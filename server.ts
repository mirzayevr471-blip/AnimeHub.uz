import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = http.createServer(app);
  
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Chat memory storage (last 100 messages)
  const chatMessages: any[] = [];

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Send history on join
    socket.emit('chat:history', chatMessages);
    
    socket.on('chat:message', (data) => {
      const msg = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        userId: data.userId,
        name: data.name,
        avatar: data.avatar,
        text: data.text,
        timestamp: new Date().toISOString(),
        role: data.role,
        isSuperAdmin: data.isSuperAdmin
      };
      
      chatMessages.push(msg);
      if (chatMessages.length > 100) chatMessages.shift();
      
      io.emit('chat:message', msg);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  app.use(express.json());
  app.use(cookieParser());
  app.use(session({
    secret: process.env.SESSION_SECRET || 'anihub-secret-key-123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none', // Critical for iframe
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Google OAuth Client
  const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // 1. Get Google Auth URL
  app.get('/api/auth/google/url', (req, res) => {
    const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${origin}/auth/callback`;

    // Fallback if no keys are provided
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.json({ url: `${origin}/auth/callback?code=mock_google_flow` });
    }

    const authorizeUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      redirect_uri: redirectUri,
    });

    res.json({ url: authorizeUrl });
  });

  // 2. Google Callback
  app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).send('No code provided');
    }

    try {
      let payload;

      // Mock Login bypass
      if (code === 'mock_google_flow') {
        payload = {
          sub: 'mock_superadmin_12345',
          name: 'Demo Super Admin',
          email: 'eyfelchik@gmail.com', // Grants Super Admin role
          picture: ''
        };
      } else {
        // Real Google Auth
        const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        const redirectUri = `${origin}/auth/callback`;

        const { tokens } = await googleClient.getToken({
          code: code as string,
          redirect_uri: redirectUri,
        });

        googleClient.setCredentials(tokens);

        const ticket = await googleClient.verifyIdToken({
          idToken: tokens.id_token!,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        payload = ticket.getPayload();
      }
      
      if (payload) {
        // Updated admin logic: eyfelchik@gmail.com is Super Admin
        const isSuperAdmin = payload.email === 'eyfelchik@gmail.com';
        const isAdmin = isSuperAdmin || payload.email === 'mirzayevr471@gmail.com';
        
        const superAdminAvatar = "https://image.spreadshirtmedia.net/image-server/v1/compositions/T812A2PA3811PT17X46Y41D1037385934W21927H21927/views/1,width=550,height=550,appearanceId=2,backgroundColor=000000/cute-anime-boy-poster.jpg";
        
        const user = {
          id: payload.sub,
          name: payload.name || 'Foydalanuvchi',
          email: payload.email,
          avatar: isSuperAdmin ? superAdminAvatar : (payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload.name}`),
          role: isAdmin ? 'admin' : 'user',
          isSuperAdmin: isSuperAdmin,
          joinedAt: new Date().toISOString().split('T')[0],
          level: 1,
          points: 0,
          favorites: [],
          history: [],
          achievements: []
        };

        (req.session as any).user = user;
      }

      // Success responder for popup
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/profile';
              }
            </script>
            <p>Muvaffaqiyatli! Bu oyna o'zi yopiladi...</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Google Auth Error:', error);
      res.status(500).send('Authentication failed');
    }
  });

  // 3. Get Session User
  app.get('/api/auth/me', (req, res) => {
    res.json({ user: (req.session as any).user || null });
  });

  // 4. Logout
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Logout failed' });
      res.json({ status: 'ok' });
    });
  });

  // 5. Telegram Notification
  app.post('/api/admin/telegram/notify', async (req, res) => {
    // Rely on frontend Admin route protection since the user DB is in localStorage
    if (!(req.session as any).user) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID } = process.env;
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
      return res.status(500).json({ error: 'Telegram bot kalitlari kiritilmagan. Sozlamalar menyusidan kalitlarni kiriting.' });
    }

    const { title, type, genres, status, imageUrl, animeId } = req.body;
    
    // Construct App URL
    const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const watchUrl = `${origin}/watch/${animeId}`;

    const messageText = `📺 *Yangi Anime Qo'shildi!*\n\n🎬 *Nomi:* ${title}\n🎭 *Janr:* ${genres.join(', ')}\n📋 *Turi:* ${type}\n📊 *Holati:* ${status}\n\n👇 *Saytimiz orqali tomosha qiling!*`;

    try {
      const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
      const response = await fetch(tgUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHANNEL_ID,
          photo: imageUrl,
          caption: messageText,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🍿 Tomosha qilish', url: watchUrl }]
            ]
          }
        }),
      });

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.description || 'Failed to send to Telegram');
      }

      res.json({ status: 'ok' });
    } catch (error) {
      console.error('Telegram API Error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // 6. Telegram Keys Management
  app.get('/api/admin/telegram/config', (req, res) => {
    if (!(req.session as any).user) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    res.json({ 
      botToken: process.env.TELEGRAM_BOT_TOKEN || '', 
      channelId: process.env.TELEGRAM_CHANNEL_ID || '' 
    });
  });

  app.post('/api/admin/telegram/config', (req, res) => {
    if (!(req.session as any).user) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const { botToken, channelId } = req.body;
    
    // Process env update for current instance memory
    if (botToken !== undefined) process.env.TELEGRAM_BOT_TOKEN = botToken;
    if (channelId !== undefined) process.env.TELEGRAM_CHANNEL_ID = channelId;
    
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

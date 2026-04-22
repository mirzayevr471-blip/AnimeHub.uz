import React from 'react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-[#070708] border-t border-blue-900/30 pt-16 pb-8 mt-12 w-full">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
             <a href="/" className="flex items-center gap-3 group mb-4">
               <img 
                 src="animehub_uz_logo_image_1.png" 
                 alt="AnimeHub.uz" 
                 className="h-8 w-auto group-hover:scale-105 transition-transform duration-300"
                 referrerPolicy="no-referrer"
               />
            </a>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              {settings.siteDescription}
            </p>
            <div className="flex gap-4">
              {settings.socialLinks.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-colors border border-white/5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
              )}
              {settings.socialLinks.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-colors border border-white/5">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
              )}
              {settings.socialLinks.telegram && (
                <a href={settings.socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-colors border border-white/5">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </a>
              )}
              {settings.socialLinks.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-colors border border-white/5">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-colors border border-white/5">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 60 60 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 60 60 0 0 1-15 0 2 2 0 0 1-2-2Z"/><path d="m10 15 5-3-5-3z"/></svg>
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm text-gray-500">Menyular</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Bosh sahifa</a></li>
              <li><a href="/?genre=Katalog" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Katalog</a></li>
              <li><a href="/#janrlar" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Janrlar</a></li>
              <li><button onClick={() => alert('Mobil ilovamiz yaqin kunlarda App Store va Google Play\'da taqdim etiladi!')} className="text-sm text-gray-400 hover:text-blue-400 transition-colors text-left">Mobil Ilova</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm text-gray-500">Yordam</h3>
            <ul className="space-y-3">
              <li><a href={`mailto:${settings.contactEmail}`} className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Aloqa</a></li>
              <li><button onClick={() => alert('FAQ bo\'limi to\'ldirilmoqda. Savollaringiz bo\'lsa, Aloqa orqali murojaat qiling.')} className="text-sm text-gray-400 hover:text-blue-400 transition-colors text-left">FAQ</button></li>
              <li><button onClick={() => alert('Maxfiylik siyosati: AniHub foydalanuvchi ma\'lumotlari xavfsizligini ta\'minlaydi.')} className="text-sm text-gray-400 hover:text-blue-400 transition-colors text-left">Maxfiylik siyosati</button></li>
              <li><button onClick={() => alert('Foydalanish shartlari: Saytdan foydalanishda odob-axloq qoidalariga amal qiling.')} className="text-sm text-gray-400 hover:text-blue-400 transition-colors text-left">Foydalanish shartlari</button></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {settings.siteName}. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-sm text-gray-500">
            Made with <span className="text-blue-500">&hearts;</span> by {settings.siteName} Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

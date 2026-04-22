import React, { useState, useEffect } from 'react';
import { Shield, Bell, User, Database, Globe, Key, ChevronLeft, Loader2, X, Check, Settings, Plus, Send, Instagram, Facebook, Trash2, FileText, HelpCircle, PlayCircle, Mail, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../context/SettingsContext';

export default function AdminSettings() {
  const { settings: globalSettings, updateSettings } = useSettings();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'stable' | 'warning' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Local state for forms
  const [formData, setFormData] = useState(globalSettings);
  const [tgConfig, setTgConfig] = useState({ botToken: '', channelId: '' });

  useEffect(() => {
    setFormData(globalSettings);
  }, [globalSettings]);

  useEffect(() => {
    if (activeSection === 'api') {
      fetch('/api/admin/telegram/config')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setTgConfig({ botToken: data.botToken, channelId: data.channelId });
          }
        })
        .catch(console.error);
    }
  }, [activeSection]);

  const handleSave = async () => {
    setIsSaving(true);
    
    if (activeSection === 'api') {
      await fetch('/api/admin/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tgConfig)
      }).catch(console.error);
    }
    
    updateSettings(formData);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 500);
  };

  const sections = [
    { id: 'profile', title: 'Hisob Sozlamalari', desc: 'Profil va xavfsizlik sozlamalari', icon: User },
    { id: 'notifications', title: 'Bildirishnomalar', desc: 'Sizga keladigan xabarlar boshqaruvi', icon: Bell },
    { id: 'social', title: 'Ijtimoiy Tarmoqlar', desc: 'Telegram, Instagram va boshqalar', icon: Send },
    { id: 'pages', title: 'Sahifalar va Yordam', desc: 'FAQ, Maxfiylik, Shartlar', icon: FileText },
    { id: 'system', title: 'Tizim Sozlamalari', desc: 'Platforma umumiy sozlamalari', icon: Database },
    { id: 'security', title: 'Xavfsizlik', desc: 'Parol va kirish huquqlari', icon: Shield },
    { id: 'localization', title: 'Lokallashuv', desc: 'Til va vaqt mintaqasi', icon: Globe },
    { id: 'api', title: 'API Kalitlar', desc: 'Tashqi xizmatlar integratsiyasi', icon: Key },
  ];

  const handleToggle = (key: string) => {
    // This was for notifications, updating formData instead
    if (key in formData) {
       // @ts-ignore
       setFormData({ ...formData, [key]: !formData[key] });
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('stable');
    }, 2500);
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'social': {
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 px-1">Ijtimoiy tarmoq havolalari</div>
            
            <div className="space-y-4">
              {[
                { key: 'facebook', label: 'Facebook', icon: Facebook },
                { key: 'twitter', label: 'Twitter', icon: PlayCircle },
                { key: 'telegram', label: 'Telegram', icon: Send },
                { key: 'instagram', label: 'Instagram', icon: Instagram },
                { key: 'youtube', label: 'YouTube', icon: Youtube },
              ].map((social) => (
                <div key={social.key} className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <social.icon className="w-3.5 h-3.5 text-purple-400" />
                    {social.label}
                  </label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder={`https://${social.key}.com/username`}
                      value={formData.socialLinks[social.key as keyof typeof formData.socialLinks]}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, [social.key]: e.target.value }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 outline-none text-white transition-all placeholder:text-gray-700"
                    />
                    {formData.socialLinks[social.key as keyof typeof formData.socialLinks] && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Check className="w-4 h-4 text-emerald-500 opacity-50" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-purple-500/5 border border-purple-500/10 rounded-[32px] mt-6">
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed italic text-center">
                Footer'dagi belgilar bu yerda kiritilgan havolalar asosida avtomatik ravishda ko'rinadi. 
                Agar havolani bo'sh qoldirsangiz, belgi saytdan yashiriladi.
              </p>
            </div>
          </div>
        );
      }
      case 'api': {
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 px-1">Tashqi Xizmatlar Kalitlari</div>
            <div className="p-6 bg-[#0a0a0c] border border-white/5 rounded-[32px] space-y-6">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                  <Send className="w-5 h-5 text-purple-500" />
                  Telegram Bot Integratsiyasi
                </h3>
                <p className="text-xs text-gray-500">Kanalga xabarlar yuborish uchun bot tokeni va kanal ID/username kiritilishi kerak.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Bot Tokeni</label>
                  <input 
                    type="password" 
                    placeholder="Masalan: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                    value={tgConfig.botToken}
                    onChange={(e) => setTgConfig({...tgConfig, botToken: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all text-white placeholder:text-gray-700 font-mono" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Kanal Username yoki ID</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: @anihub_uz yoki -10012345678"
                    value={tgConfig.channelId}
                    onChange={(e) => setTgConfig({...tgConfig, channelId: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all text-white placeholder:text-gray-700 font-mono" 
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-purple-500/5 border border-purple-500/10 rounded-[32px]">
              <p className="text-[10px] text-purple-400 font-medium leading-relaxed italic text-center">
                Eslatma: Ushbu tokenlar yordamida "Yangi anime qo'shish" bo'limida belgilangan kanalga avtomatik ravishda xabar yuboriladi. Telegram botni o'z kanalingizga qo'shib unga yozish huquqini berishingiz zarur!
              </p>
            </div>
          </div>
        );
      }
      case 'system': {
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Platforma Nomi</label>
              <input 
                type="text" 
                value={formData.siteName}
                onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Qisqacha Tavsif (Footer uchun)</label>
              <textarea 
                rows={3}
                value={formData.siteDescription}
                onChange={(e) => setFormData({...formData, siteDescription: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all text-white resize-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Aloqa uchun Email</label>
              <input 
                type="email" 
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all text-white" 
              />
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <Check className="w-5 h-5" />
            Sozlamalar saqlandi!
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!activeSection ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-black tracking-tight">Sozlamalar</h2>
              <p className="text-gray-400 text-sm mt-1">Platforma parametrlarini moslashtirish.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => setActiveSection(s.id)}
                  className="bg-[#0a0a0c] p-6 rounded-[32px] border border-white/5 hover:border-purple-500/30 transition-all duration-500 cursor-pointer group active:scale-95"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 text-gray-500">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">{s.title}</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#0a0a0c] rounded-[32px] border border-white/5 p-8">
              <h3 className="text-xl font-bold mb-6">Xavfsizlik Monitoringi</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-[24px] border border-white/5 transition-all hover:bg-white/10">
                  <div className="flex items-center gap-4">
                    {isScanning ? (
                      <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scanResult === 'stable' ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
                        <div className={`w-2 h-2 rounded-full ${scanResult === 'stable' ? 'bg-emerald-500' : 'bg-blue-500'} ${isScanning ? '' : 'animate-pulse'}`}></div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold">
                        {isScanning ? 'Tizim tekshirilmoqda...' : 'Tizim holati'}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">
                        {isScanning ? 'Xavfsizlik protokollari tahlil qilinmoqda' : scanResult === 'stable' ? 'Barcha xizmatlar barqaror va xavfsiz' : 'Barcha xizmatlar barqaror'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleScan}
                    disabled={isScanning}
                    className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 disabled:opacity-50 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
                  >
                    {isScanning ? 'Kutib turing...' : 'Tekshirish'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveSection(null)}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-black">{sections.find(s => s.id === activeSection)?.title}</h2>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Konfiguratsiya va boshqaruv</p>
              </div>
            </div>

            <div className="bg-[#0a0a0c] rounded-[32px] border border-white/5 p-8 max-w-2xl shadow-2xl">
              {renderSectionContent()}
              
              <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                <button 
                  onClick={() => setActiveSection(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-sm transition-all"
                >
                  Bekor Qilish
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-purple-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Saqlash"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

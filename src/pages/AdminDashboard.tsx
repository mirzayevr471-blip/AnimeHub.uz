import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnime } from '../context/AnimeContext';
import { Film, PlayCircle, Star, Users, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Video } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';

export default function AdminDashboard() {
  const { animes } = useAnime();
  const navigate = useNavigate();

  const stats = [
    { 
      title: "Jami Animelar", 
      value: animes.length.toString(), 
      icon: Film, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      trend: "+12%",
      trendUp: true
    },
    { 
      title: "Davom etayotgan", 
      value: animes.filter(a => a.status === 'Davom etayotgan').length.toString(), 
      icon: PlayCircle, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      trend: "+5%",
      trendUp: true
    },
    { 
      title: "Reyting (O'rtacha)", 
      value: (animes.reduce((acc, a) => acc + a.rating, 0) / (animes.length || 1)).toFixed(1), 
      icon: Star, 
      color: "text-yellow-500", 
      bg: "bg-yellow-500/10",
      trend: "-0.2",
      trendUp: false
    },
    { 
      title: "Ko'rishlar", 
      value: "142.8k", 
      icon: Users, 
      color: "text-emerald-500", 
      bg: "bg-emerald-500/10",
      trend: "+18%",
      trendUp: true
    },
  ];

  // Chart Data: Animes by Year
  const yearData = Object.entries(
    animes.reduce((acc: any, curr) => {
      acc[curr.year] = (acc[curr.year] || 0) + 1;
      return acc;
    }, {})
  ).map(([year, count]) => ({ year, count })).sort((a, b) => Number(a.year) - Number(b.year));

  const statusData = [
    { name: 'Ongoing', value: animes.filter(a => a.status === 'Davom etayotgan').length, color: '#2563eb' },
    { name: 'Completed', value: animes.filter(a => a.status === 'Tugallangan').length, color: '#3b82f6' },
  ];

  const downloadReport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      totalAnimes: animes.length,
      averageRating: (animes.reduce((acc, a) => acc + a.rating, 0) / (animes.length || 1)).toFixed(1),
      statusDistribution: statusData.reduce((acc: any, curr) => {
        acc[curr.name] = curr.value;
        return acc;
      }, {}),
      animes: animes.map(a => ({ title: a.title, rating: a.rating, status: a.status }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anihub-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-400 text-sm mt-1">Platformadagi faollik va statistikalar monitoringi.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#0a0a0c] border border-white/5 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <button 
            onClick={downloadReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 active:scale-95"
          >
            <TrendingUp className="w-4 h-4" />
            Hisobot Yuklash
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0a0a0c] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-3xl font-black mb-1 group-hover:text-blue-400 transition-colors">{stat.value}</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.title}</p>
            
            {/* Subtle background glow on hover */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-600/5 blur-3xl rounded-full group-hover:bg-blue-600/10 transition-colors"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#0a0a0c] p-6 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Relizlar Dinamikasi</h3>
              <p className="text-xs text-gray-400">Yillar kesimida animelar soni</p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg text-xs px-2 py-1 outline-none text-gray-400">
              <option>So'nggi 5 yil</option>
              <option>Barchasi</option>
            </select>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="year" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #1f2937', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#2563eb' }}
                />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Info */}
        <div className="bg-[#0a0a0c] p-6 rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
          <h3 className="text-lg font-bold mb-8">Status Taqsimoti</h3>
          <div className="h-[200px] w-full min-h-[200px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black">{animes.length}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Jami</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Table Section */}
      <div className="bg-[#0a0a0c] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold">Oxirgi Yangilanganlar</h3>
          <button className="text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest">Barchasi</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-500 bg-white/5">
                <th className="px-6 py-3">Anime</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {animes.slice(0, 4).map(anime => (
                <tr key={anime.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img src={anime.image} alt={anime.title} className="w-10 h-14 object-cover rounded-lg shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                    <div>
                      <div className="text-sm font-bold text-white mb-0.5">{anime.title}</div>
                      <div className="text-[10px] text-gray-500">{anime.year} • {anime.genres.slice(0,2).join(', ')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                      <Star className="w-3 h-3 fill-yellow-400" />
                      {anime.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${anime.status === 'Tugallangan' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                      {anime.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => navigate(`/admin/animes/${anime.id}/episodes`)}
                      className="p-2 bg-white/5 hover:bg-blue-600/20 hover:text-blue-500 rounded-lg transition-all"
                      title="Qismlarni boshqarish"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


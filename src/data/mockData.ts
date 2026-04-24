import { Anime } from '../types';

export const heroAnime: Anime = {
  id: 'hero-1',
  title: 'Solo Leveling',
  image: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=2000&auto=format&fit=crop',
  rating: 9.8,
  year: 2024,
  type: 'TV Serial',
  status: 'Davom etayotgan',
  genres: ['Sarguzasht', 'Jangari', 'Fantaziya'],
  description: 'Qudratli maxluqlar va sirli portal dunyosida omon qolish uchun kurash. Eng zaif hunterdan eng kuchliga aylanish yo\'lida misli ko\'rilmagan sarguzashtlarga guvoh bo\'ling.',
  episodesList: [
    { id: 'ep-1', number: 1, title: 'I Am the Weakest', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', addedAt: new Date().toISOString(), duration: '23:45', thumbnail: 'https://images.unsplash.com/photo-1514068574489-503a8eb91592?q=80&w=600&auto=format&fit=crop' },
    { id: 'ep-2', number: 2, title: 'The Double Dungeon', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', addedAt: new Date().toISOString(), duration: '24:10', thumbnail: 'https://images.unsplash.com/photo-1578632292335-df3f47ebb2cb?q=80&w=600&auto=format&fit=crop' }
  ]
};

export const recentlyAdded: Anime[] = [
  {
    id: 'req-1',
    title: 'Gojo Satoru: Cheksizlik',
    image: 'https://images.unsplash.com/photo-1621478373722-155d946f3f23?q=80&w=1000&auto=format&fit=crop',
    rating: 9.9,
    year: 2024,
    type: 'TV Serial',
    status: 'Davom etayotgan',
    genres: ['Sarguzasht', 'Jangari', 'G\'ayritabiiy'],
    description: 'Eng kuchli sehrgarning hayoti va uning misli ko\'rilmagan janglari haqida hikoya.',
    episodesList: []
  },
  {
    id: 'req-2',
    title: 'Demon Slayer: Hashira Training',
    image: 'https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?q=80&w=1000&auto=format&fit=crop',
    rating: 9.6,
    year: 2023,
    type: 'TV Serial',
    status: 'Tugallangan',
    genres: ['Jangari', 'Fantaziya'],
    description: 'Sirlar va kutilmagan voqealarga boy bo\'lgan dunyoda malikaning o\'z taxtini himoya qilish yo\'lidagi ayovsiz jangi.',
    episodesList: []
  },
  {
    id: 'req-3',
    title: 'Van-Pis',
    image: 'https://images.unsplash.com/photo-1620317351659-c2901c518b53?q=80&w=1000&auto=format&fit=crop',
    rating: 9.5,
    year: 1999,
    type: 'TV Serial',
    status: 'Davom etayotgan',
    genres: ['Sarguzasht', 'Komediya', 'Jangari'],
    description: 'Manki D. Luffi va uning jamoasi afsonaviy xazina "Van Pis" ni topish maqsadida Buyuk dengiz bo\'ylab sayohatga otlanadilar.',
    episodesList: [
      { id: 'ep-3-1', number: 1000, title: 'Overwhelming Strength', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', addedAt: new Date().toISOString(), duration: '23:50', thumbnail: 'https://picsum.photos/seed/onepiece1000/320/180' }
    ]
  },
  {
    id: 'req-7',
    title: 'Hujumkor titanlar',
    image: 'https://images.unsplash.com/photo-1514068574489-503a8eb91592?q=80&w=1000&auto=format&fit=crop',
    rating: 10.0,
    year: 2013,
    type: 'TV Serial',
    status: 'Tugallangan',
    genres: ['Jangari', 'Drama', 'Fantaziya'],
    description: 'Insoniyat ulkan titanlar hujumidan himoyalanish uchun devorlar ortida yashaydi. Bu hikoya Eren Yegerning ozodlik uchun kurashini bayon etadi.',
    episodesList: [
      { id: 'ep-7-1', number: 1, title: 'To You, 2000 Years From Now', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', addedAt: new Date().toISOString(), duration: '24:00', thumbnail: 'https://picsum.photos/seed/titan1/320/180' }
    ]
  },
  {
    id: 'req-8',
    title: 'Naruto Shippuden',
    image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop',
    rating: 9.3,
    year: 2007,
    type: 'TV Serial',
    status: 'Tugallangan',
    genres: ['Shonen', 'Jangari', 'Sarguzasht'],
    description: 'Naruto Uzumaki o\'z qishlog\'i Xokagesi bo\'lish va do\'stlarini himoya qilish uchun o\'z mashg\'ulotlarini davom ettiradi.',
    episodesList: []
  },
  {
    id: 'req-9',
    title: 'Jujutsu Kaisen',
    image: 'https://images.unsplash.com/photo-1621478373722-155d946f3f23?q=80&w=1000&auto=format&fit=crop',
    rating: 9.2,
    year: 2020,
    type: 'TV Serial',
    status: 'Davom etayotgan',
    genres: ['Sarguzasht', 'Jangari', 'G\'ayritabiiy'],
    description: 'Yuji Itadori o\'z do\'stlarini qutqarish uchun la\'natlangan barmoqni yutib yuboradi va sehrgarlar dunyosiga qadam qo\'yadi.',
    episodesList: []
  },
  {
    id: 'req-10',
    title: 'Demon Slayer',
    image: 'https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?q=80&w=1000&auto=format&fit=crop',
    rating: 9.4,
    year: 2019,
    type: 'TV Serial',
    status: 'Davom etayotgan',
    genres: ['Jangari', 'Tarixiy', 'Sarguzasht'],
    description: 'Tanjiro Kamado o\'z singlisini insonga aylantirish uchun jinlar ovchisiga aylanadi.',
    episodesList: []
  },
  {
    id: 'req-11',
    title: 'Black Clover',
    image: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000&auto=format&fit=crop',
    rating: 8.7,
    year: 2017,
    type: 'TV Serial',
    status: 'Tugallangan',
    genres: ['Sihr', 'Jangari', 'Komediya'],
    description: 'Sihr dunyosida hech qanday sehri bo\'lmagan Asta o\'z maqsadi yo\'lida to\'xtamaydi.',
    episodesList: []
  },
  {
    id: 'req-12',
    title: 'Spy x Family',
    image: 'https://images.unsplash.com/photo-1528101726217-ecfed5d344d0?q=80&w=1000&auto=format&fit=crop',
    rating: 9.0,
    year: 2022,
    type: 'TV Serial',
    status: 'Davom etayotgan',
    genres: ['Komediya', 'Jangari', 'Sarguzasht'],
    description: 'Josus, qotil va telepat birgalikda oila bo\'lib yashashga majbur bo\'ladilar.',
    episodesList: []
  },
  {
    id: 'req-13',
    title: 'Haikyu!!',
    image: 'https://images.unsplash.com/photo-1461896704075-83ec3c39002c?q=80&w=1000&auto=format&fit=crop',
    rating: 8.9,
    year: 2014,
    type: 'TV Serial',
    status: 'Tugallangan',
    genres: ['Sport', 'Drama', 'Maktab'],
    description: 'Hinata Shoyo bo\'yi past bo\'lishiga qaramay, voleybol bo\'yicha cho\'qqilarni zabt etishni xohlaydi.',
    episodesList: []
  }
];

export const popularAnime: Anime[] = [...recentlyAdded].sort((a, b) => b.rating - a.rating).slice(0, 6);

export const genres = [
  'Shonen', 'Romantika', 'Sarguzasht', 'Fantaziya', 
  'Qo\'rqinchli', 'Komediya', 'Drama', 'Seinen', 
  'Slice of Life', 'Sport', 'Isekai', 'Mecha'
];

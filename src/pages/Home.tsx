import React, { useMemo, useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AnimeCard from '../components/AnimeCard';
import SectionHeader from '../components/SectionHeader';
import GenresGrid from '../components/GenresGrid';
import TopTenRanking from '../components/TopTenRanking';
import Footer from '../components/Footer';
import { useAnime } from '../context/AnimeContext';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const { animes } = useAnime();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const searchQuery = searchParams.get('q') || '';
  const genreQuery = searchParams.get('genre') || '';
  const filterQuery = searchParams.get('filter') || '';

  const filteredAnimes = useMemo(() => {
    return animes.filter(anime => {
      const matchesSearch = anime.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = !genreQuery || genreQuery === 'Katalog' || anime.genres.includes(genreQuery);
      const matchesFilter = !filterQuery || (filterQuery === 'Mashhur' && anime.rating >= 8.5);
      return matchesSearch && matchesGenre && matchesFilter;
    });
  }, [animes, searchQuery, genreQuery, filterQuery]);

  const totalPages = Math.ceil(filteredAnimes.length / itemsPerPage);
  const displayedAnimes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAnimes.slice(start, start + itemsPerPage);
  }, [filteredAnimes, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, genreQuery, filterQuery]);

  const popularAnimes = useMemo(() => 
    [...animes].sort((a,b) => b.rating - a.rating).slice(0, 10),
  [animes]);

  const isFiltering = searchQuery || (genreQuery && genreQuery !== '') || filterQuery;

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="flex flex-col h-full w-full bg-brand-bg font-sans">
      <Header />
      
      <main className="flex-1 w-full">
        {!isFiltering && <Hero />}
        
        <div className={`p-4 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 max-w-screen-2xl mx-auto w-full ${isFiltering ? 'mt-8' : ''}`}>
          
          {/* Main Content Column */}
          <div className="md:col-span-8 lg:col-span-9 space-y-12">
            
            {isFiltering ? (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <div>
                    <h2 className="text-2xl font-black flex items-center gap-2">
                       {searchQuery ? (
                         <>
                           <SearchIcon className="text-purple-500" />
                           "{searchQuery}" qidiruv natijalari
                         </>
                       ) : filterQuery === 'Mashhur' ? (
                         <>
                           <span className="text-purple-500">Mashhur</span> animelar
                         </>
                       ) : (
                         <>
                           <span className="text-purple-500">#{genreQuery}</span> janridagi animelar
                         </>
                       )}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">{filteredAnimes.length} ta natija topildi</p>
                  </div>
                  <button 
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Filtrni tozalash
                  </button>
                </div>

                {displayedAnimes.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {displayedAnimes.map(anime => (
                          <AnimeCard key={anime.id} anime={anime} />
                      ))}
                    </div>

                    {/* Pagination - Show if more than 7 total items exist */}
                    {filteredAnimes.length >= 7 && (
                      <div className="mt-12 flex items-center justify-center gap-2">
                        <button 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-gray-400 transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-12 h-10 rounded-xl font-black transition-all ${
                              currentPage === i + 1 
                                ? 'bg-lime-500 text-black shadow-lg shadow-lime-500/20' 
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button 
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-gray-400 transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <SearchIcon className="w-10 h-10 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-300">Hech narsa topilmadi</h3>
                    <p className="text-gray-500 text-sm mt-2">Balki boshqa nom bilan qidirib ko'rarsiz?</p>
                  </div>
                )}
              </section>
            ) : (
              <>
                {/* Yangi qo'shilganlar */}
                <section>
                  <SectionHeader 
                    title="Yangi qo'shilganlar" 
                    showAllLink="/?genre=Katalog"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {animes.slice(0, 10).map(anime => (
                        <AnimeCard key={anime.id} anime={anime} />
                    ))}
                  </div>
                </section>

                {/* Mashhur animelar */}
                <section>
                  <SectionHeader 
                    title="Mashhur animelar" 
                    showAllLink="/?filter=Mashhur"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {popularAnimes.map((anime, idx) => (
                      <AnimeCard key={anime.id} anime={anime} rank={idx + 1} />
                    ))}
                  </div>
                </section>
              </>
            )}
            
          </div>
          
          {/* Sidebar Column */}
          <div className="md:col-span-4 lg:col-span-3 md:border-l border-white/5 md:pl-8 flex flex-col pt-12 md:pt-0">
            <GenresGrid />
            <TopTenRanking />
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}

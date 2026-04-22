import React from 'react';
import { genres } from '../data/mockData';
import { useSearchParams } from 'react-router-dom';

const GenresGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentGenre = searchParams.get('genre');

  const toggleGenre = (genre: string) => {
    if (currentGenre === genre) {
      setSearchParams({});
    } else {
      setSearchParams({ genre });
    }
  };

  return (
    <section id="genres">
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Ommabop Janrlar</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {genres.map((genre) => (
          <span 
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`genre-pill cursor-pointer select-none transition-all ${currentGenre === genre ? 'bg-purple-600 border-purple-500 text-white' : ''}`}
          >
            {genre}
          </span>
        ))}
      </div>
    </section>
  );
};

export default GenresGrid;

import React from 'react';
import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showAllLink?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, showAllLink }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold border-l-4 border-purple-500 pl-3 leading-none text-white">
        {title}
      </h2>
      
      {showAllLink && (
        <Link to={showAllLink} className="text-xs text-purple-400 hover:underline transition-colors font-medium">
          Hammasini ko‘rish
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;

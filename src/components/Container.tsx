import Header from './Header';
import Search from './Search';
import Gallery from './Gallery';
import { useState } from 'react';
import { Paints } from '../script/api';

export interface Props {
  isDark: boolean;
  setIsDark: () => void;
}

export default function Container({ isDark, setIsDark }: Props) {
  const [page, setPage] = useState(1); // Страница для пагинации
  const [filteredData, setFilteredData] = useState<Paints[]>([]); // Фильтрованные данные
  const [searchQuery, setSearchQuery] = useState(''); // Поисковый запрос

  const handleSearch = (query: string) => {
    setPage(1); // Сбрасываем страницу при новом поиске
    setSearchQuery(query); // Устанавливаем новый запрос
  };

  return (
    <div className="container">
      <Header
        isDark={isDark}
        setIsDark={setIsDark}
      />
      <main>
        <Search
          isDark={isDark}
          onSearch={handleSearch}
        />
        <Gallery
          isDark={isDark}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          searchQuery={searchQuery}
          page={page}
          setPage={setPage}
        />
      </main>
    </div>
  );
}

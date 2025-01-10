import { useState } from 'react';
import SearchImgDark from '../../public/img/search-img-dark.svg';
import SearchImgLight from '../../public/img/search-img-light.svg';
import SearchCloseDark from '../../public/img/search-close-dark.svg';
import SearchCloseLight from '../../public/img/search-close-light.svg';

export default function Search({
  onSearch,
  isDark
}: {
  onSearch: (query: string) => void;
  isDark: boolean;
}) {
  const [inputValue, setInputValue] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Обновляем значение инпута
    onSearch(e.target.value); // Передаем новое значение поисковому запросу
  };

  // Очищаем инпут и поисковый запрос
  const clearInput = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <section className="search">
      <div className="search-container">
        <div className={`input-container ${isDark ? 'dark' : 'light'}`}>
          <img
            className="search-img"
            src={isDark ? SearchImgDark : SearchImgLight}
            alt="Поиск"
          />
          <input
            onChange={onChange}
            value={inputValue}
            className={`search-input ${isDark ? 'dark' : 'light'}`}
            placeholder="Название картины"
            type="text"
          />
          {/* Иконка закрытия поиска */}
          <div
            className={`search-close-temp ${inputValue ? 'hidden' : ''}`}></div>
          <img
            className={`search-close-img ${inputValue ? 'visible' : ''}`}
            src={isDark ? SearchCloseDark : SearchCloseLight}
            alt="Закрыть"
            onClick={clearInput}
          />
        </div>
      </div>
    </section>
  );
}

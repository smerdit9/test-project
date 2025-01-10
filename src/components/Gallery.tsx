import { useQuery } from '@tanstack/react-query';
import {
  galleryApi,
  getPaintByTitle,
  getAuthors,
  getLocations
} from '../script/api';
import { useState, useEffect } from 'react';
import { Paints, Author, Location } from '../script/api';

interface GalleryProps {
  filteredData: Paints[];
  setFilteredData: React.Dispatch<React.SetStateAction<Paints[]>>;
  searchQuery: string;
  isDark: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

// Основной компонент галереи
export default function Gallery({
  filteredData,
  setFilteredData,
  searchQuery,
  isDark
}: GalleryProps) {
  return (
    <section className="gallery">
      <div className="gallery-container">
        {/* Компонент для отображения элементов галереи */}
        <GalleryElements
          isDark={isDark}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          searchQuery={searchQuery}
        />
      </div>
    </section>
  );
}

interface GalleryElementsProps {
  filteredData: Paints[];
  setFilteredData: React.Dispatch<React.SetStateAction<Paints[]>>;
  searchQuery: string;
  isDark: boolean;
}

function GalleryElements({
  filteredData,
  setFilteredData,
  searchQuery,
  isDark
}: GalleryElementsProps) {
  const [page, setPage] = useState(1); // Страница для пагинации
  const [totalItems, setTotalItems] = useState(0); // Общее количество элементов
  const [authors, setAuthors] = useState<Author[]>([]); // Данные авторов
  const [locations, setLocations] = useState<Location[]>([]); // Данные локаций
  const itemsPerPage = 6; // Количество элементов на одной странице

  const { data, error, isLoading } = useQuery({
    queryKey: ['paints', { page }],
    queryFn: (meta) => galleryApi.getGalleryElements({ page }, meta),
    enabled: !searchQuery, // Запрос будет выполнен, если нет поискового запроса
    staleTime: 5000
  });

  useEffect(() => {
    // Запросы для получения данных авторов и локаций
    getAuthors().then((data) => setAuthors(data));
    getLocations().then((data) => setLocations(data));

    if (searchQuery) {
      // Если есть поисковый запрос, фильтруем картины по названию
      getPaintByTitle(searchQuery).then((data) => {
        setFilteredData(data);
        setTotalItems(data.length);
      });
    } else if (data) {
      // Если данных нет, используем данные с сервера
      setFilteredData(data.paints);
      setTotalItems(data.totalItems);
    }
  }, [searchQuery, data, setFilteredData]);

  // Сбрасываем страницу при изменении поискового запроса
  useEffect(() => {
    if (searchQuery) {
      setPage(1);
    }
  }, [searchQuery]);

  const paginateData = (data: Paints[], page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage); // Обрезаем данные для пагинации
  };

  const displayData = searchQuery
    ? paginateData(filteredData, page, itemsPerPage)
    : filteredData; // Данные для отображения в зависимости от поиска

  const totalPages = Math.ceil(totalItems / itemsPerPage); // Рассчитываем общее количество страниц

  if (!Array.isArray(displayData)) {
    return <div>Ошибка данных</div>;
  }

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {JSON.stringify(error)}</div>;
  }

  return (
    <>
      {/* Если нет данных, выводим сообщение о том, что не найдены картины */}
      {displayData.length === 0 ? (
        <div>
          <p className={`no-matches-title ${isDark ? 'dark' : 'light'}`}>
            No matches for{' '}
            <span className="no-matches-title-span">
              {searchQuery ? `${searchQuery}` : ''}
            </span>
          </p>
          <p className={`no-matches-text ${isDark ? 'dark' : 'light'}`}>
            Please try again with a different spelling or keywords.
          </p>
        </div>
      ) : (
        // Отображаем картины
        displayData.map((Paint) => {
          const author = authors.find((author) => author.id === Paint.authorId);
          const location = locations.find(
            (location) => location.id === Paint.locationId
          );

          return (
            <div
              key={Paint.id}
              className="gallery-element">
              <img
                src={`https://test-front.framework.team${Paint.imageUrl}`}
                alt={Paint.name}
              />
              <div
                className={`gallery-info-container ${isDark ? 'dark' : 'light'}`}>
                <div
                  className={`gallery-info-container-content ${isDark ? 'dark' : 'light'}`}>
                  <div className="info-content-default">
                    <p className={`paint-title ${isDark ? 'dark' : 'light'}`}>
                      {Paint.name.toUpperCase()}
                    </p>
                    <p className={`paint-year ${isDark ? 'dark' : 'light'}`}>
                      {Paint.created}
                    </p>
                  </div>
                  <div className="info-content-animation">
                    <p className={`paint-title ${isDark ? 'dark' : 'light'}`}>
                      {author ? author.name.toUpperCase() : ''}
                    </p>
                    <p className={`paint-year ${isDark ? 'dark' : 'light'}`}>
                      {location ? location.location.toUpperCase() : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Отображение пагинации, если есть несколько страниц */}
      {totalPages > 1 && (
        <Pagination
          isDark={isDark}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      )}
    </>
  );
}

function Pagination({
  page,
  totalPages,
  setPage,
  isDark
}: {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  isDark: boolean;
}) {
  const getPaginationGroup = () => {
    let start = Math.max(2, page - 1);
    let end = Math.min(totalPages - 1, page + 1);

    if (page === totalPages || page === 1) {
      start = Math.max(2, page - 2);
      end = Math.min(totalPages - 1, page + 2);
    }

    const pages = ['-', 1];

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const paginationGroup = getPaginationGroup();

  return (
    <div className="pagination">
      <button
        className={`arrow ${isDark ? 'dark' : 'light'} left`}
        onClick={() => setPage(Math.max(page - 1, 1))}
        disabled={page === 1}></button>
      <div className="pagination-container">
        {paginationGroup.map((pageNumber, index) => (
          <button
            key={index}
            onClick={() =>
              typeof pageNumber === 'number' && setPage(pageNumber)
            }
            className={` ${
              pageNumber === page
                ? 'pagination-button active'
                : typeof pageNumber === 'number'
                  ? 'pagination-button'
                  : 'pagination-button dots'
            } ${isDark ? 'dark' : 'light'}`}>
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        className={`arrow ${isDark ? 'dark' : 'light'} right`}
        onClick={() => setPage(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}></button>
    </div>
  );
}

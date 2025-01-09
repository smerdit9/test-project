import { useQuery } from '@tanstack/react-query';
import { galleryApi, getPaintByTitle } from '../script/api';
import { useState, useEffect } from 'react';
import { Paints } from '../script/api';

interface GalleryProps {
  filteredData: Paints[];
  setFilteredData: React.Dispatch<React.SetStateAction<Paints[]>>;
  searchQuery: string;
  isDark: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Gallery({
  filteredData,
  setFilteredData,
  searchQuery,
  isDark
}: GalleryProps) {
  return (
    <section className="gallery">
      <div className="gallery-container">
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
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  const { data, error, isLoading } = useQuery({
    queryKey: ['paints', { page }],
    queryFn: (meta) => galleryApi.getGalleryElements({ page }, meta),
    enabled: !searchQuery,
    staleTime: 5000
  });

  useEffect(() => {
    if (searchQuery) {
      getPaintByTitle(searchQuery).then((data) => {
        setFilteredData(data);
        setTotalItems(data.length);
      });
    } else if (data) {
      setFilteredData(data.data);
      setTotalItems(data.items);
    }
  }, [searchQuery, setFilteredData, data]);

  useEffect(() => {
    if (searchQuery) {
      setPage(1);
    }
  }, [searchQuery]);

  const paginateData = (data: Paints[], page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const displayData = searchQuery
    ? paginateData(filteredData, page, itemsPerPage)
    : filteredData;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {JSON.stringify(error)}</div>;
  }

  return (
    <>
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
        displayData.map((Paint) => (
          <div
            key={Paint.id}
            className="gallery-element">
            <img
              src={Paint.image}
              alt={Paint.title}
            />
            <div
              className={`gallery-info-container ${isDark ? 'dark' : 'light'}`}>
              <div
                className={`gallery-info-container-content ${
                  isDark ? 'dark' : 'light'
                }`}>
                <div className="info-content-default">
                  <p className={`paint-title ${isDark ? 'dark' : 'light'}`}>
                    {Paint.title.toUpperCase()}
                  </p>
                  <p className={`paint-year ${isDark ? 'dark' : 'light'}`}>
                    {Paint.year}
                  </p>
                </div>
                <div className="info-content-animation">
                  <p className={`paint-title ${isDark ? 'dark' : 'light'}`}>
                    {'jean-honore fragonard'.toUpperCase()}
                  </p>
                  <p className={`paint-year ${isDark ? 'dark' : 'light'}`}>
                    {'Louvre museum'.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
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

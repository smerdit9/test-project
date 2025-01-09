import axios from 'axios';

const FIRST_API_URL = 'http://localhost:3000';

export type Paginated<T> = {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
};

export type Paints = {
  id: string;
  title: string;
  image: string;
  year: string;
};

export const galleryApi = {
  getGalleryElements: async (
    { page }: { page: number },
    { signal }: { signal: AbortSignal }
  ): Promise<Paginated<Paints>> => {
    const response = await axios.get<Paginated<Paints>>(
      `${FIRST_API_URL}/paints?_page=${page}&_per_page=6`,
      { signal }
    );
    return response.data;
  }
};

export const getPaintByTitle = async (
  paintTitle: string
): Promise<Paints[]> => {
  const response = await axios.get(`${FIRST_API_URL}/paints`);
  return response.data.filter((paint: { title: string }) =>
    paint.title.toLowerCase().includes(paintTitle.toLowerCase())
  );
};

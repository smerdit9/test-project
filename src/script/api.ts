import axios from 'axios';

const FIRST_API_URL = 'https://test-front.framework.team';

export type Paints = {
  authorId: number;
  created: string;
  id: number;
  imageUrl: string;
  locationId: number;
  name: string;
};

export const galleryApi = {
  getGalleryElements: async (
    { page }: { page: number },
    { signal }: { signal: AbortSignal }
  ): Promise<{ paints: Paints[]; totalItems: number }> => {
    const response = await axios.get<Paints[]>(
      `${FIRST_API_URL}/paintings?_page=${page}&_limit=6`,
      { signal }
    );

    const totalItems = parseInt(response.headers['x-total-count'] || '0', 10);
    return { paints: response.data, totalItems };
  }
};

export const getPaintByTitle = async (
  paintTitle: string
): Promise<Paints[]> => {
  const response = await axios.get(
    `${FIRST_API_URL}/paintings?q=${paintTitle}`
  );
  return response.data;
};

export type Author = {
  id: number;
  name: string;
};

export type Location = {
  id: number;
  location: string;
};

export const getAuthors = async (): Promise<Author[]> => {
  try {
    const response = await axios.get(`${FIRST_API_URL}/authors`);
    return response.data || [];
  } catch (error) {
    return [];
  }
};

export const getLocations = async (): Promise<Location[]> => {
  try {
    const response = await axios.get(`${FIRST_API_URL}/locations`);
    return response.data || [];
  } catch (error) {
    return [];
  }
};

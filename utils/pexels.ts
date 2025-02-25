// Pexels API-тай ажиллах функцууд
export async function searchPexelsPhotos(query: string): Promise<string | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
    
    if (!apiKey) {
      console.error('Pexels API key is missing');
      return null;
    }
    
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          'Authorization': apiKey
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      // Дунд хэмжээтэй зураг авах
      return data.photos[0].src.large;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from Pexels:', error);
    return null;
  }
} 
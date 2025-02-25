// API түлхүүрийг шалгах хуудас
export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: "Pexels API key is missing" });
    }

    // Pexels API-г шалгах
    const response = await fetch(
      "https://api.pexels.com/v1/search?query=nature&per_page=1",
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Pexels API error: ${response.status}`,
        details: await response.text(),
      });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

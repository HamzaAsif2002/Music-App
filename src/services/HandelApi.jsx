import axios from "axios";

const api = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});

export const GetApiData = async (query) => {
  try {
    const res = await api.get("/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 18,
        key: import.meta.env.VITE_YOUTUBE_API_KEY, // replace with your key
      },
    });
    return res.data.items;
  } catch (error) {
    console.error("API Error:", error);
    return { items: [] }; // fallback
  }
};

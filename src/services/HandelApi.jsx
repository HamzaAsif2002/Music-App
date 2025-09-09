import axios from "axios";

const key = "AIzaSyCDpAFdLopjv6zNcOeYFR6zN80i5wwh9aM";

const api = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});

export const GetApiData = async (query) => {
  try {
    const res = await axios.get("/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 8,
        key: key, // replace with your key
      },
    });
    return res.data;
  } catch (error) {
    console.error("API Error:", error);
    return { items: [] }; // fallback
  }
};

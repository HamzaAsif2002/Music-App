import { useState, useRef } from "react";
import YouTube from "react-youtube";
import { GetApiData } from "../services/HandelApi";
import { useQuery } from "@tanstack/react-query";

function LandingPage() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("ahad rafay"); // default term
  const [videoId, setVideoId] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const playerRef = useRef(null);

  const {
    data: results = [], // default empty array
  } = useQuery({
    queryKey: ["songs", searchTerm],
    queryFn: () => GetApiData(searchTerm),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // replaced cacheTime in v5
    refetchOnWindowFocus: false,
    enabled: !!searchTerm, // only fetch when searchTerm exists
  });

  const onSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    setSearchTerm(query);
    setQuery("");
    // React Query will automatically fetch since searchTerm changed
  };

  // Play selected song
  const playSong = (item) => {
    setVideoId(item.id.videoId);
    setCurrentSong(item.snippet);
  };

  const opts = {
    height: "400",
    width: "700",
    playerVars: { autoplay: 1 },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">🎵 My Music WebApp</h1>

      {/* Search Bar */}
      <form onSubmit={onSearch} className="w-full max-w-2xl mb-8 flex">
        <input
          type="text"
          placeholder="Search music..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 rounded-l-xl text-black outline-none 
             transition duration-200 ease-in-out 
            bg-gray-100  shadow-md"
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-black px-6 rounded-r-xl font-semibold"
        >
          Search
        </button>
      </form>

      <div className="flex justify-center gap-5  flex-col items-center lg:items-start lg:flex-row">
        {/* Now Playing */}
        {currentSong && videoId && (
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg w-full max-w-2xl mb-6 max-h-[500px]">
            {/* YouTube Player */}
            <YouTube videoId={videoId} opts={opts} onReady={onReady} />

            <h2 className="text-xl font-bold mb-4 mt-3">{currentSong.title}</h2>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6 w-full max-w-5xl mb-8">
          {results.map((item) => (
            <div
              key={item.id.videoId}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              <img
                src={item.snippet.thumbnails?.medium?.url}
                alt={item.snippet.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                {item.snippet.title}
              </h2>
              <button
                onClick={() => playSong(item)}
                className="bg-green-500 px-4 py-2 rounded-lg mt-2"
              >
                ▶ Play
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

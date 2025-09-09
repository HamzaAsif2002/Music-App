import { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import { GetApiData } from "./services/HandelApi";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [videoId, setVideoId] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const playerRef = useRef(null);

  // 🎵 Load default Ahad Rafay songs on page load
  useEffect(() => {
    const loadDefaultSongs = async () => {
      try {
        const data = await GetApiData("bilal saeed");
        if (data?.items?.length > 0) {
          setResults(data.items);
          setVideoId(data.items[0].id.videoId);
          setCurrentSong(data.items[0].snippet);
        } else {
          console.warn("No songs found for Ahad Rafay");
          setResults([]);
        }
      } catch (err) {
        console.error("Error loading default songs:", err);
        setResults([]);
      }
    };

    loadDefaultSongs();
  }, []);

  // 🔍 Search YouTube
  const searchYouTube = async () => {
    if (!query) return;
    try {
      const data = await GetApiData(query);
      if (data?.items?.length > 0) {
        setResults(data.items);
        setVideoId(data.items[0].id.videoId);
        setCurrentSong(data.items[0].snippet);
      } else {
        setResults([]);
        console.warn("No search results found");
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
  };

  // 🎵 YouTube player options
  const opts = {
    height: "400",
    width: "700",
    playerVars: { autoplay: 1 },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  const playSong = (item) => {
    setVideoId(item.id.videoId);
    setCurrentSong(item.snippet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">🎵 My Music WebApp</h1>

      {/* Search bar */}
      <div className="flex w-full max-w-2xl mb-8">
        <input
          type="text"
          placeholder="Search music..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 rounded-l-xl text-black outline-none"
        />
        <button
          onClick={searchYouTube}
          className="bg-amber-500 hover:bg-amber-600 text-black px-6 rounded-r-xl font-semibold"
        >
          Search
        </button>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
        {results?.map((item) => (
          <div
            key={item.id.videoId}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg hover:scale-105 transition-transform cursor-pointer"
            onClick={() => playSong(item)}
          >
            <img
              src={item.snippet.thumbnails?.medium?.url}
              alt={item.snippet.title}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h2 className="text-lg font-semibold mb-2 line-clamp-2">
              {item.snippet.title}
            </h2>
          </div>
        ))}
      </div>

      {/* Now Playing */}
      {currentSong && (
        <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg w-full max-w-2xl mb-6">
          <img
            src={currentSong.thumbnails?.medium?.url}
            alt={currentSong.title}
            className="w-24 h-24 object-cover rounded-lg mr-4"
          />
          <div>
            <h2 className="text-xl font-bold">{currentSong.title}</h2>
          </div>
        </div>
      )}

      {/* YouTube Player */}
      {videoId && <YouTube videoId={videoId} opts={opts} onReady={onReady} />}

      {/* Controls */}
      {playerRef.current && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => playerRef.current.playVideo()}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
          >
            ▶ Play
          </button>
          <button
            onClick={() => playerRef.current.pauseVideo()}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg"
          >
            ⏸ Pause
          </button>
          <button
            onClick={() => playerRef.current.stopVideo()}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            ⏹ Stop
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

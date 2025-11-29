"use client";
import { useState, useEffect } from "react";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

interface FoodItem {
  id: string;
  title: string;
  picture: string;
  description: string;
  ingredients: string;
  timetaken: string;
  difficulty: string;
  steps?: string;
  score?: number;
}

export default function ThaiFoodSearch() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [ascending, setAscending] = useState<boolean>(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(res.statusText);

        let data: FoodItem[] = await res.json();
        const lowerQuery = query.toLowerCase();

        // Try to detect if query is time or difficulty
        const timeMatch = lowerQuery.match(/(\d+)\s*(min|minutes|mins)?/);
        const diffMatch = ["easy", "medium", "hard"].find((lvl) =>
          lowerQuery.includes(lvl)
        );

        // Filter logic
        let filtered = data;
        if (timeMatch) {
          const targetTime = parseInt(timeMatch[1]);
          filtered = filtered.filter((item) => {
            const timeNum = parseInt(item.timetaken);
            return !isNaN(timeNum) && Math.abs(timeNum - targetTime) <= 5; // ±5 min tolerance
          });
        }

        if (diffMatch) {
          filtered = filtered.filter(
            (item) =>
              item.difficulty.toLowerCase().includes(diffMatch) ||
              diffMatch.includes(item.difficulty.toLowerCase())
          );
        }

        // // Calculate relevance score
        // filtered = filtered.map((item) => {
        //   const count = (text: string) =>
        //     text.toLowerCase().split(lowerQuery).length - 1;

        //   const titleScore = count(item.title) * 4;
        //   const descScore = count(item.description) * 2;
        //   const ingredScore = count(item.ingredients) * 2;
        //   const timeScore = count(item.timetaken);
        //   const diffScore = count(item.difficulty);

        //   return {
        //     ...item,
        //     score: titleScore + descScore + ingredScore + timeScore + diffScore,
        //   };
        // });

        // Only show relevant
        const relevant = filtered.filter((item) => (item.score || 0) > 0);

        // Sort
        const sorted = relevant.sort((a, b) =>
          ascending
            ? (a.score || 0) - (b.score || 0)
            : (b.score || 0) - (a.score || 0)
        );

        setResults(sorted);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("Fetch failed:", err);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchData, 300);
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, ascending]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-amber-50 to-orange-100 p-6 pt-20">
      <h1 className="text-4xl font-bold mb-6 text-amber-800">🍜 Thai Food Search</h1>

      <div className="relative w-full max-w-xl mb-6">
        {/* Search bar */}
        <div className="flex items-center bg-white shadow-md rounded-full overflow-hidden border border-amber-200">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food, e.g. 'spicy', '15 min', 'easy'..."
            className="flex-grow px-4 py-2 outline-none text-gray-700 rounded-l-full"
          />
          {/* Sort icon */}
          <button
            onClick={() => setAscending(!ascending)}
            className="px-4 text-gray-700 hover:text-amber-700 transition"
            title={`Sort ${ascending ? "descending" : "ascending"}`}
          >
            {ascending ? <FaSortAmountUp size={20} /> : <FaSortAmountDown size={20} />}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-4 flex flex-col gap-4 w-full">
            {results.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-amber-200 shadow-md rounded-lg p-4 flex gap-4 hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                  <img src={item.picture} alt={item.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow">
                  <h2 className="text-lg font-semibold text-amber-700">{item.title}</h2>

                  <p className="text-gray-600 text-sm mb-1">{item.description}</p>

                  <p className="text-gray-500 text-xs mb-1">
                    🕒 {item.timetaken} | ⚙️ {item.difficulty}
                  </p>

                 

                  {item.score !== undefined && (
                    <p className="text-yellow-600 font-bold">⭐ {item.score.toFixed(3)} relevance</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && <p className="text-gray-600 mt-2">Searching...</p>}
        {!loading && query && results.length === 0 && (
          <p className="text-gray-600 mt-2">No matching recipes found.</p>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold"
              onClick={() => setSelectedItem(null)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-amber-800 mb-4">
              {selectedItem.title}
            </h2>

            <div className="flex gap-4 mb-4">
              <div className="w-48 h-48 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={selectedItem.picture}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-gray-600 mb-2">{selectedItem.description}</p>
                <p className="text-gray-500 text-sm mb-1">
                  <strong>Ingredients:</strong> {selectedItem.ingredients}
                </p>
                <p className="text-gray-500 text-sm mb-1">
                  <strong>Time:</strong> {selectedItem.timetaken}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Difficulty:</strong> {selectedItem.difficulty}
                </p>
              </div>
            </div>

            {/* 🔥 Full Steps in Modal */}
            {selectedItem.steps && (
              <div>
                <h3 className="text-lg font-semibold text-amber-700 mb-2">Steps</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedItem.steps}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

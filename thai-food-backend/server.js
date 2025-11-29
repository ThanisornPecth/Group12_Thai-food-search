// server.js
import express from "express";
import cors from "cors";
import { Client } from "@elastic/elasticsearch";

const app = express();

// Allow requests from frontend
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Connect to Elasticsearch
const client = new Client({ node: "http://localhost:9200" });

// Search route
app.get("/search", async (req, res) => {
  const q = req.query.q ? req.query.q.trim() : "";
  if (!q) return res.json([]);

  try {
    const result = await client.search({
      index: "thai_foods",
      size: 100,
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: q,
                type: "most_fields",
                fields: [
                  "title^4",
                  "description^2",
                  "ingredients^2",
                  "timetaken",
                  "difficulty",
                  "steps"              // 🔥 added steps so search includes them
                ],
                fuzziness: "AUTO",
                operator: "or",
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
    });

    const hits = result.hits.hits
      .filter(hit => (hit._score || 0) > 0)
      .map(hit => ({
        id: hit._id,
        title: hit._source.title || "",
        picture: hit._source.picture || "",
        description: hit._source.description || "No description available",
        ingredients: hit._source.ingredients || "N/A",
        timetaken: hit._source.timetaken || "N/A",
        difficulty: hit._source.difficulty || "N/A",
        steps: hit._source.steps || "No steps available",  // 🔥 RETURN STEPS HERE
        score: hit._score || 0,
      }))
      .sort((a, b) => b.score - a.score);

    res.json(hits);
  } catch (err) {
    console.error("Elasticsearch error:", err.meta?.body?.error || err);
    res.status(500).json({ error: "Search failed" });
  }
});

const PORT = 5001;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

import fs from "fs";
import { Client } from "@elastic/elasticsearch";

const client = new Client({ node: "http://localhost:9200" });
const indexName = "thai_foods";

async function run() {
  const { body: exists } = await client.indices.exists({ index: indexName });

  if (!exists) {
    await client.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            title:       { type: "text" },
            ingredients: { type: "text" },
            description: { type: "text" },
            steps:       { type: "text" },
            timetaken:   { type: "keyword" },
            difficulty:  { type: "keyword" },
            picture:     { type: "keyword" }
          }
        }
      }
    });
    console.log("✅ Index created");
  } else {
    console.log("ℹ️ Index already exists");
  }

  const raw = fs.readFileSync("../thai_foods.json", "utf8");
  const docs = JSON.parse(raw);

  const body = docs.flatMap((doc) => [
    { index: { _index: indexName } },
    doc
  ]);

  const result = await client.bulk({ refresh: true, body });

  if (result.errors) {
    const errored = result.items.filter(item => item.index?.error);
    console.error("❌ Bulk errors:", errored);
  } else {
    console.log("✅ Import completed");
  }
}

run().catch(console.error);

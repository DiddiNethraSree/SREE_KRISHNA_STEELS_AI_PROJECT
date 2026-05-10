import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_KEY = process.env.ADMIN_KEY || "change-me-admin-key";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, "data", "products.json");

app.use(cors());
app.use(express.json());

async function readProducts() {
  const raw = await fs.readFile(dataFilePath, "utf8");
  return JSON.parse(raw);
}

async function writeProducts(products) {
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Furniture showroom API running" });
});

app.get("/api/products", async (_req, res) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Could not load products", error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const incomingKey = req.headers["x-admin-key"];
    if (incomingKey !== ADMIN_KEY) {
      return res.status(401).json({ message: "Unauthorized: invalid admin key" });
    }

    const { name, category, price, material, dimensions, stockStatus, imageUrl, description } = req.body;
    if (!name || !category || !price || !material || !dimensions || !stockStatus || !imageUrl) {
      return res.status(400).json({ message: "Missing required product fields" });
    }

    const products = await readProducts();
    const id = `${category.toUpperCase()}-${String(products.length + 1).padStart(3, "0")}`;

    const newProduct = {
      id,
      name,
      category,
      price: Number(price),
      material,
      dimensions,
      stockStatus,
      imageUrl,
      description: description || ""
    };

    products.unshift(newProduct);
    await writeProducts(products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Could not add product", error: error.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const incomingKey = req.headers["x-admin-key"];
    if (incomingKey !== ADMIN_KEY) {
      return res.status(401).json({ message: "Unauthorized: invalid admin key" });
    }

    const { id } = req.params;
    const { name, category, price, material, dimensions, stockStatus, imageUrl, description } = req.body;

    const products = await readProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existing = products[index];
    products[index] = {
      ...existing,
      name: name ?? existing.name,
      category: category ?? existing.category,
      price: price !== undefined ? Number(price) : existing.price,
      material: material ?? existing.material,
      dimensions: dimensions ?? existing.dimensions,
      stockStatus: stockStatus ?? existing.stockStatus,
      imageUrl: imageUrl ?? existing.imageUrl,
      description: description ?? existing.description
    };

    await writeProducts(products);
    res.json(products[index]);
  } catch (error) {
    res.status(500).json({ message: "Could not update product", error: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const incomingKey = req.headers["x-admin-key"];
    if (incomingKey !== ADMIN_KEY) {
      return res.status(401).json({ message: "Unauthorized: invalid admin key" });
    }

    const { id } = req.params;
    const products = await readProducts();
    const filtered = products.filter((product) => product.id !== id);

    if (filtered.length === products.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    await writeProducts(filtered);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete product", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

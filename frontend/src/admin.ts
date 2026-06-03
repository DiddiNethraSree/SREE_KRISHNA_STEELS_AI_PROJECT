import "../src/style.css";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  material: string;
  dimensions: string;
  stockStatus: string;
  imageUrl: string;
  description: string;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

let adminKey = sessionStorage.getItem("x-admin-key") || "";
let catalogProducts: Product[] = [];

// DOM Elements
const authOverlay = document.getElementById("admin-auth-overlay") as HTMLDivElement;
const adminDashboard = document.getElementById("admin-dashboard") as HTMLDivElement;
const loginForm = document.getElementById("admin-login-form") as HTMLFormElement;
const passcodeInput = document.getElementById("admin-passcode-input") as HTMLInputElement;
const authErrorMsg = document.getElementById("auth-error-msg") as HTMLParagraphElement;
const logoutBtn = document.getElementById("admin-logout-btn") as HTMLButtonElement;

// Stats Elements
const statTotalProducts = document.getElementById("stat-total-products") as HTMLElement;
const statCategories = document.getElementById("stat-categories") as HTMLElement;
const statOutOfStock = document.getElementById("stat-out-of-stock") as HTMLElement;

// Form Elements
const addForm = document.getElementById("add-product-form") as HTMLFormElement;
const formFeedback = document.getElementById("form-feedback") as HTMLParagraphElement;

// CSV Elements
const csvDragArea = document.getElementById("csv-drag-area") as HTMLDivElement;
const csvFileInput = document.getElementById("csv-file-input") as HTMLInputElement;
const csvFeedback = document.getElementById("csv-feedback") as HTMLParagraphElement;
const downloadTemplateBtn = document.getElementById("download-csv-template") as HTMLButtonElement;

// Catalog Elements
const tableBody = document.getElementById("catalog-table-body") as HTMLTableSectionElement;
const searchInput = document.getElementById("catalog-search") as HTMLInputElement;
const categoryFilter = document.getElementById("catalog-category-filter") as HTMLSelectElement;

// Modal Elements
const editModal = document.getElementById("edit-product-modal") as HTMLDivElement;
const editForm = document.getElementById("edit-product-form") as HTMLFormElement;
const editIdInput = document.getElementById("edit-prod-id") as HTMLInputElement;
const editNameInput = document.getElementById("edit-prod-name") as HTMLInputElement;
const editCategorySelect = document.getElementById("edit-prod-category") as HTMLSelectElement;
const editPriceInput = document.getElementById("edit-prod-price") as HTMLInputElement;
const editMaterialInput = document.getElementById("edit-prod-material") as HTMLInputElement;
const editDimensionsInput = document.getElementById("edit-prod-dimensions") as HTMLInputElement;
const editStockSelect = document.getElementById("edit-prod-stock") as HTMLSelectElement;
const editImageInput = document.getElementById("edit-prod-image") as HTMLInputElement;
const editDescInput = document.getElementById("edit-prod-desc") as HTMLTextAreaElement;
const closeEditBtn = document.getElementById("close-edit-modal") as HTMLButtonElement;

// ── Auth Handling ─────────────────────────────────────────────────────────────

async function verifyAdminKey(key: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": key
      },
      body: JSON.stringify({})
    });
    // Valid key returns 400 (missing fields), invalid key returns 401
    return response.status !== 401;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
}

async function tryLogin(key: string) {
  const isValid = await verifyAdminKey(key);
  if (isValid) {
    adminKey = key;
    sessionStorage.setItem("x-admin-key", key);
    authOverlay.style.display = "none";
    adminDashboard.style.display = "block";
    loadCatalog();
  } else {
    authErrorMsg.style.display = "block";
    sessionStorage.removeItem("x-admin-key");
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authErrorMsg.style.display = "none";
  await tryLogin(passcodeInput.value.trim());
});

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("x-admin-key");
  adminKey = "";
  authOverlay.style.display = "grid";
  adminDashboard.style.display = "none";
  passcodeInput.value = "";
});

// ── Data Handling & Table Rendering ──────────────────────────────────────────

async function loadCatalog() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) throw new Error("Could not load products");
    catalogProducts = await response.json();
    updateStats();
    renderCatalogTable();
  } catch (err: any) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#ff4444;">Error loading products: ${err.message}</td></tr>`;
  }
}

function updateStats() {
  statTotalProducts.textContent = String(catalogProducts.length);
  
  const categories = new Set(catalogProducts.map(p => p.category.toLowerCase()));
  statCategories.textContent = String(categories.size);
  
  const outOfStock = catalogProducts.filter(p => p.stockStatus === "Out of Stock").length;
  statOutOfStock.textContent = String(outOfStock);
}

function renderCatalogTable() {
  const searchQuery = searchInput.value.toLowerCase().trim();
  const catFilter = categoryFilter.value.toLowerCase();
  
  const filtered = catalogProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) ||
                          p.material.toLowerCase().includes(searchQuery) ||
                          p.id.toLowerCase().includes(searchQuery);
    const matchesCat = catFilter === "all" || p.category.toLowerCase() === catFilter;
    return matchesSearch && matchesCat;
  });
  
  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--muted)">No matching products found.</td></tr>`;
    return;
  }
  
  tableBody.innerHTML = filtered.map(p => `
    <tr>
      <td>
        <div class="secure-image-container" style="width:50px; height:50px; border-radius:6px; overflow:hidden; border:1px solid var(--line);">
          <div class="secure-image-overlay"></div>
          <img src="${p.imageUrl}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='/branding/d-furniture-logo-centered.jpg'" />
        </div>
      </td>
      <td>
        <strong>${p.name}</strong>
        <div style="font-size:0.75rem; color:var(--muted); margin-top:0.2rem;">
          ID: ${p.id} | Size: ${p.dimensions} | Material: ${p.material}
        </div>
      </td>
      <td><span class="chip" style="font-size:0.7rem; padding:0.2rem 0.5rem;">${p.category}</span></td>
      <td><strong>₹ ${p.price.toLocaleString("en-IN")}</strong></td>
      <td>
        <span style="font-size:0.75rem; font-weight:700; color: ${p.stockStatus === "In Stock" ? "var(--green)" : p.stockStatus === "Out of Stock" ? "#ff4444" : "var(--gold)"}">
          ${p.stockStatus}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:0.4rem;">
          <button class="secondary-btn edit-btn" data-id="${p.id}" style="padding:0.3rem 0.6rem; font-size:0.75rem;">Edit</button>
          <button class="primary-btn delete-btn" data-id="${p.id}" style="padding:0.3rem 0.6rem; font-size:0.75rem; background:linear-gradient(135deg, #d32f2f, #b71c1c);">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  // Bind edit/delete handlers
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = (e.currentTarget as HTMLButtonElement).dataset.id;
      if (id) openEditModal(id);
    });
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = (e.currentTarget as HTMLButtonElement).dataset.id;
      if (id && confirm(`Are you sure you want to delete product ${id}?`)) {
        await deleteProduct(id);
      }
    });
  });
}

searchInput.addEventListener("input", renderCatalogTable);
categoryFilter.addEventListener("change", renderCatalogTable);

// ── CRUD Single Operations ───────────────────────────────────────────────────

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  showFeedback(formFeedback, "Saving product...", "info");
  
  const productData = {
    name: (document.getElementById("prod-name") as HTMLInputElement).value.trim(),
    category: (document.getElementById("prod-category") as HTMLSelectElement).value,
    price: Number((document.getElementById("prod-price") as HTMLInputElement).value),
    material: (document.getElementById("prod-material") as HTMLInputElement).value.trim(),
    dimensions: (document.getElementById("prod-dimensions") as HTMLInputElement).value.trim(),
    stockStatus: (document.getElementById("prod-stock") as HTMLSelectElement).value,
    imageUrl: (document.getElementById("prod-image") as HTMLInputElement).value.trim(),
    description: (document.getElementById("prod-desc") as HTMLTextAreaElement).value.trim()
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Failed to add product");
    }

    showFeedback(formFeedback, "✔️ Product added successfully!", "success");
    addForm.reset();
    await loadCatalog();
  } catch (err: any) {
    showFeedback(formFeedback, `❌ Error: ${err.message}`, "error");
  }
});

async function deleteProduct(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey }
    });
    
    if (response.status === 401) {
      alert("Session expired. Please log in again.");
      logoutBtn.click();
      return;
    }
    
    if (!response.ok) throw new Error("Failed to delete product");
    
    await loadCatalog();
  } catch (err: any) {
    alert(`Error deleting product: ${err.message}`);
  }
}

function openEditModal(id: string) {
  const p = catalogProducts.find(item => item.id === id);
  if (!p) return;
  
  editIdInput.value = p.id;
  editNameInput.value = p.name;
  editCategorySelect.value = p.category;
  editPriceInput.value = String(p.price);
  editMaterialInput.value = p.material;
  editDimensionsInput.value = p.dimensions;
  editStockSelect.value = p.stockStatus;
  editImageInput.value = p.imageUrl;
  editDescInput.value = p.description;
  
  editModal.style.display = "grid";
}

closeEditBtn.addEventListener("click", () => {
  editModal.style.display = "none";
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = editIdInput.value;
  
  const productData = {
    name: editNameInput.value.trim(),
    category: editCategorySelect.value,
    price: Number(editPriceInput.value),
    material: editMaterialInput.value.trim(),
    dimensions: editDimensionsInput.value.trim(),
    stockStatus: editStockSelect.value,
    imageUrl: editImageInput.value.trim(),
    description: editDescInput.value.trim()
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey
      },
      body: JSON.stringify(productData)
    });

    if (response.status === 401) {
      alert("Session expired. Please log in again.");
      logoutBtn.click();
      return;
    }

    if (!response.ok) throw new Error("Failed to update product");
    
    editModal.style.display = "none";
    await loadCatalog();
  } catch (err: any) {
    alert(`Error updating product: ${err.message}`);
  }
});

// ── CSV Bulk Parsing & Importer ─────────────────────────────────────────────

function parseCSV(text: string): any[] {
  const lines: string[] = [];
  let currentLine = "";
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i+1];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = "";
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip carriage return newline pair
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }
  
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  const results: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;
    
    const item: any = {};
    headers.forEach((header, index) => {
      item[header.trim()] = values[index] ? values[index].trim() : "";
    });
    results.push(item);
  }
  
  return results;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let currentValue = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(currentValue);
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  result.push(currentValue);
  return result;
}

async function processCSVFile(file: File) {
  showFeedback(csvFeedback, "Reading CSV file...", "info");
  const reader = new FileReader();
  
  reader.onload = async () => {
    const text = reader.result as string;
    try {
      const parsedData = parseCSV(text);
      if (parsedData.length === 0) {
        throw new Error("No valid rows found in CSV or invalid headers format.");
      }

      // Map headers case-insensitively
      const mappedProducts = parsedData.map(row => {
        const findVal = (keyNames: string[]) => {
          const foundKey = Object.keys(row).find(k => keyNames.includes(k.toLowerCase().trim()));
          return foundKey ? row[foundKey] : "";
        };

        return {
          name: findVal(["name", "product name", "title"]),
          category: findVal(["category", "type"]).toLowerCase(),
          price: Number(findVal(["price", "cost", "rate", "amount"])) || 0,
          material: findVal(["material", "wood", "fabric", "metal"]),
          dimensions: findVal(["dimensions", "size", "dimension", "measurements"]),
          stockStatus: findVal(["stockstatus", "stock status", "stock", "availability"]) || "In Stock",
          imageUrl: findVal(["imageurl", "image url", "photo", "image", "picture"]),
          description: findVal(["description", "desc", "details", "info"]) || ""
        };
      });

      // Filter out products missing required fields
      const validProducts = mappedProducts.filter(p => p.name && p.category && p.price && p.material && p.dimensions && p.imageUrl);
      if (validProducts.length === 0) {
        throw new Error("All items are missing one or more required fields (Name, Category, Price, Material, Dimensions, ImageUrl).");
      }

      showFeedback(csvFeedback, `Importing ${validProducts.length} items to database...`, "info");
      
      const response = await fetch(`${API_BASE_URL}/api/products/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey
        },
        body: JSON.stringify(validProducts)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to bulk import products");
      }

      const resData = await response.json();
      showFeedback(csvFeedback, `✔️ Successfully imported ${resData.products.length} products!`, "success");
      await loadCatalog();
    } catch (err: any) {
      showFeedback(csvFeedback, `❌ CSV Error: ${err.message}`, "error");
    }
  };

  reader.onerror = () => {
    showFeedback(csvFeedback, "❌ File read error.", "error");
  };

  reader.readAsText(file);
}

// Drag & drop triggers
csvDragArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  csvDragArea.classList.add("drag-over");
});

csvDragArea.addEventListener("dragleave", () => {
  csvDragArea.classList.remove("drag-over");
});

csvDragArea.addEventListener("drop", (e) => {
  e.preventDefault();
  csvDragArea.classList.remove("drag-over");
  const file = e.dataTransfer?.files[0];
  if (file && file.name.endsWith(".csv")) {
    processCSVFile(file);
  } else {
    showFeedback(csvFeedback, "❌ Invalid file type. Please select a .csv file.", "error");
  }
});

csvDragArea.addEventListener("click", () => {
  csvFileInput.click();
});

csvFileInput.addEventListener("change", () => {
  const file = csvFileInput.files?.[0];
  if (file) processCSVFile(file);
});

// CSV sample download
downloadTemplateBtn.addEventListener("click", () => {
  const csvHeaders = "Name,Category,Price,Material,Dimensions,StockStatus,ImageUrl,Description\n";
  const csvRows = [
    '"Premium Teak Sofa","sofa",35000,"Teak Wood","72x34x32 inches","In Stock","https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800","Handcrafted teak wood frame with premium fabric cushion upholstery."',
    '"King Size Wooden Bed","bed",28000,"Rosewood","78x72x36 inches","Custom Order","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800","Rosewood double bed with storage drawer units and smooth finish."',
    '"Office Ergonomic Chair","chair",6800,"Nylon & Mesh","24x24x40 inches","Out of Stock","https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800","Ergonomic office high-back chair with lumbar support and pneumatic lift."'
  ].join("\n");
  
  const blob = new Blob([csvHeaders + csvRows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "sks_products_import_template.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Helper feedback function
function showFeedback(el: HTMLParagraphElement, msg: string, type: "success" | "error" | "info") {
  el.textContent = msg;
  el.style.display = "block";
  el.style.color = type === "success" ? "var(--green)" : type === "error" ? "#ff4444" : "var(--gold)";
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

if (adminKey) {
  tryLogin(adminKey);
} else {
  authOverlay.style.display = "grid";
  adminDashboard.style.display = "none";
}

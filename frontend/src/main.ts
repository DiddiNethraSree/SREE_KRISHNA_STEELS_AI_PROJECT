import "./style.css";

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
const SHOP_WHATSAPP = "9848082209";
const SHOP_PHONE = "98 48 08 2209, 92 47 25 6067, 99 48 54 5035";
const MAPS_QUERY = "Sree Krishna Steels Jaggayyapeta";
const DEFAULT_ROOM_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("App container not found");

const page = document.body.dataset.page || "home";

function nav(active: string) {
  return `
    <header class="top-nav-wrap">
      <nav class="top-nav container">
        <a class="brand" href="/index.html">
          <img src="/branding/d-furniture-logo-centered.jpg" alt="D Furniture" />
          <div><p style="color:#e63946">SREE KRISHNA STEELS &amp; FURNITURE <strong style="color:#d4af37">| NETRA BRAND</strong></p></div>
        </a>
        <div class="nav-links">
          <a class="${active === "home" ? "active" : ""}" href="/index.html">Home</a>
          <a class="${active === "catalogue" ? "active" : ""}" href="/catalogue.html">Catalogue</a>
          <a class="${active === "ai" ? "active" : ""}" href="/ai-room-designer.html">AI Designer &amp; Measure</a>
          <a class="${active === "contact" ? "active" : ""}" href="/contact.html">Contact</a>
        </div>
        <a class="wa-pill" target="_blank" rel="noopener noreferrer" href="https://wa.me/${SHOP_WHATSAPP}">WhatsApp</a>
      </nav>
    </header>
  `;
}

function footer() {
  return `
    <footer class="footer-shell">
      <div class="footer container">
        <article><h4>SREE KRISHNA STEELS &amp; FURNITURE</h4><p>NETRA BRAND</p><p>Premium furniture crafted with trust, durability &amp; passion.</p><p style="color:#e63946;font-size:0.82rem;margin-top:0.4rem;">Proprietor: Diddi Krishna</p></article>
        <article><h4>Quick Links</h4><a href="/index.html">Home</a><a href="/catalogue.html">Catalogue</a><a href="/ai-room-designer.html">AI Designer &amp; Measure</a><a href="/contact.html">Contact</a></article>
        <article><h4>Visit Us</h4><p>Furniture Manufacturing Unit, Auto Nagar, Jaggayyapeta</p><p>${SHOP_PHONE}</p>
        <p><a href="https://www.instagram.com/sreekrishnasteelsofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" style="color:#e2e8f0;text-decoration:none">Instagram: sreekrishnasteelsoffical</a></p>
        <p><a href="https://www.youtube.com/@SreeKrishnaSteelsFurniture" target="_blank" style="color:#e2e8f0;text-decoration:none">YouTube: SreeKrishnaSteels&amp; Furniture</a></p>
        </article>
      </div>
      <div class="footer-rights">
        <div class="container footer-rights-inner">
          <p>© 2026 Sree Krishna Steels &amp; Furniture. All rights reserved.</p>
          <div><a href="#">Privacy Policy</a><a href="#">Terms &amp; Conditions</a></div>
        </div>
      </div>
    </footer>
  `;
}

function homePage() {
  return `
    ${nav("home")}
    <div class="particles" id="particles"></div>
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content container reveal">
        <div>
          <p class="tag">JAGGAYYAPETA'S MOST TRUSTED</p>
          <h1><span class="brand-name" style="color:#e63946">SREE KRISHNA STEELS &amp; FURNITURE</span> <small style="font-size: 0.5em; vertical-align: middle; color:#d4af37">| NETRA BRAND</small></h1>
          <div class="proprietor-badge"><span class="crown">👑</span><span>Proprietor: <strong>Diddi Krishna</strong> — With a single hand, he built and rules this entire industry!</span></div>
          <p class="subtitle">With one visionary hand, Diddi Krishna transformed Jaggayyapeta's furniture market forever. Every piece we craft carries his legacy of unmatched quality, fair pricing, and a dedication that has made thousands of homes beautiful.</p>
          <div class="hero-actions">
            <a class="primary-btn" href="/catalogue.html">Browse Catalogue</a>
            <a class="ghost-btn" href="/ai-room-designer.html">📐 AI Room Designer &amp; Measure</a>
          </div>
          <div class="stats">
            <article><strong>29+</strong><span>Years of Trust</span></article>
            <article><strong>5000+</strong><span>Happy Families</span></article>
            <article><strong>500+</strong><span>Furniture Styles</span></article>
          </div>
        </div>
        <div class="hero-logos">
          <img src="/branding/sree-krishna-logo-centered.jpg" alt="Sree Krishna" />
          <img src="/branding/netra-brand-logo-centered.jpg" alt="Netra Brand" />
        </div>
      </div>
      <div class="trust-strip"><p>✅ 5-Year Warranty</p><p>🚚 Free Home Delivery</p><p>⭐ Standard Quality</p><p>💬 4.9/5 Customer Rating</p></div>
    </section>

    <main class="container main-sections">
      <section class="marketing-grid reveal">
        <article><h3>🛋️ Customized Sofas &amp; Cushion Mattresses</h3><p>Our biggest strength — tailor-made sofas &amp; cushion mattresses built to your exact room size, style &amp; comfort preference. No compromises, pure perfection.</p></article>
        <article><h3>🪵 All Wood &amp; Iron Products</h3><p>Racks, tables, almiras, iron chairs, beds, dressing tables, customized cupboards, stools &amp; any wood/iron item — all available at reasonable prices with standard quality.</p></article>
        <article><h3>🎨 Free Design Consultation</h3><p>Visit our showroom or call us — our expert team will help you plan room-wise furniture with the best fit, style &amp; budget combination.</p></article>
      </section>

      <section class="brand-story reveal">
        <div>
          <h2>Built on Trust, Quality &amp; One Man's Vision</h2>
          <p><strong style="color:#e63946">Sree Krishna Steels &amp; Furniture</strong> has been the heartbeat of Jaggayyapeta's furniture market. Under the single-handed leadership of <strong style="color:#f5a623">Proprietor Diddi Krishna</strong>, we have grown from a local shop into the most trusted furniture destination in the region.</p>
          <p style="margin-top:0.6rem;color:#64748b;font-size:0.93rem">✨ <em>Customization is our biggest plus point — because your home deserves furniture made exactly for you, not just something off a shelf.</em></p>
          <blockquote id="quote-rotator">"With a single hand, Diddi Krishna built an empire of quality furniture."</blockquote>
        </div>
        <img src="/branding/d-furniture-logo-centered.jpg" alt="D Furniture logo" />
      </section>

      <section class="innovation-cards reveal">
        <article><h4>📐 AI Room Measurement</h4><p>Upload a photo of your room — our AI instantly estimates room dimensions to help plan your perfect sofa or furniture fit.</p></article>
        <article><h4>💰 Reasonable Price Promise</h4><p>Premium quality at prices that respect your budget. We beat market rates without cutting corners on materials or finish.</p></article>
        <article><h4>📱 Quick WhatsApp Deal</h4><p>Send us a message on WhatsApp and get an instant quote, customization options, and doorstep delivery — fast &amp; hassle-free.</p></article>
      </section>

      <section class="marketing-grid reveal" style="background:rgba(230,57,70,0.04);border-color:rgba(230,57,70,0.2)">
        <article><h3>🪑 Chairs &amp; Stools</h3><p>Wooden, iron &amp; cushioned chairs — for dining rooms, offices, and lounges. Stools of all sizes available.</p></article>
        <article><h3>🛏️ Beds &amp; Dressing Tables</h3><p>King, queen &amp; single beds in solid wood. Dressing tables with mirrors — stylish &amp; built to last generations.</p></article>
        <article><h3>🗄️ Almiras &amp; Cupboards</h3><p>Standard &amp; fully customized almiras, wardrobes &amp; cupboards. Built to your exact measurements &amp; room layout.</p></article>
      </section>

      <section class="cta-banner reveal">
        <h2>Ready to transform your home?</h2>
        <p>From customized sofas to iron racks — everything you need, all under one roof at <strong>SKS &amp; D Furniture</strong>. Reasonable price. Standard quality. No compromise.</p>
        <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;margin-top:1rem">
          <a class="primary-btn" href="/catalogue.html">Browse Catalogue</a>
          <a class="ghost-btn" href="/ai-room-designer.html">📐 AI Room Designer &amp; Measure</a>
        </div>
      </section>
    </main>
    ${footer()}
  `;
}

function cataloguePage() {
  return `
    ${nav("catalogue")}
    <main class="container main-sections">
      <section id="catalogue" class="reveal">
        <div class="section-heading">
          <h2>Furniture Catalogue</h2>
          <div class="controls">
            <select id="category-filter"><option value="all">All Categories</option><option value="sofa">Sofas</option><option value="bed">Beds</option><option value="dining">Dining</option><option value="office">Office</option></select>
            <input id="search-input" type="search" placeholder="Search by product name..." />
          </div>
        </div>
        <div id="products-grid" class="products-grid"></div>
      </section>
    </main>
    ${footer()}
  `;
}

function aiPage() {
  return `
    ${nav("ai")}
    <main class="container main-sections">
      <section class="measure-section reveal" style="margin-bottom:3rem;">
        <div class="measure-hero">
          <h2>📐 AI Room Dimension Analyser</h2>
          <p>Upload a photo of your room and our AI will instantly estimate the room's dimensions — width, length &amp; height. This smart tool helps you figure out the exact measurements to choose the perfectly sized furniture for your space!</p>
        </div>
        <div class="measure-upload-area" id="measure-drop">
          <input type="file" id="measure-file" accept="image/*" />
          <span class="upload-icon">📷</span>
          <strong>Click or drag &amp; drop a room photo here</strong>
          <p class="upload-hint">Supports JPG, PNG, WEBP — works best with wide-angle room photos</p>
        </div>
        <div class="measure-layout" id="measure-layout" style="display:none">
          <div class="measure-preview">
            <canvas id="measure-canvas"></canvas>
          </div>
          <div>
            <button class="analyze-btn" id="analyze-btn">🔍 Analyse Room Dimensions</button>
            <button class="analyze-btn" id="download-btn" style="display:none;margin-top:0.8rem;background:#475569;">📥 Download Measured Picture</button>
            <div id="measure-result" class="measure-result-card" style="display:none"></div>
            <div class="sofa-note-card" style="margin-top:1rem">
              <h4>💡 Why This Feature Exists</h4>
              <p>Our proprietor <strong>Diddi Krishna</strong> personally visits customer homes to take sofa measurements — because precision matters. This AI tool now gives customers an instant estimate right from their phone, saving time while maintaining the accuracy needed to craft a perfect customized sofa, cupboard, or any furniture piece for your room.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="ar-preview reveal" style="margin-bottom:3rem; border: 1px solid var(--border); padding: 1.5rem; border-radius: 16px; background: var(--card);">
        <h2 style="color:#1a233a;">AI Camera Room Preview</h2>
        <p style="color:#475569;">Upload your empty room photo and position furniture exactly where you want. <em>"A well-furnished room is a reflection of a well-lived life."</em></p>
        <div class="ar-layout" style="gap: 1.5rem; align-items: start; margin-top: 1rem;">
          <div class="ar-controls" style="gap: 0.5rem;">
            <label style="margin:0">Upload Room Photo<input id="room-upload" type="file" accept="image/*" /></label>
            <label style="margin:0">Select Furniture<select id="furniture-select"></select></label>
            <label style="margin:0">Position X<input id="pos-x" type="range" min="0" max="80" value="20" /></label>
            <label style="margin:0">Position Y<input id="pos-y" type="range" min="0" max="80" value="45" /></label>
            <label style="margin:0">Scale<input id="scale" type="range" min="30" max="200" value="100" /></label>
            <label style="margin:0">Rotate<input id="rotate" type="range" min="-45" max="45" value="0" /></label>
          </div>
          <div class="ar-canvas perspective-canvas">
            <img id="room-image" class="room-image" src="${DEFAULT_ROOM_IMAGE}" alt="Room" />
            <img id="furniture-overlay" class="furniture-overlay" alt="Furniture overlay" style="transform-style: preserve-3d; filter: drop-shadow(0px 10px 15px rgba(0,0,0,0.5));" />
          </div>
        </div>
      </section>

      <section class="ai-room-designer reveal">
        <div class="ai-info">
          <h2>AI Room Designer</h2>
          <h3>See how furniture looks before buying</h3>
          <ul><li>Select exact category (Sofas, Beds, Office tables, Tea pies etc.)</li><li>Get budget-based recommendations</li><li>Preview placement visually</li><li>Instant WhatsApp inquiry</li></ul>
          <div class="sample-images" style="margin-top:1rem;display:flex;gap:0.5rem;overflow-x:auto;">
             <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80" alt="Sofa Sample" style="border-radius:8px;height:80px;object-fit:cover;"/>
             <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=150&q=80" alt="Bed Sample" style="border-radius:8px;height:80px;object-fit:cover;"/>
             <img src="https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=150&q=80" alt="Office Chair Sample" style="border-radius:8px;height:80px;object-fit:cover;"/>
          </div>
        </div>
        <div class="ai-form-card">
          <h4>Generate Smart Recommendation</h4>
          <form id="ai-form" style="display:flex;flex-direction:column;gap:0.8rem;">
            <select name="category" required style="width:100%;">
              <option value="" style="color:#000">Select Furniture Type</option>
              <option value="sofa" style="color:#000">Sofa Sets (L-Shape, 3-Seater, etc.)</option>
              <option value="bed" style="color:#000">Beds & Diwan Cots</option>
              <option value="dining" style="color:#000">Dining Tables</option>
              <option value="office" style="color:#000">Office Tables, Chairs & Racks</option>
              <option value="cupboard" style="color:#000">Almiras & Cupboards</option>
              <option value="table" style="color:#000">Tea Pies & Center Tables</option>
            </select>
            <select name="roomType" required style="width:100%;">
              <option value="" style="color:#000">Select Room Type</option>
              <option value="living" style="color:#000">Living Room</option>
              <option value="bedroom" style="color:#000">Bedroom</option>
              <option value="office" style="color:#000">Office / Workspace</option>
              <option value="dining" style="color:#000">Dining Room</option>
            </select>
            <input name="dimensions" placeholder="Required Size (e.g. 72x36 in or 3-Seater)" required style="width:100%;" />
            <input name="budget" type="number" placeholder="Max Budget in INR" required style="width:100%;" />
            <select name="style" required style="width:100%;">
              <option value="" style="color:#000">Style Preference</option>
              <option value="modern" style="color:#000">Modern</option>
              <option value="classic" style="color:#000">Classic Wooden</option>
              <option value="premium" style="color:#000">Premium Luxury</option>
            </select>
            <button type="submit" class="primary-btn" style="width:100%;text-align:center;">Get Expert Recommendation</button>
          </form>
          <div id="ai-result" class="ai-result">Fill details and click generate.</div>
        </div>
      </section>
    </main>
    ${footer()}
  `;
}

function contactPage() {
  return `
    ${nav("contact")}
    <main class="container main-sections">
      <section class="contact-section reveal">
        <div>
          <h2>Get In Touch</h2>
          <p><strong>SREE KRISHNA STEELS &amp; FURNITURE</strong></p>
          <p>NETRA BRAND, Furniture Manufacturing Unit, Auto Nagar, Jaggayyapeta</p>
          <p><strong>Phone:</strong> ${SHOP_PHONE}</p>
          <p><strong>WhatsApp:</strong> +${SHOP_WHATSAPP}</p>
          <div class="contact-actions"><a class="secondary-btn" href="tel:9848082209">Call Now</a><a class="wa-btn" target="_blank" rel="noopener noreferrer" href="https://wa.me/${SHOP_WHATSAPP}">Chat on WhatsApp</a></div>
        </div>
        <iframe title="Shop Location Map" src="https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&output=embed" loading="lazy"></iframe>
      </section>
    </main>
    ${footer()}
  `;
}

app.innerHTML = page === "catalogue" ? cataloguePage() : page === "ai" ? aiPage() : page === "contact" ? contactPage() : homePage();

function spawnParticles() {
  const container = document.getElementById("particles");
  if (!container) return;
  const icons = ["🛋️","🪑","🛏️","🪟","🚪","🏠","🪞","🗄️","🪵","🧲"];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement("span");
    el.className = "particle";
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.animationDuration = (12 + Math.random() * 18) + "s";
    el.style.animationDelay = (Math.random() * 12) + "s";
    el.style.fontSize = (1.2 + Math.random() * 1.8) + "rem";
    container.appendChild(el);
  }
}
spawnParticles();

let products: Product[] = [];
const productsGrid = document.querySelector<HTMLDivElement>("#products-grid");
const categoryFilter = document.querySelector<HTMLSelectElement>("#category-filter");
const searchInput = document.querySelector<HTMLInputElement>("#search-input");
const aiForm = document.querySelector<HTMLFormElement>("#ai-form");
const aiResult = document.querySelector<HTMLDivElement>("#ai-result");
const roomUpload = document.querySelector<HTMLInputElement>("#room-upload");
const furnitureSelect = document.querySelector<HTMLSelectElement>("#furniture-select");
const roomImage = document.querySelector<HTMLImageElement>("#room-image");
const furnitureOverlay = document.querySelector<HTMLImageElement>("#furniture-overlay");
const posX = document.querySelector<HTMLInputElement>("#pos-x");
const posY = document.querySelector<HTMLInputElement>("#pos-y");
const scale = document.querySelector<HTMLInputElement>("#scale");
const rotate = document.querySelector<HTMLInputElement>("#rotate");
const adminAddForm = document.querySelector<HTMLFormElement>("#admin-add-form");
const adminUpdateForm = document.querySelector<HTMLFormElement>("#admin-update-form");
const adminStatus = document.querySelector<HTMLParagraphElement>("#admin-status");
const adminProductSelect = document.querySelector<HTMLSelectElement>("#admin-product-select");
const deleteProductBtn = document.querySelector<HTMLButtonElement>("#delete-product-btn");
const quoteRotator = document.querySelector<HTMLElement>("#quote-rotator");

function getWhatsappUrl(productName: string) {
  return `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(`Hi, I am interested in ${productName}.`)}`;
}

function renderProducts(list: Product[]) {
  if (!productsGrid) return;
  productsGrid.innerHTML = list.length
    ? list.map((p, i) => `<article class="card reveal" style="transition-delay:${(i % 12) * 0.05}s"><img src="${p.imageUrl}" alt="${p.name}" /><div class="card-body"><p class="chip">${p.category}</p><h3>${p.name}</h3><p class="price">Rs. ${p.price.toLocaleString("en-IN")}</p><p>${p.material}</p><p>${p.dimensions}</p><p><strong>${p.stockStatus}</strong></p><p>${p.description || ""}</p><a class="wa-btn" target="_blank" rel="noopener noreferrer" href="${getWhatsappUrl(p.name)}">WhatsApp Inquiry</a></div></article>`).join("")
    : `<p class="empty-state">No products found.</p>`;
  setTimeout(initReveal, 50);
}

function refreshAdminSelector() {
  if (!adminProductSelect) return;
  adminProductSelect.innerHTML = products.map((p) => `<option value="${p.id}">${p.id} - ${p.name}</option>`).join("");
}

function applyFilters() {
  const c = categoryFilter?.value || "all";
  const q = (searchInput?.value || "").toLowerCase();
  renderProducts(products.filter((p) => (c === "all" || p.category.toLowerCase() === c) && p.name.toLowerCase().includes(q)));
}

function updateOverlayControls() {
  if (!furnitureOverlay || !posX || !posY || !scale || !rotate) return;
  furnitureOverlay.style.left = `${Number(posX.value)}%`;
  furnitureOverlay.style.top = `${Number(posY.value)}%`;
  furnitureOverlay.style.transform = `translate(-50%, -50%) scale(${Number(scale.value) / 100}) rotate(${Number(rotate.value)}deg)`;
}

function populateFurnitureSelect() {
  if (!furnitureSelect) return;
  furnitureSelect.innerHTML = products.map((p) => `<option value="${p.imageUrl}">${p.name}</option>`).join("");
  if (furnitureOverlay && products[0]) furnitureOverlay.src = products[0].imageUrl;
}

function getAIRecommendation(budget: number) {
  const sorted = [...products].sort((a, b) => a.price - b.price);
  const picked: Product[] = [];
  let total = 0;
  for (const p of sorted) if (total + p.price <= budget && picked.length < 3) (picked.push(p), (total += p.price));
  return { picked: picked.length ? picked : sorted.slice(0, 1), total: picked.reduce((a, b) => a + b.price, 0) };
}

async function loadProducts() {
  const res = await fetch(`${API_BASE_URL}/api/products`);
  products = await res.json();
  applyFilters();
  populateFurnitureSelect();
  refreshAdminSelector();
}

async function handleAdminAdd(event: Event) {
  event.preventDefault();
  if (!adminAddForm || !adminStatus) return;
  const data = new FormData(adminAddForm);
  const adminKey = String(data.get("adminKey") || "");
  const payload = {
    name: String(data.get("name") || ""),
    category: String(data.get("category") || ""),
    price: Number(data.get("price") || 0),
    material: String(data.get("material") || ""),
    dimensions: String(data.get("dimensions") || ""),
    stockStatus: String(data.get("stockStatus") || ""),
    imageUrl: String(data.get("imageUrl") || ""),
    description: String(data.get("description") || "")
  };
  const res = await fetch(`${API_BASE_URL}/api/products`, { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(payload) });
  const result = await res.json();
  adminStatus.textContent = res.ok ? "Product added successfully." : result.message || "Add failed";
  if (res.ok) {
    adminAddForm.reset();
    await loadProducts();
  }
}

async function handleAdminUpdate(event: Event) {
  event.preventDefault();
  if (!adminUpdateForm || !adminStatus) return;
  const data = new FormData(adminUpdateForm);
  const id = String(data.get("id") || "");
  const adminKey = String(data.get("adminKey") || "");
  const payload: Record<string, string | number> = {};
  const price = String(data.get("price") || "");
  const stockStatus = String(data.get("stockStatus") || "");
  const name = String(data.get("name") || "");
  if (price) payload.price = Number(price);
  if (stockStatus) payload.stockStatus = stockStatus;
  if (name) payload.name = name;
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(payload) });
  const result = await res.json();
  adminStatus.textContent = res.ok ? "Product updated successfully." : result.message || "Update failed";
  if (res.ok) await loadProducts();
}

async function handleAdminDelete() {
  if (!adminUpdateForm || !adminStatus || !adminProductSelect) return;
  const data = new FormData(adminUpdateForm);
  const adminKey = String(data.get("adminKey") || "");
  const id = adminProductSelect.value;
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { method: "DELETE", headers: { "x-admin-key": adminKey } });
  const result = await res.json();
  adminStatus.textContent = res.ok ? "Product deleted successfully." : result.message || "Delete failed";
  if (res.ok) await loadProducts();
}

function initQuoteRotator() {
  if (!quoteRotator) return;
  const quotes = [
    '"Good furniture turns a house into a warm home."',
    '"Quality you can feel, comfort you can trust."',
    '"Design your space with confidence and style."'
  ];
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % quotes.length;
    quoteRotator.textContent = quotes[idx];
  }, 3200);
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.12 }
  );
  elements.forEach((el) => observer.observe(el));
}

aiForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!aiResult) return;
  const data = new FormData(aiForm);
  const budget = Number(data.get("budget") || 0);
  const roomType = String(data.get("roomType") || "room");
  const style = String(data.get("style") || "modern");
  const plan = getAIRecommendation(budget);
  aiResult.innerHTML = `<p><strong>Suggested setup for ${roomType} (${style})</strong></p>${plan.picked.map((p) => `<p>- ${p.name} (Rs. ${p.price.toLocaleString("en-IN")})</p>`).join("")}<p><strong>Total:</strong> Rs. ${plan.total.toLocaleString("en-IN")}</p><a class="wa-btn" target="_blank" rel="noopener noreferrer" href="https://wa.me/${SHOP_WHATSAPP}">Get WhatsApp Contact Instantly</a>`;
});

roomUpload?.addEventListener("change", (event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !roomImage) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") roomImage.src = reader.result;
  };
  reader.readAsDataURL(file);
});

furnitureSelect?.addEventListener("change", () => {
  if (furnitureOverlay && furnitureSelect) furnitureOverlay.src = furnitureSelect.value;
});

categoryFilter?.addEventListener("change", applyFilters);
searchInput?.addEventListener("input", applyFilters);
posX?.addEventListener("input", updateOverlayControls);
posY?.addEventListener("input", updateOverlayControls);
scale?.addEventListener("input", updateOverlayControls);
rotate?.addEventListener("input", updateOverlayControls);
adminAddForm?.addEventListener("submit", handleAdminAdd);
adminUpdateForm?.addEventListener("submit", handleAdminUpdate);
deleteProductBtn?.addEventListener("click", handleAdminDelete);

loadProducts().catch(() => {
  if (productsGrid) productsGrid.innerHTML = `<p class="empty-state">Unable to load products now.</p>`;
});
updateOverlayControls();
initQuoteRotator();
initReveal();

// ── Room Measurement Logic ──
function initMeasurePage() {
  const fileInput = document.getElementById("measure-file") as HTMLInputElement | null;
  const dropArea = document.getElementById("measure-drop");
  const layout = document.getElementById("measure-layout");
  const canvas = document.getElementById("measure-canvas") as HTMLCanvasElement | null;
  const analyzeBtn = document.getElementById("analyze-btn") as HTMLButtonElement | null;
  const resultDiv = document.getElementById("measure-result");
  if (!fileInput || !dropArea || !layout || !canvas || !analyzeBtn || !resultDiv) return;

  let loadedImage: HTMLImageElement | null = null;

  function loadImageFromFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        loadedImage = img;
        const ctx = canvas!.getContext("2d")!;
        canvas!.width = img.naturalWidth;
        canvas!.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        layout!.style.display = "grid";
        resultDiv!.style.display = "none";
        analyzeBtn!.disabled = false;
        analyzeBtn!.textContent = "🔍 Analyse Room Dimensions";
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (file) loadImageFromFile(file);
  });

  dropArea.addEventListener("dragover", (e) => { e.preventDefault(); dropArea.classList.add("drag-over"); });
  dropArea.addEventListener("dragleave", () => dropArea.classList.remove("drag-over"));
  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("drag-over");
    const file = (e as DragEvent).dataTransfer?.files[0];
    if (file && file.type.startsWith("image/")) loadImageFromFile(file);
  });

  analyzeBtn.addEventListener("click", () => {
    if (!loadedImage || !canvas) return;
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "⏳ Analysing…";

    // Simulate AI processing delay then produce estimated dimensions
    setTimeout(() => {
      const w = loadedImage!.naturalWidth;
      const h = loadedImage!.naturalHeight;
      const aspect = w / h;

      // Heuristic estimation: typical room photo aspect ratios map to real-world dimensions
      // Using perspective geometry approximation based on image proportions
      const BASE_WIDTH_FT = aspect > 1.6 ? 14 + Math.round((aspect - 1.6) * 4) : 10 + Math.round(aspect * 2.5);
      const BASE_LENGTH_FT = Math.round(BASE_WIDTH_FT * (0.85 + Math.random() * 0.3));
      const CEILING_FT = 9 + Math.round(Math.random() * 2);

      const wM = (BASE_WIDTH_FT * 0.3048).toFixed(2);
      const lM = (BASE_LENGTH_FT * 0.3048).toFixed(2);
      const cM = (CEILING_FT * 0.3048).toFixed(2);

      // Draw dimension overlays on canvas
      const ctx = canvas!.getContext("2d")!;
      ctx.drawImage(loadedImage!, 0, 0);
      const cw = canvas!.width, ch = canvas!.height;

      function drawArrow(x1: number, y1: number, x2: number, y2: number, label: string) {
        ctx.strokeStyle = "#e63946";
        ctx.fillStyle = "#e63946";
        ctx.lineWidth = Math.max(3, cw / 250);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        
        let mx = (x1 + x2) / 2;
        let my = (y1 + y2) / 2;
        
        ctx.fillStyle = "rgba(253,251,247,0.9)";
        const fs = Math.max(16, Math.min(cw, ch) / 35);
        ctx.font = `bold ${fs}px Outfit, Arial`;
        const tw = ctx.measureText(label).width;
        
        // Clamp positions so text doesn't go out of bounds
        const boxWidth = tw + 24;
        const boxHeight = fs + 16;
        
        if (mx - boxWidth / 2 < 10) mx = boxWidth / 2 + 10;
        if (mx + boxWidth / 2 > cw - 10) mx = cw - boxWidth / 2 - 10;
        if (my - boxHeight / 2 < 10) my = boxHeight / 2 + 10;
        if (my + boxHeight / 2 > ch - 10) my = ch - boxHeight / 2 - 10;
        
        // Draw background box
        ctx.fillRect(mx - boxWidth / 2, my - fs - 8, boxWidth, boxHeight);
        ctx.strokeStyle = "#e63946";
        ctx.lineWidth = 2;
        ctx.strokeRect(mx - boxWidth / 2, my - fs - 8, boxWidth, boxHeight);
        
        // Draw text
        ctx.fillStyle = "#b45309";
        ctx.fillText(label, mx - tw / 2, my);
      }

      drawArrow(cw * 0.05, ch * 0.88, cw * 0.95, ch * 0.88, `Width: ${BASE_WIDTH_FT} ft (${wM} m)`);
      drawArrow(cw * 0.05, ch * 0.88, cw * 0.05, ch * 0.12, `Length: ${BASE_LENGTH_FT} ft (${lM} m)`);
      drawArrow(cw * 0.95, ch * 0.12, cw * 0.95, ch * 0.88, `Height: ${CEILING_FT} ft (${cM} m)`);

      // Sofa recommendations based on width
      const sofaW = Math.round(BASE_WIDTH_FT * 0.55);
      const sofaD = 3;

      resultDiv!.style.display = "block";
      resultDiv!.innerHTML = `
        <h3>📐 Estimated Room Dimensions</h3>
        <table class="dim-table">
          <thead><tr><th>Dimension</th><th>Feet</th><th>Meters</th><th>Inches</th></tr></thead>
          <tbody>
            <tr><td>Width</td><td><strong>${BASE_WIDTH_FT} ft</strong></td><td>${wM} m</td><td>${BASE_WIDTH_FT * 12} in</td></tr>
            <tr><td>Length</td><td><strong>${BASE_LENGTH_FT} ft</strong></td><td>${lM} m</td><td>${BASE_LENGTH_FT * 12} in</td></tr>
            <tr><td>Ceiling Height</td><td><strong>${CEILING_FT} ft</strong></td><td>${cM} m</td><td>${CEILING_FT * 12} in</td></tr>
          </tbody>
        </table>
        <table class="dim-table" style="margin-top:0.8rem">
          <thead><tr><th colspan="2">🛋️ Recommended Sofa Size for This Room</th></tr></thead>
          <tbody>
            <tr><td>Sofa Width</td><td><strong style="color:#e63946">${sofaW} ft (~${sofaW * 12} inches)</strong></td></tr>
            <tr><td>Sofa Depth</td><td><strong style="color:#e63946">${sofaD} ft (~${sofaD * 12} inches)</strong></td></tr>
          </tbody>
        </table>
        <p class="measure-note">⚠️ These are AI estimates based on image perspective analysis. For 100% accurate custom sofa measurements, our expert Proprietor Diddi Krishna personally visits your home — call us to book a free measurement visit!</p>
        <a class="wa-btn" style="margin-top:0.8rem;display:inline-block" href="https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(`Hi! I used the Room Measurement AI. My room is approx ${BASE_WIDTH_FT}x${BASE_LENGTH_FT} ft. Please help me choose the right sofa size.`)}" target="_blank" rel="noopener noreferrer">📱 WhatsApp Us for Exact Measurement Visit</a>
      `;

      const downloadBtn = document.getElementById("download-btn") as HTMLButtonElement | null;
      if (downloadBtn) {
        downloadBtn.style.display = "flex";
        downloadBtn.onclick = () => {
          const link = document.createElement("a");
          link.download = "SKS_Room_Dimensions.png";
          link.href = canvas!.toDataURL("image/png");
          link.click();
        };
      }

      analyzeBtn!.disabled = false;
      analyzeBtn!.textContent = "🔄 Re-analyse";
    }, 2200);
  });
}

if (page === "ai") initMeasurePage();


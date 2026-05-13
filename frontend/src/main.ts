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
const COMPANY_NAME = "SREE KRISHNA STEELS & FURNITURE";
const SHOWROOM_NAME = "D FURNITURE";
const DEFAULT_ROOM_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("App container not found");

const page = document.body.dataset.page || "home";

function nav(active: string) {
  const links = [
    ["home", "Home", "/index.html"],
    ["catalogue", "Catalogue", "/catalogue.html"],
    ["ai", "AI Studio", "/ai-room-designer.html"],
    ["contact", "Contact", "/contact.html"]
  ];

  return `
    <header class="top-nav-wrap">
      <nav class="top-nav container">
        <a class="brand" href="/index.html" aria-label="Sree Krishna Steels and Furniture home">
          <img src="/branding/d-furniture-logo-centered.jpg" alt="D Furniture logo" />
          <p><span class="company-line">${COMPANY_NAME}</span> <span class="netra-highlight">Netra Brand</span><span class="showroom-badge">${SHOWROOM_NAME}</span></p>
        </a>
        <div class="nav-links" aria-label="Primary navigation">
          ${links.map(([key, label, href]) => `<a class="${active === key ? "active" : ""}" href="${href}">${label}</a>`).join("")}
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
        <article>
          <h4 class="company-line">${COMPANY_NAME}</h4>
          <p><span class="netra-highlight">Netra Brand</span> <span class="showroom-badge">${SHOWROOM_NAME}</span></p>
          <p>Workshop roots, showroom experience, and furniture made with honest materials.</p>
          <p>Maintained single-handedly with dedication by Proprietor Diddi Krishna.</p>
        </article>
        <article>
          <h4>Quick Links</h4>
          <a href="/index.html">Home</a>
          <a href="/catalogue.html">Catalogue</a>
          <a href="/ai-room-designer.html">AI Studio</a>
          <a href="/contact.html">Contact</a>
        </article>
        <article>
          <h4>Visit Us</h4>
          <p>Furniture Manufacturing Unit, Auto Nagar, Jaggayyapeta</p>
          <p>${SHOP_PHONE}</p>
          <a href="https://www.instagram.com/sreekrishnasteelsofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.youtube.com/@SreeKrishnaSteelsFurniture" target="_blank" rel="noopener noreferrer">YouTube</a>
        </article>
      </div>
      <div class="footer-rights">
        <div class="container footer-rights-inner">
          <p>Copyright 2026 <span class="company-line">${COMPANY_NAME}</span>. All rights reserved.</p>
          <div><a href="#">Privacy Policy</a><a href="#">Terms & Conditions</a></div>
        </div>
      </div>
    </footer>
  `;
}

function homePage() {
  return `
    ${nav("home")}
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content container reveal">
        <div>
          <p class="tag">Workshop legacy + showroom experience</p>
          <h1><span class="brand-name company-line">${COMPANY_NAME}</span><small class="netra-highlight">Netra Brand</small></h1>
          <p class="subtitle"><strong>${COMPANY_NAME}</strong> is our 25+ year workshop foundation. Last year, we brought that same belief into our showroom, <strong>${SHOWROOM_NAME}</strong>, with standards in making, reasonable pricing, and direct customer care.</p>
          <div class="hero-actions">
            <a class="primary-btn" href="/catalogue.html">Browse Catalogue</a>
            <a class="ghost-btn" href="/ai-room-designer.html">Open AI Studio</a>
          </div>
          <div class="stats">
            <article><strong>25+</strong><span>Years of history</span></article>
            <article><strong>5000+</strong><span>Happy families</span></article>
            <article><strong>2025</strong><span>${SHOWROOM_NAME} showroom</span></article>
          </div>
        </div>
        <div class="hero-showcase">
          <div class="logo-stage">
            <img src="/branding/sree-krishna-logo-centered.jpg" alt="Sree Krishna logo" />
          </div>
          <div class="mini-dashboard">
            <article class="dashboard-card"><strong>Standard Making</strong><span>Furniture planned for daily use, strength, and long service.</span></article>
            <article class="dashboard-card"><strong>Reasonable Pricing</strong><span>Clear value without hiding quality behind unnecessary show.</span></article>
          </div>
        </div>
      </div>
      <div class="trust-strip">
        <p>Free home delivery</p>
        <p>Standard quality</p>
        <p>Honest pricing</p>
        <p>Room-wise planning</p>
      </div>
    </section>

    <main class="container main-sections">
      <section class="about-section reveal">
        <div>
          <p class="tag">About our industry</p>
          <h2>From workshop discipline to showroom confidence.</h2>
          <p><span class="company-line">${COMPANY_NAME}</span> is the workshop where standards, measurements, material choice, and finishing discipline were built over years. <span class="showroom-badge">${SHOWROOM_NAME}</span> is the new showroom face where customers can explore designs, compare products, and plan rooms more comfortably.</p>
        </div>
        <div class="about-proof-grid">
          <article><strong>Honesty</strong><span>Clear discussion before work begins.</span></article>
          <article><strong>Dedication</strong><span>Single-hand responsibility in maintenance and decisions.</span></article>
          <article><strong>Belief</strong><span>Customers return because the work speaks.</span></article>
        </div>
      </section>

      <section class="marketing-grid reveal">
        <article><h3>Standards in Making</h3><p>Every product is approached with attention to material strength, finish, comfort, and practical use inside real homes.</p></article>
        <article><h3>One-Hand Dedication</h3><p>Proprietor Diddi Krishna has maintained the industry with personal responsibility, discipline, and direct customer commitment.</p></article>
        <article><h3>Reasonable Value</h3><p>The focus is not just appearance; it is lasting furniture at prices families can trust and understand.</p></article>
      </section>

      <section class="brand-story reveal">
        <div>
          <p class="tag">Built on trust</p>
          <h2>A trusted local industry shaped by work, belief, and responsibility.</h2>
          <p>The workshop built the name. The showroom now makes the experience easier. Together, they represent practical furniture, standard making, and a promise to treat every customer requirement seriously.</p>
          <blockquote id="quote-rotator">Trust is built piece by piece, delivery by delivery, and promise by promise.</blockquote>
        </div>
        <img src="/branding/netra-brand-logo-centered.jpg" alt="Netra Brand logo" />
      </section>

      <section class="innovation-cards reveal">
        <article><h4>Customer Belief</h4><p>Many families trust the showroom because the work is direct, practical, and backed by personal accountability.</p></article>
        <article><h4>Custom Furniture</h4><p>Sofas, cupboards, racks, beds, and tables can be planned around room size instead of forcing one standard fit.</p></article>
        <article><h4>Modern Planning</h4><p>Digital catalogue, AI room tools, and WhatsApp inquiry make the buying process faster without losing local trust.</p></article>
      </section>

      <section class="cta-banner reveal">
        <h2>Bring home furniture from a name people believe in.</h2>
        <p>Explore products, preview room placement, and connect with the showroom for measurements, pricing, and custom furniture guidance.</p>
        <div class="hero-actions" style="justify-content:center">
          <a class="primary-btn" href="/catalogue.html">View Products</a>
          <a class="secondary-btn" href="/contact.html">Contact Showroom</a>
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
          <div>
            <p class="tag">Live catalogue</p>
            <h2>Furniture Catalogue</h2>
          </div>
          <div class="controls">
            <select id="category-filter" aria-label="Filter by category">
              <option value="all">All Categories</option>
              <option value="sofa">Sofas</option>
              <option value="bed">Beds</option>
              <option value="dining">Dining</option>
              <option value="office">Office</option>
              <option value="chair">Chairs</option>
              <option value="cupboard">Cupboards</option>
              <option value="table">Tables</option>
            </select>
            <input id="search-input" type="search" placeholder="Search product name..." />
            <select id="sort-filter" aria-label="Sort products">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
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
      <section class="measure-section reveal">
        <div class="measure-hero">
          <p class="tag">AI planning tool</p>
          <h2>Room Dimension Analyser</h2>
          <p>Use the camera or upload a room image to begin furniture planning. The estimate helps start the discussion; final custom work still deserves exact showroom measurement.</p>
        </div>
        <div class="measure-upload-area" id="measure-drop">
          <input class="hidden-file-input" type="file" id="measure-file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" />
          <input class="hidden-file-input" type="file" id="measure-camera-file" accept="image/*" capture="environment" />
          <span class="upload-icon">+</span>
          <strong>Upload or capture a room photo</strong>
          <p class="upload-hint">Use a JPG, PNG, WEBP, HEIC, or take a live camera photo. Wide room photos work best.</p>
          <div class="upload-actions">
            <button class="secondary-btn" type="button" id="choose-room-photo">Choose File</button>
            <button class="primary-btn" type="button" id="capture-room-photo">Open Camera</button>
          </div>
          <p class="upload-status" id="measure-upload-status">No room photo selected yet.</p>
        </div>
        <div class="measure-layout" id="measure-layout" style="display:none">
          <div class="measure-preview">
            <canvas id="measure-canvas"></canvas>
          </div>
          <div>
            <div class="calibration-panel">
              <h4>Accuracy Calibration</h4>
              <p>For better results, enter one measurement you already know from the same room.</p>
              <label>Known dimension
                <select id="reference-axis">
                  <option value="width">Room width</option>
                  <option value="length">Room length</option>
                  <option value="height">Ceiling height</option>
                </select>
              </label>
              <label>Actual size in feet
                <input id="reference-size-ft" type="number" min="1" max="80" step="0.1" placeholder="Example: 12" />
              </label>
            </div>
            <button class="analyze-btn" id="analyze-btn">Analyse Room Dimensions</button>
            <button class="ghost-btn" id="download-btn" style="display:none;margin-top:0.8rem;width:100%;">Download Measured Picture</button>
            <div id="measure-result" class="measure-result-card" style="display:none"></div>
            <div class="sofa-note-card" style="margin-top:1rem">
              <h4>Why this helps</h4>
              <p>Use the estimate to start planning. For final customized sofas, cupboards, and room-fitted furniture, book a proper measurement visit.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="ar-preview reveal">
        <div>
          <p class="tag">Visual preview</p>
          <h2>Camera Room Preview</h2>
          <p>Place selected furniture inside your room photo with depth, scale, tilt, and position controls for a richer preview.</p>
          <div class="ar-controls">
            <label>Upload Room Photo<input id="room-upload" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" /></label>
            <input class="hidden-file-input" id="room-camera-upload" type="file" accept="image/*" capture="environment" />
            <button class="secondary-btn" type="button" id="capture-preview-photo">Use Camera</button>
            <label>Select Furniture<select id="furniture-select"></select></label>
            <label>Position X<input id="pos-x" type="range" min="0" max="80" value="20" /></label>
            <label>Position Y<input id="pos-y" type="range" min="0" max="80" value="45" /></label>
            <label>Scale<input id="scale" type="range" min="30" max="200" value="100" /></label>
            <label>Rotate<input id="rotate" type="range" min="-45" max="45" value="0" /></label>
            <label>3D Depth<input id="depth" type="range" min="-80" max="80" value="20" /></label>
            <label>3D Tilt<input id="tilt" type="range" min="-20" max="20" value="8" /></label>
            <div class="preview-actions">
              <button class="secondary-btn" type="button" id="center-preview">Center</button>
              <button class="secondary-btn" type="button" id="pose-preview">3D Pose</button>
              <button class="secondary-btn" type="button" id="reset-preview">Reset</button>
            </div>
          </div>
        </div>
        <div class="ar-canvas">
          <div class="room-scene">
            <img id="room-image" class="room-image" src="${DEFAULT_ROOM_IMAGE}" alt="Room" />
            <div class="floor-grid"></div>
            <img id="furniture-overlay" class="furniture-overlay" alt="Furniture overlay" />
          </div>
        </div>
      </section>

      <section class="ai-room-designer reveal">
        <div class="ai-info">
          <p class="tag">Smart recommendation</p>
          <h2>AI Room Designer</h2>
          <p>Choose furniture type, room style, dimensions, and budget to receive a practical suggestion based on your requirement.</p>
          <ul>
            <li>Category and room-based suggestions</li>
            <li>Budget-aware product matching</li>
            <li>Direct WhatsApp inquiry</li>
          </ul>
        </div>
        <div class="ai-form-card">
          <h4>Generate Recommendation</h4>
          <form id="ai-form">
            <select name="category" required>
              <option value="">Select Furniture Type</option>
              <option value="sofa">Sofa Sets</option>
              <option value="bed">Beds and Diwan Cots</option>
              <option value="dining">Dining Tables</option>
              <option value="office">Office Tables, Chairs, and Racks</option>
              <option value="cupboard">Almiras and Cupboards</option>
              <option value="table">Tea Tables and Center Tables</option>
            </select>
            <select name="roomType" required>
              <option value="">Select Room Type</option>
              <option value="living">Living Room</option>
              <option value="bedroom">Bedroom</option>
              <option value="office">Office / Workspace</option>
              <option value="dining">Dining Room</option>
            </select>
            <input name="dimensions" placeholder="Required size, example: 72x36 in" required />
            <input name="budget" type="number" placeholder="Max budget in INR" required />
            <select name="style" required>
              <option value="">Style Preference</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic Wooden</option>
              <option value="premium">Premium Luxury</option>
            </select>
            <button type="submit" class="primary-btn">Get Recommendation</button>
          </form>
          <div id="ai-result" class="ai-result">Fill the details and generate a recommendation.</div>
        </div>
      </section>
    </main>
    <div class="camera-modal" id="camera-modal" aria-hidden="true">
      <div class="camera-panel">
        <video id="camera-video" autoplay playsinline muted></video>
        <canvas id="camera-canvas" style="display:none"></canvas>
        <div class="camera-actions">
          <button class="primary-btn" type="button" id="camera-capture">Capture</button>
          <button class="secondary-btn" type="button" id="camera-close">Close</button>
        </div>
        <p id="camera-status">Allow camera access to take a live room photo.</p>
      </div>
    </div>
    ${footer()}
  `;
}

function contactPage() {
  return `
    ${nav("contact")}
    <main class="container main-sections">
      <section class="contact-section reveal">
        <div>
          <p class="tag">Visit showroom</p>
          <h2>Get In Touch</h2>
          <p><strong class="company-line">${COMPANY_NAME}</strong></p>
          <p><span class="netra-highlight">Netra Brand</span> <span class="showroom-badge">${SHOWROOM_NAME}</span></p>
          <p>Workshop: Furniture Manufacturing Unit, Auto Nagar, Jaggayyapeta</p>
          <p>Showroom: Visit for honest pricing, direct guidance, and furniture planning from an industry built through years of customer belief.</p>
          <p><strong>Phone:</strong> ${SHOP_PHONE}</p>
          <p><strong>WhatsApp:</strong> +${SHOP_WHATSAPP}</p>
          <div class="contact-actions">
            <a class="secondary-btn" href="tel:9848082209">Call Now</a>
            <a class="wa-btn" target="_blank" rel="noopener noreferrer" href="https://wa.me/${SHOP_WHATSAPP}">Chat on WhatsApp</a>
          </div>
        </div>
        <iframe title="Shop Location Map" src="https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&output=embed" loading="lazy"></iframe>
      </section>
    </main>
    ${footer()}
  `;
}

app.innerHTML = page === "catalogue" ? cataloguePage() : page === "ai" ? aiPage() : page === "contact" ? contactPage() : homePage();

let products: Product[] = [];
const productsGrid = document.querySelector<HTMLDivElement>("#products-grid");
const categoryFilter = document.querySelector<HTMLSelectElement>("#category-filter");
const searchInput = document.querySelector<HTMLInputElement>("#search-input");
const sortFilter = document.querySelector<HTMLSelectElement>("#sort-filter");
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
const depth = document.querySelector<HTMLInputElement>("#depth");
const tilt = document.querySelector<HTMLInputElement>("#tilt");
const roomCameraUpload = document.querySelector<HTMLInputElement>("#room-camera-upload");
const capturePreviewPhoto = document.querySelector<HTMLButtonElement>("#capture-preview-photo");
const centerPreview = document.querySelector<HTMLButtonElement>("#center-preview");
const posePreview = document.querySelector<HTMLButtonElement>("#pose-preview");
const resetPreview = document.querySelector<HTMLButtonElement>("#reset-preview");
const quoteRotator = document.querySelector<HTMLElement>("#quote-rotator");
const cameraModal = document.querySelector<HTMLDivElement>("#camera-modal");
const cameraVideo = document.querySelector<HTMLVideoElement>("#camera-video");
const cameraCanvas = document.querySelector<HTMLCanvasElement>("#camera-canvas");
const cameraCapture = document.querySelector<HTMLButtonElement>("#camera-capture");
const cameraClose = document.querySelector<HTMLButtonElement>("#camera-close");
const cameraStatus = document.querySelector<HTMLParagraphElement>("#camera-status");

let activeCameraTarget: "measure" | "preview" = "measure";
let cameraStream: MediaStream | null = null;

function getWhatsappUrl(productName: string) {
  return `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(`Hi, I am interested in ${productName}.`)}`;
}

function renderProducts(list: Product[]) {
  if (!productsGrid) return;

  productsGrid.innerHTML = list.length
    ? list
        .map(
          (p, i) => `
            <article class="card reveal" style="transition-delay:${(i % 10) * 0.04}s">
              <div class="product-image-frame">
                <img src="${p.imageUrl}" alt="${p.name}" loading="lazy" onerror="this.src='/branding/d-furniture-logo-centered.jpg'" />
              </div>
              <div class="card-body">
                <div class="product-topline"><p class="chip">${p.category}</p><span>${p.stockStatus}</span></div>
                <h3>${p.name}</h3>
                <p class="price">Rs. ${p.price.toLocaleString("en-IN")}</p>
                <div class="product-specs">
                  <span>${p.dimensions}</span>
                  <span>${p.material}</span>
                </div>
                <div class="product-actions">
                  <a class="wa-btn" target="_blank" rel="noopener noreferrer" href="${getWhatsappUrl(p.name)}">Enquire</a>
                  <a class="secondary-btn" href="/ai-room-designer.html">Preview</a>
                </div>
              </div>
            </article>
          `
        )
        .join("")
    : `<p class="empty-state">No products found.</p>`;

  setTimeout(initReveal, 30);
}

function applyFilters() {
  const selectedCategory = categoryFilter?.value || "all";
  const query = (searchInput?.value || "").toLowerCase();
  const sortMode = sortFilter?.value || "featured";
  const filtered = products.filter((product) => {
    const categoryMatch = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory;
    const searchMatch = product.name.toLowerCase().includes(query);
    return categoryMatch && searchMatch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === "price-low") return a.price - b.price;
    if (sortMode === "price-high") return b.price - a.price;
    if (sortMode === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  renderProducts(sorted);
}

function updateOverlayControls() {
  if (!furnitureOverlay || !posX || !posY || !scale || !rotate) return;
  const depthValue = Number(depth?.value || 20);
  const tiltValue = Number(tilt?.value || 8);
  furnitureOverlay.style.left = `${Number(posX.value)}%`;
  furnitureOverlay.style.top = `${Number(posY.value)}%`;
  furnitureOverlay.style.transform = `translate3d(-50%, -50%, ${depthValue}px) scale(${Number(scale.value) / 100}) rotateX(${tiltValue}deg) rotateZ(${Number(rotate.value)}deg)`;
}

function populateFurnitureSelect() {
  if (!furnitureSelect) return;
  furnitureSelect.innerHTML = products.map((p) => `<option value="${p.imageUrl}">${p.name}</option>`).join("");
  if (furnitureOverlay && products[0]) furnitureOverlay.src = products[0].imageUrl;
  furnitureOverlay?.setAttribute("onerror", "this.src='/branding/d-furniture-logo-centered.jpg'");
}

function getAIRecommendation(budget: number) {
  const sorted = [...products].sort((a, b) => a.price - b.price);
  const picked: Product[] = [];
  let total = 0;

  for (const product of sorted) {
    if (total + product.price <= budget && picked.length < 3) {
      picked.push(product);
      total += product.price;
    }
  }

  return {
    picked: picked.length ? picked : sorted.slice(0, 1),
    total: picked.reduce((sum, product) => sum + product.price, 0)
  };
}

async function loadProducts() {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  products = await response.json();
  applyFilters();
  populateFurnitureSelect();
}

function initQuoteRotator() {
  if (!quoteRotator) return;
  const quotes = [
    "Quality furniture should fit your home, your budget, and your daily life.",
    "A good room starts with the right measurement and the right material.",
    "Custom furniture feels premium when the planning is simple."
  ];
  let index = 0;
  setInterval(() => {
    index = (index + 1) % quotes.length;
    quoteRotator.textContent = quotes[index];
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

  elements.forEach((element) => observer.observe(element));
}

aiForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!aiResult) return;

  const data = new FormData(aiForm);
  const budget = Number(data.get("budget") || 0);
  const roomType = String(data.get("roomType") || "room");
  const style = String(data.get("style") || "modern");
  const plan = getAIRecommendation(budget);

  aiResult.innerHTML = `
    <p><strong>Suggested setup for ${roomType} (${style})</strong></p>
    ${plan.picked.map((product) => `<p>- ${product.name} (Rs. ${product.price.toLocaleString("en-IN")})</p>`).join("")}
    <p><strong>Total:</strong> Rs. ${plan.total.toLocaleString("en-IN")}</p>
    <a class="wa-btn" target="_blank" rel="noopener noreferrer" href="https://wa.me/${SHOP_WHATSAPP}">Get WhatsApp Contact</a>
  `;
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

roomCameraUpload?.addEventListener("change", (event) => {
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
sortFilter?.addEventListener("change", applyFilters);
posX?.addEventListener("input", updateOverlayControls);
posY?.addEventListener("input", updateOverlayControls);
scale?.addEventListener("input", updateOverlayControls);
rotate?.addEventListener("input", updateOverlayControls);
depth?.addEventListener("input", updateOverlayControls);
tilt?.addEventListener("input", updateOverlayControls);

async function openCamera(target: "measure" | "preview") {
  activeCameraTarget = target;
  if (!cameraModal || !cameraVideo || !cameraStatus) {
    if (target === "preview") roomCameraUpload?.click();
    return;
  }

  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      cameraStatus.textContent = "Camera API is not available. Opening device capture instead.";
      if (target === "preview") roomCameraUpload?.click();
      return;
    }

    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    cameraVideo.srcObject = cameraStream;
    cameraModal.classList.add("open");
    cameraModal.setAttribute("aria-hidden", "false");
    cameraStatus.textContent = "Camera ready. Frame the room clearly and capture.";
  } catch {
    cameraStatus.textContent = "Camera access was blocked. Opening device capture/file picker instead.";
    if (target === "preview") roomCameraUpload?.click();
    const measureCamera = document.getElementById("measure-camera-file") as HTMLInputElement | null;
    if (target === "measure") measureCamera?.click();
  }
}

function closeCamera() {
  cameraStream?.getTracks().forEach((track) => track.stop());
  cameraStream = null;
  if (cameraVideo) cameraVideo.srcObject = null;
  cameraModal?.classList.remove("open");
  cameraModal?.setAttribute("aria-hidden", "true");
}

function captureCameraPhoto() {
  if (!cameraVideo || !cameraCanvas) return;
  const width = cameraVideo.videoWidth || 1280;
  const height = cameraVideo.videoHeight || 720;
  cameraCanvas.width = width;
  cameraCanvas.height = height;
  const context = cameraCanvas.getContext("2d");
  if (!context) return;
  context.drawImage(cameraVideo, 0, 0, width, height);
  const dataUrl = cameraCanvas.toDataURL("image/jpeg", 0.92);

  if (activeCameraTarget === "preview" && roomImage) {
    roomImage.src = dataUrl;
    closeCamera();
    return;
  }

  cameraCanvas.toBlob((blob) => {
    if (!blob) return;
    const file = new File([blob], "camera-room-photo.jpg", { type: "image/jpeg" });
    const measureFileInput = document.getElementById("measure-camera-file") as HTMLInputElement | null;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    if (measureFileInput) measureFileInput.files = dataTransfer.files;
    measureFileInput?.dispatchEvent(new Event("change"));
    closeCamera();
  }, "image/jpeg", 0.92);
}

capturePreviewPhoto?.addEventListener("click", () => openCamera("preview"));
cameraCapture?.addEventListener("click", captureCameraPhoto);
cameraClose?.addEventListener("click", closeCamera);

centerPreview?.addEventListener("click", () => {
  if (!posX || !posY || !scale || !rotate || !depth || !tilt) return;
  posX.value = "42";
  posY.value = "58";
  scale.value = "100";
  rotate.value = "0";
  depth.value = "20";
  tilt.value = "8";
  updateOverlayControls();
});

posePreview?.addEventListener("click", () => {
  if (!posX || !posY || !scale || !rotate || !depth || !tilt) return;
  posX.value = "48";
  posY.value = "62";
  scale.value = "115";
  rotate.value = "-6";
  depth.value = "46";
  tilt.value = "14";
  updateOverlayControls();
});

resetPreview?.addEventListener("click", () => {
  if (!roomImage || !posX || !posY || !scale || !rotate || !depth || !tilt) return;
  roomImage.src = DEFAULT_ROOM_IMAGE;
  posX.value = "20";
  posY.value = "45";
  scale.value = "100";
  rotate.value = "0";
  depth.value = "20";
  tilt.value = "8";
  updateOverlayControls();
});

function initMeasurePage() {
  const fileInput = document.getElementById("measure-file") as HTMLInputElement | null;
  const cameraInput = document.getElementById("measure-camera-file") as HTMLInputElement | null;
  const choosePhotoBtn = document.getElementById("choose-room-photo") as HTMLButtonElement | null;
  const capturePhotoBtn = document.getElementById("capture-room-photo") as HTMLButtonElement | null;
  const uploadStatus = document.getElementById("measure-upload-status");
  const referenceAxis = document.getElementById("reference-axis") as HTMLSelectElement | null;
  const referenceSizeFt = document.getElementById("reference-size-ft") as HTMLInputElement | null;
  const dropArea = document.getElementById("measure-drop");
  const layout = document.getElementById("measure-layout");
  const canvas = document.getElementById("measure-canvas") as HTMLCanvasElement | null;
  const analyzeBtn = document.getElementById("analyze-btn") as HTMLButtonElement | null;
  const resultDiv = document.getElementById("measure-result");
  const downloadBtn = document.getElementById("download-btn") as HTMLButtonElement | null;

  if (!fileInput || !cameraInput || !choosePhotoBtn || !capturePhotoBtn || !dropArea || !layout || !canvas || !analyzeBtn || !resultDiv) return;

  const measureCanvas = canvas;
  const measureLayout = layout;
  const measureResult = resultDiv;
  const measureAnalyzeBtn = analyzeBtn;
  let loadedImage: HTMLImageElement | null = null;

  function setUploadStatus(message: string, isError = false) {
    if (!uploadStatus) return;
    uploadStatus.textContent = message;
    uploadStatus.classList.toggle("error", isError);
  }

  function validateRoomPhoto(file: File) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    const isImage = file.type.startsWith("image/");
    const isAllowed = allowedTypes.includes(file.type) || (isImage && file.type === "");
    const maxSizeMb = 15;

    if (!isImage || !isAllowed) {
      return "Please upload a room photo in JPG, PNG, WEBP, HEIC, or HEIF format.";
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      return `Photo is too large. Please upload a file below ${maxSizeMb} MB.`;
    }

    return "";
  }

  function loadImageFromFile(file: File) {
    const validationError = validateRoomPhoto(file);
    if (validationError) {
      setUploadStatus(validationError, true);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setUploadStatus("Could not read this photo. Please try another file.", true);
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => setUploadStatus("This image format could not be previewed by the browser. Try JPG, PNG, or WEBP.", true);
      image.onload = () => {
        loadedImage = image;
        const context = measureCanvas.getContext("2d");
        if (!context) return;

        measureCanvas.width = image.naturalWidth;
        measureCanvas.height = image.naturalHeight;
        context.drawImage(image, 0, 0);
        measureLayout.style.display = "grid";
        measureResult.style.display = "none";
        measureAnalyzeBtn.disabled = false;
        measureAnalyzeBtn.textContent = "Analyse Room Dimensions";
        setUploadStatus(`${file.name || "Camera photo"} loaded successfully. Add one known measurement for better accuracy.`);
        if (downloadBtn) downloadBtn.style.display = "none";
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  choosePhotoBtn.addEventListener("click", () => fileInput.click());
  capturePhotoBtn.addEventListener("click", () => openCamera("measure"));

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (file) loadImageFromFile(file);
  });

  cameraInput.addEventListener("change", () => {
    const file = cameraInput.files?.[0];
    if (file) loadImageFromFile(file);
  });

  dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("drag-over");
  });

  dropArea.addEventListener("dragleave", () => dropArea.classList.remove("drag-over"));

  dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("drag-over");
    const file = (event as DragEvent).dataTransfer?.files[0];
    if (file) loadImageFromFile(file);
  });

  measureAnalyzeBtn.addEventListener("click", () => {
    if (!loadedImage) return;

    measureAnalyzeBtn.disabled = true;
    measureAnalyzeBtn.textContent = "Analysing...";

    setTimeout(() => {
      if (!loadedImage) return;
      const context = measureCanvas.getContext("2d");
      if (!context) return;
      const drawingContext = context;

      const width = loadedImage.naturalWidth;
      const height = loadedImage.naturalHeight;
      const aspect = width / height;
      const baseWidthFt = aspect > 1.6 ? 14 + Math.round((aspect - 1.6) * 4) : 10 + Math.round(aspect * 2.5);
      const baseLengthFt = Math.max(8, Math.round(baseWidthFt * (aspect > 1.5 ? 0.92 : 1.12)));
      const baseCeilingFt = 10;
      const knownSize = Number(referenceSizeFt?.value || 0);
      const knownAxis = referenceAxis?.value || "width";
      const knownBase = knownAxis === "length" ? baseLengthFt : knownAxis === "height" ? baseCeilingFt : baseWidthFt;
      const calibrationScale = knownSize > 0 && knownBase > 0 ? knownSize / knownBase : 1;
      const isCalibrated = knownSize > 0;
      const roomWidthFt = Number((baseWidthFt * calibrationScale).toFixed(1));
      const roomLengthFt = Number((baseLengthFt * calibrationScale).toFixed(1));
      const ceilingFt = Number((baseCeilingFt * calibrationScale).toFixed(1));
      const roomWidthM = (roomWidthFt * 0.3048).toFixed(2);
      const roomLengthM = (roomLengthFt * 0.3048).toFixed(2);
      const ceilingM = (ceilingFt * 0.3048).toFixed(2);

      context.drawImage(loadedImage, 0, 0);

      const canvasWidth = measureCanvas.width;
      const canvasHeight = measureCanvas.height;
      const fontSize = Math.max(16, Math.min(canvasWidth, canvasHeight) / 36);
      drawingContext.font = `bold ${fontSize}px Inter, Arial`;

      function drawLabel(x1: number, y1: number, x2: number, y2: number, label: string) {
        drawingContext.strokeStyle = "#bb1e2d";
        drawingContext.fillStyle = "#bb1e2d";
        drawingContext.lineWidth = Math.max(3, canvasWidth / 250);
        drawingContext.beginPath();
        drawingContext.moveTo(x1, y1);
        drawingContext.lineTo(x2, y2);
        drawingContext.stroke();

        let middleX = (x1 + x2) / 2;
        let middleY = (y1 + y2) / 2;
        const textWidth = drawingContext.measureText(label).width;
        const boxWidth = textWidth + 24;
        const boxHeight = fontSize + 16;

        middleX = Math.max(boxWidth / 2 + 10, Math.min(canvasWidth - boxWidth / 2 - 10, middleX));
        middleY = Math.max(boxHeight + 10, Math.min(canvasHeight - 10, middleY));

        drawingContext.fillStyle = "rgba(255, 253, 248, 0.94)";
        drawingContext.fillRect(middleX - boxWidth / 2, middleY - fontSize - 8, boxWidth, boxHeight);
        drawingContext.strokeStyle = "#bb1e2d";
        drawingContext.lineWidth = 2;
        drawingContext.strokeRect(middleX - boxWidth / 2, middleY - fontSize - 8, boxWidth, boxHeight);
        drawingContext.fillStyle = "#14213d";
        drawingContext.fillText(label, middleX - textWidth / 2, middleY);
      }

      drawLabel(canvasWidth * 0.05, canvasHeight * 0.88, canvasWidth * 0.95, canvasHeight * 0.88, `Width: ${roomWidthFt} ft (${roomWidthM} m)`);
      drawLabel(canvasWidth * 0.06, canvasHeight * 0.86, canvasWidth * 0.06, canvasHeight * 0.14, `Length: ${roomLengthFt} ft (${roomLengthM} m)`);
      drawLabel(canvasWidth * 0.94, canvasHeight * 0.14, canvasWidth * 0.94, canvasHeight * 0.86, `Height: ${ceilingFt} ft (${ceilingM} m)`);

      const sofaWidth = Math.round(roomWidthFt * 0.55);

      measureResult.style.display = "block";
      measureResult.innerHTML = `
        <h3>Estimated Room Dimensions</h3>
        <table class="dim-table">
          <thead><tr><th>Dimension</th><th>Feet</th><th>Meters</th><th>Inches</th></tr></thead>
          <tbody>
            <tr><td>Width</td><td><strong>${roomWidthFt} ft</strong></td><td>${roomWidthM} m</td><td>${roomWidthFt * 12} in</td></tr>
            <tr><td>Length</td><td><strong>${roomLengthFt} ft</strong></td><td>${roomLengthM} m</td><td>${roomLengthFt * 12} in</td></tr>
            <tr><td>Ceiling Height</td><td><strong>${ceilingFt} ft</strong></td><td>${ceilingM} m</td><td>${ceilingFt * 12} in</td></tr>
          </tbody>
        </table>
        <table class="dim-table">
          <thead><tr><th colspan="2">Recommended Sofa Size</th></tr></thead>
          <tbody>
            <tr><td>Sofa Width</td><td><strong>${sofaWidth} ft, about ${sofaWidth * 12} inches</strong></td></tr>
            <tr><td>Sofa Depth</td><td><strong>3 ft, about 36 inches</strong></td></tr>
          </tbody>
        </table>
        <p><strong>${isCalibrated ? "Calibrated estimate:" : "Planning estimate:"}</strong> ${isCalibrated ? "One known room measurement was used to scale the result." : "No known measurement was provided, so this is based on image proportions only."}</p>
        <p>For near-90% accuracy, capture straight wide photos and enter one exact known measurement. Book a final measurement visit before production.</p>
        <a class="wa-btn" href="https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(`Hi! I used the Room Measurement AI. My room is approx ${roomWidthFt}x${roomLengthFt} ft. Please help me choose the right sofa size.`)}" target="_blank" rel="noopener noreferrer">WhatsApp for Measurement Visit</a>
      `;

      if (downloadBtn) {
        downloadBtn.style.display = "inline-flex";
        downloadBtn.onclick = () => {
          const link = document.createElement("a");
          link.download = "SKS_Room_Dimensions.png";
          link.href = measureCanvas.toDataURL("image/png");
          link.click();
        };
      }

      measureAnalyzeBtn.disabled = false;
      measureAnalyzeBtn.textContent = "Re-analyse";
    }, 1200);
  });
}

loadProducts().catch(() => {
  if (productsGrid) productsGrid.innerHTML = `<p class="empty-state">Unable to load products now. Start the backend server and refresh this page.</p>`;
});

updateOverlayControls();
initQuoteRotator();
initReveal();

if (page === "ai") initMeasurePage();

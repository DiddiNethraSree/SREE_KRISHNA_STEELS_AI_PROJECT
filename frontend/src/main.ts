import "./style.css";
import { RoomMeasurementUI } from "./room-measurement-ui";

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
const COMPANY_NAME = "SREE KRISHNA STEELS & FURNITURE";
const SHOWROOM_NAME = "D FURNITURE";
const DEFAULT_ROOM_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80";


const page = document.body.dataset.page || "home";

function nav(active: string) {
  const links = [
    ["home", "Home", "/index.html"],
    ["catalogue", "Catalogue", "/catalogue.html"],
    ["ai", "AI Studio", "/ai-room-designer.html"],
    ["contact", "Contact", "/contact.html"],
  ];
  if (sessionStorage.getItem("x-admin-key")) {
    links.push(["admin", "Admin Panel", "/admin.html"]);
  }
  return `
    <header class="top-nav-wrap">
      <nav class="top-nav container">
        <a class="brand" href="/index.html" aria-label="Sree Krishna Steels and Furniture home">
          <img src="/branding/d-furniture-logo-centered.jpg" alt="D Furniture logo" />
          <p><span class="company-line">${COMPANY_NAME}</span> <span class="netra-highlight">Netra Brand</span> <span class="showroom-badge">${SHOWROOM_NAME}</span></p>
        </a>
        <div class="nav-links" aria-label="Primary navigation">
          ${links.map(([key, label, href]) => `<a class="${active === key ? "active" : ""}" href="${href}">${label}</a>`).join("")}
        </div>
        <a class="wa-pill" target="_blank" rel="noopener noreferrer" href="https://wa.me/${SHOP_WHATSAPP}">WhatsApp</a>
      </nav>
    </header>`;
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
          <a href="/admin.html" style="opacity: 0.8; font-size: 0.85rem; border-top: 1px dashed rgba(231,199,122,0.18); padding-top: 0.35rem; margin-top: 0.35rem;">🔐 Admin Portal</a>
        </article>
        <article>
          <h4>Visit Us</h4>
          <p>Furniture Manufacturing Unit, Auto Nagar, Jaggayyapeta</p>
          <p>${SHOP_PHONE}</p>
          <a href="https://www.instagram.com/sreekrishnasteelsofficial" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.youtube.com/@SreeKrishnaSteelsFurniture" target="_blank" rel="noopener noreferrer">YouTube</a>
        </article>
      </div>
      <div class="footer-rights">
        <div class="container footer-rights-inner">
          <p>Copyright 2026 <span class="company-line">${COMPANY_NAME}</span>. All rights reserved.</p>
          <div><a href="#">Privacy Policy</a><a href="#">Terms & Conditions</a></div>
        </div>
      </div>
    </footer>`;
}

const navContainer = document.getElementById("nav-container");
if (navContainer) navContainer.innerHTML = nav(page);

const footerContainer = document.getElementById("footer-container");
if (footerContainer) footerContainer.innerHTML = footer();

let products: Product[] = [];
const productsGrid        = document.querySelector<HTMLDivElement>("#products-grid");
const categoryFilter      = document.querySelector<HTMLSelectElement>("#category-filter");
const searchInput         = document.querySelector<HTMLInputElement>("#search-input");
const sortFilter          = document.querySelector<HTMLSelectElement>("#sort-filter");
const aiForm              = document.querySelector<HTMLFormElement>("#ai-form");
const aiResult            = document.querySelector<HTMLDivElement>("#ai-result");
const roomUpload          = document.querySelector<HTMLInputElement>("#room-upload");
const furnitureSelect     = document.querySelector<HTMLSelectElement>("#furniture-select");
const roomImage           = document.querySelector<HTMLImageElement>("#room-image");
const furnitureOverlay    = document.querySelector<HTMLImageElement>("#furniture-overlay");
const posX                = document.querySelector<HTMLInputElement>("#pos-x");
const posY                = document.querySelector<HTMLInputElement>("#pos-y");
const scale               = document.querySelector<HTMLInputElement>("#scale");
const rotate              = document.querySelector<HTMLInputElement>("#rotate");
const depth               = document.querySelector<HTMLInputElement>("#depth");
const tilt                = document.querySelector<HTMLInputElement>("#tilt");
const roomCameraUpload    = document.querySelector<HTMLInputElement>("#room-camera-upload");
const capturePreviewPhoto = document.querySelector<HTMLButtonElement>("#capture-preview-photo");
const centerPreview       = document.querySelector<HTMLButtonElement>("#center-preview");
const posePreview         = document.querySelector<HTMLButtonElement>("#pose-preview");
const resetPreview        = document.querySelector<HTMLButtonElement>("#reset-preview");
const downloadPreview     = document.querySelector<HTMLButtonElement>("#download-preview");
const quoteRotator        = document.querySelector<HTMLElement>("#quote-rotator");
const cameraModal         = document.querySelector<HTMLDivElement>("#camera-modal");
const cameraVideo         = document.querySelector<HTMLVideoElement>("#camera-video");
const cameraCanvas        = document.querySelector<HTMLCanvasElement>("#camera-canvas");
const cameraCapture       = document.querySelector<HTMLButtonElement>("#camera-capture");
const cameraClose         = document.querySelector<HTMLButtonElement>("#camera-close");
const cameraStatus        = document.querySelector<HTMLParagraphElement>("#camera-status");

let activeCameraTarget: "measure" | "preview" = "measure";
let cameraStream: MediaStream | null = null;

function getWhatsappUrl(productName: string) {
  return `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(`Hi, I am interested in ${productName}.`)}`;
}

function renderProducts(list: Product[]) {
  if (!productsGrid) return;
  productsGrid.innerHTML = list.length
    ? list.map((p, i) => `
        <article class="card reveal" style="transition-delay:${(i % 10) * 0.04}s">
          <div class="product-image-frame">
            <div class="secure-image-container">
              <div class="secure-image-overlay"></div>
              <img src="${p.imageUrl}" alt="${p.name}" loading="lazy" onerror="this.src='/branding/d-furniture-logo-centered.jpg'" />
            </div>
          </div>
          <div class="card-body">
            <div class="product-topline"><p class="chip">${p.category}</p><span>${p.stockStatus}</span></div>
            <h3>${p.name}</h3>
            <p class="price">Rs. ${p.price.toLocaleString("en-IN")}</p>
            <div class="product-specs"><span>${p.dimensions}</span><span>${p.material}</span></div>
            <div class="product-actions">
              <a class="wa-btn" target="_blank" rel="noopener noreferrer" href="${getWhatsappUrl(p.name)}">Enquire</a>
              <a class="secondary-btn" href="/ai-room-designer.html">Preview in Room</a>
            </div>
          </div>
        </article>`).join("")
    : `<p class="empty-state">No products found.</p>`;
  setTimeout(initReveal, 30);
}

function applyFilters() {
  const selectedCategory = categoryFilter?.value || "all";
  const query    = (searchInput?.value || "").toLowerCase();
  const sortMode = sortFilter?.value || "featured";
  const filtered = products.filter(p => {
    const cm = selectedCategory === "all" || p.category.toLowerCase() === selectedCategory;
    return cm && p.name.toLowerCase().includes(query);
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === "price-low")  return a.price - b.price;
    if (sortMode === "price-high") return b.price - a.price;
    if (sortMode === "name")       return a.name.localeCompare(b.name);
    return 0;
  });
  renderProducts(sorted);
}

function updateOverlayControls() {
  if (!furnitureOverlay || !posX || !posY || !scale || !rotate) return;
  const dv = Number(depth?.value || 20);
  const tv = Number(tilt?.value  || 8);
  const scaleVal = Number(scale.value) / 100;
  
  furnitureOverlay.style.left      = `${Number(posX.value)}%`;
  furnitureOverlay.style.top       = `${Number(posY.value)}%`;
  furnitureOverlay.style.transform = `translate3d(-50%,-50%,${dv}px) scale(${scaleVal}) rotateX(${tv}deg) rotateZ(${Number(rotate.value)}deg)`;
  
  // Update 3D Floor Ring position and perspective scale
  const floorRing = document.getElementById("furniture-floor-ring");
  if (floorRing) {
    floorRing.style.display = "block";
    floorRing.style.left = `${Number(posX.value)}%`;
    // Offset below the center based on perspective and tilt
    const ringOffset = 40 + (scaleVal * 15);
    floorRing.style.top = `${Number(posY.value) + (ringOffset * (1 - tv/35))}%`;
    floorRing.style.width = `${Math.round(250 * scaleVal)}px`;
    floorRing.style.height = `${Math.round(90 * scaleVal)}px`;
    floorRing.style.transform = `translate3d(-50%,-50%,0) rotateX(68deg) rotateZ(${Number(rotate.value)}deg)`;
  }

  // Update live labels
  const px = document.getElementById("pos-x-val"); if (px) px.textContent = `${posX.value}%`;
  const py = document.getElementById("pos-y-val"); if (py) py.textContent = `${posY.value}%`;
  const sv = document.getElementById("scale-val"); if (sv) sv.textContent = `${scale.value}%`;
  const rv = document.getElementById("rotate-val"); if (rv) rv.textContent = `${rotate.value}°`;
  const dval = document.getElementById("depth-val"); if (dval) dval.textContent = `${depth?.value}`;
  const tv2 = document.getElementById("tilt-val"); if (tv2) tv2.textContent = `${tilt?.value}°`;
}

function populateFurnitureSelect() {
  if (!furnitureSelect) return;
  furnitureSelect.innerHTML = products.map(p => `<option value="${p.imageUrl}">${p.name}</option>`).join("");
  if (furnitureOverlay && products[0]) furnitureOverlay.src = products[0].imageUrl;
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
  let i = 0;
  setInterval(() => { i = (i + 1) % quotes.length; quoteRotator.textContent = quotes[i]; }, 3200);
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); }),
    { threshold: 0.12 }
  );
  els.forEach(el => obs.observe(el));
}

async function openCamera(target: "measure" | "preview") {
  activeCameraTarget = target;
  if (!cameraModal || !cameraVideo || !cameraStatus) {
    if (target === "preview") roomCameraUpload?.click();
    return;
  }
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
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
    cameraStatus.textContent = "Camera ready. Frame the room and capture.";
  } catch {
    if (target === "preview") roomCameraUpload?.click();
    const mc = document.getElementById("measure-camera-file") as HTMLInputElement | null;
    if (target === "measure") mc?.click();
  }
}

function closeCamera() {
  cameraStream?.getTracks().forEach(t => t.stop());
  cameraStream = null;
  if (cameraVideo) cameraVideo.srcObject = null;
  cameraModal?.classList.remove("open");
  cameraModal?.setAttribute("aria-hidden", "true");
}

function captureCameraPhoto() {
  if (!cameraVideo || !cameraCanvas) return;
  const w = cameraVideo.videoWidth || 1280;
  const h = cameraVideo.videoHeight || 720;
  cameraCanvas.width = w; cameraCanvas.height = h;
  const ctx = cameraCanvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(cameraVideo, 0, 0, w, h);
  if (activeCameraTarget === "preview" && roomImage) {
    roomImage.src = cameraCanvas.toDataURL("image/jpeg", 0.92);
    closeCamera(); return;
  }
  cameraCanvas.toBlob(blob => {
    if (!blob) return;
    const file = new File([blob], "camera-room-photo.jpg", { type: "image/jpeg" });
    const mi = document.getElementById("measure-camera-file") as HTMLInputElement | null;
    const dt = new DataTransfer(); dt.items.add(file);
    if (mi) mi.files = dt.files;
    mi?.dispatchEvent(new Event("change"));
    closeCamera();
  }, "image/jpeg", 0.92);
}

// ── AI Recommendation ─────────────────────────────────────────────────────────
aiForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!aiResult) return;
  aiResult.innerHTML = `
    <div style="text-align:center;padding:1.5rem">
      <div style="font-size:2rem;margin-bottom:0.5rem">🤖</div>
      <p style="color:#bb1e2d;font-weight:600">Gemini AI is analysing your requirement...</p>
      <p style="font-size:0.85rem;color:#666">Finding the best furniture for your room and budget</p>
    </div>`;

  const data       = new FormData(aiForm!);
  const budget     = Number(data.get("budget")     || 0);
  const roomType   = String(data.get("roomType")   || "living room");
  const style      = String(data.get("style")      || "modern");
  const category   = String(data.get("category")   || "sofa");
  const dimensions = String(data.get("dimensions") || "");

  try {
    const response = await fetch(`${API_BASE_URL}/api/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, roomType, dimensions, budget, style, products })
    });
    const result = await response.json();
    const recommendation = result.recommendation || "Unable to generate recommendation.";
    const matched = products
      .filter(p => p.price <= budget && p.category.toLowerCase().includes(category.toLowerCase()))
      .slice(0, 3);

    aiResult.innerHTML = `
      <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:12px;padding:1.2rem;margin-bottom:1rem">
        <p style="color:#f0c040;font-size:0.8rem;font-weight:700;letter-spacing:1px;margin:0 0 0.5rem">✨ GEMINI AI RECOMMENDATION</p>
        <p style="color:#fff;line-height:1.8;margin:0;font-size:0.95rem">${recommendation}</p>
      </div>
      ${matched.length ? `
        <p style="font-weight:700;color:#bb1e2d;margin:0.8rem 0 0.4rem">🛋️ Matching Products from Our Shop:</p>
        ${matched.map(p => `
          <div style="background:#f8f4ee;padding:0.8rem 1rem;border-radius:10px;margin-top:0.5rem;border-left:4px solid #bb1e2d;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem">
            <div>
              <strong style="color:#14213d">${p.name}</strong>
              <span style="font-size:0.8rem;color:#666;display:block">${p.material} | ${p.dimensions}</span>
            </div>
            <strong style="color:#bb1e2d;font-size:1.1rem">Rs. ${p.price.toLocaleString("en-IN")}</strong>
          </div>`).join("")}` : ""}
      <a class="wa-btn" style="margin-top:1.2rem;display:flex;align-items:center;justify-content:center;gap:0.5rem" target="_blank"
        href="https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(`Hi! I got an AI recommendation for a ${category} for my ${roomType}. Budget: Rs.${budget}. Style: ${style}. Room size: ${dimensions}. Please help!`)}">
        💬 Enquire on WhatsApp</a>`;
  } catch {
    const fallback = products.filter(p => p.price <= budget).slice(0, 2);
    aiResult.innerHTML = `
      <p style="color:#b45309;font-weight:600">⚡ Best matches within your budget:</p>
      ${fallback.map(p => `
        <div style="background:#f8f4ee;padding:0.8rem 1rem;border-radius:10px;margin-top:0.5rem;border-left:4px solid #bb1e2d">
          <strong>${p.name}</strong> — Rs. ${p.price.toLocaleString("en-IN")}
        </div>`).join("")}
      <a class="wa-btn" style="margin-top:1rem;display:flex;align-items:center;justify-content:center" target="_blank" href="https://wa.me/${SHOP_WHATSAPP}">💬 Enquire on WhatsApp</a>`;
  }
});

// ── Event Listeners ───────────────────────────────────────────────────────────
roomUpload?.addEventListener("change", e => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || !roomImage) return;
  const r = new FileReader();
  r.onload = () => { if (typeof r.result === "string") roomImage.src = r.result; };
  r.readAsDataURL(file);
});

roomCameraUpload?.addEventListener("change", e => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || !roomImage) return;
  const r = new FileReader();
  r.onload = () => { if (typeof r.result === "string") roomImage.src = r.result; };
  r.readAsDataURL(file);
});

furnitureSelect?.addEventListener("change",  () => { if (furnitureOverlay && furnitureSelect) furnitureOverlay.src = furnitureSelect.value; });
categoryFilter?.addEventListener("change",   applyFilters);
searchInput?.addEventListener("input",       applyFilters);
sortFilter?.addEventListener("change",       applyFilters);
posX?.addEventListener("input",              updateOverlayControls);
posY?.addEventListener("input",              updateOverlayControls);
scale?.addEventListener("input",             updateOverlayControls);
rotate?.addEventListener("input",            updateOverlayControls);
depth?.addEventListener("input",             updateOverlayControls);
tilt?.addEventListener("input",              updateOverlayControls);
capturePreviewPhoto?.addEventListener("click", () => openCamera("preview"));
cameraCapture?.addEventListener("click",       captureCameraPhoto);
cameraClose?.addEventListener("click",         closeCamera);

centerPreview?.addEventListener("click", () => {
  if (!posX||!posY||!scale||!rotate||!depth||!tilt) return;
  posX.value="42"; posY.value="58"; scale.value="100"; rotate.value="0"; depth.value="20"; tilt.value="8";
  updateOverlayControls();
});
posePreview?.addEventListener("click", () => {
  if (!posX||!posY||!scale||!rotate||!depth||!tilt) return;
  posX.value="48"; posY.value="62"; scale.value="115"; rotate.value="-6"; depth.value="46"; tilt.value="14";
  updateOverlayControls();
});
resetPreview?.addEventListener("click", () => {
  if (!roomImage||!posX||!posY||!scale||!rotate||!depth||!tilt) return;
  roomImage.src=DEFAULT_ROOM_IMAGE;
  posX.value="20"; posY.value="45"; scale.value="100"; rotate.value="0"; depth.value="20"; tilt.value="8";
  updateOverlayControls();
});
downloadPreview?.addEventListener("click", () => {
  const scene = document.getElementById("room-scene");
  if (!scene || !roomImage) return;
  const cvs = document.createElement("canvas");
  cvs.width = roomImage.naturalWidth || roomImage.width;
  cvs.height = roomImage.naturalHeight || roomImage.height;
  const ctx = cvs.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(roomImage, 0, 0, cvs.width, cvs.height);
  const a = document.createElement("a");
  a.download = "SKS_Room_Preview.png";
  a.href = cvs.toDataURL("image/png");
  a.click();
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────
loadProducts().catch(() => {
  if (productsGrid)
    productsGrid.innerHTML=`<p class="empty-state">Unable to load products. Start the backend server and refresh.</p>`;
});

updateOverlayControls();
initQuoteRotator();
initReveal();

if (page === "ai") {
  new RoomMeasurementUI();
}
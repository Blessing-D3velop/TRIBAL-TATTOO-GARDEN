/* ============================================
   TRIBAL TATTOO GARDEN — script.js
   ============================================ */

const WHATSAPP_NUMBER = "27622881125";

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initHamburger();
  initCursorGlow();
  initEmbers();
  initGalleryFilters();
  initGallery();
  initLightbox();
  initScrollReveal();
  initBookingForm();
  setMinDate();
});

/* ---------- Header scroll state ---------- */
function initHeader() {
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile hamburger menu ---------- */
function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("mainNav");

  hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  nav.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Ambient cursor glow (desktop only) ---------- */
function initCursorGlow() {
  const glow = document.getElementById("cursorGlow");
  if (!glow || window.matchMedia("(hover: none)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let active = false;

  window.addEventListener("mousemove", (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    if (!active) {
      glow.classList.add("active");
      active = true;
    }
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    glow.classList.remove("active");
    active = false;
  });
}

/* ---------- Floating embers in the hero ---------- */
function initEmbers() {
  const container = document.getElementById("embers");
  if (!container) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#2af2ff", "#9b3ffa", "#ff2fc7", "#ff2d4d"];
  const count = window.innerWidth < 640 ? 12 : 22;

  for (let i = 0; i < count; i++) {
    const ember = document.createElement("span");
    ember.className = "ember";

    const size = 2 + Math.random() * 4;
    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 10;
    const delay = Math.random() * 14;
    const color = colors[Math.floor(Math.random() * colors.length)];

    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    ember.style.left = `${left}%`;
    ember.style.background = color;
    ember.style.boxShadow = `0 0 ${size * 2.5}px ${color}`;
    ember.style.animationDuration = `${duration}s`;
    ember.style.animationDelay = `${delay}s`;

    container.appendChild(ember);
  }
}

/* ---------- Gallery data ----------
   Add more tattoos by pushing another object onto this array —
   the filters and grid rebuild automatically. Re-assign `category`
   on any item to match real photos once they're in place.
---------------------------------------------- */
const GALLERY_ITEMS = [
  { image: "images/g1.jpg",  category: "Custom Tattoos", alt: "Custom tattoo design" },
  { image: "images/g2.jpg",  category: "Black & Grey",   alt: "Black and grey tattoo" },
  { image: "images/g3.jpg",  category: "Sleeves",        alt: "Sleeve tattoo" },
  { image: "images/g4.jpg",  category: "Colour Tattoos", alt: "Colour tattoo" },
  { image: "images/g5.jpg",  category: "Small Tattoos",  alt: "Small tattoo" },
  { image: "images/g6.jpg",  category: "Piercings",      alt: "Piercing work" },
  { image: "images/g7.jpg",  category: "Custom Tattoos", alt: "Custom tattoo design" },
  { image: "images/g8.jpg",  category: "Black & Grey",   alt: "Black and grey tattoo" },
  { image: "images/g9.jpg",  category: "Sleeves",        alt: "Sleeve tattoo" },
  { image: "images/g10.jpg", category: "Colour Tattoos", alt: "Colour tattoo" },
  { image: "images/g11.jpg", category: "Small Tattoos",  alt: "Small tattoo" },
  { image: "images/g12.jpg", category: "Piercings",      alt: "Piercing work" },
  { image: "images/g13.jpg", category: "Custom Tattoos", alt: "Custom tattoo design" },
  { image: "images/g14.jpg", category: "Black & Grey",   alt: "Black and grey tattoo" },
  { image: "images/g15.jpg", category: "Sleeves",        alt: "Sleeve tattoo" },
  { image: "images/g16.jpg", category: "Colour Tattoos", alt: "Colour tattoo" },
];

const GALLERY_CATEGORIES = ["All", "Small Tattoos", "Custom Tattoos", "Sleeves", "Black & Grey", "Colour Tattoos", "Piercings"];

let activeCategory = "All";
let visibleItems = GALLERY_ITEMS.slice();
let galleryIndex = 0;

function initGalleryFilters() {
  const filters = document.getElementById("galleryFilters");

  filters.innerHTML = GALLERY_CATEGORIES.map(cat => `
    <button type="button" class="filter-btn${cat === activeCategory ? " active" : ""}" data-category="${cat}" role="tab" aria-selected="${cat === activeCategory}">${cat}</button>
  `).join("");

  filters.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;

      filters.querySelectorAll(".filter-btn").forEach(b => {
        const isActive = b === btn;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-selected", isActive);
      });

      renderGallery();
    });
  });
}

function initGallery() {
  renderGallery();
}

function renderGallery() {
  const masonry = document.getElementById("masonry");

  visibleItems = activeCategory === "All"
    ? GALLERY_ITEMS.slice()
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  masonry.innerHTML = visibleItems.map((item, i) => `
    <div class="masonry-item" data-index="${i}" style="animation-delay:${Math.min(i, 8) * 0.04}s">
      <img src="${item.image}" alt="${item.alt}" loading="lazy">
      <span class="masonry-item-tag">${item.category}</span>
    </div>
  `).join("");

  masonry.querySelectorAll(".masonry-item").forEach(item => {
    item.addEventListener("click", () => openLightbox(parseInt(item.dataset.index, 10)));
  });
}

/* ---------- Lightbox ---------- */
function initLightbox() {
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", () => stepLightbox(-1));
  document.getElementById("lightboxNext").addEventListener("click", () => stepLightbox(1));
  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
}

function openLightbox(index) {
  galleryIndex = index;
  const item = visibleItems[galleryIndex];
  const img = document.getElementById("lightboxImg");
  img.src = item.image;
  img.alt = item.alt;
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}

function stepLightbox(dir) {
  galleryIndex = (galleryIndex + dir + visibleItems.length) % visibleItems.length;
  const item = visibleItems[galleryIndex];
  const img = document.getElementById("lightboxImg");
  img.src = item.image;
  img.alt = item.alt;
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const sections = document.querySelectorAll(".reveal-section");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    sections.forEach(s => s.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

  sections.forEach(section => observer.observe(section));
}

/* ---------- Booking form -> WhatsApp ---------- */
function setMinDate() {
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);
}

function initBookingForm() {
  const form = document.getElementById("bookingForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    sendBookingToWhatsApp(getFormData());
  });
}

function getFormData() {
  return {
    fullName: document.getElementById("fullName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    service: document.getElementById("service").value,
    tattooSize: document.getElementById("tattooSize").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    message: document.getElementById("message").value.trim()
  };
}

function sendBookingToWhatsApp(data) {
  const lines = [
    "Hi Tribal Tattoo Garden, I'd like to book an appointment.",
    "",
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    `Service: ${data.service}`
  ];

  if (data.tattooSize) lines.push(`Size: ${data.tattooSize}`);

  lines.push(`Date: ${data.date}`, `Time: ${data.time}`, `Message: ${data.message}`);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank", "noopener");
}

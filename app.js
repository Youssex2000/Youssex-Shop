/* =========================
   Typewriter (Hero)
========================= */
const roles = ["Designer", "Editor", "Programmer"];
const typeEl = document.getElementById("typewriter");

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function tickTypewriter() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typeEl.textContent = current.slice(0, charIndex);

    if (charIndex === current.length) {
      deleting = true;
      setTimeout(tickTypewriter, 900);
      return;
    }
  } else {
    charIndex--;
    typeEl.textContent = current.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  const speed = deleting ? 40 : 55;
  setTimeout(tickTypewriter, speed);
}

tickTypewriter();

/* =========================
   Mobile Nav Toggle
========================= */
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

function setMobileNav(open) {
  navToggle.setAttribute("aria-expanded", String(open));
  mobileNav.hidden = !open;
}

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  setMobileNav(!isOpen);
});

mobileNav?.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (link) setMobileNav(false);
});

/* =========================
   Portfolio Data + Render
========================= */
const portfolioItems = [
  { id: 1, title: "Logo design", desc: "Design a professional logo with your store name or your personal name of your choice.", category: "design", tags: ["UI/UX", "Figma", "Landing"] },
  { id: 2, title: "Pack About (Platform Streamer)", desc: "Designing your profile set for the page you broadcast on or for your YouTube channel.", category: "design", tags: ["Design System", "Components"] },
  { id: 3, title: "Professional programmer", desc: "Professional programmer for platforms, personal websites, and more..", category: "code", tags: ["HTML", "CSS Grid", "JS"] },
  { id: 4, title: "Browser extensions programmer", desc: "A professional browser extension developer with licenses from all browsers.", category: "code", tags: ["JavaScript", "UX"] },
  { id: 5, title: "professional video editor", desc: "A professional video editor with 4K quality and the translation you want (excluding Chinese and Hindi).", category: "edits", tags: ["Editing", "Captions", "Color"] },
  { id: 6, title: "Photo Retouch Set", desc: "Clean, natural retouch and tone.", category: "edits", tags: ["Retouch", "Lightroom"] },
];

const gallery = document.getElementById("gallery");

function categoryLabel(cat) {
  if (cat === "design") return "Design";
  if (cat === "code") return "Code";
  if (cat === "edits") return "Edits";
  return cat;
}

function renderGallery() {
  gallery.innerHTML = portfolioItems.map(item => `
    <article class="item" tabindex="0" role="button"
      data-category="${item.category}"
      data-id="${item.id}"
      aria-label="Open ${item.title} details">
      <div class="item__thumb"></div>
      <span class="badge">${categoryLabel(item.category)}</span>
      <div class="item__body">
        <h3 class="item__title">${item.title}</h3>
        <p class="item__desc">${item.desc}</p>
      </div>
    </article>
  `).join("");
}

renderGallery();

/* =========================
   Portfolio Filter
========================= */
const filterButtons = document.querySelectorAll(".filter-btn");

function setActiveFilterButton(activeBtn) {
  filterButtons.forEach(btn => {
    const isActive = btn === activeBtn;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });
}

function applyFilter(filter) {
  const items = document.querySelectorAll(".item");
  items.forEach(el => {
    const cat = el.getAttribute("data-category");
    const show = filter === "all" || cat === filter;
    el.classList.toggle("is-hidden", !show);
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");
    setActiveFilterButton(btn);
    applyFilter(filter);
  });
});

/* =========================
   Portfolio Modal (optional but nice)
========================= */
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalMeta = document.getElementById("modalMeta");

function openModal(item) {
  modalTitle.textContent = item.title;
  modalDesc.textContent = item.desc;
  modalMeta.innerHTML = item.tags.map(t => `<span class="meta-pill">${t}</span>`).join("");

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modal.addEventListener("click", (e) => {
  if (e.target.matches("[data-close-modal]")) closeModal();
  if (e.target.closest("[data-close-modal]")) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

gallery.addEventListener("click", (e) => {
  const card = e.target.closest(".item");
  if (!card) return;
  const id = Number(card.getAttribute("data-id"));
  const item = portfolioItems.find(x => x.id === id);
  if (item) openModal(item);
});

gallery.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = e.target.closest(".item");
  if (!card) return;
  e.preventDefault();
  const id = Number(card.getAttribute("data-id"));
  const item = portfolioItems.find(x => x.id === id);
  if (item) openModal(item);
});

/* =========================
   Contact Form Validation
========================= */
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

function setError(fieldName, message) {
  const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (errorEl) errorEl.textContent = message || "";
}

function isValidEmail(email) {
  // Practical email validation (not perfect, but solid UX)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(String(email).trim());
}

function clearErrors() {
  ["name", "email", "subject", "message", "consent"].forEach(f => setError(f, ""));
  statusEl.textContent = "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();
  const consent = document.getElementById("consent").checked;

  let ok = true;

  if (name.length < 2) { setError("name", "Please enter your name."); ok = false; }
  if (!isValidEmail(email)) { setError("email", "Please enter a valid email address."); ok = false; }
  if (subject.length < 3) { setError("subject", "Please add a short subject."); ok = false; }
  if (message.length < 10) { setError("message", "Please write a brief message (10+ characters)."); ok = false; }
  if (!consent) { setError("consent", "Consent is required to submit this form."); ok = false; }

  if (!ok) {
    statusEl.textContent = "Please fix the highlighted fields and try again.";
    return;
  }

  // Show a quick sending state, then submit to FormSubmit (external form backend).
  statusEl.textContent = "Sending…";
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  // Use native submit to avoid CORS issues and keep compatibility.
  form.submit();
});

/* =========================
   Footer year
========================= */
document.getElementById("year").textContent = new Date().getFullYear();
/* =========================
   About: Read More toggle
========================= */
const aboutBio = document.getElementById("aboutBio");
const aboutMore = document.getElementById("aboutMore");
const aboutToggle = document.getElementById("aboutToggle");

if (aboutBio && aboutMore && aboutToggle) {
  aboutToggle.addEventListener("click", () => {
    const isOpen = aboutBio.classList.toggle("is-open");
    aboutToggle.setAttribute("aria-expanded", String(isOpen));
    aboutToggle.textContent = isOpen ? "Read less" : "Read more";
  });
}

/* =========================
   Scroll Reveal + About Counters
========================= */
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCount(el, to) {
  if (prefersReduced) {
    el.textContent = String(to);
    return;
  }

  const start = performance.now();
  const duration = 900;

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const value = Math.floor(t * to);
    el.textContent = String(value);
    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function runAboutCountersOnce() {
  const nums = document.querySelectorAll(".stat__num[data-count]");
  nums.forEach((el) => {
    if (el.dataset.counted === "true") return;
    el.dataset.counted = "true";
    const target = Number(el.getAttribute("data-count"));
    animateCount(el, target);
  });
}

const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");

      if (entry.target.classList.contains("about__text")) {
        runAboutCountersOnce();
      }

      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
  runAboutCountersOnce();
}



/* =========================
   Contact success (after redirect)
========================= */
(function () {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("sent") === "1" && statusEl) {
      statusEl.textContent = "Message sent successfully. I’ll reply as soon as possible.";
      // Clean URL (remove ?sent=1) without reloading
      params.delete("sent");
      const newQuery = params.toString();
      const newUrl =
        window.location.pathname +
        (newQuery ? `?${newQuery}` : "") +
        window.location.hash;
      window.history.replaceState({}, "", newUrl);
    }
  } catch (_) {
    // ignore
  }
})();


/* ===== Logout (clears Remember Me demo) ===== */
(function(){
  const btn = document.getElementById("logoutBtn");
  if(!btn) return;
  btn.addEventListener("click", () => {
    try{
      localStorage.removeItem("ys_remember");
      localStorage.removeItem("ys_email");
    }catch(_){}
    window.location.href = "index.html";
  });
})();

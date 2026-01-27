const parallaxLayers = [];
const kiBar = document.querySelector("#scroll-ki-bar .ki-fill");
const revealEls = [];
let lastScrollY = 0;

// Collect parallax layers
document.querySelectorAll("[data-depth]").forEach((el) => {
  parallaxLayers.push({
    el,
    depth: parseFloat(el.getAttribute("data-depth")) || 0.1,
  });
});

// Mouse move parallax
window.addEventListener("mousemove", (e) => {
  const { innerWidth, innerHeight } = window;
  const x = (e.clientX / innerWidth - 0.5) * 2;
  const y = (e.clientY / innerHeight - 0.5) * 2;

  parallaxLayers.forEach(({ el, depth }) => {
    const translateX = -x * 25 * depth;
    const translateY = -y * 25 * depth;
    el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
  });
});

// Scroll-based ki bar
function updateKiBar() {
  const scrollTop = window.scrollY || window.pageYOffset;
  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  kiBar.style.width = `${progress}%`;
}

// Scroll reveal observer
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

function initReveal() {
  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    revealObserver.observe(el);
  });
}

// Subtle hero scaling on scroll
const hero = document.getElementById("hero");
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY || window.pageYOffset;
  lastScrollY = scrollY;

  updateKiBar();

  if (hero) {
    const maxOffset = 140;
    const offset = Math.min(scrollY, maxOffset);
    const scale = 1 - offset / (maxOffset * 18);
    hero.style.transform = `translateY(${offset * 0.1}px) scale(${scale})`;
  }
});

// Mobile menu toggle
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.style.display === "flex";
    mobileMenu.style.display = isOpen ? "none" : "flex";
  });

  // Close menu on nav click
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.style.display = "none";
    });
  });
}

// Close mobile menu on resize to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 960 && mobileMenu) {
    mobileMenu.style.display = "none";
  }
});

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

function applyStoredTheme() {
  try {
    const stored = localStorage.getItem("tp2-theme");
    if (stored === "light") {
      body.classList.add("theme-light");
    } else {
      body.classList.remove("theme-light");
    }
  } catch {
    // ignore
  }
}

function toggleTheme() {
  const isLight = body.classList.toggle("theme-light");
  try {
    localStorage.setItem("tp2-theme", isLight ? "light" : "dark");
  } catch {
    // ignore
  }
}

// Initial setup
applyStoredTheme();
initReveal();
updateKiBar();

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

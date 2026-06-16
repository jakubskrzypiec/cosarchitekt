const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// Płynna animacja startowa. Startuje po załadowaniu strony i znika bez szarpnięcia.
const splash = document.querySelector(".splash-screen");
if (splash) {
  document.body.classList.add("splash-active");

  const hideSplash = () => {
    window.setTimeout(() => {
      splash.classList.add("is-leaving");
      document.body.classList.remove("splash-active");

      window.setTimeout(() => {
        splash.remove();
      }, 900);
    }, 1350);
  };

  if (document.readyState === "complete") {
    hideSplash();
  } else {
    window.addEventListener("load", hideSplash, { once: true });
  }
}

// Chowanie górnego paska przy scrollowaniu w dół i pokazywanie przy scrollowaniu w górę.
const header = document.querySelector(".site-header");
let lastScroll = window.scrollY || 0;
let ticking = false;

function updateHeader() {
  if (!header) return;

  const currentScroll = Math.max(window.scrollY || 0, 0);
  const goingDown = currentScroll > lastScroll + 8;
  const goingUp = currentScroll < lastScroll - 8;

  if (currentScroll > 130 && goingDown) {
    header.classList.add("is-hidden");
  }

  if (goingUp || currentScroll < 80) {
    header.classList.remove("is-hidden");
  }

  lastScroll = currentScroll;
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateHeader);
    ticking = true;
  }
}, { passive: true });

// Płynne przewijanie do sekcji.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const selector = link.getAttribute("href");
    const target = document.querySelector(selector);
    if (!target) return;

    event.preventDefault();
    header?.classList.remove("is-hidden");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Filtrowanie galerii.
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const visible = filter === "all" || category === filter;
      card.classList.toggle("hidden", !visible);
    });
  });
});

// Lightbox galerii.
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    const image = card.querySelector("img");
    if (!image || !lightbox || !lightboxImage) return;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
}

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

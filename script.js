document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  const header = document.querySelector(".site-header");

  if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const farEnough = currentScrollY > 110;

      if (currentScrollY <= 20) {
        header.classList.remove("is-hidden");
      } else if (scrollingDown && farEnough && !body.classList.contains("nav-open")) {
        header.classList.add("is-hidden");
      } else if (!scrollingDown) {
        header.classList.remove("is-hidden");
      }

      lastScrollY = Math.max(currentScrollY, 0);
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
      if (header) header.classList.remove("is-hidden");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const selector = link.getAttribute("href");
      if (!selector || selector === "#") return;
      const target = document.querySelector(selector);

      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (header) {
        header.classList.add("is-hidden");
        window.setTimeout(() => header.classList.remove("is-hidden"), 500);
      }
    });
  });

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      projectCards.forEach((card) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightboxImage");
  const lightboxClose = document.querySelector("#lightboxClose");

  if (lightbox && lightboxImage && lightboxClose) {
    projectCards.forEach((card) => {
      card.addEventListener("click", () => {
        const image = card.querySelector("img");
        if (!image) return;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || "Projekt wnętrza";
        lightbox.classList.add("active");
        body.style.overflow = "hidden";
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      lightboxImage.src = "";
      body.style.overflow = "";
    };

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }
});
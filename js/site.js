const burger = document.querySelector(".burger");
const overlay = document.querySelector("#menu");
const closeBtn = overlay.querySelector(".close");

function openMenu() {
  overlay.hidden = false;
  burger.setAttribute("aria-expanded", "true");
  closeBtn.focus();
}

function closeMenu() {
  overlay.hidden = true;
  burger.setAttribute("aria-expanded", "false");
  burger.focus();
}

burger.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !overlay.hidden) closeMenu();
});

const tabs = [...document.querySelectorAll("[role='tab']")];
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(item.getAttribute("aria-controls"));
      panel.hidden = !selected;
      if (selected) {
        panel.classList.remove("swap");
        void panel.offsetWidth;
        panel.classList.add("swap");
      }
    });
  });
});

const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".dots button")];
let slideIndex = 0;
let slideTimer;

function setLinks(slide, on) {
  slide.querySelectorAll("a").forEach((link) => {
    if (on) link.removeAttribute("tabindex");
    else link.tabIndex = -1;
  });
}

function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, n) => {
    const on = n === slideIndex;
    if (on) slide.classList.remove("leaving");
    else if (slide.classList.contains("is-on")) slide.classList.add("leaving");
    slide.classList.toggle("is-on", on);
    slide.setAttribute("aria-hidden", String(!on));
    setLinks(slide, on);
    if (on) {
      slide.classList.remove("is-on");
      void slide.offsetWidth;
      slide.classList.add("is-on");
    }
  });
  dots.forEach((dot, n) => dot.setAttribute("aria-selected", String(n === slideIndex)));
}

function queueSlide() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(slideIndex + 1), 7000);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
slides.forEach((slide, n) => setLinks(slide, n === 0));
dots.forEach((dot, n) => dot.addEventListener("click", () => {
  showSlide(n);
  if (!reduceMotion) queueSlide();
}));
const hero = document.querySelector(".hero");
hero.addEventListener("mouseenter", () => clearInterval(slideTimer));
hero.addEventListener("mouseleave", () => { if (!reduceMotion) queueSlide(); });
if (!reduceMotion) queueSlide();

const revealItems = document.querySelectorAll(".reveal");
if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("in"));
} else if ("IntersectionObserver" in window) {
  const watcher = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        watcher.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  revealItems.forEach((item) => watcher.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in"));
}

const track = document.querySelector(".quote-track");
if (track) {
  const originals = [...track.children];
  originals.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
  if (!reduceMotion) {
  let quoteIndex = 0;
  let quoteTimer;

  function quoteStep() {
    const card = track.children[0];
    const gap = 18;
    const distance = card.getBoundingClientRect().width + gap;
    quoteIndex += 1;
    track.style.transition = "transform 0.7s ease";
    track.style.transform = `translateX(-${quoteIndex * distance}px)`;
    if (quoteIndex >= originals.length) {
      window.setTimeout(() => {
        track.style.transition = "none";
        quoteIndex = 0;
        track.style.transform = "translateX(0)";
      }, 720);
    }
  }

  function queueQuotes() {
    clearInterval(quoteTimer);
    quoteTimer = setInterval(quoteStep, 4200);
  }

  const quoteWindow = document.querySelector(".quote-window");
  quoteWindow.addEventListener("mouseenter", () => clearInterval(quoteTimer));
  quoteWindow.addEventListener("mouseleave", queueQuotes);
  window.addEventListener("resize", () => {
    track.style.transition = "none";
    quoteIndex = 0;
    track.style.transform = "translateX(0)";
  });
  queueQuotes();
  }
}

const form = document.querySelector("#pitch");
const thanks = document.querySelector("#thanks");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  form.querySelectorAll("input, textarea, button").forEach((field) => {
    field.disabled = true;
  });
  thanks.hidden = false;
});

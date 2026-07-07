const cursor = document.querySelector(".cursor");
const hoverTargets = document.querySelectorAll("a, button, h1, h2, h3, p, .hero-logo-space, .area-card, .mockup-card, .metric-card, .process-tab, .process-drag-star, .process-panel, .process-inline-cta, .brand-track span, .brand-logo-card img");
const manifestoPhrase = document.querySelector(".manifesto-phrase");
const countUpNumbers = document.querySelectorAll(".count-up");
const processCarousel = document.querySelector(".process-carousel");
const processTabsTrack = document.querySelector(".process-tabs");
const processTabs = document.querySelectorAll(".process-tab");
const processDragStar = document.querySelector(".process-drag-star");
const processPanel = document.querySelector(".process-panel");
const revealTargets = document.querySelectorAll(".manifesto-strip, .problem-copy, .section-heading, .area-card, .brand-roll, .metric-card, .process-intro, .process-carousel, .process-outro, .final-message, .final-actions, .site-footer");
const processSteps = [
  {
    number: "01",
    title: "Entender",
    text: "O que é o projeto, para quem ele fala e o que precisa mudar."
  },
  {
    number: "02",
    title: "Dar direção",
    text: "Organizar as ideias, definir a mensagem e encontrar um conceito que faça sentido."
  },
  {
    number: "03",
    title: "Criar",
    text: "Transformar essa direção em identidade, conteúdo, design ou experiência."
  },
  {
    number: "04",
    title: "Colocar no mundo",
    text: "Fazer o projeto chegar até as pessoas certas, do jeito certo."
  }
];
const manifestoPhrases = [
  "Estratégia para fazer sentido.",
  "Arte para não parecer igual.",
  "Design para transformar tudo em presença."
];

window.addEventListener("pointermove", (event) => {
  if (!cursor) return;
  cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
});

hoverTargets.forEach((target) => {
  target.addEventListener("pointerenter", () => cursor?.classList.add("is-hovering"));
  target.addEventListener("pointerleave", () => cursor?.classList.remove("is-hovering"));
});

document.querySelectorAll(".brand-logo-card img").forEach((logo) => {
  logo.addEventListener("error", () => {
    logo.removeAttribute("src");
    logo.setAttribute("aria-hidden", "true");
  });
});

if (manifestoPhrase) {
  let manifestoIndex = 0;

  setInterval(() => {
    manifestoPhrase.classList.add("is-glitching");

    window.setTimeout(() => {
      manifestoIndex = (manifestoIndex + 1) % manifestoPhrases.length;
      const nextPhrase = manifestoPhrases[manifestoIndex];
      manifestoPhrase.textContent = nextPhrase;
      manifestoPhrase.dataset.glitchText = nextPhrase;
    }, 280);

    window.setTimeout(() => {
      manifestoPhrase.classList.remove("is-glitching");
    }, 620);
  }, 2000);
}

if (countUpNumbers.length) {
  const animateCount = (element) => {
    const target = Number(element.dataset.count || 0);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(tick);
  };

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.45 });

  countUpNumbers.forEach((number) => countObserver.observe(number));
}

if (revealTargets.length) {
  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12
  });

  revealTargets.forEach((target) => revealObserver.observe(target));
}

if (processCarousel && processPanel && processTabs.length) {
  const processNumber = processPanel.querySelector(".process-number");
  const processTitle = processPanel.querySelector("h3");
  const processText = processPanel.querySelector("p");
  let activeProcessStep = 0;
  let isDraggingProcessStar = false;

  const getProcessStarPosition = (stepIndex) => `${((stepIndex + 0.5) / processSteps.length) * 100}%`;

  const setProcessStep = (stepIndex) => {
    const step = processSteps[stepIndex];
    if (!step) return;

    activeProcessStep = stepIndex;
    processCarousel.dataset.activeStep = stepIndex;
    processCarousel.style.setProperty("--process-star-x", getProcessStarPosition(stepIndex));
    processCarousel.style.setProperty("--process-shift", `${(stepIndex - 1.5) * 18}px`);
    processCarousel.style.setProperty("--process-rotate", `${(stepIndex % 2 === 0 ? -5 : 4)}deg`);
    processPanel.classList.remove("is-switching");
    void processPanel.offsetWidth;
    processPanel.classList.add("is-switching");

    window.setTimeout(() => {
      processNumber.textContent = step.number;
      processTitle.textContent = step.title;
      processText.textContent = step.text;
    }, 120);

    processTabs.forEach((tab) => {
      const isActive = Number(tab.dataset.step) === stepIndex;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    window.setTimeout(() => {
      processPanel.classList.remove("is-switching");
    }, 640);
  };

  processTabs.forEach((tab) => {
    tab.addEventListener("click", () => setProcessStep(Number(tab.dataset.step)));
  });

  const getStepFromPointer = (clientX) => {
    if (!processTabsTrack) return activeProcessStep;
    const bounds = processTabsTrack.getBoundingClientRect();
    const progress = Math.min(Math.max((clientX - bounds.left) / bounds.width, 0), 1);
    return Math.min(processSteps.length - 1, Math.floor(progress * processSteps.length));
  };

  if (processTabsTrack && processDragStar) {
    processDragStar.addEventListener("pointerdown", (event) => {
      isDraggingProcessStar = true;
      processDragStar.classList.add("is-dragging");
      processDragStar.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    processDragStar.addEventListener("pointermove", (event) => {
      if (!isDraggingProcessStar) return;
      const bounds = processTabsTrack.getBoundingClientRect();
      const progress = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
      processCarousel.style.setProperty("--process-star-x", `${progress * 100}%`);
    });

    processDragStar.addEventListener("pointerup", (event) => {
      if (!isDraggingProcessStar) return;
      isDraggingProcessStar = false;
      processDragStar.classList.remove("is-dragging");
      processDragStar.releasePointerCapture(event.pointerId);
      setProcessStep(getStepFromPointer(event.clientX));
    });

    processDragStar.addEventListener("pointercancel", () => {
      isDraggingProcessStar = false;
      processDragStar.classList.remove("is-dragging");
      setProcessStep(activeProcessStep);
    });
  }

  setProcessStep(0);
}

const parallaxItems = document.querySelectorAll(".cta-noise");

window.addEventListener("scroll", () => {
  const offset = window.scrollY * 0.08;
  parallaxItems.forEach((item, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    item.style.translate = `0 ${offset * direction}px`;
  });
  document.documentElement.style.setProperty("--manifesto-scroll", `${window.scrollY}px`);
}, { passive: true });

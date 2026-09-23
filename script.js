const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const printResumeButton = document.querySelector("[data-print-resume]");
const currentYearTarget = document.querySelector("[data-current-year]");
const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector("#nav-toggle");
const navMenu = document.querySelector("#nav-links");
const backToTopButton = document.querySelector("#back-to-top");

if (currentYearTarget) {
    currentYearTarget.textContent = `© ${new Date().getFullYear()}`;
}

if (printResumeButton) {
    printResumeButton.addEventListener("click", () => window.print());
}

function closeNavigation() {
    if (!nav || !navToggle) {
        return;
    }

    nav.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
}

if (nav && navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNavigation();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1100) {
            closeNavigation();
        }
    });
}

const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const observedSections = [];

navLinks.forEach((link) => {
    const sectionId = link.getAttribute("href").slice(1);
    const section = document.getElementById(sectionId);

    if (section) {
        observedSections.push({ link, section });
    }
});

if (observedSections.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                observedSections.forEach(({ link, section }) => {
                    link.classList.toggle("is-active", section === entry.target);
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0,
        }
    );

    observedSections.forEach(({ section }) => sectionObserver.observe(section));
}

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length && !prefersReducedMotion.matches && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-ready");

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            rootMargin: "0px 0px -8% 0px",
            threshold: 0.08,
        }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (backToTopButton) {
    const updateBackToTopButton = () => {
        backToTopButton.classList.toggle("is-visible", window.scrollY > 500);
    };

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    });

    window.addEventListener("scroll", updateBackToTopButton, { passive: true });
    updateBackToTopButton();
}

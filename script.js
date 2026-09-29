/* Pinstack Design: progressive enhancement only.
   Core content (nav anchors, copy, contact links) works with JS disabled.
   - Adds the `js` hook that gates the CSS scroll-reveal.
   - Reveals elements as they enter the viewport (IntersectionObserver).
   - Closes the mobile <details> menu when a link is chosen. */

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /* Respect reduced motion: skip the reveal choreography entirely,
     leave everything fully visible. */
  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function showAll() {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  if (prefersReduced || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* Mobile menu: close the <details> after choosing a link, so focus
     returns to a sensible place and the panel does not stay open. */
  var menus = document.querySelectorAll("details.mobile-menu");
  menus.forEach(function (menu) {
    var summary = menu.querySelector("summary");
    /* Keep the toggle label honest for screen readers. */
    menu.addEventListener("toggle", function () {
      if (summary) {
        summary.setAttribute(
          "aria-label",
          menu.hasAttribute("open") ? "Close menu" : "Open menu"
        );
      }
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function (event) {
        menu.removeAttribute("open");
        /* Keyboard activation (detail === 0): the link is about to hide with
           the panel, so land focus on the target section's heading instead
           of dropping it to <body>. */
        if (event.detail === 0) {
          var target = document.querySelector(link.getAttribute("href"));
          var heading = target && target.querySelector("h1, h2, h3");
          if (heading) {
            if (!heading.hasAttribute("tabindex")) {
              heading.setAttribute("tabindex", "-1");
            }
            heading.focus({ preventScroll: true });
          }
        }
      });
    });
    /* Escape closes the open panel (native <details> has no such behavior). */
    menu.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.hasAttribute("open")) {
        menu.removeAttribute("open");
        var summary = menu.querySelector("summary");
        if (summary) summary.focus();
      }
    });
  });
})();

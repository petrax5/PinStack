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

  /* ---------- Pinned route stepper ----------
     The "How it works" route pins while its track scrolls through: each
     stop takes focus in turn, then the page unpins after the last one.
     Pure progressive enhancement — no pinning without JS, with reduced
     motion, or on viewports too short to fit the stage. */
  var processSection = document.getElementById("process");
  var pinTrack = document.getElementById("routePin");
  var routeSteps = document.getElementById("routeSteps");
  var pinCurrent = document.getElementById("pinCurrent");
  var pinBar = document.getElementById("pinBar");

  function pinAllowed() {
    return (
      !!processSection &&
      !!pinTrack &&
      !!routeSteps &&
      !prefersReduced &&
      !!window.matchMedia &&
      window.matchMedia("(min-height: 620px)").matches &&
      "requestAnimationFrame" in window
    );
  }

  if (processSection && pinTrack && routeSteps) {
    var stops = Array.prototype.slice.call(
      routeSteps.querySelectorAll(".stop")
    );
    var pinActive = -1;

    function setPinStep(index) {
      if (index === pinActive) return;
      pinActive = index;
      stops.forEach(function (stop, i) {
        stop.classList.toggle("is-active", i === index);
        stop.classList.toggle("is-past", i < index);
      });
    }

    function updatePin() {
      if (!processSection.classList.contains("pin-enabled")) return;
      var trackTop = pinTrack.getBoundingClientRect().top;
      var scrollable = pinTrack.offsetHeight - window.innerHeight;
      var scrolled = Math.min(Math.max(-trackTop, 0), Math.max(scrollable, 1));
      var progress = scrollable > 0 ? scrolled / scrollable : 0;
      var index = Math.min(stops.length - 1, Math.floor(progress * stops.length));
      setPinStep(index);
      if (pinCurrent) {
        pinCurrent.textContent = ("0" + (index + 1)).slice(-2);
      }
      if (pinBar) {
        pinBar.style.transform = "scaleX(" + progress.toFixed(3) + ")";
      }
    }

    function refreshPin() {
      if (!pinAllowed()) {
        processSection.classList.remove("pin-enabled");
        pinActive = -1;
        stops.forEach(function (stop) {
          stop.classList.remove("is-active", "is-past");
        });
        if (pinCurrent) pinCurrent.textContent = "01";
        if (pinBar) pinBar.style.transform = "scaleX(0)";
        return;
      }
      processSection.classList.add("pin-enabled");
      updatePin();
    }

    var pinTicking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (pinTicking) return;
        pinTicking = true;
        window.requestAnimationFrame(function () {
          pinTicking = false;
          updatePin();
        });
      },
      { passive: true }
    );

    var pinResizeTimer = null;
    window.addEventListener("resize", function () {
      if (pinResizeTimer) window.clearTimeout(pinResizeTimer);
      pinResizeTimer = window.setTimeout(refreshPin, 150);
    });

    refreshPin();
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

  /* ---------- Theme ----------
     Pre-paint script in <head> may already have set data-theme; sync the
     logos, toggle state, and theme-color meta with it on load. Manual choice
     persists in localStorage and wins; otherwise the OS preference is
     followed live. */
  var themeToggle = document.getElementById("themeToggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var themeMedia = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  /* ---------- Scroll-aware theme-color ----------
     iOS Safari tints the top toolbar (around the Dynamic Island) and the
     bottom tab bar from the theme-color meta. Follow the section sitting
     under the chrome: Grove while the dark closing band (contact/footer)
     is on screen, otherwise the theme's page background. */
  var chromeBands = Array.prototype.slice.call(
    document.querySelectorAll(".contact, .site-footer")
  );
  var chromeColor = null;

  function paintChrome() {
    if (!themeMeta) return;
    var base = currentTheme() === "dark" ? "#111814" : "#FBF7F0";
    var overBand = chromeBands.some(function (el) {
      var r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    });
    var next = overBand ? "#1F3B2E" : base;
    if (next !== chromeColor) {
      chromeColor = next;
      themeMeta.setAttribute("content", next);
    }
    /* Safari 26 ignores theme-color and tints from the page itself: mirror
       the band state onto <html> so the canvas past the page end (under the
       bottom tab bar) turns Grove while the footer band is on screen. */
    root.classList.toggle("chrome-band", overBand);
  }

  function paintTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    paintChrome();
    /* Wordmark ink would vanish on a dark header (and vice versa in the
       footer, which inverts), so swap the logo files with the theme. */
    var logos = document.querySelectorAll("img[data-light]");
    for (var i = 0; i < logos.length; i++) {
      logos[i].setAttribute(
        "src",
        theme === "dark"
          ? logos[i].getAttribute("data-dark")
          : logos[i].getAttribute("data-light")
      );
    }
    if (themeToggle) {
      var toDark = theme !== "dark";
      themeToggle.setAttribute("aria-pressed", String(!toDark));
      themeToggle.setAttribute(
        "aria-label",
        toDark ? "Switch to dark mode" : "Switch to light mode"
      );
      var moon = themeToggle.querySelector(".icon-moon");
      var sun = themeToggle.querySelector(".icon-sun");
      if (moon) moon.hidden = !toDark;
      if (sun) sun.hidden = toDark;
    }
  }

  paintTheme(currentTheme());

  /* Keep the Safari chrome tint in sync while scrolling. */
  var chromeTicking = false;
  function onChromeScroll() {
    if (chromeTicking) return;
    chromeTicking = true;
    window.requestAnimationFrame(function () {
      chromeTicking = false;
      paintChrome();
    });
  }
  window.addEventListener("scroll", onChromeScroll, { passive: true });
  window.addEventListener("resize", onChromeScroll);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("pinstack-theme", next);
      } catch (e) {}
      paintTheme(next);
    });
  }

  if (themeMedia && themeMedia.addEventListener) {
    themeMedia.addEventListener("change", function (event) {
      var stored = null;
      try {
        stored = localStorage.getItem("pinstack-theme");
      } catch (e) {}
      if (!stored) {
        paintTheme(event.matches ? "dark" : "light");
      }
    });
  }
})();

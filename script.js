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
      var stage = pinTrack.querySelector(".pin-stage");
      if (stage) stage.classList.toggle("is-pinned", trackTop <= 0);
      var scrollable = pinTrack.offsetHeight - (stage ? stage.offsetHeight : window.innerHeight);
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
        var pinStage = pinTrack.querySelector(".pin-stage");
        if (pinStage) pinStage.classList.remove("is-pinned");
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

  /* ---------- Services pin choreography ----------
     Desktop: the section becomes a tall track with a sticky stage; --p
     (0..1) drives the pin zoom, then each stack and service beat in turn.
     Scrubbed, so scrolling back rewinds. Mobile: no pinning — the pin
     zooms once and the stacks fill on a timer. Progressive enhancement:
     no .is-choreo/.is-mobile-play without JS, with reduced motion, or on
     short viewports, so the finished state simply shows. */
  var servicesSection = document.getElementById("services");
  var servicesTrack = document.getElementById("servicesTrack");

  function choreoFine() {
    return (
      !!window.matchMedia &&
      window.matchMedia("(min-width: 900px)").matches &&
      window.matchMedia("(hover: hover)").matches &&
      window.matchMedia("(min-height: 620px)").matches
    );
  }

  function updateChoreo() {
    if (
      !servicesSection.classList.contains("is-choreo") ||
      !servicesTrack
    ) return;
    var trackTop = servicesTrack.getBoundingClientRect().top;
    var scrollable = servicesTrack.offsetHeight - window.innerHeight;
    var scrolled = Math.min(Math.max(-trackTop, 0), Math.max(scrollable, 1));
    var p = scrollable > 0 ? scrolled / scrollable : 0;
    servicesSection.style.setProperty("--p", p.toFixed(4));
  }

  var mobileTimers = [];
  function clearMobileTimers() {
    mobileTimers.forEach(function (t) { window.clearTimeout(t); });
    mobileTimers = [];
  }

  function playMobile() {
    var pinSvg = servicesSection.querySelector(".pin-svg");
    var stacks = Array.prototype.slice.call(
      servicesSection.querySelectorAll(".pin-stack")
    );
    var beats = Array.prototype.slice.call(
      servicesSection.querySelectorAll(".service-beat")
    );
    function showBeats() {
      beats.forEach(function (b) { b.classList.add("is-shown"); });
    }
    if (!("IntersectionObserver" in window)) {
      if (pinSvg) pinSvg.classList.add("is-zoomed");
      stacks.forEach(function (s) { s.classList.add("is-in"); });
      showBeats();
      return;
    }
    var pinWrap = servicesSection.querySelector(".services-pin");
    var seen = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          seen.unobserve(entry.target);
          if (pinSvg) pinSvg.classList.add("is-zoomed");
          stacks.forEach(function (s, i) {
            mobileTimers.push(
              window.setTimeout(function () { s.classList.add("is-in"); }, 250 + i * 180)
            );
          });
          var beatSeen = new IntersectionObserver(
            function (bentries) {
              bentries.forEach(function (be) {
                if (be.isIntersecting) {
                  be.target.classList.add("is-shown");
                  beatSeen.unobserve(be.target);
                }
              });
            },
            { threshold: 0.3 }
          );
          beats.forEach(function (b) { beatSeen.observe(b); });
        });
      },
      { threshold: 0.5 }
    );
    if (pinWrap) seen.observe(pinWrap);
    else showBeats();
  }

  function refreshServices() {
    if (!servicesSection || !servicesTrack) return;
    clearMobileTimers();
    if (!prefersReduced && choreoFine() && "requestAnimationFrame" in window) {
      servicesSection.classList.add("is-choreo");
      servicesSection.classList.remove("is-mobile-play");
      updateChoreo();
    } else if (!prefersReduced && "IntersectionObserver" in window) {
      servicesSection.classList.remove("is-choreo");
      servicesSection.classList.remove("is-mobile-play");
      void servicesSection.offsetWidth; /* replay the entrance if re-added */
      servicesSection.classList.add("is-mobile-play");
      playMobile();
    } else {
      servicesSection.classList.remove("is-choreo", "is-mobile-play");
      servicesSection.style.removeProperty("--p");
    }
  }

  if (servicesSection && servicesTrack) {
    var choreoTicking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (choreoTicking) return;
        choreoTicking = true;
        window.requestAnimationFrame(function () {
          choreoTicking = false;
          updateChoreo();
        });
      },
      { passive: true }
    );

    var choreoResizeTimer = null;
    window.addEventListener("resize", function () {
      if (choreoResizeTimer) window.clearTimeout(choreoResizeTimer);
      choreoResizeTimer = window.setTimeout(refreshServices, 150);
    });

    refreshServices();
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

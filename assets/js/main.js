/* L.G. — comportamento del sito
   Movimento lento e intenzionale (Motion ID del brand), sempre spento con
   "riduci movimento". Senza JavaScript tutto il contenuto resta visibile. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var motion = !reduce.matches;

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("menu-mobile");
  var label = toggle ? toggle.querySelector(".menu-toggle__label") : null;
  var outside = [document.querySelector("main"), document.querySelector(".site-footer")];

  function setInert(on) {
    outside.forEach(function (el) {
      if (!el) return;
      if (on) { el.setAttribute("inert", ""); } else { el.removeAttribute("inert"); }
    });
  }

  function openMenu() {
    menu.hidden = false;
    requestAnimationFrame(function () { menu.classList.add("is-open"); });
    toggle.setAttribute("aria-expanded", "true");
    if (label) label.textContent = "Chiudi";
    document.body.classList.add("menu-open");
    setInert(true);
    var first = menu.querySelector("a");
    if (first) first.focus();
  }

  function closeMenu(returnFocus) {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (label) label.textContent = "Menu";
    document.body.classList.remove("menu-open");
    setInert(false);
    window.setTimeout(function () {
      if (toggle.getAttribute("aria-expanded") === "false") menu.hidden = true;
    }, motion ? 450 : 0);
    if (returnFocus) toggle.focus();
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") { closeMenu(true); } else { openMenu(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") closeMenu(true);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu(false);
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (e) {
      if (e.matches && toggle.getAttribute("aria-expanded") === "true") closeMenu(false);
    });
  }

  /* ---------- Indice dei capitoli (Chi sono) ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
    /* Prima del capitolo I nessun capitolo è evidenziato */
    var intro = document.getElementById("inizio-storia");
    if (intro) spy.observe(intro);
  }

  /* ---------- Da qui in poi solo movimento ---------- */
  if (!motion) {
    root.classList.add("is-ready");
    return;
  }
  root.classList.add("motion-ok");

  /* Titolo dell'hero: le parole emergono una dopo l'altra */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var i = 0;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var parts = node.textContent.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var span = document.createElement("span");
        span.className = "w";
        span.style.setProperty("--i", i++);
        span.textContent = part;
        frag.appendChild(span);
      });
      node.parentNode.replaceChild(frag, node);
    });
    el.classList.add("split-words");
  });

  /* Linee dei simboli: si disegnano da punto a punto */
  document.querySelectorAll(".halo circle:not(.dot), .halo path").forEach(function (shape) {
    try {
      var len = Math.ceil(shape.getTotalLength());
      shape.style.setProperty("--len", len);
      shape.style.strokeDasharray = len;
    } catch (err) { /* forma non misurabile: resta com'è */ }
  });

  /* Pronto: parte l'ingresso dell'hero (una sola volta) */
  var started = false;
  function ready() {
    if (started) return;
    started = true;
    root.classList.add("is-ready");
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(ready);
    window.setTimeout(ready, 700);
  } else {
    ready();
  }

  /* Citazioni e linee: compaiono quando entrano nello schermo */
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        } else {
          /* Fuori schermo: ora può attendere la sua comparsa */
          entry.target.classList.add("is-armed");
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.1 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* Momenti legati alla lettura: la roadmap si accende, la luce della svolta cresce */
  var roadmap = document.querySelector("[data-roadmap]");
  var line = roadmap ? roadmap.querySelector(".roadmap__line") : null;
  var stages = roadmap ? Array.prototype.slice.call(roadmap.querySelectorAll(".stage")) : [];
  var lights = Array.prototype.slice.call(document.querySelectorAll("[data-light]"));
  var ticking = false;

  function clamp(v) { return Math.max(0, Math.min(1, v)); }

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    if (roadmap && line) {
      var r = line.getBoundingClientRect();
      var p = clamp((vh * 0.6 - r.top) / Math.max(1, r.height));
      line.style.setProperty("--p", p.toFixed(4));
      var reach = r.top + r.height * p;
      stages.forEach(function (stage) {
        var node = stage.querySelector(".stage__node");
        if (!node) return;
        var nr = node.getBoundingClientRect();
        stage.classList.toggle("is-lit", nr.top + nr.height / 2 <= reach + 2);
      });
    }
    lights.forEach(function (el) {
      var b = el.getBoundingClientRect();
      var t = clamp((vh - b.top) / (vh + b.height * 0.5));
      el.style.setProperty("--light", (0.15 + 0.85 * t).toFixed(3));
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  if (roadmap || lights.length) {
    if (line) line.style.setProperty("--p", "0");
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }
})();

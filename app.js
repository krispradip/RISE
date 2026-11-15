/*
 * RISE PRESENTATION — EASY CONTENT EDITING
 * Edit the initiative cards and pillar details below.
 * No build system required: index.html + styles.css + app.js.
 */
const SITE = {
  chapters: [
    { id: "home", title: "Welcome" },
    { id: "vision", title: "Our ambition" },
    { id: "pillars", title: "Our priorities" },
    { id: "initiatives", title: "Initiatives" },
    { id: "roadmap", title: "One-year roadmap" },
    { id: "outcomes", title: "Impact" },
    { id: "closing", title: "The next chapter" }
  ],
  pillars: [
    {
      id: "pillar-0", title: "Connected customer journeys", category: "PRIORITY 01",
      description: "Put the full customer journey at the centre of decisions, so teams can prevent friction rather than repeatedly handling its symptoms.",
      points: ["Map the highest-volume journeys with each business unit.", "Find unnecessary handoffs and recurring customer effort.", "Prioritize a small set of measurable journey improvements."]
    },
    {
      id: "pillar-1", title: "AI & intelligent operations", category: "PRIORITY 02",
      description: "Use practical AI and automation to help colleagues focus on the interactions that need a human touch.",
      points: ["Target repetitive work with clear human oversight.", "Pilot AI-assisted workflows where evidence supports value.", "Measure quality, adoption and actual capacity released."]
    },
    {
      id: "pillar-2", title: "Empowered colleagues", category: "PRIORITY 03",
      description: "Give teams simpler tools, relevant knowledge and confidence to resolve customer needs.",
      points: ["Surface answers in the flow of work.", "Create feedback loops from frontline teams.", "Build training and knowledge into everyday operations."]
    },
    {
      id: "pillar-3", title: "Quality & insight", category: "PRIORITY 04",
      description: "Turn conversation data into actionable insight without confusing automated assessment with verified ground truth.",
      points: ["Strengthen consistent, evidence-based quality reviews.", "Understand reasons for contact and recurring pain points.", "Use coaching and root-cause action to improve outcomes."]
    },
    {
      id: "pillar-4", title: "Simpler ways of working", category: "PRIORITY 05",
      description: "Standardize what can be standardized, remove steps that do not add value, and keep delivery practical.",
      points: ["Review process variation across relevant business units.", "Simplify approvals and manual activities.", "Scale proven improvements with clear ownership."]
    }
  ],
  initiatives: [
    {
      id: "qa", category: "AI", title: "Intelligent Quality", subtitle: "Evidence-led quality assessment across customer interactions.",
      status: "Capability showcase", description: "A combined approach to deterministic checks and AI-supported evaluation can help teams review more interactions consistently, while clearly flagging uncertainty.",
      points: ["Scoring against governed criteria", "Agent and team coaching opportunities", "Traceable evidence and reviewer controls"],
      url: "" // Optional: insert a reviewed, approved demo URL.
    },
    {
      id: "service", category: "Experience", title: "Colleague Service Hub", subtitle: "A clearer view of performance, knowledge and action.",
      status: "Capability showcase", description: "A connected workspace can bring relevant performance, training and operational context closer to colleagues.",
      points: ["Personalized performance views", "Training and knowledge progression", "Business-unit visibility based on role"],
      url: ""
    },
    {
      id: "audio", category: "AI", title: "Conversation Intelligence", subtitle: "Transform interactions into useful operational insight.",
      status: "Concept / prototype", description: "Audio transcription and structured summaries can reduce manual effort and make interaction information easier to explore.",
      points: ["Timestamped transcripts with speaker attribution", "Structured reasons for contact and actions", "Evidence-linked operational insights"],
      url: ""
    },
    {
      id: "journey", category: "Experience", title: "Connected Journeys", subtitle: "Less switching, fewer handoffs, better resolution.",
      status: "Opportunity area", description: "Orchestrate the right backend services around the customer journey instead of expecting every journey to follow a rigid, linear sequence.",
      points: ["Journey mapping with business teams", "Simpler orchestration across existing systems", "Clear ownership of end-to-end resolution"],
      url: ""
    },
    {
      id: "process", category: "Operations", title: "Process Simplification", subtitle: "Take complexity out of everyday operations.",
      status: "One-year focus", description: "Work with Retail, VOX, AMBU and other relevant teams to choose high-volume processes that can be improved within one year.",
      points: ["Identify high-effort activities", "Remove unnecessary handoffs and manual steps", "Define before-and-after measures"],
      url: ""
    },
    {
      id: "insight", category: "Operations", title: "Demand & Root Cause", subtitle: "Fix what drives unnecessary contacts.",
      status: "Opportunity area", description: "Use contact reasons, feedback and repeated issues to identify where action outside the contact centre can prevent demand.",
      points: ["Contact reason taxonomy", "Recurring issue prioritization", "Closed-loop action tracking"],
      url: ""
    }
  ]
};
(() => {
  "use strict";
  const byId = id => document.getElementById(id);
  const chapterIds = SITE.chapters.map(ch => ch.id);
  let current = "home";
  let lastFocused = null;
  const detailDialog = byId("detail-dialog");
  const jumpDialog = byId("jump-dialog");
  const dialogs = [detailDialog, jumpDialog];
  const detailMap = new Map([...SITE.pillars, ...SITE.initiatives].map(item => [item.id, item]));
  const allViews = [...document.querySelectorAll("[data-view]")];
  function isDialogOpen() { return dialogs.some(d => !d.hidden); }
  function closeDialogs() {
    let hadOpen = false;
    for (const dialog of dialogs) if (!dialog.hidden) { dialog.hidden = true; hadOpen = true; }
    if (hadOpen && lastFocused && document.contains(lastFocused)) lastFocused.focus();
    lastFocused = null;
    document.body.classList.remove("dialog-open");
  }
  function openDialog(dialog) {
    closeDialogs();
    lastFocused = document.activeElement;
    dialog.hidden = false;
    document.body.classList.add("dialog-open");
    const focusable = dialog.querySelector("[data-close], .jump-link");
    if (focusable) focusable.focus();
  }
  function navigateTo(id, replace = false) {
    if (!chapterIds.includes(id)) return;
    closeDialogs();
    current = id;
    allViews.forEach(view => {
      const active = view.dataset.view === id;
      view.classList.toggle("is-active", active);
      view.hidden = !active;
      view.setAttribute("aria-hidden", String(!active));
    });
    const index = chapterIds.indexOf(id);
    byId("current-number").textContent = String(index).padStart(2, "0");
    byId("total-number").textContent = String(chapterIds.length - 1).padStart(2, "0");
    byId("current-name").textContent = SITE.chapters[index].title;
    byId("dock-progress-fill").style.width = (index / (chapterIds.length - 1) * 100) + "%";
    document.querySelectorAll(".topnav [data-go]").forEach(btn => {
      const active = btn.dataset.go === id;
      btn.classList.toggle("is-current", active);
      if (active) btn.setAttribute("aria-current", "page"); else btn.removeAttribute("aria-current");
    });
    byId("prev-screen").disabled = index === 0;
    byId("next-screen").disabled = index === chapterIds.length - 1;
    document.title = "RISE | " + SITE.chapters[index].title;
    if (replace) history.replaceState(null, "", "#" + id);
    else if (location.hash !== "#" + id) history.pushState(null, "", "#" + id);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function move(offset) {
    const i = Math.max(0, Math.min(chapterIds.length - 1, chapterIds.indexOf(current) + offset));
    navigateTo(chapterIds[i]);
  }
  function openDetail(id) {
    const info = detailMap.get(id);
    if (!info) return;
    byId("detail-category").textContent = "RISE / " + info.category;
    byId("detail-title").textContent = info.title;
    byId("detail-description").textContent = info.description;
    const container = byId("detail-facts");
    container.replaceChildren();
    for (const point of info.points || []) {
      const row = document.createElement("div"); row.className = "fact-row";
      const check = document.createElement("span"); check.className = "fact-check"; check.textContent = "✦";
      const body = document.createElement("span"); body.textContent = point;
      row.append(check, body); container.append(row);
    }
    if (info.url) {
      try {
        const u = new URL(info.url);
        if (u.protocol === "https:" || u.protocol === "http:") {
          const row = document.createElement("div"); row.className = "fact-row";
          const link = document.createElement("a");
          link.href = u.href; link.target = "_blank"; link.rel = "noopener noreferrer";
          link.textContent = "Open approved demo ↗"; link.className = "text-link";
          row.append(link); container.append(row);
        }
      } catch (_err) { /* Invalid optional URL is ignored. */ }
    }
    openDialog(detailDialog);
  }
  const initiativeGrid = byId("initiative-grid");
  function renderInitiatives(filter = "all") {
    initiativeGrid.replaceChildren();
    const selected = SITE.initiatives.filter(item => filter === "all" || item.category === filter);
    for (const item of selected) {
      const card = document.createElement("button"); card.type = "button";
      card.className = "initiative-card"; card.dataset.detail = item.id;
      const category = document.createElement("span"); category.className = "initiative-category"; category.textContent = item.category;
      const arrow = document.createElement("span"); arrow.className = "initiative-open"; arrow.textContent = "↗"; arrow.setAttribute("aria-hidden", "true");
      const title = document.createElement("h3"); title.textContent = item.title;
      const description = document.createElement("p"); description.textContent = item.subtitle;
      const status = document.createElement("span"); status.className = "initiative-status"; status.textContent = item.status + " · EXPLORE";
      card.append(category, arrow, title, description, status); initiativeGrid.append(card);
    }
  }
  function openJump() {
    const container = byId("jump-links"); container.replaceChildren();
    SITE.chapters.forEach((ch, i) => {
      const button = document.createElement("button"); button.type = "button"; button.className = "jump-link"; button.dataset.go = ch.id;
      const number = document.createElement("span"); number.textContent = String(i).padStart(2, "0");
      const label = document.createElement("span"); label.textContent = ch.title;
      const arrow = document.createElement("span"); arrow.textContent = "↗";
      button.append(number, label, arrow); container.append(button);
    });
    openDialog(jumpDialog);
  }
  document.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) {
      if (e.target.classList.contains("dialog-backdrop")) closeDialogs();
      return;
    }
    if (btn.hasAttribute("data-close")) { closeDialogs(); return; }
    if (btn.dataset.go) { navigateTo(btn.dataset.go); return; }
    if (btn.dataset.detail) { openDetail(btn.dataset.detail); return; }
    if (btn.dataset.filter) {
      const f = btn.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach(other => {
        const active = other === btn; other.classList.toggle("is-selected", active); other.setAttribute("aria-pressed", String(active));
      });
      renderInitiatives(f); return;
    }
  });
  byId("prev-screen").addEventListener("click", () => move(-1));
  byId("next-screen").addEventListener("click", () => move(1));
  for (const id of ["jump-open", "home-menu", "dock-jump"]) byId(id).addEventListener("click", openJump);
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    } catch (error) { console.warn("Fullscreen unavailable:", error); }
  }
  byId("fullscreen").addEventListener("click", fullscreen);
  document.addEventListener("keydown", e => {
    const target = e.target;
    if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
    if (e.key === "Escape" && isDialogOpen()) { e.preventDefault(); closeDialogs(); return; }
    if (isDialogOpen()) {
      if (e.key === "Tab") {
        const dialog = dialogs.find(d => !d.hidden);
        const nodes = [...dialog.querySelectorAll('button:not([disabled]),a[href]')];
        if (nodes.length) {
          const first = nodes[0], last = nodes[nodes.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
      return;
    }
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); move(1); }
    if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); move(-1); }
    if (e.key.toLowerCase() === "f" && !e.altKey && !e.ctrlKey && !e.metaKey) { e.preventDefault(); fullscreen(); }
    if (e.key.toLowerCase() === "g" && !e.altKey && !e.ctrlKey && !e.metaKey) { e.preventDefault(); openJump(); }
  });
  window.addEventListener("popstate", () => navigateTo(location.hash.replace(/^#/, "") || "home", true));
  renderInitiatives();
  navigateTo(location.hash.replace(/^#/, "") || "home", true);
})();
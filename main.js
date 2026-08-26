// ============================================
// Mobile nav toggle
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("open");
      toggle.classList.toggle("open");
    });
  }
});

// ============================================
// Everything below waits for CMS content to load first
// (falls back to data.js arrays if the CMS has no entries yet)
// ============================================
document.addEventListener("DOMContentLoaded", async function () {
  if (window.cmsDataReady) {
    await window.cmsDataReady;
  }

  // ============================================
  // Scroll fade-in (Intersection Observer)
  // ============================================
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // ============================================
  // Render upcoming matches (index.html + schedule.html)
  // ============================================
  const matchList = document.getElementById("match-list");
  if (matchList && typeof matches !== "undefined") {
    const now = new Date();
    const upcoming = matches
      .filter((m) => new Date(m.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const limit = matchList.dataset.limit ? parseInt(matchList.dataset.limit) : upcoming.length;
    const toShow = upcoming.slice(0, limit);

    if (toShow.length === 0) {
      matchList.innerHTML = '<p class="empty-state">No upcoming matches scheduled yet. Check back soon.</p>';
    } else {
      matchList.innerHTML = toShow
        .map((m) => {
          const d = new Date(m.date);
          const dateStr = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
          const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          return `
            <div class="match-card reveal visible">
              <div class="match-date">
                <span class="match-date-day">${dateStr}</span>
                <span class="match-date-time">${timeStr}</span>
              </div>
              <div class="match-info">
                <span class="match-vs">vs ${m.opponent}</span>
                <span class="match-location">${m.location}</span>
              </div>
            </div>`;
        })
        .join("");
    }
  }

  // ============================================
  // Render past results (schedule.html)
  // ============================================
  const resultsList = document.getElementById("results-list");
  if (resultsList && typeof matches !== "undefined") {
    const played = matches
      .filter((m) => m.result !== null && m.result !== "")
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (played.length === 0) {
      resultsList.innerHTML = '<p class="empty-state">No results yet — the season is just getting started.</p>';
    } else {
      resultsList.innerHTML = played
        .map((m) => {
          const d = new Date(m.date);
          const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          const isWin = m.result.startsWith("W");
          return `
            <div class="result-card reveal visible">
              <span class="result-badge ${isWin ? "win" : "loss"}">${m.result}</span>
              <div class="match-info">
                <span class="match-vs">vs ${m.opponent}</span>
                <span class="match-location">${dateStr} · ${m.location}</span>
              </div>
            </div>`;
        })
        .join("");
    }
  }

  // ============================================
  // Render news (index.html + news.html)
  // ============================================
  const newsList = document.getElementById("news-list");
  if (newsList && typeof news !== "undefined") {
    const limit = newsList.dataset.limit ? parseInt(newsList.dataset.limit) : news.length;
    const toShow = news.slice(0, limit);
    newsList.innerHTML = toShow
      .map((n) => {
        const d = new Date(n.date);
        const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return `
          <div class="news-card reveal visible">
            <span class="news-date">${dateStr}</span>
            <h3 class="news-title">${n.title}</h3>
            <p class="news-body">${n.body}</p>
          </div>`;
      })
      .join("");
  }

  // ============================================
  // Render trial dates (trials.html)
  // ============================================
  const trialsList = document.getElementById("trials-list");
  if (trialsList && typeof trials !== "undefined") {
    const now = new Date();
    const upcoming = trials.filter((t) => new Date(t.date) > now);
    if (upcoming.length === 0) {
      trialsList.innerHTML = '<p class="empty-state">No trial dates open right now. Check back soon or contact us to be notified.</p>';
    } else {
      trialsList.innerHTML = upcoming
        .map((t) => {
          const d = new Date(t.date);
          const dateStr = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
          const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          return `
            <div class="trial-card reveal visible">
              <div class="trial-date-badge">
                <span>${dateStr}</span>
                <span class="trial-time">${timeStr}</span>
              </div>
              <p class="trial-location"><strong>Location:</strong> ${t.location}</p>
              <p class="trial-notes">${t.notes}</p>
            </div>`;
        })
        .join("");
    }
  }
});

// ============================================
// Loads matches/news/trials created via the CMS (admin panel)
// Falls back to the hardcoded arrays in data.js if nothing is found yet
// or if the fetch fails (e.g. offline, rate-limited).
// ============================================

const CMS_REPO = "igshreyxn/Presidency-Football";
const CMS_BRANCH = "main";

async function fetchCmsFolder(folderName) {
  const listUrl = `https://api.github.com/repos/${CMS_REPO}/contents/content/${folderName}?ref=${CMS_BRANCH}`;
  try {
    const res = await fetch(listUrl);
    if (!res.ok) return null; // folder doesn't exist yet, or rate-limited
    const files = await res.json();
    if (!Array.isArray(files)) return null;

    const jsonFiles = files.filter((f) => f.name.endsWith(".json"));
    const contents = await Promise.all(
      jsonFiles.map(async (f) => {
        try {
          const fileRes = await fetch(f.download_url);
          return await fileRes.json();
        } catch (e) {
          return null;
        }
      })
    );
    return contents.filter((c) => c !== null);
  } catch (e) {
    return null; // network error — caller will fall back to data.js
  }
}

// Kicks off immediately when this script loads, so both main.js and
// countdown.js can just `await window.cmsDataReady` before rendering.
window.cmsDataReady = (async function loadCmsContent() {
  const [cmsMatches, cmsNews, cmsTrials] = await Promise.all([
    fetchCmsFolder("matches"),
    fetchCmsFolder("news"),
    fetchCmsFolder("trials"),
  ]);

  // Only override the fallback arrays if the CMS actually returned entries.
  // This keeps the placeholder content showing until real entries are published.
  if (cmsMatches && cmsMatches.length > 0) {
    matches.length = 0;
    matches.push(...cmsMatches);
  }
  if (cmsNews && cmsNews.length > 0) {
    news.length = 0;
    news.push(...cmsNews.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }
  if (cmsTrials && cmsTrials.length > 0) {
    trials.length = 0;
    trials.push(...cmsTrials);
  }
})();

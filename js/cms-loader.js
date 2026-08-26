const CMS_REPO = "igshreyxn/Presidency-Football";
const CMS_BRANCH = "main";

async function fetchCmsFolder(folderName) {
  const listUrl = `https://api.github.com/repos/${CMS_REPO}/contents/content/${folderName}?ref=${CMS_BRANCH}`;
  try {
    const res = await fetch(listUrl);
    if (!res.ok) return null;
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
    return null;
  }
}

window.cmsDataReady = (async function loadCmsContent() {
  const [cmsMatches, cmsNews, cmsTrials, cmsTeam] = await Promise.all([
    fetchCmsFolder("matches"),
    fetchCmsFolder("news"),
    fetchCmsFolder("trials"),
    fetchCmsFolder("team"),
  ]);

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
  if (cmsTeam && cmsTeam.length > 0) {
    window.teamMembers = cmsTeam.sort((a, b) => (a.order || 99) - (b.order || 99));
  } else {
    window.teamMembers = [];
  }
})();

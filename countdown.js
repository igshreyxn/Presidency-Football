// Finds the next upcoming match and counts down to it on the scoreboard

function getNextMatch() {
  const now = new Date();
  const upcoming = matches
    .filter(m => new Date(m.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  return upcoming.length ? upcoming[0] : null;
}

function pad(num) {
  return String(num).padStart(2, "0");
}

function updateCountdown() {
  const next = getNextMatch();
  const opponentEl = document.getElementById("scoreboard-opponent");
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");
  const locationEl = document.getElementById("scoreboard-location");

  if (!next) {
    opponentEl.textContent = "NO MATCH SCHEDULED YET";
    locationEl.textContent = "Check back soon";
    daysEl.textContent = "--";
    hoursEl.textContent = "--";
    minsEl.textContent = "--";
    secsEl.textContent = "--";
    return;
  }

  opponentEl.textContent = "VS " + next.opponent.toUpperCase();
  locationEl.textContent = next.location;

  const target = new Date(next.date).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minsEl.textContent = "00";
    secsEl.textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minsEl.textContent = pad(mins);
  secsEl.textContent = pad(secs);
}

document.addEventListener("DOMContentLoaded", function () {
  const scoreboard = document.getElementById("scoreboard-opponent");
  if (scoreboard) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});

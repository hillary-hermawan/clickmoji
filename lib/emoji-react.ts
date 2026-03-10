import { REACT_EMOJIS } from "./game-data";

export function spawnEmojiReact(x: number, y: number) {
  const count = 4 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement("span");
      el.className = "emoji-react";
      el.textContent =
        REACT_EMOJIS[Math.floor(Math.random() * REACT_EMOJIS.length)];
      const drift = Math.random() * 40 - 20;
      el.style.setProperty("--drift", drift + "px");
      el.style.left = x - 12 + Math.random() * 30 - 15 + "px";
      el.style.top = y - 12 + "px";
      el.style.fontSize = 18 + Math.random() * 10 + "px";
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }, i * 80);
  }
}

export function launchConfetti() {
  const layer = document.createElement("div");
  layer.style.cssText =
    "position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;overflow:hidden;z-index:9999";
  document.body.appendChild(layer);
  const colors = [
    "#E8434A", "#F5A623", "#4CAF50", "#2196F3",
    "#9C27B0", "#FF6B35", "#FFD700", "#E91E63",
  ];
  const celebEmoji = ["🎉", "🥳", "✨", "🎊", "👑", "🏆", "⭐", "💫", "🌟"];
  const count = 60;
  const emojiCount = 18;
  const total = count + emojiCount;
  const vh = window.innerHeight;
  let done = 0;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "%";
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.width = 6 + Math.random() * 8 + "px";
      c.style.height = 6 + Math.random() * 8 + "px";
      c.style.setProperty("--fall-dist", vh + 100 + "px");
      c.style.setProperty("--sway", Math.random() * 120 - 60 + "px");
      c.style.setProperty("--spin", Math.random() * 1080 - 540 + "deg");
      c.style.setProperty("--fall-dur", 4 + Math.random() * 3 + "s");
      c.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      layer.appendChild(c);
      c.addEventListener("animationend", () => {
        c.remove();
        done++;
        if (done >= total) layer.remove();
      });
    }, i * 40);
  }

  for (let i = 0; i < emojiCount; i++) {
    setTimeout(() => {
      const e = document.createElement("span");
      e.className = "confetti-emoji";
      e.textContent = celebEmoji[Math.floor(Math.random() * celebEmoji.length)];
      e.style.left = Math.random() * 100 + "%";
      e.style.fontSize = 28 + Math.random() * 20 + "px";
      e.style.setProperty("--fall-dist", vh + 100 + "px");
      e.style.setProperty("--sway", Math.random() * 100 - 50 + "px");
      e.style.setProperty("--spin", Math.random() * 360 - 180 + "deg");
      e.style.setProperty("--fall-dur", 5 + Math.random() * 3 + "s");
      layer.appendChild(e);
      e.addEventListener("animationend", () => {
        e.remove();
        done++;
        if (done >= total) layer.remove();
      });
    }, i * 120);
  }
}

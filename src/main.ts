const urlPattern = /https?:\/\/www\.youtube\.(com|de)\/watch\?v=[0-9A-Za-z_-]*/;
let active = false;

// Check if on video page and active or deactivate speed controls
console.log("[YT2X]: Started!");

setInterval(async () => {
  if (urlPattern.test(window.location.href)) {
    !active && (await activate());
  } else {
    active && (await deactivate());
  }
}, 10);

let videoElm: HTMLVideoElement | null = null;
async function activate() {
  if (active) return;

  // Get the video element
  videoElm = document.querySelector(
    `#movie_player > div.html5-video-container > video`
  ) as HTMLVideoElement;
  if (!videoElm) return;
  setRate(1.0);

  // Attach event listeners
  videoElm?.addEventListener("ratechange", onRateChanged);
  document.body.addEventListener("keydown", onKeyDown);
  document.body.addEventListener("keyup", onKeyUp);

  active = true;
  console.log("[YT2X]: Activated!");
}

async function deactivate() {
  if (!activate) return;

  // Remove event listeners
  videoElm?.removeEventListener("ratechange", onRateChanged);
  document.body.removeEventListener("keydown", onKeyDown);
  document.body.removeEventListener("keyup", onKeyUp);

  active = false;
  console.log("[YT2X]: Deactivated!");
}

function onRateChanged() {
  if (!videoElm) return;
  videoElm.playbackRate = rate;
  console.log(`[YT2X]: rate: ${rate} | realRate: ${videoElm.playbackRate}`);
  updateRateBanner(String(videoElm.playbackRate) + "💨");
}

let boostTimeout: null | number = null;
let isSpacePressed = false;
let isBoosted = false;
function onKeyDown(event: { key: string }) {
  // console.log(`[YT2X]: keydown: ${event.key}`);
  switch (event.key) {
    case ">":
      setRate(rate + 0.25);
      break;
    case "<":
      setRate(rate - 0.25);
      break;
    case " ":
      if (isSpacePressed) return;

      isSpacePressed = true;
      if (boostTimeout) {
        clearInterval(boostTimeout);
      }
      boostTimeout = setTimeout(() => {
        if (isSpacePressed) {
          setRate(2.5);
          isBoosted = true;
        }
        boostTimeout = null;
      }, 350);
      break;
  }
}

function onKeyUp(event: { key: string }) {
  // console.log(`[YT2X]: keyup: ${event.key}`);
  switch (event.key) {
    case " ":
      isSpacePressed = false;
      if (isBoosted) {
        setRate(1.0);
        isBoosted = false;
      }
      break;
  }
}

let rate = 1.0;
function setRate(newRate: number) {
  if (!videoElm) return;
  rate = newRate > 0.25 ? newRate : 0.25;
  videoElm.playbackRate = rate;
}

function updateRateBanner(value: string) {
  const rateElm = document.querySelectorAll<HTMLDivElement>(
    `#movie_player > * > div.ytp-bezel-text-wrapper > div`
  )[0] as HTMLDivElement;
  if (!rateElm) return;
  rateElm.innerText = value;
}

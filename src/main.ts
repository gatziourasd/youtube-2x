console.log("YouTube-4x started!");

let playbackRate: number | null = null;
let videoElm: HTMLVideoElement | null = null;
let active = false;

const urlPattern = /https?:\/\/www\.youtube\.(com|de)\/watch\?v=[0-9A-Za-z_-]*/;

setInterval(() => {
  if (urlPattern.test(window.location.href)) {
    !active && activate("");
  } else {
    active && deactivate();
  }
}, 10);

async function activate(channelName: string) {
  injectControls();

  videoElm = (await waitFor(
    `#movie_player > div.html5-video-container > video`
  )) as HTMLVideoElement;
  if (playbackRate === null) {
    playbackRate = videoElm.playbackRate;
  } else {
    videoElm.playbackRate = playbackRate;
  }
  videoElm.addEventListener("ratechange", onRateChanged);
  document.body.addEventListener("keydown", onKeyDown);
}

function deactivate() {
  active = false;
  videoElm?.removeEventListener("ratechange", onRateChanged);
  document.body.removeEventListener("keydown", onKeyDown);
  removeControls();
}

function onRateChanged(event?: Event) {
  console.log("Video Speed: " + videoElm?.playbackRate);
  console.log("Speed: " + playbackRate);
  const newRate = videoElm?.playbackRate;
  if (!newRate || !playbackRate || !videoElm) return;
  videoElm.playbackRate = playbackRate;
  updateRateBanner();
}

function onKeyDown(event: { key: string }) {
  if (playbackRate) {
    if (event.key === ">" && playbackRate < 5.0) {
      playbackRate += 0.25;
      onRateChanged();
    } else if (event.key === "<" && playbackRate > 0.25) {
      playbackRate -= 0.25;
      onRateChanged();
    }
  }
}

function updateRateBanner() {
  const rateElm = document.querySelector<HTMLDivElement>(
    `#movie_player > div:nth-child(9) > div.ytp-bezel-text-wrapper > div`
  ) as HTMLDivElement;
  if (!rateElm) return;
  rateElm.innerText = String(playbackRate) + "x";
}

async function injectControls() {}

function removeControls() {}
function waitFor(selector: string) {
  return new Promise((resolve) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) return resolve(element);

    const pageObserver = new MutationObserver(() => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        resolve(element);
        pageObserver.disconnect();
      }
    });

    pageObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

console.log("youtube-4x is running");

let videoElm = null;
let channelName = null;
let pageObserver = null;

let active = false;

(async () => {
  "use strict";
  waitForPage();
  window.onload = observeUrlChange;
})();

function waitForPage() {
  pageObserver = new MutationObserver(() => {
    const videoElement = document.querySelector(
      `#movie_player > div.html5-video-container > video`
    );
    const channelNameElement = document.querySelector(`#text > a`);
    if (
      !active &&
      videoElement &&
      channelNameElement &&
      window.location.href.match(/www\.youtube\.com\/watch\?v=/)
    ) {
      videoElm = videoElement;
      channelName = channelNameElement.innerText;
      activate();
    } else if (active && !(videoElement && channelNameElement)) {
      deactivate();
    }
  });

  pageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function activate() {
  active = true;
  alert(channelName);
}

function deactivate() {
  active = false;
  videoElm = null;
  channelName = null;
  alert("deactov");
}

function observeWindowLocation() {
  let oldHref = document.location.href;
  const pageObserver = new MutationObserver((mutations) => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      onLocationChange(oldHref);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function onLocationChange(href) {
    
}

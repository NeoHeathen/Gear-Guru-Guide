const canonicalOrigin = "https://gearguruguide.com";

function updateOgUrl() {
  const path = window.location.pathname === "/" ? "/" : window.location.pathname.replace(/\/+$/u, "");
  const url = `${canonicalOrigin}${path}`;
  let element = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", "og:url");
    document.head.appendChild(element);
  }
  element.content = url;
}

export function installOgUrlSync() {
  updateOgUrl();
  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);

  history.pushState = (...args) => {
    originalPushState(...args);
    updateOgUrl();
  };
  history.replaceState = (...args) => {
    originalReplaceState(...args);
    updateOgUrl();
  };
  window.addEventListener("popstate", updateOgUrl);
}

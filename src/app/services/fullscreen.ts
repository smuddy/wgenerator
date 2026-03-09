const elem = document.documentElement;

export const openFullscreen = () => {
  if (!elem.requestFullscreen || !document.fullscreenEnabled) {
    return;
  }

  try {
    const promise = elem.requestFullscreen();
    if (promise && typeof promise.catch === 'function') {
      void promise.catch(() => {
        // Browser may reject when no user gesture is present. Keep app usable.
      });
    }
  } catch {
    // Some browsers may throw synchronously if fullscreen is not allowed.
  }
};

export const closeFullscreen = () => {
  if (document.exitFullscreen) {
    const promise = document.exitFullscreen();
    if (promise && typeof promise.catch === 'function') {
      void promise.catch(() => {
        // Ignore; leaving fullscreen is a best-effort action.
      });
    }
  }
};

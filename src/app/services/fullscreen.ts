const elem = document.documentElement;

export const openFullscreen = () => {
  if (!elem.requestFullscreen || !document.fullscreenEnabled) {
    return;
  }

  try {
    void elem.requestFullscreen().catch(() => {
      // Browser may reject when no user gesture is present. Keep app usable.
    });
  } catch {
    // Some browsers may throw synchronously if fullscreen is not allowed.
  }
};

export const closeFullscreen = () => {
  if (document.exitFullscreen) {
    void document.exitFullscreen().catch(() => {
      // Ignore; leaving fullscreen is a best-effort action.
    });
  }
};

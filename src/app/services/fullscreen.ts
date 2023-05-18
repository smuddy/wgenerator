const elem = document.documentElement;

export const openFullscreen = () => {
  if (elem.requestFullscreen) {
    void elem.requestFullscreen();
  }
};

export const closeFullscreen = () => {
  if (document.exitFullscreen) {
    void document.exitFullscreen();
  }
};

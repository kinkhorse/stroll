// do da dark mode

let dark = false;

function toggleDarkMode(e) {
  dark = !dark;
  setDarkMode(dark);
}

function setDarkMode(darkMode) {
  dark = darkMode;
  window.localStorage.setItem("dark-mode",dark);
  if (dark) {
    document.querySelector("body").classList.remove("light");
    document.querySelector("body").classList.add("dark");
  } else {
    document.querySelector("body").classList.remove("dark");
    document.querySelector("body").classList.add("light");
  }
}

function loadDarkMode() {

  (function() {
    let storage = window.localStorage;

    if (storage.getItem("dark-mode") != null) {
      setDarkMode(storage.getItem("dark-mode") === "true");
    }
  }());
};

const loadingElement = document.getElementsByClassName(
  "c-global-loading-screen"
)[0];

export function showLoading() {
  loadingElement.style.display = "block";
  return Promise.resolve();
}

export function hideLoading() {
  loadingElement.style.display = "none";
  return Promise.resolve();
}

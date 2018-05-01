import {
  showLoading,
  retrieveAvailableGames,
  renderAvailableGames,
  hideLoading
} from "./bootstrap";

showLoading()
  .then(retrieveAvailableGames)
  .then(renderAvailableGames)
  .then(hideLoading)
  .catch(error => {
    console.log(error);
  });

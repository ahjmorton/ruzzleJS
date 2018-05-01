export default function(availableGames) {
  return availableGames[0].loader().then(module => module.default());
}

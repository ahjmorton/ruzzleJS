export default function() {
  return import("./json/wordlist.json").then(wordlist => {
    return import("./json/markov.json").then(markov => {
      return {
        wordlist: wordlist,
        markov: markov
      };
    });
  });
}

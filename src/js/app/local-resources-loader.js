"use strict"
require(["../../json/wordlist.json" , "../../json/markov.json", "./local-resources"],
    function (wordlist, markov, resources) {
        resources.setWordList(wordlist);
        resources.setMarkovChain(markov);
    }
);

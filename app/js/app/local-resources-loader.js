"use strict"
require(["json/wordlist.json?callback=define" , "json/markov.json?callback=define", "app/local-resources"],
    function (wordlist, markov, resources) {
        resources.setWordList(wordlist);
        resources.setMarkovChain(markov);
    }
);

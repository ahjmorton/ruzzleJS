"use strict"
require(["json/wordlist.json?callback=define", "app/local-wordlist"],
    function (data, wordlist) {
        wordlist.setWordList(data);
    }
);

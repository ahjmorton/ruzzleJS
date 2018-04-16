"use strict"

define(function() {
    var wordList = {};
    var markovChain = {};
    return {
        setWordList: function (list) {
            wordList = list;
        },
        getWordList: function () {
            return wordList;
        },
        setMarkovChain : function(chain) {
            markovChain = chain;
        },
        getMarkovChain : function () {
            return markovChain;
        }
    };
});


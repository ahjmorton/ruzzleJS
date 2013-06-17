"use strict"

define(function() {
    var wordList = {};
    return {
        setWordList: function (list) {
            wordList = list;
        },
        getWordList: function () {
            return wordList;
        }
    };
});


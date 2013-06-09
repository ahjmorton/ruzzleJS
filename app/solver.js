"use strict"
var WordList = function () {
    var wordList = {};
    var WORDLIST_URL = document.URL + "json/wordlist.json?callback=WordList.setWordList";

    return {
        updateFromServer: function () {
            var scriptNode = document.createElement("script");
            scriptNode.type = "text/javascript";
            scriptNode.src = WORDLIST_URL;
            document.head.appendChild(scriptNode);

        },
        setWordList: function (list) {
            wordList = list;
        },
        getWordList: function () {
            return wordList;
        }
    };
}();

var App = function () {
    function sublists(array, size) {
        return array.reduce(function (previousValue, nextValue, index) {
            if (index % size === 0) {
                previousValue.push([nextValue]);
            } else {
                previousValue[previousValue.length - 1].push(nextValue);
            }
            return previousValue;
        }, []);
    };

    function startWork(grid, wordListObj, resultFunc) {
        var LETTERS_PER_WORKER = 4;
        var WORDLIST_FILE = "worker.js";
        var assignments = sublists(grid, LETTERS_PER_WORKER);
        var gridToSendToWorkers = sublists(grid, 4);
        var stoppers = [];
        for (var i = 0; i < assignments.length; i++) {
            var worker = new Worker(WORDLIST_FILE);
            worker.postMessage({
                    cmd: "start",
                    grid: gridToSendToWorkers,
                    wordList: wordListObj,
                    letters: assignments[i]
                });
            worker.addEventListener('message', function (msgData) {
                resultFunc(msgData.data);
            });
            stoppers.push((function (toStop) {
                        return function () {
                            toStop.terminate();
                        }
                    })(worker));
        }
        return stoppers;
    };
    var controller = function ListHandler() {
        var WORD_LIST_ID = "wordList";
        var ACTION_BUTTON_ID = "actionButton";
        var GRID_ELEMENT_DIV = "inputGrid";
        var nodeCache = {};

        function get(nodeId) {
            if (!nodeCache.hasOwnProperty(nodeId)) {
                nodeCache[nodeId] = document.getElementById(nodeId);
            }
            return nodeCache[nodeId];
        };

        function changeActionButton(text, onClick) {
            var button = get(ACTION_BUTTON_ID);
            button.onclick = onClick;
            button.innerHTML = text;
        };

        function getGridElements() {
            var arr = new Array();
            var nodeList = get(GRID_ELEMENT_DIV).getElementsByTagName("input");
            for (var i = 0; i < nodeList.length; i++) {
                arr.push(nodeList[i]);
            }
            return arr;
        };

        function highlight(element) {
            var current = element.style.backgroundColor;
            setTimeout(function () {
                element.style.backgroundColor = current;
            }, 1000);
            element.style.backgroundColor = "red";
        };
        return {
            addResult: function (word) {
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(word));
                get(WORD_LIST_ID).appendChild(li);
            },
            clearResults: function () {
                get(WORD_LIST_ID).innerHTML = "";
            },
            changeAction: changeActionButton,
            verifyInputGrid: function (verifyFunction) {
                var toVerify = getGridElements();
                toVerify = toVerify.filter(function (element) {
                    return verifyFunction(element.value);
                });
                if (toVerify.length === 0) {
                    return true;
                } else {
                    toVerify.forEach(highlight);
                    return false;
                }
            },
            getInputGrid: function () {
                return getGridElements().map(function (element) {
                    return element.value.toLowerCase();
                });
            },
            init: function (startFunc) {
                changeActionButton("Solve", startFunc);
            }
        };
    }();

    function start() {
        controller.clearResults();
        if (controller.verifyInputGrid(function (text) {
                    return !(typeof text === 'string' && text.length === 1);
                })) {
            var theGrid = controller.getInputGrid();
            var stopFunctions = startWork(theGrid, WordList.getWordList(), (function () {
                        var seen = {};
                        return function (word) {
                            if (!seen.hasOwnProperty(word)) {
                                controller.addResult(word);
                                seen[word] = undefined;
                            }
                        };
                    }()));
            controller.changeAction("Stop", function () {
                for (var i = 0; i < stopFunctions.length; i++) {
                    var stopFunction = stopFunctions[i];
                    stopFunction();
                }
                controller.changeAction("Solve", start);
            });
        }
    };
    return {
        initModule: function () {
            controller.init(start);
            WordList.updateFromServer();
        }
    };
}();
window.onload = App.initModule;
"use strict"

var App = function () {
    var wordList = function () {
        var wordList = {};
        var WORDLIST_URL = document.URL + "json/wordlist.json?callback=App.wordListCallback";

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


    function startWork(grid, wordListObj, resultFunc) {
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
    var controller = function() {
        var WORD_LIST_ID = "wordList";
        var ACTION_BUTTON_ID = "actionButton";
        var RESET_BUTTON_ID = "resetButton";
        var GRID_ELEMENT_DIV = "inputGrid";
        var nodeCache = {};
        var gridElements = undefined;

        function get(nodeId) {
            if (!nodeCache.hasOwnProperty(nodeId)) {
                nodeCache[nodeId] = document.getElementById(nodeId);
            }
            return nodeCache[nodeId];
        };

        function changeButton(nodeId, text, onClick) {
            var button = get(nodeId);
            button.onclick = onClick;
            button.innerHTML = text;
        };

        function getGridElements() {
            if(typeof gridElements === 'undefined') {
                gridElements = new Array();
                var nodeList = get(GRID_ELEMENT_DIV).getElementsByTagName("input");
                for (var i = 0; i < nodeList.length; i++) {
                   gridElements.push(nodeList[i]);
                }
            }
            return gridElements;
        };

        function highlight(element) {
            var HIGHLIGHT_CLASS_NAME = "gridError";
            setTimeout(function () {
                var reStr = "(?:^|\\s)" + HIGHLIGHT_CLASS_NAME + "(?!\\S)";
                console.log(reStr);
                var re = new RegExp(reStr, "g");
                element.className = element.className.replace(re, '');
            }, 1000);
            element.className = element.className + " " + HIGHLIGHT_CLASS_NAME; 
        };

        function resetInputs() {
            getGridElements().forEach(function(element) {
                element.value = '';
            });
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
            changeAction: function() {
                 return function(text, onClick) {
                     changeButton(ACTION_BUTTON_ID, text, onClick);
                 };
            }(),
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
            disableResetButton : function() {
                get(RESET_BUTTON_ID).disabled = true;
            },
            enableResetButton : function() {
                get(RESET_BUTTON_ID).disabled = false;
            },
            getInputGrid: function () {
                return getGridElements().map(function (element) {
                    return element.value.toLowerCase();
                });
            },
            init: function (startFunc) {
                changeButton(ACTION_BUTTON_ID, "Solve", startFunc);
                changeButton(RESET_BUTTON_ID, "Reset", resetInputs);
            }
        };
    }();

    function start() {
        if (controller.verifyInputGrid(function (text) {
                    return !(typeof text === 'string' && text.length === 1);
                })) {
            controller.disableResetButton();
            var theGrid = controller.getInputGrid();
            controller.clearResults();
            var stopFunctions = startWork(theGrid, wordList.getWordList(), (function () {
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
                controller.enableResetButton();
                controller.changeAction("Solve", start);
            });
        }
    };
    return {
        initModule: function () {
            controller.init(start);
            wordList.updateFromServer();
        },
        wordListCallback : function(list) {
            wordList.setWordList(list);
        }
    };
}();
window.onload = App.initModule;

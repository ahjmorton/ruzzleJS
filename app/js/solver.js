"use strict"

var App = function () {
    var wordList = function () {
        var wordList = {};
        var WORDLIST_URL = document.URL + "json/wordlist.json?callback=";

        return {
            init: function (callbackName) {
                var scriptNode = document.createElement("script");
                scriptNode.type = "text/javascript";
                scriptNode.src = WORDLIST_URL + callbackName;
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

    var solver = function() {
        var LETTERS_PER_WORKER = 4;
        var WORDLIST_FILE = "worker.js";
        var stoppers = {}
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
        return {
            startWork: function(grid, wordListObj, resultFunc, stopFunc) {
                resultFunc = resultFunc || function () {};
                stopFunc = stopFunc || function() {};
                var assignments = sublists(grid, LETTERS_PER_WORKER);
                var gridToSendToWorkers = sublists(grid, 4);
                var results = {};
                stoppers = {};
                for (var i = 0; i < assignments.length; i++) {
                    var worker = new Worker(WORDLIST_FILE);
                    worker.postMessage({
                        cmd: "start",
                        grid: gridToSendToWorkers,
                        wordList: wordListObj,
                        letters: assignments[i]
                    });
                    var cleanup = function(workerId) {
                        return function() {
                            delete stoppers[workerId];
                            stopFunc(workerId, Object.keys(stoppers));
                        };
                    }(i);
                    worker.addEventListener('message', function(cleanupFunc) {
                        return function(msgData)  {
                            msgData = msgData.data;
                            switch(msgData.cmd) {
                                case "result" :
                                    resultFunc(msgData.word);
                                    break;
                                case "closing" :
                                    cleanupFunc();
                                    break;
                            }
                        }
                    }(cleanup));
                    stoppers[i] = function(toClose, cleanupFunc) {
                        return function () {
                            toClose.terminate();
                            cleanupFunc();
                        };
                    }(worker, cleanup);
                    results[i] = assignments[i];
                 }
                 return results;
            },
            stopWork: function() {
                for(var prop in stoppers) {
                    stoppers[prop]();
                }
            }
        };
    }();
    var controller = function() {
        var WORD_LIST_ID = "wordList";
        var STATUS_LIST_ID = "statusList";
        var ACTION_BUTTON_ID = "actionButton";
        var RESET_BUTTON_ID = "resetButton";
        var GRID_ELEMENT_DIV = "inputGrid";
        var nodeCache = {};
        var statusLines = {};
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
            addStatusLine : function (statusId, text) {
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(text));
                get(STATUS_LIST_ID).appendChild(li);
                statusLines[statusId] = li;
            },
            markStatusAsComplete : function(statusId) {
                var STATUS_COMPLETE_NAME = "completed";
                statusLines[statusId].className = statusLines[statusId].className + " " + STATUS_COMPLETE_NAME;
            },
            clearStatus : function () {
                get(STATUS_LIST_ID).innerHTML = "";
                statusLines = {};
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
    function noDups(fn) {
        var seen = {};
        return function(item) {
            if(!seen.hasOwnProperty(item)) {
                fn(item);
                seen[item] = undefined;
            }
        };
    };
    function start() {
        function whenDone() {
            solver.stopWork();
            controller.enableResetButton();
            controller.changeAction("Solve", start);
        };
        if (controller.verifyInputGrid(function (text) {
                    return !(typeof text === 'string' && text.length === 1);
                })) {
            controller.disableResetButton();
            var theGrid = controller.getInputGrid();
            controller.clearResults();
            controller.clearStatus();
            var assignments = solver.startWork(theGrid, wordList.getWordList(),
                 noDups(controller.addResult),
                 function(workerId, workersLeft) {
                    controller.markStatusAsComplete(workerId);
                    if(typeof workersLeft === 'undefined' || workersLeft.length === 0) {
                        whenDone();
                    }
                 }
            );
            Object.keys(assignments).forEach(function(workerId) {
                 controller.addStatusLine(workerId, "" + workerId + "[" + assignments[workerId].join() + "]");
            });
            controller.changeAction("Stop", whenDone);
        }
    };
    return {
        initModule: function () {
            controller.init(start);
            wordList.init("App.wordListCallback");
        },
        wordListCallback : function(list) {
            wordList.setWordList(list);
        }
    };
}();
window.onload = App.initModule;

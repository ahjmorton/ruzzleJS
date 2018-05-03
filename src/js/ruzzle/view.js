import "./ruzzle.less";
import html from "./ruzzle.html";

define(function() {
  var CONTAINER = "container";
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
  }

  function changeButton(nodeId, text, onClick) {
    var button = get(nodeId);
    button.onclick = onClick;
    button.innerHTML = text;
  }

  function getGridElements() {
    if (typeof gridElements === "undefined") {
      gridElements = new Array();
      var nodeList = get(GRID_ELEMENT_DIV).getElementsByTagName("input");
      for (var i = 0; i < nodeList.length; i++) {
        gridElements.push(nodeList[i]);
      }
    }
    return gridElements;
  }

  function highlight(element) {
    var HIGHLIGHT_CLASS_NAME = "gridError";
    setTimeout(function() {
      var reStr = "(?:^|\\s)" + HIGHLIGHT_CLASS_NAME + "(?!\\S)";
      var re = new RegExp(reStr, "g");
      element.className = element.className.replace(re, "");
    }, 1000);
    element.className = element.className + " " + HIGHLIGHT_CLASS_NAME;
  }

  function resetInputs() {
    getGridElements().forEach(function(element) {
      element.value = "";
    });
  }
  return {
    addResult: function(word) {
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(word));
      get(WORD_LIST_ID).appendChild(li);
    },
    addStatusLine: function(statusId, text) {
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(text));
      get(STATUS_LIST_ID).appendChild(li);
      statusLines[statusId] = li;
    },
    markStatusAsComplete: function(statusId) {
      var STATUS_COMPLETE_NAME = "completed";
      statusLines[statusId].className =
        statusLines[statusId].className + " " + STATUS_COMPLETE_NAME;
    },
    clearStatus: function() {
      get(STATUS_LIST_ID).innerHTML = "";
      statusLines = {};
    },
    clearResults: function() {
      get(WORD_LIST_ID).innerHTML = "";
    },
    changeAction: (function() {
      return function(text, onClick) {
        changeButton(ACTION_BUTTON_ID, text, onClick);
      };
    })(),
    verifyInputGrid: function(verifyFunction) {
      var toVerify = getGridElements();
      toVerify = toVerify.filter(function(element) {
        return verifyFunction(element.value);
      });
      if (toVerify.length === 0) {
        return true;
      } else {
        toVerify.forEach(highlight);
        return false;
      }
    },
    disableResetButton: function() {
      get(RESET_BUTTON_ID).disabled = true;
    },
    enableResetButton: function() {
      get(RESET_BUTTON_ID).disabled = false;
    },
    getInputGrid: function() {
      return getGridElements().map(function(element) {
        return element.value.toLowerCase();
      });
    },
    init: function(startFunc) {
      get(CONTAINER).innerHTML = html;
      changeButton(ACTION_BUTTON_ID, "Solve", startFunc);
      changeButton(RESET_BUTTON_ID, "Reset", resetInputs);
    }
  };
});

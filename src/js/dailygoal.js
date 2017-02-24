'use strict';

/* eslint-disable no-param-reassign */

// MAX_WIDTH of Bootstrap is 12 columns.
var MAX_WIDTH = 12;

// Maximum level.
var MAX_LEVEL = 4;

// Use date as key to database.
var dateKey = "";

/* JSON-formated data of daily goal lists.
 * Format:
 * [
 *   {
 *     value: xxx,
 *     children: [
 *       {value: xxx; children: [...]}
 *       ...
 *     ]
 *   },
 *   ...
 * ]
 */
var dailyGoalData = [];

// Localforage module is local simple database.
var localforage = require('localforage');

// Sprintf module is same as printf in C.
var sprintf = require('sprintf-js').sprintf;

// jQuery.
var $ = require('jquery');

var loadDailyGoalList = function loadDailyGoalList() {
  // Remove all daily goal lists.
  $('.container').find('.dg-lists').remove();

  // Render to front end.
  addDailyGoalToElement($('.container'), dailyGoalData, []);
};

var loadDailyGoalListFromDatabase = function loadDailyGoalListFromDatabase(key) {
  // Load daily goal data from database, then render to front end.
  localforage.getItem(key).then(function (value) {
    // If the value is empty or null, then leave it as empty list.
    if (!value) {
      dailyGoalData = [];
    } else {
      dailyGoalData = value;
    }

    loadDailyGoalList();
  }).catch(function (err) {
    console.log(err);
  });
};

/**
 * When click a wait element, turn into active.
 *
 * `element` should be a jQuery element.
 */
var bindDailyGoalElementAction = function bindDailyGoalElementAction(element) {
  element.click(function () {
    if (!element.hasClass('dg-focus')) {
      element.toggleClass('dg-focus');
    }
  });
};

var bindDailyGoalSaveButton = function bindDailyGoalSaveButton(button, id, input) {
  button.click(function () {
    // Path to desired JSON node.
    var path = id.split('-').map(function (num) {
      return parseInt(num, 10);
    });

    // Route to the node.
    var node = dailyGoalData;
    for (var level = 0; level < path.length; level += 1) {
      // At level `level`, the childIdx-th child.
      var childIdx = path[level];
      if (level !== path.length - 1) {
        node = node[childIdx].children;
      } else if (childIdx !== node.length) {
        node = node[childIdx];
      } else {
        node.push({ value: '', children: [] });
        node = node[childIdx];
      }
    }

    node.value = input.val();

    // Refresh content.
    loadDailyGoalList();
  });
};

var getWidthByLevel = function getWidthByLevel(level) {
  return MAX_WIDTH - level;
};

var getOffsetByLevel = function getOffsetByLevel(level) {
  return level;
};

/**
 * Make a daily goal element.
 *
 * level: level of each sub-list, control indentation
 * value: content in this sub-list
 * traverse: How to route to this list/node from root.
 */
var makeDailyGoalElement = function makeDailyGoalElement(level, value, traverse) {
  var placeholder = '';
  if (!value) {
    placeholder = 'Add a daily goal...';
    // Value could be undefined etc.
    value = '';
  }

  var id = traverse.join('-');

  var dailyGoalElement = $('<div class=\'dg-lists\' id=\'' + id + '\'>\n      <div class=\'row my-1\'>\n        <input class=\'form-control mb-2 col-' + getWidthByLevel(level) + ' offset-' + getOffsetByLevel(level) + '\' type=\'text\' placeholder=\'' + placeholder + '\' value=\'' + value + '\'>\n        <button type=\'button\' class=\'btn btn-success col-2 offset-' + getOffsetByLevel(level) + ' mr-2\'>Save</button>\n        <button type=\'button\' class=\'btn btn-warning col-2 mr-2\'>Cancel</button>\n        <button type=\'button\' class=\'btn btn-danger col-2\'>Delete</button>\n      </div>\n    </div>');

  bindDailyGoalElementAction(dailyGoalElement.find('div.row').first());

  bindDailyGoalSaveButton(dailyGoalElement.find('button.btn-success').first(), id, dailyGoalElement.find('input'));

  return dailyGoalElement;
};

/**
 * Recursively add all items in `dgList` to `containerElement`,
 * with indentation set by `level`.
 */
var addDailyGoalToElement = function addDailyGoalToElement(containerElement, dgList, traverse) {
  var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  for (var i = 0; i < dgList.length; i += 1) {
    // Add traverse route.
    traverse[level] = i;

    // For each direct child in the same level, append to `containerElement`.
    var dg = dgList[i];
    var dgElement = makeDailyGoalElement(level, dg.value, traverse);
    containerElement.append(dgElement);

    // For children in next level, recursively call `addDailyGoalToElement` to
    // attach children to this element.
    if (level < MAX_LEVEL - 1) {
      addDailyGoalToElement(dgElement, dg.children, traverse, level + 1);
      // Remove last number as it is only used in children level.
      traverse.pop();
    }
  }

  // Reserve one line to add new list.
  traverse[level] = dgList.length;
  containerElement.append(makeDailyGoalElement(level, null, traverse));
};

var getCurrentDateKey = function getCurrentDateKey() {
  // Use YYYY-MM-dd as primary key in database.
  var date = new Date();
  var key = sprintf('%d%02d%02d', date.getFullYear(), date.getMonth(), date.getDate());
  return key;
};

/**
 * Load database for daily goal list.
 */
var init = function init() {
  dateKey = getCurrentDateKey();
  loadDailyGoalListFromDatabase(dateKey);
};

$(document).ready(init);

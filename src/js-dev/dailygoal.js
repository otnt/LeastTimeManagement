/* eslint-disable no-param-reassign */

// MAX_WIDTH of Bootstrap is 12 columns.
const MAX_WIDTH = 12;

// Maximum level.
const MAX_LEVEL = 4;

// Use date as key to database.
let dateKey = "";

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
let dailyGoalData = [];

// Localforage module is local simple database.
const localforage = require('localforage');

// Sprintf module is same as printf in C.
const sprintf = require('sprintf-js').sprintf;

// jQuery.
const $ = require('jquery');

const loadDailyGoalList = function loadDailyGoalList() {
  // Remove all daily goal lists.
  $('.container').find('.dg-lists').remove();

  // Render to front end.
  addDailyGoalToElement(
    $('.container'),
    dailyGoalData,
    []);
};

const loadDailyGoalListFromDatabase = function loadDailyGoalListFromDatabase(key) {
  // Load daily goal data from database, then render to front end.
  localforage.getItem(key).then((value) => {
    // If the value is empty or null, then leave it as empty list.
    if (!value) {
      dailyGoalData = [];
    } else {
      dailyGoalData = value;
    }

    loadDailyGoalList();
  }).catch((err) => {
    console.log(err);
  });
};

/**
 * When click a wait element, turn into active.
 *
 * `element` should be a jQuery element.
 */
const bindDailyGoalElementAction = function bindDailyGoalElementAction(element) {
  element.click(() => {
    if (!element.hasClass('dg-focus')) {
      element.toggleClass('dg-focus');
    }
  });
};

const bindDailyGoalSaveButton = function bindDailyGoalSaveButton(button, id, input) {
  button.click(() => {
    // Path to desired JSON node.
    const path = id.split('-').map(num => parseInt(num, 10));

    // Route to the node.
    let node = dailyGoalData;
    for (let level = 0; level < path.length; level += 1) {
      // At level `level`, the childIdx-th child.
      const childIdx = path[level];
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

const getWidthByLevel = function getWidthByLevel(level) {
  return MAX_WIDTH - level;
};

const getOffsetByLevel = function getOffsetByLevel(level) {
  return level;
};

/**
 * Make a daily goal element.
 *
 * level: level of each sub-list, control indentation
 * value: content in this sub-list
 * traverse: How to route to this list/node from root.
 */
const makeDailyGoalElement = function makeDailyGoalElement(level, value, traverse) {
  let placeholder = '';
  if (!value) {
    placeholder = 'Add a daily goal...';
    // Value could be undefined etc.
    value = '';
  }

  const id = traverse.join('-');

  const dailyGoalElement = $(
    `<div class='dg-lists' id='${id}'>
      <div class='row my-1'>
        <input class='form-control mb-2 col-${getWidthByLevel(level)} offset-${getOffsetByLevel(level)}' type='text' placeholder='${placeholder}' value='${value}'>
        <button type='button' class='btn btn-success col-2 offset-${getOffsetByLevel(level)} mr-2'>Save</button>
        <button type='button' class='btn btn-warning col-2 mr-2'>Cancel</button>
        <button type='button' class='btn btn-danger col-2'>Delete</button>
      </div>
    </div>`);

  bindDailyGoalElementAction(dailyGoalElement.find('div.row').first());

  bindDailyGoalSaveButton(
    dailyGoalElement.find('button.btn-success').first(),
    id,
    dailyGoalElement.find('input'));

  return dailyGoalElement;
};

/**
 * Recursively add all items in `dgList` to `containerElement`,
 * with indentation set by `level`.
 */
const addDailyGoalToElement = function addDailyGoalToElement(
  containerElement,
  dgList,
  traverse,
  level = 0) {
  for (let i = 0; i < dgList.length; i += 1) {
    // Add traverse route.
    traverse[level] = i;

    // For each direct child in the same level, append to `containerElement`.
    const dg = dgList[i];
    const dgElement = makeDailyGoalElement(level, dg.value, traverse);
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

const getCurrentDateKey = function getCurrentDateKey() {
  // Use YYYY-MM-dd as primary key in database.
  const date = new Date();
  const key = sprintf('%d%02d%02d', date.getFullYear(), date.getMonth(), date.getDate());
  return key;
};

/**
 * Load database for daily goal list.
 */
const init = function init() {
  dateKey = getCurrentDateKey();
  loadDailyGoalListFromDatabase(dateKey);
};

$(document).ready(init);
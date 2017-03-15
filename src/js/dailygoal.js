let root = null;

const localforage = require('localforage');

const { dialog } = require('electron').remote;

/*
 * Base daily goal item.
 */
class DailyGoalNode {

  constructor() {
    this.children = [];
    this.wrapper = $('<div class="dg-lists"></div>');
  }

  addChild(dailyGoalNode) {
    // Bind child logically.
    this.children.push(dailyGoalNode);
    dailyGoalNode.parent = this;

    // Update DOM to show child.
    this.wrapper.append(dailyGoalNode.wrapper);
  }
}

/*
 * Real/useful item in daily goal list.
 *
 * It could be nested or contains many levels of children.
 */
class DailyGoalRealNode extends DailyGoalNode {

  // MAX_WIDTH of Bootstrap is 12 columns.
  static get MAX_WIDTH() {
    return 12;
  }

  // Maximum level.
  static get MAX_LEVEL() {
    return 4;
  }

  /*
   * level: control indentation
   * value: text content in this item
   */
  constructor(level, value, done, old) {
    super();

    this.level = level;
    this.value = value || '';
    this.placeholder = 'Add a daily goal...';
    this.done = done || false;

    // HTML elements.
    this.insideWrapper = $(`<div class="row my-1 ${old ? '' : 'dg-add-new'} ${old && done ? 'dg-done' : ''}"></div>`);
    this.input = $(`<input class="form-control mb-2 col-${DailyGoalRealNode.getWidthByLevel(level) - 2} offset-${DailyGoalRealNode.getOffsetByLevel(level)} ${old ? '' : 'border-0'}" type='text' placeholder='${this.placeholder}' value='${this.value}'>`);
    this.checkButton = $(`
      <a class='mb-2 col vh-center'>
        <i class="fa fa-check" aria-hidden="true"></i>
        <i class="fa fa-repeat" aria-hidden="true"></i>
      </a>`);
    this.saveButton = $(`<button type='button' class='dg-btn-save btn btn-success col-2 offset-${DailyGoalRealNode.getOffsetByLevel(level)} mr-2'>Save</button>`);
    this.sublistButton = $('<button type=\'button\' class=\'dg-btn-sub-list btn btn-info col-2 mr-2\'>Subtask</button>');
    this.deleteButton = $('<button type=\'button\' class=\'dg-btn-delete btn btn-danger col-2\'>Delete</button>');

    // Put HTML elements together.
    this.insideWrapper.append(this.input, this.checkButton, this.saveButton);
    // No sublist at last level.
    if (level < DailyGoalRealNode.MAX_LEVEL - 1) {
      this.insideWrapper.append(this.sublistButton);
    }
    this.insideWrapper.append(this.deleteButton);
    this.wrapper.append(this.insideWrapper);

    // Register actions.

    // Focus on this daily goal item.
    this.input.focus(this.focus.bind(this));
    // Unfocus on current item.
    this.input.blur(this.blur.bind(this));
    // Click save button. Save text value to daily goal image node.
    this.saveButton.click(this.save.bind(this));
    // Click sublist button. Create another daily goal item, and attach to itself.
    this.sublistButton.click(this.sublist.bind(this));
    // Delete this item.
    this.deleteButton.click(this.delete.bind(this));
    // Done with item.
    this.checkButton.click(this.check.bind(this));
  }

  static getWidthByLevel(level) {
    return DailyGoalRealNode.MAX_WIDTH - level;
  }

  static getOffsetByLevel(level) {
    return level;
  }

  // Add focus class tag, so that button could appear.
  focus() {
    this.insideWrapper.addClass('dg-focus');
    this.input.removeClass('border-0');
  }

  // Remove focus class tag, so that button would disappear.
  unfocus() {
    this.insideWrapper.removeClass('dg-focus');
  }

  // Save current value and remove focus class tag.
  save() {
    // Remove focus class tag.
    this.unfocus();

    // Empty item.
    const isEmpty = !this.input.val();

    // If current modifying item is the last one.
    const parent = this.parent;
    const index = parent.children.indexOf(this);
    const isLast = parent.children.length === index + 1;

    if (!isEmpty && isLast) {
      // Last but not empty, then append new node.
      this.insideWrapper.removeClass('dg-add-new');
      const next = new DailyGoalRealNode(this.level);
      parent.addChild(next);
    } else if (isEmpty && !isLast) {
      // Is empty, but not last, keep it and set to default value.
      this.input.val('Empty');
    } else if (isEmpty && isLast) {
      // Is empty, and is last one, remove border.
      this.input.addClass('border-0');
      if (parent.children.length === 1 && this.level !== 0) {
        // Is empty, is last, and not at top level, then remove it.
        this.removeSelf();
      }
    }

    // Save value.
    this.value = this.input.val();

    saveData(root);
  }

  // If click/focus on any other element besides current inside wrapper,
  // then save current element.
  blur() {
    // When blur, automatically save, except just clicked a button.
    if (this.insideWrapper.is(':active')) {
      return;
    }
    this.save();
  }

  // Save current element and append sublist.
  sublist() {
    if (!this.input.val()) {
      this.input.val('Empty');
    }
    this.save();

    const child = new DailyGoalRealNode(this.level + 1);
    this.addChild(child);
    child.input.focus();
  }

  // Remove this item.
  delete() {
    this.removeSelf();

    // If only remaining element is a dg-add-new element, then remove it.
    const parent = this.parent;
    if (parent.children.length === 1
      && parent.children[0].insideWrapper.hasClass('dg-add-new')
      && this.level !== 0) {
      parent.children[0].wrapper.remove();
    }
  }

  check() {
    // Remove focus class tag.
    this.unfocus();

    this.insideWrapper.toggleClass('dg-done');
    this.done = !this.done;
  }

  removeSelf() {
    const parent = this.parent;

    // Remove itself from parent's children list.
    const index = parent.children.indexOf(this);
    parent.children.splice(index, 1);

    // Update DOM to remove child.
    this.wrapper.remove();
  }
}

const saveNodeData = function saveNodeData(node) {
  const data = {
    value: node.value,
    done: node.done,
    children: [],
  };
  for (let i = 0; i < node.children.length; i += 1) {
    const nodeData = saveNodeData(node.children[i]);
    if (nodeData) {
      data.children.push(nodeData);
    }
  }

  return data;
};

const saveData = function saveData(node) {
  const data = JSON.stringify(saveNodeData(node));

  localforage.setItem('data', data).then(() => {
    console.log(`saved data ${data}`);
  }).catch((err) => {
    console.log(err);
  });
};

const loadNodeData = function loadNodeData(data, level) {
  const old = data.value || data.children.length !== 0;
  const node = new DailyGoalRealNode(level, data.value, data.done, old);
  for (let i = 0; i < data.children.length; i += 1) {
    const n = loadNodeData(data.children[i], level + 1);
    node.addChild(n);
  }
  return node;
};

const loadData = function loadData(node) {
  localforage.getItem('data').then((s) => {
    const data = JSON.parse(s);
    for (let i = 0; i < data.children.length; i += 1) {
      node.addChild(loadNodeData(data.children[i], 0));
    }

    console.log('loaded');
  }).catch((err) => {
    console.log(err);
  });
};

/**
 * Render daily goal list.
 */
const reset = function reset() {
  $('#dg-container').empty();

  // Outmost wrapper for all daily goal nodes. The root itself has no
  // text value.
  root = new DailyGoalNode();

  // First/default daily goal node to be appended, so that user could
  // start editing.
  const first = new DailyGoalRealNode(0);

  // Render view.
  root.addChild(first);
  $('#dg-container').append(root.wrapper);

  // Save to clean database.
  saveData(root);

  // Save current time.
  const timeMs = JSON.stringify({ 'time' : Date.now() });
  localforage.setItem('time', timeMs).then(() => {
    console.log(`saved time ${timeMs}`);
  }).catch((err) => {
    console.log(err);
  });
};

const init = function init() {
  $('#dg-refresh').click(() => {
    dialog.showMessageBox(null, {
      type: 'question',
      buttons: ['Reset', 'Cancel'],
      defaultId: 1,
      title: 'Reset',
      message: 'Are you sure to reset?',
      detail: 'Reset will remove all your current tasks! Only reset when you finished all the tasks.',
    }, (response) => {
      if (response === 0) {
        reset();
      }
    });
  });

  // By default, load from database.
  root = new DailyGoalNode();
  loadData(root);
  $('#dg-container').append(root.wrapper);

  $('#dg-back').click(() => {
    window.location = '../../index.html';
  });
};

$(document).ready(init);

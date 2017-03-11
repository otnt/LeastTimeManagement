let root = null;

const localforage = require('localforage');

/*
 * Base daily goal item.
 */
class DailyGoalNode {

  constructor() {
    this.children = [];
    this.wrapper = $(`<div class='dg-lists'></div>`);
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
  get MAX_WIDTH() {
   return 12;
  }

  // Maximum level.
  get MAX_LEVEL() {
    return 4;
  }

  /*
   * level: control indentation
   * value: text content in this item
   */
  constructor(level, value) {
    super();

    this.level = level;
    this.value = value || '';
    this.placeholder = 'Add a daily goal...';

    // HTML elements.
    this.insideWrapper = $(`<div class='row my-1 dg-add-new'></div>`);
    this.input = $(`<input class='form-control mb-2 col-${this.getWidthByLevel(level) - 2} offset-${this.getOffsetByLevel(level)} border-0' type='text' placeholder='${this.placeholder}' value='${this.value}'>`);
    this.checkButton = $(`
      <a class='mb-2 col vh-center'>
        <i class="fa fa-check" aria-hidden="true"></i>
        <i class="fa fa-repeat" aria-hidden="true"></i>
      </a>`);
    this.saveButton = $(`<button type='button' class='dg-btn-save btn btn-success col-2 offset-${this.getOffsetByLevel(level)} mr-2'>Save</button>`);
    this.sublistButton = $(`<button type='button' class='dg-btn-sub-list btn btn-info col-2 mr-2'>Subtask</button>`);
    this.deleteButton = $(`<button type='button' class='dg-btn-delete btn btn-danger col-2'>Delete</button>`);

    // Put HTML elements together.
    this.insideWrapper.append(this.input, this.checkButton, this.saveButton);
    // No sublist at last level.
    if (level < this.MAX_LEVEL - 1) {
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

  getWidthByLevel(level) {
    return this.MAX_WIDTH - level;
  };

  getOffsetByLevel(level) {
    return level;
  };

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
    if(this.insideWrapper.is(':active')) {
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
  if (!node.value && node.children.length === 0) {
    return null;
  }

  const data = {
    'value': node.value,
    'children': []
  };
  for (let i = 0; i < node.children.length; ++i) {
    const nodeData = saveNodeData(node.children[i]);
    if (nodeData) {
      data.children.push(nodeData);
    }
  }

  return data;
};

const saveData = function saveData(node) {
  const data = saveNodeData(node);

  localforage.setItem('test', JSON.stringify(data)).then(() => {
    console.log('saved');
  }).catch((err) => {
    console.log(err);
  });
};

/**
 * Render daily goal list.
 */
const init = function init() {
  // Outmost wrapper for all daily goal nodes. The root itself has no
  // text value.
  root = new DailyGoalNode();

  // First/default daily goal node to be appended, so that user could
  // start editing.
  const first = new DailyGoalRealNode(0);

  // Render view.
  root.addChild(first);
  $('.container').append(root.wrapper);
};

$(document).ready(init);

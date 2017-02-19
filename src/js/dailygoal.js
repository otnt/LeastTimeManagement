
// MAX_WIDTH of Bootstrap is 12 columns.
const MAX_WIDTH = 12;

// Maximum level.
const MAX_LEVEL = 4;

// Class name for focused daily goal list.
const DG_FOCUS_CLASS = "dg-focus";

// Class name for not focused daily goal list.
const DG_NOT_FOCUS_CLASS = "dg-not-focus";

function getWidthByLevel(level) {
  return MAX_WIDTH - level;
}

function getOffsetByLevel(level) {
  return level;
}

/**
 * When click a wait element, turn into active.
 *
 * `element` should be a jQuery element.
 */
function bindDailyGoalElementAction(element) {
  element.click(() => {
    if (element.hasClass(DG_NOT_FOCUS_CLASS)) {
      element.toggleClass(DG_NOT_FOCUS_CLASS);
      element.toggleClass(DG_FOCUS_CLASS);
    }
  });
};

/**
 * Make a daily goal element.
 */
function makeDailyGoalElement(level, value) {
  let placeholder = "";
  if (!value) {
    placeholder = "Add a daily goal...";
    // Value could be undefined etc.
    value = "";
  }

  const dailyGoalElement = $(
    `<div>
      <div class="row my-1 ${DG_NOT_FOCUS_CLASS}">
        <input class="form-control mb-2 col-${getWidthByLevel(level)} offset-${getOffsetByLevel(level)}" type="text" placeholder="${placeholder}" value="${value}">
        <button type="button" class="btn btn-success col-1 offset-${getOffsetByLevel(level)} mr-2">Save</button>
        <button type="button" class="btn btn-warning col-1 mr-2">Cancel</button>
        <button type="button" class="btn btn-danger col-1">Delete</button>
      </div>
    </div>`);

  bindDailyGoalElementAction(dailyGoalElement.find("div.row").first());

  return dailyGoalElement;
};

/**
 * Recursively add all items in `dgList` to `containerElement`,
 * with indentation set by `level`.
 */
function addDailyGoalToElement(containerElement, dgList, level) {
  if (!level) {
    level = 0;
  }

  for (let i = 0; i < dgList.length; i += 1) {
    const dg = dgList[i];
    const dgElement = makeDailyGoalElement(level, dg.value);
    containerElement.append(dgElement);
    if (level < MAX_LEVEL - 1) {
      addDailyGoalToElement(dgElement, dg.children, level + 1);
    }
  }

  // Reserve one line to add new list.
  containerElement.append(makeDailyGoalElement(level));
};

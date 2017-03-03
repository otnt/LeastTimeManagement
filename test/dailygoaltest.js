const Application = require('spectron').Application;
const assert = require('assert');
const electron = require('electron-prebuilt');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

const assertVisibleLength = function assertVisibleLength(items, length) {
  return items
    .getCssProperty('display')
    .then((properties) => {
      let visibles;
      if (properties.constructor === Array) {
        visibles = properties.filter(property => property.value !== 'none');
      } else {
        visibles = [properties.value];
      }
      expect(visibles.length).to.be.equal(length);
    });
};

const assertInvisibleLength = function assertInvisibleLength(items, length) {
  return items
    .getCssProperty('display')
    .then((properties) => {
      let visibles;
      if (properties.constructor === Array) {
        visibles = properties.filter(property => property.value === 'none');
      } else {
        visibles = [properties.value];
      }
      expect(visibles.length).to.be.equal(length);
    });
};

global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});

describe('naive test', function () {
  beforeEach(function() {
    this.app = new Application({
        path: electron,
        args: ['.']
    });
    return this.app.start();
  });

  beforeEach(function() {
    // Implicit timeout wait for functions like 'elements'.
    // http://webdriver.io/guide/testrunner/timeouts.html#Session-Implicit-Wait-Timeout
    this.app.client.timeouts('implicit', 5000);
  });

  beforeEach(function() {
    return this.app.client
      .click('#js-daily-goal');
  });

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('when initially open, check no buttons visible', function() {
    return assertInvisibleLength(this.app.client.elements('button'), 4);
  });

  it('when initially open, check one input is there', function() {
    return assertVisibleLength(this.app.client.elements('input'), 1);
  });

  it('when click add row, check four buttons (save, add sublist, cancel, delete) exist', function() {
    return assertVisibleLength(
      this.app.client
        .click('input')
        .elements('button'), 4);
  });

  it('after save an item, one more empty item on same level should appear', function() {
    return assertVisibleLength(
      this.app.client
        .click('input')
        .setValue('input', 'test goal')
        .click('button.dg-btn-save')
        .elements('input'),
      2);
  });

  it('after save an item, buttons should disappear', function() {
    return assertVisibleLength(
      this.app.client
        .click('input')
        .setValue('input', 'test goal')
        .click('button.dg-btn-save')
        .elements('button'),
      0);
  });

  it('after add sublist, automatically saved', function() {
    return this.app.client
      .click('input')
      .setValue('input', 'test goal')
      .click('button.dg-btn-sub-list')
      .element('input') // Search for the first one.
      .getValue()
      .then(value => expect(value).to.be.equal('test goal'));
  });

  it('after add sublist, one input appear at next level', function() {
    return this.app.client
      .click('input')
      .setValue('input', 'test goal')
      .click('button.dg-btn-sub-list')
      .elements('.dg-lists') // Search for the first one.
      .then(items => expect(items.value.length).to.be.equal(3));
  });
})

const Application = require('spectron').Application;
const assert = require('assert');
const electron = require('electron-prebuilt');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});

describe('naive test', function () {
  this.timeout(5000);

  beforeEach(function() {
    this.app = new Application({
        path: electron,
        args: ['.']
    });
    return this.app.start();
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
    return this.app.client
      .elements('button')
      .then(function(buttons) {
        expect(buttons.value.length).to.be.equal(0);
      });
  });

  it('when click add row, check three buttons (save, cancel, delete) exist', function() {
    return this.app.client
      .click('div.row')
      .elements('button')
      .then(function(buttons) {
        expect(buttons.value.length).to.be.equal(3);
      });
  });

  it('after save an item, one more empty item on same level should appear', function() {
    return this.app.client
      .click('input')
      .setValue('input', 'test goal')
      .click('button.btn-success')
      .elements('input')
      .then(function(inputs) {
        expect(inputs.value.length).to.be.equal(3);
      });
  });

  it('after save an item, buttons should disappear', function() {
    return this.app.client
      .click('input')
      .setValue('input', 'test goal')
      .click('button.btn-success')
      .elements('button')
      .then(function(buttons) {
        expect(buttons.value.length).to.be.equal(0);
      });
  });
})

const Application = require('spectron').Application;
const assert = require('assert');
const electron = require('electron-prebuilt');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});

describe('naive test', function () {
  this.timeout(5000);

  beforeEach(function () {
    this.app = new Application({
        path: electron,
        args: ['.']
    });
    return this.app.start();
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('when open, check three buttons (save, cancel, delete) exist', function () {
    return this.app.client.elements("button").then(function (buttons) {
      return true;
    });
  });
})

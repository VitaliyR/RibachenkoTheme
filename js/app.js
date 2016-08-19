var Page = require('./core/page');
var Cover = require('./pages/cover');

var utils = require('./lib/utils');

var App = Page.extend({
  controllers: [
    {
      controller: Cover,
      classList: [
        'home-template',
        'tag-template',
        'archive-template'
      ]
    }
  ],

  /**
   * @constructor
   * @override
   */
  constructor: function() {
    this.constructor.__super__.constructor.apply(this, arguments);
    this.checkIntegrity();

    var Controller = this.getController();

    if (Controller) {
      this.currentController = new Controller(this.container);
    }
  },

  /**
   * Returns controller for the current page of application
   */
  getController: function() {
    var body = document.body;
    var classList = body.classList || body.className.split(' ');
    var documentClassList = Array.prototype.slice.call(classList);
    var controller;

    for (var controllerIndex in this.controllers) {
      var cont = this.controllers[controllerIndex];
      var thisController = documentClassList.some(function(v) {
        return cont.classList.indexOf(v) !== -1;
      }, this);

      if (thisController) {
        controller = cont.controller;
        break;
      }
    }

    return controller;
  },

  checkIntegrity: function() {
    if (navigator.appVersion.match(/MSIE/)) {
      utils.eventsPolyfill();
    }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // eslint-disable-next-line no-new
  new App(document.body);
});

/**
 * Exports
 */
module.exports = App;

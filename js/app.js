var Page = require('./core/page');
var Cover = require('./pages/cover');

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

    var Controller = this.getController();

    if (Controller) {
      this.currentController = new Controller(this.container);
    }
  },

  /**
   * Returns controller for the current page of application
   */
  getController: function() {
    var documentClassList = Array.prototype.slice.call(document.body.classList);
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
  }
});

document.addEventListener('DOMContentLoaded', function() {
  new App(document.body);
});

/**
 * Exports
 */
module.exports = App;

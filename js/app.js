var utils = require('./lib/utils');

var Base = require('./core/base');
var Store = require('./core/store');
var config = require('./config');

var Cover = require('./pages/cover');
var Post = require('./pages/post');

var App = Base.extend({
  controllers: [
    {
      controller: Cover,
      classList: [
        'home-template',
        'tag-template',
        'archive-template'
      ]
    },
    {
      controller: Post,
      classList: [
        'post-template'
      ]
    }
  ],

  /**
   * @constructor
   * @override
   */
  constructor: function(container) {
    this.container = container;

    this.store = Store.register(config.app_name);

    var Controller = this.getController();

    if (Controller) {
      this.currentController = new Controller(this.container, this.store);
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
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // eslint-disable-next-line no-new
  new App(document.body);
});

window.addEventListener('load', function() {
  utils.toggleClass(document.body, 'loading', false);
});

/**
 * Exports
 */
module.exports = App;

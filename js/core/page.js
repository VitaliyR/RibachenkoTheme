var Base = require('./base');

module.exports = Base.extend({
  constructor: function(container) {
    this.container = container;
    this.elements = {};

    for (var selectorName in this.selectors) {
      var elements = this.container.querySelectorAll(this.selectors[selectorName]);
      this.elements[selectorName] = elements.length === 1 ? elements[0] : Array.prototype.slice.call(elements);
    }

    this._handlers = {};
    for (var eventDesc in this.events) {
      var event = eventDesc.split(' ');
      var eventName = event[0];
      var eventHandler = this.events[eventDesc];
      var eventObj = event[1];

      if (typeof eventHandler === 'string') {
        eventHandler = this[eventHandler];
      }

      if (eventName === 'init') {
        eventHandler.apply(this);
      } else {
        eventObj = window[eventObj] || this.elements[eventObj];

        if (eventObj) {
          if (typeof eventObj === 'object' && !eventObj.length) {
            eventObj = [eventObj];
          }
          var eventDecl = eventHandler.bind(this);
          eventObj.forEach(function(obj) {
            obj.addEventListener(eventName, eventDecl);
          }, this);
        }
      }
    }
  },

  trigger: function(event) {
    var args = [this.container].concat(Array.prototype.slice.call(arguments));
    this.triggerOn.apply(this, args);
  },

  triggerOn: function(obj, eventName) {
    var data = Array.prototype.slice.call(arguments, 2);
    var event;

    if (data.length === 1) data = data[0];

    if (window.CustomEvent) {
      event = new CustomEvent(eventName, { detail: data });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, true, true, data);
    }

    obj.dispatchEvent(event);
  }
});

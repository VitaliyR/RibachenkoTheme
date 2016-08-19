var config = require('../config');

var Page = require('../core/page');
var Paginator = require('./paginator');
var utils = require('../lib/utils');

module.exports = Page.extend({

  selectors: {
    container: '.cover-container',
    scrollContent: '.content, .description',
    sections: '.section-container > section'
  },

  events: {
    'init': 'handleResize',
    'resize window': 'handleResize'
  },

  constructor: function() {
    this.constructor.__super__.constructor.apply(this, arguments);

    scrollTo(0, 0);

    this.paginator = new Paginator(this.container);

    if (!utils.isMobile() && !utils.isMac()) {
      this.enableScrolls();
    }
  },

  /**
   * Resize handler, called on window resize
   */
  handleResize: function() {
    if (navigator.appVersion.match(/MSIE/)) {
      setTimeout(this.matchSectionsHeight.bind(this), 100);
    }
  },

  /**
   * IE support
   * @returns {*}
   */
  matchSectionsHeight: function() {
    this.clearSectionsHeight();

    if (innerWidth < config.mobile_width || innerHeight < config.mobile_height) {
      return;
    }

    var maxHeight = Array.prototype.reduce.apply(this.elements.sections, [
      function(max, section) {
        var height = section.getBoundingClientRect().height;
        return height > max ? height : max;
      },
      0
    ]);

    for (var i = 0; i < this.elements.sections.length; i++) {
      var section = this.elements.sections[i];
      section.style.height = maxHeight + 'px';
    }
  },

  clearSectionsHeight: function() {
    for (var i = 0; i < this.elements.sections.length; i++) {
      var section = this.elements.sections[i];
      section.style.height = '';
    }
  },

  /**
   * Scrolls for not OS X systems
   */
  enableScrolls: function() {
    this.elements.scrollContent.forEach(function(element) {
      SimpleScrollbar.initEl(element);
    });
  }
});

var Page = require('../core/page');
var utils = require('../lib/utils');

module.exports = Page.extend({

  selectors: {
    container: '.post-page'
  },

  constructor: function() {
    this.constructor.__super__.constructor.apply(this, arguments);

    // enable scrolls for chrome not on mobile & mac
    if (!utils.isMobile() && !utils.isMac() && utils.isChrome()) {
      utils.toggleClass(document.body, 'scrolls', true);
    }
  }
});

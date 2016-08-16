var Page = require('../core/page');
var utils = require('../lib/utils');

module.exports = Page.extend({

  selectors: {
    pageCountSpan: 'span.page-number',
    newerPostsButton: 'a.newer-posts',
    olderPostsButton: 'a.older-posts',
    paginationNav: 'nav.pagination',
    contentNode: 'main#content'
  },

  events: {
    'click paginationNav': 'handleNavigationClick'
  },

  constructor: function() {
    this.constructor.__super__.constructor.apply(this, arguments);

    this.elements.olderPostsButton.style.opacity = 1;

    this.parsePage();
  },

  handleNavigationClick: function(event) {
    event.preventDefault();

    var target = event.target.tagName.toLowerCase() === 'span' ? event.target.parentElement : event.target;
    var direction = parseInt(target.getAttribute('data-direction'), 10);

    if (!isNaN(direction)) {
      this.getPage(this.page + direction || 1);
    }
  },

  /**
   * Gets provided page html via ajax and parse using shadow DOM for new
   * paginator data and articles
   * @param {number} page
   */
  getPage: function(page) {
    if (!page || this.page === page) {
      return;
    }

    var url = page === 1 ? '/' : '/page/' + page;
    utils.request({
      ctx: this,
      url: url,
      success: function(html) {
        var dom = document.createElement('html');
        dom.innerHTML = html;

        var pageCountSpan = dom.querySelector('span.page-number');
        var articlesNode = dom.getElementsByTagName('main')[1];

        if (articlesNode) {
          this.elements.pageCountSpan.innerHTML = pageCountSpan.innerHTML;
          this.elements.contentNode.innerHTML = articlesNode.innerHTML;

          this.parsePage();

          if (history) {
            history.pushState({}, '', url);
          }

          this.triggerOn(window, 'articles:update');
        }
      }
    });
  },

  /**
   * Parses current page and all pages count from <span>.
   * Toggles next/prev article buttons
   */
  parsePage: function() {
    var pages = this.elements.pageCountSpan.textContent.split(' of '); // ha-ha-ha;

    this.page = parseInt(pages[0], 10);
    this.pagesAll = parseInt(pages[1], 10);

    var olderPostsButtonWidth = this.elements.olderPostsButton.getBoundingClientRect().width;
    this.elements.pageCountSpan.style.marginRight = this.page === this.pagesAll ? olderPostsButtonWidth + 'px' : 0;

    var newerPostsBtnVisible = this.page === 1;
    var olderPostsBtnVisible = this.page === this.pagesAll;

    this.elements.newerPostsButton.style.display = newerPostsBtnVisible ? 'none' : 'inline-block';
    this.elements.olderPostsButton.style.display = olderPostsBtnVisible ? 'none' : 'inline-block';
  }
});

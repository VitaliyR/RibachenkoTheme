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
    'click paginationNav': 'handleNavigationClick',
    'popstate window': 'handleHistory'
  },

  classNames: {
    loading: 'icon icon-loader'
  },

  pageRegexp: /page\/(\d+)/,
  delayToLoader: 100,

  constructor: function() {
    this.constructor.__super__.constructor.apply(this, arguments);

    this.elements.olderPostsButton.style.opacity = 1;

    this.parsePage();
  },

  handleNavigationClick: function(event) {
    event.preventDefault();

    var target = event.target.tagName.toLowerCase() === 'span' ? event.target.parentElement : event.target;
    var direction = parseInt(target.getAttribute('data-direction'), 10);

    if (!isNaN(direction) && !this.request) {
      setTimeout(function() {
        if (this.request) {
          this.toggleLoading(target, true);
        }
      }.bind(this), this.delayToLoader);
      this.request = this.getPage(this.page + direction || 1);
    }
  },

  toggleLoading: function(element, state) {
    var elements = element ? [element] : utils.arr(this.elements.paginationNav.querySelectorAll('a'));

    elements.forEach(function(el) {
      if (state) {
        el.className += ' ' + this.classNames.loading;
      } else {
        el.className = el.className.replace(' ' + this.classNames.loading, '');
      }
    }, this);
  },

  /**
   * Gets provided page html via ajax and parse using shadow DOM for new
   * paginator data and articles
   * @param {number} page
   * @return {XMLHttpRequest}
   */
  getPage: function(page) {
    if (!page || this.page === page || this.request) {
      return this.request;
    }

    var url = this.getPageUrl(page);
    return utils.request({
      ctx: this,
      url: url,
      success: function(html) {
        var pageCount = /<span class="page-number">(.+)<\/span>/.exec(html);
        var articlesNode = /<main id="content".+>([\S\s]+)<\/main>/.exec(html);

        if (articlesNode) {
          this.elements.pageCountSpan.innerHTML = pageCount[1].trim();
          this.animateContentNode(articlesNode[1].trim());

          this.parsePage();

          if (history && history.pushState && url !== this.getPageUrl()) {
            history.pushState({}, '', url);
          }

          this.toggleLoading();
          this.triggerOn(window, 'articles:update');
        }

        delete this.request;
      }
    });
  },

  animateContentNode: function(newContent) {
    var node = this.elements.contentNode;
    var isMobile = utils.isMobile();

    if (isMobile) {
      var nodeHeight = node.getBoundingClientRect().height;
      node.style.height = nodeHeight + 'px';
    }

    node.innerHTML = newContent;

    if (isMobile) {
      var height = utils.arr(node.children).reduce(function(r, node) {
        return r + node.getBoundingClientRect().height;
      }, 0);
      node.style.height = height + 'px';
    }
  },

  /**
   * Returns page url
   * @param {number} [page=]
   * @returns {string}
   */
  getPageUrl: function(page) {
    if (page) {
      return page === 1 ? '/' : ('/page/' + page);
    } else {
      return location.pathname;
    }
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
  },

  /**
   * Handles HTML5 history
   */
  handleHistory: function() {
    var pageLocation = location.pathname;
    var page = this.pageRegexp.exec(pageLocation);
    this.getPage(page && page.length ? page[1] : 1);
  }
});

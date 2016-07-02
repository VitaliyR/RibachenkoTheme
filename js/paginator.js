import Page from './page';

/**
 * Serves the paginator ajax functionality
 */
class Paginator extends Page {

  get selectors() {
    return {
      pageCountSpan: 'span.page-number',
      newerPostsButton: 'a.newer-posts',
      olderPostsButton: 'a.older-posts',
      paginationNav: 'nav.pagination'
    };
  }

  get events() {
    return {
      'click paginationNav': this.handleNavigationClick
    };
  }

  constructor(...args) {
    super(...args);

    this.elements.olderPostsButton.style.opacity = 1;

    this.parsePage();
  }

  handleNavigationClick(event) {
    event.preventDefault();
    var target = event.target.tagName.toLowerCase() === 'span' ? event.target.parentElement : event.target;
    var direction = parseInt(target.getAttribute('data-direction'), 10);

    if (!isNaN(direction)) {
      this.getPage(this.page + direction || 1);
    }
  }

  /**
   * Gets provided page html via ajax and parse using shadow DOM for new
   * paginator data and articles
   * @param  {number} page
   * @todo rewrite to native
   */
  getPage(page) {
    if (!page || this.page === page) {
      return;
    }

    $.ajax('/page/' + page).done((html) => {
      var dom = document.createElement('html');
      dom.innerHTML = html;

      var pageCountSpan = dom.querySelector('span.page-number');
      var articlesNode = dom.getElementsByTagName('main')[0];
      if (articlesNode) {
        this.pageCountSpan.innerHTML = pageCountSpan.innerHTML;
        this.parsePage();

        var container = document.querySelector('main .jspPane') || document.querySelector('main');
        container.innerHTML = articlesNode.innerHTML;

        if (history) {
          history.pushState({}, '', '/page/' + page);
        }

        $('body').triggerHandler('articlesUpdated');
      }
    }).fail(function(err) {
      console.error(err);
    });
  }

  /**
   * Parses current page and all pages count from <span>.
   * Toggles next/prev article buttons
   */
  parsePage() {
    const pages = this.elements.pageCountSpan.textContent.split(' of '); // ha-ha-ha;

    this.page = parseInt(pages[0], 10);
    this.pagesAll = parseInt(pages[1], 10);

    const olderPostsButtonWidth = this.elements.olderPostsButton.getBoundingClientRect().width;
    this.elements.pageCountSpan.style.marginRight = this.page === this.pagesAll ? olderPostsButtonWidth + 'px' : 0;

    const newerPostsBtnVisible = this.page === 1;
    const olderPostsBtnVisible = this.page === this.pagesAll;

    this.elements.newerPostsButton.style.display = newerPostsBtnVisible ? 'none' : 'inline-block';
    this.elements.olderPostsButton.style.display = olderPostsBtnVisible ? 'none' : 'inline-block';
  }
}

export default Paginator;

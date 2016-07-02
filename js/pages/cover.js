import Page from '../page';
import Paginator from '../paginator';
import utils from '../utils';

class CoverController extends Page {

  get selectors() {
    return {
      scrollContent: '.content, .description'
    };
  }

  constructor(...args) {
    super(...args);

    scrollTo(0, 0);
    this.paginator = new Paginator(this.container);

    if (!utils.isMobile() && !utils.isMac()) {
      this.enableScrolls();
    }
  }

  /**
   * @uses jQuery
   */
  enableScrolls() {
    var barsSelector = '.jspHorizontalBar, .jspVerticalBar';
    var $scrollContent = $(this.elements.scrollContent);

    this._timeouts = {};

    $scrollContent
      .css('overflow', 'initial')
      .bind('jsp-initialised', function() {
        $(this).find(barsSelector).hide();
      })
      .jScrollPane({
        contentWidth: '0px'
      })
      .scroll(
        function() {
          var $self = $(this);
          $self.find(barsSelector).stop().show().css('opacity', 0.9);

          clearTimeout(this._timeouts[this]);
          this._timeouts[this] = setTimeout(function() {
            $self.find(barsSelector).stop().fadeTo('fast', 0);
          }, 1000);
        }
      );

    $('body').on('articlesUpdated', function() {
      $scrollContent.each(function() {
        $(this).data('jsp').reinitialise();
      });
    });

    $scrollContent.each(function() {
          var jsp = $(this).data('jsp');
          jsp && jsp.reinitialise();
        });
  }
}

export default CoverController;

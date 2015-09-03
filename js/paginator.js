window.Paginator = (function() {

    /**
     * Serves the paginator ajax functionality
     * @constructor
     */
    var Paginator = function() {
        /**
         * @var {Number} page
         */
        var self = this;

        /**
         * Span element (@page of @pages)
         * @type {Element}
         */
        this.pageCountSpan = document.querySelector('span.page-number');

        // butons prev page and next page
        this.buttons = {
            newerPosts: document.querySelector('a.newer-posts'),
            olderPosts: document.querySelector('a.older-posts')
        };

        document.querySelector('nav.pagination').addEventListener('click', function(event) {
            event.preventDefault();
            var direction = parseInt(event.target.getAttribute('data-direction'), 10);

            if (! isNaN(direction)) {
                self.getPage(self.page + direction || 1);
            }
        });

        this.parsePage();
    };

    /**
     * @lends Paginator
     */
    Paginator.prototype = {
        /**
         * Gets provided page html via ajax and parse using shadow DOM for new
         * paginator data and articles
         * @param  {number} page
         */
        getPage: function(page) {
            var self = this;

            if (! page || this.page === page){
                return;
            }

            $.ajax('/page/' + page).done(function(html){
                var dom = document.createElement('html');
                dom.innerHTML = html;

                var pageCountSpan = dom.querySelector('span.page-number');
                var articlesNode = dom.getElementsByTagName('main')[0];
                if (articlesNode) {
                    self.pageCountSpan.innerHTML = pageCountSpan.innerHTML;
                    self.parsePage();

                    document.getElementsByTagName('main')[0].innerHTML = articlesNode.innerHTML;

                    if (history){
                        history.pushState({}, '', '/page/' + page);
                    }
                }
            }).fail(function(err){
                console.error(err);
            });
        },

        /**
         * Parses current page and all pages count from <span>.
         * Toggles next/prev article buttons
         */
        parsePage: function() {
            var pages = this.pageCountSpan.textContent.split(' of '); // ha-ha-ha;
            this.page = parseInt(pages[0], 10);
            this.pagesAll = parseInt(pages[1], 10);

            this.buttons.newerPosts.style.display = this.page === 1 ? 'none' : 'inline-block';
            this.buttons.olderPosts.style.display = this.page === this.pagesAll ? 'none' : 'inline-block';
        }
    };

    return Paginator;

})();
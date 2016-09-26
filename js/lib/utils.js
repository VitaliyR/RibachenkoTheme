module.exports = {
  i18n: {
    today: 'at %d',
    yesterday: 'yesterday',
    fewdays: 'a few days ago',
    longtime: 'a long time ago'
  },

  isMobile: function() {
    var isMobile = false;
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;
    return isMobile;
  },

  /**
   * Detects if UA contains Mac OS X
   * @return {boolean}
   */
  isMac: function() {
    return /Mac/.test(navigator.platform);
  },

  /**
   * Make ajax request
   * @param {Object} opts
   *  @param {Object} [opts.ctx=this]
   *  @param {string} [opts.method=GET]
   *  @param {string}isMobile opts.url
   *  @param {Function} [opts.success=Function.prototype]
   *  @param {Function} [opts.error=Function.prototype]
   *  @return {XMLHttpRequest}
   */
  request: function(opts) {
    var request = new XMLHttpRequest();
    var method = opts.method || 'GET';
    var ctx = opts.ctx;

    request.open(method, opts.url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var json;
        try {
          json = JSON.parse(request.responseText);
        } catch (e) {}

        opts.success && opts.success.apply(ctx || this, [json || request.responseText, request]);
      } else {
        opts.error && opts.error.apply(ctx || this, [request]);
      }
    };

    request.onerror = opts.error || Function.prototype;

    request.send();

    return request;
  },

  /**
   * Makes array from array-like objects
   * @param {Object} a
   * @returns {Array}
   */
  arr: function(a) {
    return Array.prototype.slice.call(a);
  },

  /**
   * Toggles provided class on element
   * @param {HTMLElement} el
   * @param {string} className
   * @param {Boolean} state
   */
  toggleClass: function(el, className, state) {
    var classList = el.className.split(' ');
    var classPos = classList.indexOf(className);

    if (state) {
      classPos === -1 && classList.push(className);
    } else {
      classPos !== -1 && classList.splice(classPos, 1);
    }

    el.className = classList.join(' ');
  },

  /**
   * Returns normalized time string
   * @param {Date} date
   * @returns {string}
   */
  getTime: function(date) {
    var hours = '' + date.getHours();
    var minutes = '' + date.getMinutes();

    hours = hours.length === 1 ? '0' + hours : hours;
    minutes = minutes.length === 1 ? '0' + minutes : minutes;

    return hours + ':' + minutes;
  },

  /**
   * Accepts timestamp and returns relative date string from i18n
   * @param {Number} timestamp
   * @returns {String}
   */
  getRelativeDate: function(timestamp) {
    var date = new Date(timestamp);
    var now = new Date();
    var isCurrentYear = now.getFullYear() === date.getFullYear();
    var isCurrentMonth = isCurrentYear && (now.getMonth() === date.getMonth());
    var isCurrentDay = isCurrentMonth && (now.getDate() === date.getDate());
    var isYesterday = isCurrentMonth && (now.getDate() - 1 === date.getDate());
    var fewDaysLength = 1000 * 60 * 60 * 24 * 14; // 2 weeks
    var isFewDays = (now.getTime() - date.getTime()) <= fewDaysLength;
    var resultStr;

    if (isCurrentDay) {
      resultStr = this.i18n.today.replace(/%d/, this.getTime(date));
    } else if (isYesterday) {
      resultStr = this.i18n.yesterday;
    } else if (isFewDays) {
      resultStr = this.i18n.fewdays;
    } else {
      resultStr = this.i18n.longtime;
    }

    return resultStr;
  }
};

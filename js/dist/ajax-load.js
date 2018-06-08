function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * --------------------------------------------------------------------------
 * CoreUI (v2.0.3): ajax-load.js
 * Licensed under MIT (https://coreui.io/license)
 * --------------------------------------------------------------------------
 */
var AjaxLoad = function ($) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'ajaxLoad';
  var VERSION = '2.0.3';
  var DATA_KEY = 'coreui.ajaxLoad';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var ClassName = {
    ACTIVE: 'active',
    NAV_PILLS: 'nav-pills',
    NAV_TABS: 'nav-tabs',
    OPEN: 'open',
    VIEW_SCRIPT: 'view-script'
  };
  var Event = {
    CLICK: 'click'
  };
  var Selector = {
    HEAD: 'head',
    NAV_DROPDOWN: '.sidebar-nav .nav-dropdown',
    NAV_LINK: '.sidebar-nav .nav-link',
    NAV_ITEM: '.sidebar-nav .nav-item',
    VIEW_SCRIPT: '.view-script'
  };
  var Default = {
    defaultPage: 'views/main.html',
    errorPage: 'views/404.html',
    subpagesDirectory: ''
  };

  var AjaxLoad =
  /*#__PURE__*/
  function () {
    function AjaxLoad(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      var url = location.hash.replace(/^#/, '');

      if (url !== '') {
        this.setUpUrl(url);
      } else {
        this.setUpUrl(this._config.defaultPage);
      }

      this._addEventListeners();
    } // Getters


    var _proto = AjaxLoad.prototype;

    // Public
    _proto.loadPage = function loadPage(url) {
      var _this = this;

      if (typeof window.preparePage === 'function') {
        window.preparePage();
      }
      /* const element = this._element
      const config = this._config
       const loadScripts = (src, element = 0) => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = src[element]
        script.className = ClassName.VIEW_SCRIPT
        // eslint-disable-next-line no-multi-assign
        script.onload = script.onreadystatechange = function () {
          if (!this.readyState || this.readyState === 'complete') {
            if (src.length > element + 1) {
              loadScripts(src, element + 1)
            }
          }
        }
        const body = document.getElementsByTagName('body')[0]
        body.appendChild(script)
      }
      */


      axios.get(this._config.subpagesDirectory + url).then(function (res) {
        $('#ui-view').html(res.data);
        window.location.hash = url;
      })
      /* eslint-disable */
      .catch(function (err) {
        // console.log(err)
        window.location.href = _this._config.errorPage;
      });
      /* eslint-enable */

      /* $.ajax({
        type : 'GET',
        url : config.subpagesDirectory + url,
        dataType : 'html',
        beforeSend() {
          $(Selector.VIEW_SCRIPT).remove()
        },
        success(result) {
          const wrapper = document.createElement('div')
          wrapper.innerHTML = result
           const scripts = Array.from(wrapper.querySelectorAll('script[src]')).map((script) => script.attributes.getNamedItem('src').nodeValue)
           wrapper.querySelectorAll('script[src]').forEach((script) => script.parentNode.removeChild(script))
           $('body').animate({
            scrollTop: 0
          }, 0)
          $(element).html(wrapper)
          if (scripts.length) {
            loadScripts(scripts)
          }
          window.location.hash = url
        },
        error() {
          window.location.href = config.errorPage
        }
      })*/
    };

    _proto.setUpUrl = function setUpUrl(url) {
      $(Selector.NAV_LINK).removeClass(ClassName.ACTIVE);
      $(Selector.NAV_DROPDOWN).removeClass(ClassName.OPEN);
      $(Selector.NAV_DROPDOWN + ":has(a[href=\"" + url.split('?')[0] + "\"])").addClass(ClassName.OPEN);
      $(Selector.NAV_ITEM + " a[href=\"" + url.split('?')[0] + "\"]").addClass(ClassName.ACTIVE); // Setup Breadcrumb

      var menuName = '<li class="breadcrumb-item"><a href="/">Home</a></li>';
      /* eslint-disable */

      $.menuElement = $('nav .nav li:has(a[href="' + url.split('?')[0] + '"])');

      if ($.menuElement.parent().parent().hasClass('nav-dropdown open')) {
        $.menuElementParentName = $.menuElement.parent().parent().find('span:first').text();
        menuName += '<li class="breadcrumb-item">' + $.menuElementParentName + '</li>';
      }

      menuName += '<li class="breadcrumb-item active">' + $('nav .nav li:has(a[href="' + url.split('?')[0] + '"])').find('.active').find('span').first().text() + '</li>';
      /* eslint-enable */

      $('#breadcrumb').html(menuName);
      this.loadPage(url);
    };

    _proto.loadBlank = function loadBlank(url) {
      window.open(url);
    };

    _proto.loadTop = function loadTop(url) {
      window.location = url;
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = Object.assign({}, Default, config);
      return config;
    };

    _proto._addEventListeners = function _addEventListeners() {
      var _this2 = this;

      $(document).on(Event.CLICK, Selector.NAV_LINK + "[href!=\"#\"]", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (event.currentTarget.target === '_top') {
          _this2.loadTop(event.currentTarget.href);
        } else if (event.currentTarget.target === '_blank') {
          _this2.loadBlank(event.currentTarget.href);
        } else {
          _this2.setUpUrl(event.currentTarget.getAttribute('href'));
        }
      });
    }; // Static


    AjaxLoad._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new AjaxLoad(this, _config);
          $(this).data(DATA_KEY, data);
        }
      });
    };

    _createClass(AjaxLoad, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);

    return AjaxLoad;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME] = AjaxLoad._jQueryInterface;
  $.fn[NAME].Constructor = AjaxLoad;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return AjaxLoad._jQueryInterface;
  };

  return AjaxLoad;
}($);
//# sourceMappingURL=ajax-load.js.map
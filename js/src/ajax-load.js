import $ from 'jquery'
import axios from 'axios'

/**
 * --------------------------------------------------------------------------
 * CoreUI (v2.0.3): ajax-load.js
 * Licensed under MIT (https://coreui.io/license)
 * --------------------------------------------------------------------------
 */


const AjaxLoad = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                       = 'ajaxLoad'
  const VERSION                    = '2.0.3'
  const DATA_KEY                   = 'coreui.ajaxLoad'
  const JQUERY_NO_CONFLICT         = $.fn[NAME]

  const ClassName = {
    ACTIVE      : 'active',
    NAV_PILLS   : 'nav-pills',
    NAV_TABS    : 'nav-tabs',
    OPEN        : 'open',
    VIEW_SCRIPT : 'view-script'
  }

  const Event = {
    CLICK : 'click'
  }

  const Selector = {
    HEAD         : 'head',
    NAV_DROPDOWN : '.sidebar-nav .nav-dropdown',
    NAV_LINK     : '.sidebar-nav .nav-link',
    NAV_ITEM     : '.sidebar-nav .nav-item',
    VIEW_SCRIPT  : '.view-script'
  }

  const Default = {
    defaultPage       : 'pages/Dashboard.html',
    errorPage         : 'pages/404.html',
    subpagesDirectory : ''
  }

  class AjaxLoad {
    constructor(element, config) {
      this._config = this._getConfig(config)
      this._element = element

      const url = location.hash.replace(/^#/, '')

      if (url !== '') {
        this.setUpUrl(url)
      } else {
        this.setUpUrl(this._config.defaultPage)
      }
      this._addEventListeners()
    }

    // Getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }

    // Public

    loadPage(url) {
      if (typeof window.beforeHook === 'function') {
        window.beforeHook()
      }

      /* const config = {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control' : 'no-cache'
        }
      }
      axios.get(this._config.subpagesDirectory + url, config)
      */

      window.location.hash = url
      axios.get(this._config.subpagesDirectory + url)
        .then((res) => {
          $('#ui-view').html(res.data)

          if (typeof window.afterHook === 'function') {
            window.afterHook()
          }
        })
        /* eslint-disable */
        .catch((err) => {
          axios.get(this._config.errorPage)
          .then((res) => {
            $('#ui-view').html(res.data)
            if (typeof window.afterHook === 'function') {
              window.afterHook()
            }
          })
          .catch((err) => {
            // console.log(err)
            window.location.href = this._config.errorPage
          })          
        })
        /* eslint-enable */
    }

    setUpUrl(url) {
      $(Selector.NAV_LINK).removeClass(ClassName.ACTIVE)
      $(Selector.NAV_DROPDOWN).removeClass(ClassName.OPEN)

      $(`${Selector.NAV_DROPDOWN}:has(a[href="${url.split('?')[0]}"])`).addClass(ClassName.OPEN)
      $(`${Selector.NAV_ITEM} a[href="${url.split('?')[0]}"]`).addClass(ClassName.ACTIVE)

      // Setup Breadcrumb
      let menuName = '<li class="breadcrumb-item"><a href="/">Home</a></li>'
      /* eslint-disable */
      $.menuElement = $('nav .nav li:has(a[href="' + url.split('?')[0] + '"])')
      if ($.menuElement.parent().parent().hasClass('nav-dropdown open')) {
        $.menuElementParentName = $.menuElement.parent().parent().find('span:first').text()
        menuName += '<li class="breadcrumb-item">' + $.menuElementParentName + '</li>'
      }
      menuName += '<li class="breadcrumb-item active">' + $('nav .nav li:has(a[href="' + url.split('?')[0] + '"])').find('.active').find('span').first().text() + '</li>'
      /* eslint-enable */
      $('#breadcrumb').html(menuName)

      this.loadPage(url)
    }

    loadBlank(url) {
      window.open(url)
    }

    loadTop(url) {
      window.location = url
    }

    // Private

    _getConfig(config) {
      config = {
        ...Default,
        ...config
      }
      return config
    }

    _addEventListeners() {
      $(document).on(Event.CLICK, '.ajaxLink', (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.loadPage(event.currentTarget.getAttribute('href'))
      })

      $(document).on(Event.CLICK, `${Selector.NAV_LINK}[href!="#"]`, (event) => {
        event.preventDefault()
        event.stopPropagation()

        if (event.currentTarget.target === '_top') {
          this.loadTop(event.currentTarget.href)
        } else if (event.currentTarget.target === '_blank') {
          this.loadBlank(event.currentTarget.href)
        } else {
          this.setUpUrl(event.currentTarget.getAttribute('href'))
        }
      })
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY)
        const _config = typeof config === 'object' && config

        if (!data) {
          data = new AjaxLoad(this, _config)
          $(this).data(DATA_KEY, data)
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = AjaxLoad._jQueryInterface
  $.fn[NAME].Constructor = AjaxLoad
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return AjaxLoad._jQueryInterface
  }

  return AjaxLoad
})($)

export default AjaxLoad

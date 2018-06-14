import $ from 'jquery'

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
    defaultPage       : 'views/main.html',
    errorPage         : 'views/404.html',
    subpagesDirectory : ''
  }

  class AjaxLoad {
    constructor(element, config) {
      this._config = this._getConfig(config)
      this._element = element

      const url = location.hash.replace(/^#/, '')

      if (url !== '') {
        this.setUpUrl(url)
      } else if ($('#ui-view').html() === '') {
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
      const config = this._config

      if (typeof window.beforeHook === 'function') {
        window.beforeHook()
      }

      window.location.hash = url.replace('/#/', '/')
      $.ajax({
        type : 'GET',
        url : config.subpagesDirectory + url.replace('/#/', '/'),
        dataType : 'html',
        success(result) {
          $('#ui-view').html(result)
          if (typeof window.afterHook === 'function') {
            window.afterHook()
          }
        },
        error() {
          $.ajax({
            type : 'GET',
            url : config.errorPage,
            dataType : 'html',
            success(result) {
              $('#ui-view').html(result)
              if (typeof window.afterHook === 'function') {
                window.afterHook()
              }
            },
            error() {
              window.location.href = config.errorPage
            }
          })
        }
      })
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
      $(document).on(Event.CLICK, '[href]', (event) => {
        // console.log($(this).attr('href'))
        if (event.currentTarget.getAttribute('href').startsWith('/#/')) {
          event.preventDefault()
          event.stopPropagation()
          // console.log("ajax")
          if (event.currentTarget.target === '_top') {
            this.loadTop(event.currentTarget.href)
          } else if (event.currentTarget.target === '_blank') {
            this.loadBlank(event.currentTarget.href)
          } else {
            this.setUpUrl(event.currentTarget.getAttribute('href'))
          }
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

var EventsMixin = require('../events'),
    Route       = require('./route'),
    utils       = require('../utils')

class DragonRouter {

  constructor(options) {

    this._currentHandler = null
    this._currentUrl = null
    this._debug = options.debug || false
    this._history = window.history
    this._location = window.location
    this._routes = []
    this._started = false

    this.options = options

    document.addEventListener('click', this.onLinkClick.bind(this), false)

    window.router = this

  }

  back() {
    window.history.back()
  }

  forward() {
    window.history.forward()
  }

  getPath() {

    //path.charAt(0) === '/' ? path.slice(1) : path;
    return window.location.pathname

  }

  get(pattern, options = {}) {

    var route = new Route(pattern)

    this._routes.push({route, options})

    /*let forwardPath = arguments[1]

    // Forward route
    if(typeof forwardPath == 'string') {

      this.navigate(forwardPath)
      return
    }

    return this.router.get(path, (req, next) => {

      this.currentHandler = handler

      handler.call(this.router, req, next)

    })*/

  }

  navigate(path, options = {}) {

    this._history[options.replace ? 'replaceState' : 'pushState']({}, document.title, path)
    this.onUrlChange()

  }

  onLinkClick(e) {

    var el = e.target

    if(el.nodeName == 'A') {

      var href = el.getAttribute('href'),
          rel  = el.getAttribute('rel')

      if(!href || href == '' || href.charAt(0) == '#' || (rel && rel == 'external')) return

      /*if(external) {
        window.open(href)
      }*/

      e.preventDefault()

      this.navigate(href)

    }

  }

  onUrlChange() {

    var matched = false,
        path    = this.getPath()

    console.log("url change detected", path)

    for(var i = 0, l = this._routes.length; i < l; i++) {

      var item    = this._routes[i],
          options = item.options,
          route   = item.route

      if(route.regExp.test(path)) {
        console.log("route matched", path)

        var params = route.extractParams(path)

        this.trigger('match', route, params, options)
        matched = true

        break
      }

    }

  }

  start(options = {}) {

    if(this._started) return console.error('Router already started.')

    this._started = true

    this._usePushState = true

    window.addEventListener('popstate', this.onUrlChange.bind(this), false)

    /*
    popstate doesn't fire on page load
    */
    this.onUrlChange()

  }

  stop() {

    if(!this._started) return

    window.removeEventListener('popstate', this.onUrlChange, false)

    this._started = false

  }

  use() {



  }

  dispose() {

    this.stop()

    document.removeEventListener('click', this.onLinkClick, false)

  }

}

Object.assign(DragonRouter.prototype, EventsMixin)

module.exports = DragonRouter

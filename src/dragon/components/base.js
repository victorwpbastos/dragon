var utils = require('../utils')

class DragonComponent {

  constructor(options = {}) {
    this.uid = utils.uniqueId(this)

    this.options = options

  }

  dispose() {

    if(!this.disposed) {

      utils.dispose(this)

    }

  }

}

DragonComponent.prototype.disposed = false

module.exports = DragonComponent

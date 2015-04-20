(function () {
  "use strict";

  var namespace = angular.module("app");

  namespace.value("Progressbar", Progressbar);

  function Progressbar(parent) {
    this.parent = parent;

    this.control = {};

    this.control.value = 0;
    this.control.status = 'new';
  }

  Progressbar.prototype.start = function() {
    var self = this;

    this.control.value = 0;
    this.control.status = 'new';

    this.ticker = this.parent.interval(function () {
      self.increment();
    }, 2000);

    this.parent.scope.$on('$destroy', function() {
      self.parent.interval.cancel(self.ticker);
      //self.ticker = null;
    });
  };

  Progressbar.prototype.stop = function() {
    this.control.value = 100;
    this.control.status = 'success';

    this.parent.interval.cancel(this.ticker);
  };

  Progressbar.prototype.increment = function() {
    this.control.value = this.control.value+10;

    if(this.control.value == 100) {
      this.control.value = 0;
    }
  };

  Progressbar.prototype.error = function() {
    this.control.status = 'error';
  };

})();


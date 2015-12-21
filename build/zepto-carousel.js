;
(function($, window, document, undefined) {
  'use strict';

  function setWidth(element, width) {
    element.css({
      width: width + '%'
    });
  }

  function doTransform(element, x, speed) {
    var transObj = {};
    if(x !== undefined) {
      transObj['transform'] = transObj['-webkit-transform'] = 'translate3d(' + x  + '%, 0, 0)';
    }

    if(speed !== undefined) {
      transObj['transition-duration'] = transObj['-webkit-transition-duration'] = speed + 'ms';
    }

    element.css(transObj);

    return element;
  }

  function expandImgList(eleList) {
    var eleFirst = eleList.first();
    var eleLast = eleList.last();

    eleLast.clone(true).insertBefore(eleFirst);
    eleFirst.clone(true).insertAfter(eleLast);
  }

  var ZeptoCarousel = function(element, options) {
    this.defaults = {
      interval: 6000,
      speed: 500,
      callback: function(element, index) {
        return;
      }
    };

    this.options = $.extend({}, this.defaults, options);

    this.init(element);
    this.start();
  };

  ZeptoCarousel.prototype.init = function(element) {
    var self = this;

    this.isCarousing = true;
    this.currentIndex = 1;
    this.carouselIntervalTimeout = undefined;

    this.carouselList = element.find('.carousel-list');
    this.carouselAnchor = element.find('.carousel-anchor').children();
    
    this.imgList = this.carouselList.children();
    expandImgList(this.imgList);
    this.imgList = this.carouselList.children();
    this.imgCount = this.imgList.length;

    this.oneWidth = (100 / this.imgCount - 0.001).toFixed(3);

    setWidth(this.carouselList, this.imgCount * 100);
    setWidth(this.imgList, this.oneWidth);

    doTransform(this.carouselList, -this.oneWidth);

    element.on('swipeRight', function() {
      if (self.isCarousing) {
        self.start('pre');
        self.isCarousing = false;
      }
    }).on('swipeLeft', function() {
      if (self.isCarousing) {
        self.start('next');
        self.isCarousing = false;
      }
    });

    self.setAnchor();
  };

  ZeptoCarousel.prototype.start = function(direction) {
    var self = this;
    self.carouselIntervalTimeout && clearInterval(self.carouselIntervalTimeout);
    direction && self.carouselShow(direction);
    self.carouselIntervalTimeout = setInterval(function() {
      self.carouselShow();
    }, self.options.interval);
  };

  ZeptoCarousel.prototype.finish = function() {
    doTransform(this.carouselList, undefined, 0);

    if(this.currentIndex === this.imgCount - 1) {
      this.currentIndex = 1;
    } else if(this.currentIndex === 0) {
      this.currentIndex = this.imgCount - 2;
    }

    doTransform(this.carouselList, -this.currentIndex * this.oneWidth);

    this.setAnchor();

    this.options.callback(this.imgList.eq(this.currentIndex), this.currentIndex);
    this.isCarousing = true;
  };

  ZeptoCarousel.prototype.carouselShow = function(direction) {
    var self = this;

    direction === 'pre' ? self.currentIndex-- : self.currentIndex++;
    self.currentIndex = (self.currentIndex + self.imgCount) % self.imgCount;

    doTransform(self.carouselList, -self.currentIndex * self.oneWidth, self.options.speed);

    setTimeout(function() {
      $.proxy(self.finish, self)();
    }, self.options.speed);
  };

  ZeptoCarousel.prototype.setAnchor = function() {
    this.carouselAnchor.removeClass('active').eq(this.currentIndex - 1).addClass('active');
  };

  $.fn.ZeptoCarousel = function(options) {
    this.each(function(index, element) {
      return new ZeptoCarousel($(element), options);
    });
    return this;
  };

})(Zepto, window, document);

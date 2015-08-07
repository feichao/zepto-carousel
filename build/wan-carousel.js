;
(function($, window, document, undefined) {
  'use strict';

  var WanCarousel = function(element, options) {
    this.defaults = {
      interval: 6000,
      speed: 500,
    };
    this.options = $.extend({}, this.defaults, options);
    this.canDo = true;
    this.currentIndex = 0;
    this.carouselIntervalTimeout = undefined;
    this.element = element;
    this.imgList = element.find('.carousel-list img');
    this.imgCount = this.imgList.length || -1;
    this.imgInfo = this.imgList.map(function(index, img) {
      var itemp = $(img);
      return {
        src: itemp.attr('src') || '',
        href: itemp.parent().attr('href') || null
      };
    });
  };

  //初始化DOM
  WanCarousel.prototype.initDom = function() {
    if (this.imgCount > 0) {
      var imgSrc = this.imgInfo[0].src;
      var content = ['<div class="carousel-content">',
        '<a>',
        '<img class="item-left" src="' + imgSrc + '" alt="img">',
        '<img class="item-middle" src="' + imgSrc + '" alt="img">',
        '<img class="item-right" src="' + imgSrc + '" alt="img">',
        '</a>',
        '</div>'
      ].join('');

      var direction = ['<div class="carousel-direction">',
        '<a href="javascript:void(0)" class="carousel-direction-left">',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">',
        '<path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"></path>',
        '</svg>',
        '</a>',
        '<a href="javascript:void(0)" class="carousel-direction-right">',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">',
        '<path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path>',
        '</svg>',
        '</a>',
        '</div>'
      ].join('');

      this.element.append(content);
      this.element.append(direction);
      return true;
    }
    return false;
  };

  //事件绑定
  WanCarousel.prototype.bind = function() {
    var self = this;

    self.imgContent = self.element.find('.carousel-content img');
    self.imgContentLeft = self.element.find('.carousel-content .item-left');
    self.imgContentMiddle = self.element.find('.carousel-content .item-middle');
    self.imgContentRight = self.element.find('.carousel-content .item-right');
    self.direction = self.element.find('.carousel-direction');

    self.element.delegate('.carousel-content', 'mouseenter', function() {
      self.direction.removeClass('hidden');
    }).delegate(self.element.selector, 'mouseleave', function() {
      self.direction.addClass('hidden');
    }).delegate('.carousel-direction-left', 'click', function() {
      if (self.canDo) {
        self.start('pre');
        self.canDo = false;
      }
    }).delegate('.carousel-direction-right', 'click', function() {
      if (self.canDo) {
        self.start('next');
        self.canDo = false;
      }
    });

  };

  //开始运行
  WanCarousel.prototype.start = function(direction) {
    var self = this;

    self.carouselIntervalTimeout && clearInterval(self.carouselIntervalTimeout);
    direction && self.carouselShow(direction);
    self.carouselIntervalTimeout = setInterval(function() {
      self.carouselShow();
    }, self.options.interval);
  };

  WanCarousel.prototype.finish = function() {
    var imgTemp = this.imgInfo[this.currentIndex];
    this.imgContentMiddle.attr('src', imgTemp.src).parent().attr('href', imgTemp.href);
    this.imgContent.css({
      'right': '33.333333%'
    });
    this.canDo = true;
  };

  WanCarousel.prototype.carouselShow = function(direction) {
    var self = this;
    var imgInfo = undefined;
    var dirTemp = undefined;

    if (direction === 'pre') {
      self.currentIndex = (self.currentIndex + self.imgCount - 1) % self.imgCount;
      dirTemp = '0.000000%'; //bug in IE8, '0' is not good
      imgInfo = self.imgInfo[self.currentIndex];
      self.imgContentLeft.attr('src', imgInfo.src).parent().attr('href', imgInfo.href);
    } else {
      self.currentIndex = (self.currentIndex + 1) % self.imgCount;
      dirTemp = '66.666666%';
      imgInfo = self.imgInfo[self.currentIndex];
      self.imgContentRight.attr('src', imgInfo.src).parent().attr('href', imgInfo.href);
    }

    self.imgContent.animate({
      'right': dirTemp
    }, self.options.speed, 'swing', function() {
      self.finish();
    });
  };

  $.fn.WanCarousel = function(options) {
    this.each(function(index, element) {
      var wanCarousel = new WanCarousel($(element), options);
      if (wanCarousel.initDom()) {
        wanCarousel.bind();
        wanCarousel.start();
      }
    });
    return this;
  };

})(jQuery, window, document);

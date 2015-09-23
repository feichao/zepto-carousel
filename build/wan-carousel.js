;
(function($, window, document, undefined) {
  'use strict';

  var hasSVG = (function() {
    var SVG_NS = 'http://www.w3.org/2000/svg';
    return !!document.createElementNS &&
      !!document.createElementNS(SVG_NS, 'svg').createSVGRect;
  })();

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
      var content = [
        '<div class="carousel-content">',
        '  <a>',
        '    <img class="item-left" src="' + imgSrc + '" alt="img">',
        '    <img class="item-middle" src="' + imgSrc + '" alt="img">',
        '    <img class="item-right" src="' + imgSrc + '" alt="img">',
        '  </a>',
        '</div>'
      ].join('');

      var direction = [
        '<div class="carousel-direction hidden">',
        '  <a href="javascript:void(0)" class="carousel-direction-left"></a>',
        '  <a href="javascript:void(0)" class="carousel-direction-right"></a>',
        '</div>'
      ].join('');

      var anchor = '';
      for(var i=0; i<this.imgCount; i++){
        anchor += '<a href="javascript:void(0)" data-index="' + i + '"></a>';
      }
      anchor = '<div class="carousel-anchor">' + anchor + '</div>';

      this.element.append(content);
      this.element.append(direction);
      this.element.append(anchor);
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

    self.element.delegate('.carousel-content', 'mouseover', function() {
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
    }).delegate('.carousel-anchor > a', 'click', function(event) {
      var index;
      if (self.canDo) {
        index = $(this).data('index');
        self.goTo(index);
        self.canDo = false;
      }
    });;

    self.setAnchor();
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

  WanCarousel.prototype.goTo = function(index) {
    var self = this;
    var differ = self.currentIndex - index;
    var direction;
    
    if(differ > 0) {
      direction = 'pre';
    } else if (differ < 0) {
      direction = 'next';
    } else {
      return;
    }

    self.carouselIntervalTimeout && clearInterval(self.carouselIntervalTimeout);
    self.carouselShow(direction, index);
    self.carouselIntervalTimeout = setInterval(function() {
      self.carouselShow();
    }, self.options.interval);
  };

  WanCarousel.prototype.carouselShow = function(direction, index) {
    var self = this;
    var imgInfo = undefined;
    var dirTemp = undefined;

    if (direction === 'pre') {
      self.currentIndex = index >= 0 ? index : (self.currentIndex + self.imgCount - 1) % self.imgCount;
      dirTemp = '0.000000%'; //bug in IE8, '0' is not good
      imgInfo = self.imgInfo[self.currentIndex];
      self.imgContentLeft.attr('src', imgInfo.src).parent().attr('href', imgInfo.href);
    } else {
      self.currentIndex = index >= 0 ? index : (self.currentIndex + 1) % self.imgCount;
      dirTemp = '66.666666%';
      imgInfo = self.imgInfo[self.currentIndex];
      self.imgContentRight.attr('src', imgInfo.src).parent().attr('href', imgInfo.href);
    }

    self.setAnchor();

    self.imgContent.animate({
      'right': dirTemp
    }, self.options.speed, 'swing', function() {
      self.finish();
    });
  };

  WanCarousel.prototype.setAnchor = function() {
    $('.carousel-anchor > a').css({
      'background-color': 'white'
    });
    $('.carousel-anchor > a[data-index="' + this.currentIndex + '"]').css({
       'background-color': 'black'
    });
  }

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

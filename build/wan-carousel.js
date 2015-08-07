;
(function($, window, document, undefined) {
  'use strict';

  var content = ['<div class="carousel-content">',
    '<a href="#">',
    '<img class="item-left" src="img/1.jpg" alt="img">',
    '<img class="item-middle" src="img/1.jpg" alt="img">',
    '<img class="item-right" src="img/1.jpg" alt="img">',
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

  var carouselIntervalTimeout = undefined;

  var WanCarousel = function(element, options) {
    element.append(content);
    element.append(direction);

    this.defaults = {
      interval: 6000,
      speed: 600,
    };
    this.options = $.extend({}, this.defaults, options);

    this.currentIndex = 0;
    this.element = element;
    this.imgList = element.children('.carousel-list').find('img');
    this.imgCount = this.imgList.length || -1;
    this.imgInfo = this.imgList.map(function(index, img) {
      var itemp = $(img);
      return {
        src: itemp.attr('src'),
        href: itemp.parent().attr('href') || null
      };
    });
    this.imgContent = $('.carousel-content img');
    this.imgContentLeft = $('.carousel-content .item-left');
    this.imgContentMiddle = $('.carousel-content .item-middle');
    this.imgContentRight = $('.carousel-content .item-right');
    this.direction = $('.carousel-direction');
  };

  WanCarousel.prototype.bind = function() {
    var self = this;
    var canNext = true;
    var canPre = true;

    $(document).delegate(self.element.selector, 'mouseenter', function() {
      self.direction.removeClass('hidden');
    }).delegate(self.element.selector, 'mouseleave', function() {
      self.direction.addClass('hidden');
    });

    self.element.delegate('.carousel-direction-left', 'click', function() {
      if (canPre) {
        self.start('pre');
        canPre = false;
        setTimeout(function() {
          canPre = true;
        }, self.options.speed);
      }
    }).delegate('.carousel-direction-right', 'click', function() {
      if (canNext) {
        self.start('next');
        canNext = false;
        setTimeout(function() {
          canNext = true;
        }, self.options.speed);
      }
    });

  };

  WanCarousel.prototype.start = function(direction) {
    var self = this;

    carouselIntervalTimeout && clearInterval(carouselIntervalTimeout);
    if (direction) {
      self.carouselShow(direction);
    }

    carouselIntervalTimeout = setInterval(function() {
      self.carouselShow();
    }, self.options.interval);
  };

  WanCarousel.prototype.finish = function() {
    this.imgContentMiddle.attr('src', this.imgInfo[this.currentIndex].src).parent().attr('href', this.imgInfo[this.currentIndex].href);
    this.imgContent.css({
      'right': '33.33333%'
    });
  };

  WanCarousel.prototype.carouselShow = function(direction) {
    var self = this;
    if (direction === 'pre') {
      this.currentIndex = (this.currentIndex + this.imgCount - 1) % this.imgCount;
      this.imgContentLeft.attr('src', this.imgInfo[this.currentIndex].src).parent().attr('href', this.imgInfo[this.currentIndex].href);
      this.imgContent.animate({
        'right': '0.00000%' //bug in IE8, '0' is not good
      }, this.options.speed, 'swing', function() {
        self.finish();
      });
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.imgCount;
      this.imgContentRight.attr('src', this.imgInfo[this.currentIndex].src).parent().attr('href', this.imgInfo[this.currentIndex].href);
      this.imgContent.animate({
        'right': '66.66666%'
      }, this.options.speed, 'swing', function() {
        self.finish();
      });
    }
  };

  $.fn.WanCarousel = function(options) {
    var wanCarousel = new WanCarousel(this, options);
    wanCarousel.bind();
    wanCarousel.start();
    return this;
  };

})(jQuery, window, document);

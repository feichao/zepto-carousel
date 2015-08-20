## wan-carousel,  a jQuery Carousel

### [demo](http://blog.0xfc.cn/2015/08/11/carousel/) ###

>demo/test.html

**prepare to use**

>-include jQuery
> 
>-include bulid/wan-carousel.css 
> 
>-include build/wan-carousel.js
> 
>-in your html:
> 
> ``` html
> <div class="wan-carousel" style="width: 50%; float:left;">
>   <div class="carousel-list">
>     <a href="#">
>       <img src="img/1.jpg" alt="img">
>     </a>
>     <img src="img/2.jpg" alt="img">
>   </div>
> </div>
> ```

**how to use**



>$(".wan-carousel").WanCarousel();

**options**

If you want goto some pages when user click the image, you can wrap the image with `<a href="link"></a>`. 

>interval: millisecond.
>
>speed: millisecond.
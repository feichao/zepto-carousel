## Zepto 图片轮播组件

标签：zepto carousel 

---
 
 - **DEMO**
>demo/index.html

 - **准备使用**

>-include zepto
>
>-include bulid/zepto-carousel.css 
>
>-include build/zepto-carousel.js
>

HTML中添加下述代码，carousel-list是图片所在列表，carousel-anchor是图片底部的锚点。

``` html
<div class="zepto-carousel">
    <div class="carousel-list">
        <a href="#">
            <img src="img/1.jpg" alt="img">
        </a>
    </div>
    <div class="carousel-anchor">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
</div>
```
 - **Javascript中**
参数说明：interval表示多久轮换一次图片，默认6000ms。speed表示图片移动的时间，默认500ms。callback为轮换一张图片完成后的回调函数，参数为当前图片和当前索引。
```
var options = {
    interval: 6000,
    speed: 500,
    callback: function(element, index) {
        return;
    }
};
$(".zepto-carousel").ZeptoCarousel(options);
```


# fullPage.js
#### 仿造[fullPage.js](https://alvarotrigo.com/fullPage/#firstPage)
#### [线上demo](https://hwlv.github.io/myplugin/)
#### 自己参照网上教程写了一个，加了注释。主要是练习造轮子的能力，需求是不断变化的只拿来用的话谁都会，只有掌握了核心的技术，遇到复杂的需求才不会犯难。以后会按照官网逐渐完善其他功能。欢迎star。
![preview](https://github.com/hwlv/myplugin/blob/master/fullpage/image/demo.png)
#### 使用方法

```html
<script src="js/fullpage.js"></script>
<div id="container" data-PageSwitch="">
    <div class="sections">
        <div class="section" id="section0">page321</div>
        <div class="section" id="section1"></div>
        <div class="section" id="section2"></div>
        <div class="section" id="section3"></div>
    </div>
</div>
````

```javascript
    $('#container').PageSwitch({
        direction:'vertical',//horizontal,vertical
        loop:true,
        easing:'ease-in-out',
        duration:'700'
    });
````
#### 赏一杯咖啡给小编。
![preview](https://github.com/hwlv/myplugin/blob/master/fullpage/image/code.png)

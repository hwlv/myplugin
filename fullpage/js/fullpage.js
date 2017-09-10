/**
 * Created by hwlv on 2017/8/25.
 */
/**
 * 对象级别组件开发：挂在jquery原型下的方法，动态方法
 * $.fn.myPlugin=function(){}
 * $.fn=$.prototype

 */
(function ($) {
    /*返回浏览器前缀*/
    var _prefix = (function (temp) {
        var aPrefix = ['webkit', 'Moz', 'o', 'ms'],
            props = '';
        for (var i in aPrefix) {
            props = aPrefix[i] + 'Transition';
            if (temp.style[props] !== undefined) {
                return '-' + aPrefix[i].toLowerCase() + '-';
            }
        }
        return false;
    })(document.createElement(PageSwitch));
    console.log('_prefix:' + _prefix);
    var privateFun = function () {

    }
    var PageSwitch = (function () {
        function PageSwitch(element, options) {
            this.settings = $.extend(true, $.fn.PageSwitch.defaults, options || {})
            this.element = element;
            this.init();
        }

        PageSwitch.prototype = {
            /*说明：初始化dom结构，布局，分页及绑定事件(函数名带_的说明是私有方法)*/
            init: function () {
                console.log('init..');
                var me = this;
                me.selectors = me.settings.selectors;
                me.sections = me.element.find(me.selectors.sections);
                me.section = me.element.find(me.selectors.section);
                me.direction = me.settings.direction == 'vertical' ? true : false;
                me.pagesCount = me.pageCount();
                /*当前展示页的索引值*/
                me.index = (me.settings.index >= 0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;
                me.canscroll=true;//动画锁，是否允许滑动，一个滑动动画结束后马上锁定，防止一次性滑动多个页面
                /*如果不是默认水平布局(垂直布局)*/
                if (!me.direction ) {//|| me.index
                    me._initLayout();
                }
                if (me.settings.pagination) {
                    me._initPaging();
                }
            },
            /*获取滑动页面数量*/
            pageCount: function () {
                return this.section.length;
            },
            /*获取滑动的宽度或高度*/
            switchLength: function () {
                return this.direction ? this.element.height() : this.element.width();
            },
            prev: function () {
                var me = this;
                if (me.index > 0) {
                    me.index--;
                } else if (me.settings.loop) {
                    me.index = me.pagesCount - 1;
                }
                me._scrollPage();
            },
            next: function () {
                var me = this;
                if (me.index < me.pagesCount) {
                    me.index++;
                } else if (me.settings.loop) {
                    me.index = 0;
                }
                me._scrollPage();
            },
            /*主要针对横屏情况进行布局*/
            _initLayout: function () {
                var me = this;
                var width = (me.pagesCount * 100) + '%',
                    cellWidth = (100 / me.pagesCount).toFixed(2) + '%';
                me.sections.width(width);
                me.section.width(cellWidth).css('float', 'left');

            },
            /*分页的dom结构及css样式*/
            _initPaging: function () {
                var me = this,
                    pagesClass = me.selectors.page.substring(1);
                me.activeClass = me.selectors.active.substring(1);
                var pageHtml = "<ul class='" + pagesClass + "'>";
                for (var i = 0; i < me.pagesCount; i++) {
                    pageHtml += '<li></li>';
                }
                pageHtml += '</ul>';
                me.element.append(pageHtml);
                var pages = me.element.find(me.selectors.page);
                me.pageItem = pages.find('li');
                me.pageItem.eq(me.index).addClass(me.activeClass);
                if (me.direction) {
                    pages.addClass('vertical');
                } else {
                    pages.addClass('horizontal');
                }
                me._initEvent();
            },
            /*初始化插件事件*/
            _initEvent: function () {
                var me = this;
                // 鼠标点击事件
                me.element.on('click', me.selectors.page + ' li', function () {
                    me.index = $(this).index();
                    me._scrollPage();
                })

                me.element.on("mousewheel DOMMouseScroll", function (e) {
                    if(me.canscroll){
                        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                        if (delta > 0 && (me.index && !me.settings.loop || me.settings.loop)) {
                            me.prev();
                        } else if (delta < 0 && (me.index < (me.pagesCount - 1) && !me.settings.loop || me.settings.loop)) {
                            me.next();
                        }
                    }

                })
                if (me.settings.keyboard) {
                    $(window).on('keydown', function () {
                        var keyCode = e.keyCode;
                        if (keyCode == 37 || keyCode == 38) {
                            me.prev();
                        } else if (keyCode == 39 || keyCode == 40) {
                            me.next();
                        }
                    })
                }
                $(window).resize(function () {
                    var currentLength = me.switchLength(),
                        offset = me.settings.direction ? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;
                    if (Math.abs(offset) > currentLength / 2 && me.index < (me.pageCount - 1)) {
                        me.index++;
                    }
                    if (me.index) {
                        me._scrollPage();
                    }
                })
                /*动画结束*/
                me.sections.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function () {
                    me.canscroll=true;
                    if (me.settings.callback && $.type(me.settings.callback) === 'function') {
                        me.settings.callback();
                    }
                })
            },
            _scrollPage:function () {
                var me = this;
                var dest = me.section.eq(me.index).position();
                if(!dest)return;
                me.canscroll=false;
                if(_prefix){
                    var translate = me.direction ? "translateY(-"+dest.top+"px)" : "translateX(-"+dest.left+"px)";
                    me.sections.css(_prefix+"transition", "all " + me.settings.duration + "ms " + me.settings.easing);
                    me.sections.css(_prefix+"transform" , translate);
                    /*如果不支持translate属性，使用animate替代*/
                }else{
                    var animateCss = me.direction ? {top : -dest.top} : {left : -dest.left};
                    me.sections.animate(animateCss, me.settings.duration, function(){
                        me.canscroll=true;
                        if (me.settings.callback && $.type(me.settings.callback) === 'function') {
                            me.settings.callback();
                        }
                    });
                }
                if(me.settings.pagination){
                    me.pageItem.eq(me.index).addClass(me.activeClass).siblings("li").removeClass(me.activeClass);
                }
            }
        }
        return PageSwitch;
    })();
    $.fn.PageSwitch = function (options) {
        return this.each(function () {
            var me = $(this),
                instance = me.data('PageSwitch');
            if (!instance) {
                instance = new PageSwitch(me, options);
                me.data("PageSwitch", instance);
            }
            if ($.type(options) === 'string')return instance[options];
            // $('div').PageSwitch('init');
        })
    }
    $.fn.PageSwitch.defaults = {
        selectors: {
            sections: '.sections',
            section: '.section',
            page: '.pages',
            active: '.active'
        },
        index: 0,//当前哪一页进行展示
        easing: 'ease',//速度曲线，另外几种是(linear,ease-in,ease-out,ease-in-out,cubic-bezier(n,n,n,n))
        duration: 500,
        loop: false,
        pagination: true,
        keyboard: true,
        direction: "vertical",//horizontal
        callback: ''
    }
})(jQuery)


// $(function () {
//     $('[data-PageSwitch]').PageSwitch();
// })
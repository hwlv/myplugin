
闭包的作用：
    避免全局依赖
    避免第三方破坏
    兼容jquery操作符$和jquery

鼠标滚轮方向：
    // ie6:mouseWheel,火狐：DOMMouseScroll
    其他浏览器wheeldata属性，火狐通过detail属性来判断
    每次滚动-120，detail是3
键盘事件：
    ie:keycode
    firefox: which 和charCode
    opera:keyCode  和which
    jquery兼容了以上问题
单例模式：(data()来存放实例)
 $.fn.MyPlungin=function(){
 var me=$(this),
 if(!instance){
  me.data("myPlugin",(instance=new myPlungin()))
  }
 }
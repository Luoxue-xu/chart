/**
 * 
 * @authors Luoxue (xufengjun@mogucaifu.com)
 * @date    2015-10-13 09:50:48
 * @version 1.0.0
 * @tips 此js只兼容IE9+, Firefox, Google及移动端设备
 */


 // 创建Utils实例
function $(arg) {
     return new Utils(arg);
}

//创建构造函数，记录获取元素
function Utils(arg) {
    this.elements = document.querySelectorAll(arg);
}

// 绑定事件
Utils.prototype.bind = function(type, fn) {
    for(var i = 0, len = this.elements.length; i < len; i++) {
        this.elements.item(i).addEventListener(type, fn, false);
    }  
};

// 获取样式
Utils.prototype.css = function(value) {
    var computedStyle = document.defaultView.getComputedStyle(this.elements.item(0), null);
    return computedStyle[value];
};





// 判断是否为数组
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

// 寄生组合式继承
function inheritPrototype(subType, superType) {
    var prototype = superType.prototype;
    prototype.constructor = subType;
    subType.prototype = prototype;
}
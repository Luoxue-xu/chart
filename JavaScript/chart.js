/**
 * 
 *  @authors Luoxue (xufengjun@mogucaifu.com)
 *  @date    2015-10-13 09:50:48
 *  @version 1.0.0
 */


/* 
    常用的canvas API

    设置线条的颜色，默认颜色为#000000
    strokeStyle()

    fillStyle()

    设置线条的宽度，默认为1
    lineWidth()

    将canvas的当前状态存入栈中
    save()

    设置canvas使用之前的状态
    restore()

    表示开始绘制一条新的路径
    beginPath()

    表示结束绘制刚刚的路径
    closePath()
    stroke()

    绘制一条从起始位置到x,y点的路径
    lineTo(x, y)
    
    设置路径的起始位置
    moveTo(x, y)

    绘制一条曲线， cpx,cpy为控制点， x,y为结束点
    quadraticCurveTo(cpx, cpy, x, y)

    以贝塞尔曲线的方式绘制曲线，cp1x,cp1y和cp2x,cp2y为两个控制点, x,y为目标点
    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)

    绘制一条弧度，x1,y1和x2,y2为两个控制点，radius为半径.
    arcTo(x1, y1, x2, y2, radius)
    arc(x, y, radius, startAngle, endAngle , anticlockwise)
    createLinearGradient(x0, y0, x1, y1)
    createRadialGradient(x0, y0, r0, x1, y1, r1)

    清除以x,y为坐标原点，width,height为长宽区域内的动画帧
    clearRect(x, y, width, height)
    fillRect(x, y, width, height)
*/

// 创建基本图表坐标轴
function Chart(arg, options) {
    this.contain = document.querySelector(arg);

    // 创建画布
    this.canvas = document.createElement('canvas');

    //获得画布上下文
    this.context = this.canvas.getContext('2d');

    // 设置画布样式
    this.canvas.width = parseInt(document.defaultView.getComputedStyle(this.contain, null).width);
    this.canvas.height = parseInt(document.defaultView.getComputedStyle(this.contain, null).height);

    // 添加画布至容器
    this.contain.appendChild(this.canvas);

    this.options = options;

    // 坐标原点
    this.orgin = {
        x: this.options.orgin.x,
        y: this.canvas.height - this.options.orgin.y
    };

    // 画布中，坐标轴第一象限的数据
    this.map = {
        // 宽度
        width: this.canvas.width - this.options.orgin.x * 2,
        // 高度
        height: this.canvas.height -this.options.orgin.y * 2,

        // 左上角顶点
        left_top: {
            x: this.options.orgin.x,
            y: this.options.orgin.y
        },

        // 右上角顶点
        right_top: {
            x: this.canvas.width - this.options.orgin.x,
            y: this.options.orgin.y
        },

        // 右下角顶点
        right_bottom: {
            x: this.canvas.width - this.options.orgin.x,
            y: this.canvas.height - this.options.orgin.y
        },

        // 左下角顶点
        left_bottom: {
            x: this.options.x,
            y: this.canvas.height - this.options.orgin.y
        }
    };

    this.init();

}

Chart.prototype = {

    // 绘制基本信息
    init: function() {

        // 初始化部分数据
        this.context.lineWidth = 1;
        this.context.strokeStyle = '#ccc';
        this.context.font = '12px sans-serif';
        this.context.fillStyle = '#999';

        this.drawX();
        this.drawY();

    },

    // 绘制X轴
    drawX: function() {
        this.context.beginPath();
        this.context.moveTo(this.orgin.x, this.orgin.y);
        this.context.lineTo(this.canvas.width - this.options.orgin.x, this.orgin.y);
        this.context.stroke();
        
    },

    // 绘制Y轴
    drawY: function() {
        this.context.beginPath();
        this.context.moveTo(this.orgin.x, this.orgin.y);
        this.context.lineTo(this.options.orgin.x, this.options.orgin.y);
        this.context.stroke();
    },

    // 求数据中的最大值
    getMax: function(value, attr) {
        var data = value,
            maxVal = 0;

        if(!isArray(data[0])) {

            // 一组数据
            maxVal = data[0][attr];
            for(var i = 0, len = data.length; i < len; i++) {
                maxVal = maxVal > data[i][attr] ? maxVal : data[i][attr];
            }
            return maxVal * 1;
        }else {

            // 多组数据
            maxVal = data[0][0][attr];
            for(var j = 0, lens = data.length; j < lens; j++) {
                maxVal = maxVal > this.getMax(data[j], attr) ? maxVal : this.getMax(data[j], attr);
            }
            return maxVal * 1;
        }
    },

    // 求数据中的最小值
    getMin: function(value, attr) {
        var data = value,
            minVal = 0;

        if(!isArray(data[0])) {
            
            // 一组数据
            minVal = data[0][attr];
            for(var i = 0, len = data.length; i < len; i++) {
                minVal = minVal < data[i][attr] ? minVal : data[i][attr];
            }

            return minVal * 1;
        }else {

            // 多组数据
            minVal = data[0][0][attr];
            for(var j = 0, lens = data.length; j < lens; j++) {
                minVal = minVal < this.getMin(data[j], attr) ? minVal : this.getMin(data[j], attr);
            }
            return minVal * 1;
        }

    }

};
/**
 * 
 *  @authors Luoxue (xufengjun@mogucaifu.com)
 *  @date    2015-10-15 08:56:46
 *  @version 1.0.0
 */

/* 
    股票分时图绘制
    1. 股票Y轴表示的最近成交价格刻度是根据所有已展现数据的最大值及最小值读取
    2. X轴的数据是以固定的时间段为准
    3. 数据折线以数据量的大小决定密度
*/


// 创建股票分时图
function StockKChart(arg, options) {
    
    // 继承Chart的属性
    Chart.call(this, arg, options);

    this.initialize();

}

// 继承Chart的方法
inheritPrototype(StockKChart, Chart);

// 创建基本信息
StockKChart.prototype.initialize = function() {
    var opt = this.options;

    // Y轴刻度个数
    this.tickMark_Y = opt.yAxis.tickMark || 9;

    // X轴间距
    this.margin_X = (this.canvas.width - opt.orgin.x * 2) / (opt.xAxis.data.length - 1);

    // Y轴间距
    this.margin_Y = (this.orgin.y - opt.orgin.y) / (this.tickMark_Y - 1);

    // Y轴最大值
    this.maxVal = this.getMax(opt.series.data, opt.series.attr);

    // Y轴最小值
    this.minVal = this.getMin(opt.series.data, opt.series.attr);

    // X轴每单位占的像素值
    this.valueForOnePx_X = (this.canvas.width - opt.orgin.x * 2) / (opt.series.data.length - 1);

    // Y轴每单位占的像素值
    this.valueForOnePx_Y = (this.orgin.y - opt.orgin.y) / (this.maxVal - this.minVal);

    // 所有数据坐标点
    this.coordinatePoint = this.kpPointTranslate(opt.series.data, opt.series.attr, opt.series.sp, opt.series.zg, opt.series.zd);

    // 5日均线
    this.coordinatePoint5 = this.coordinatePointTranslate(opt.series.data, opt.series.attr5);

    // 10日均线
    this.coordinatePoint10 = this.coordinatePointTranslate(opt.series.data, opt.series.attr10);

    // 20日均线
    this.coordinatePoint20 = this.coordinatePointTranslate(opt.series.data, opt.series.attr20);

    // 初始化部分数据
    this.context.lineWidth = 1;
    this.context.strokeStyle = '#ccc';
    this.context.font = '12px sans-serif';
    this.context.fillStyle = '#999';

    this.drawXMark();
    this.drawYMark();

    console.log(this.coordinatePoint);

    this.drawDot(this.coordinatePoint);
    this.drawLine(this.coordinatePoint5);
    this.drawLine(this.coordinatePoint10);
    this.drawLine(this.coordinatePoint20);
    this.context.clearRect(0, 0, this.canvas.width, this.options.orgin.y);
    //this.drawLine(this.coordinatePoint);
};

// 绘制X轴刻度
StockKChart.prototype.drawXMark = function() {
    var opt = this.options;

    // 绘制X轴刻度
    for(var i = 0, len = opt.xAxis.data.length; i < len; i++) {
        this.context.fillText(
            opt.xAxis.data[i][opt.xAxis.attr],
            // 坐标原点 + 间距 + 文本宽度的一半(为了居中显示)
            this.orgin.x + i * this.margin_X - this.context.measureText(opt.xAxis.data[i][opt.xAxis.attr]).width / 2 ,
            this.orgin.y + 20
        );
    }
};

// 绘制Y轴
StockKChart.prototype.drawYMark = function() {

    // Y轴刻度等分值
    var divide_Y = (this.maxVal - this.minVal) / (this.tickMark_Y - 1);

    // 绘制Y轴刻度
    for(var i = (this.tickMark_Y - 1); i >= 0 ; i--) {
        this.context.fillText(
            (this.minVal + divide_Y * i).toFixed(2),
            this.orgin.x - this.context.measureText((this.minVal + divide_Y * i).toFixed(2)).width - 5,
            this.options.orgin.y + (this.tickMark_Y - 1 - i) * this.margin_Y
        );
    }
};

// 数据转换为坐标点
StockKChart.prototype.coordinatePointTranslate = function(value, attr) {
    var point = [],
        data = value;

    for(var i = 0, len = data.length; i < len; i++) {
        point.push({
            x: this.orgin.x + i * this.valueForOnePx_X,
            y: this.orgin.y - (data[i][attr] - this.minVal) * this.valueForOnePx_Y
        });
    }

    return point;
};

// 开盘数据转换为坐标点 attr开盘, sp收盘价, zg最高价, zd最低价
StockKChart.prototype.kpPointTranslate = function(value, kp, sp, zg, zd) {
    var point = [],
        data = value;

    for(var i = 0, len = data.length; i < len; i++) {
        if(data[i][sp] - data[i][kp] > 0) {
            point.push({
                x: this.orgin.x + i * this.valueForOnePx_X,
                y: this.orgin.y - (data[i][kp] - this.minVal) * this.valueForOnePx_Y,

                //今日开盘与昨日收盘差
                h: data[i][sp] - data[i][kp],

                // 最高价和与开盘价差
                zg_kp: data[i][zg] - data[i][kp],

                // 最低价与开盘价差
                zd_kp: data[i][zd] - data[i][kp],

                // 1表示涨，-1表示跌或者平
                b: 1
            });
        }else {
            point.push({
                x: this.orgin.x + i * this.valueForOnePx_X,
                y: this.orgin.y - (data[i][kp] - this.minVal) * this.valueForOnePx_Y,
                h: data[i][sp] - data[i][kp],
                zg_kp: data[i][zg] - data[i][kp],
                zd_kp: data[i][zd] - data[i][kp],
                b: -1
            });
        }
    }

    return point;
};

// 绘制数据点
StockKChart.prototype.drawDot = function(value) {
    var data = value,
        defaultWidth = this.map.width / data.length * 0.8, //条柱基础宽度
        defaultHeight = 1; //条柱高度参数

    for(var i = 0, len = data.length; i < len; i++) {
        this.context.beginPath();
        if(data[i].b === 1) {
            this.context.fillStyle = '#fc0000';
            this.context.strokeStyle = '#fc0000';
            this.context.rect(data[i].x, data[i].y - Math.abs(data[i].h * 100), defaultWidth, Math.abs(data[i].h * 100));
        }else{
            this.context.fillStyle = '#019700';
            this.context.strokeStyle = '#019700';
            this.context.rect(data[i].x, data[i].y, defaultWidth, Math.abs(data[i].h * 100));
        }
        this.context.closePath();
        this.context.fill();
        
        // 绘制上下影线
        this.context.beginPath();
        this.context.moveTo(data[i].x + defaultWidth / 2, data[i].y);
        this.context.lineTo(data[i].x + defaultWidth / 2, data[i].y - Math.abs(data[i].zg_kp * 100));
        this.context.moveTo(data[i].x + defaultWidth / 2, data[i].y);
        this.context.lineTo(data[i].x + defaultWidth / 2, data[i].y + Math.abs(data[i].zd_kp * 100));
        this.context.stroke();
    }
};

// 绘制折线
StockKChart.prototype.drawLine = function(value) {
    var data = value,
        opt = this.options;

    if(opt.series.data.length > 1) {
        this.context.strokeStyle = 'rgba(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', 1)';
    }

    for(var i = 0, len = data.length - 1; i < len; i++) {
        this.context.beginPath();
        this.context.moveTo(data[i].x, data[i].y);
        this.context.lineTo(data[i + 1].x, data[i + 1].y);
        this.context.stroke();
    }
};
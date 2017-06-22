/**
 * 
 *  @authors Luoxue (1904240744@qq.com)
 *  @date    2015-10-15 08:56:46
 *  @version 1.0.0
 */


// 创建单数据折线
function LinesChart(arg, options) {
    
    // 继承Chart的属性
    Chart.call(this, arg, options);

    this.initialize();

}

// 继承Chart的方法
inheritPrototype(LinesChart, Chart);

// 创建基本信息
LinesChart.prototype.initialize = function() {
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
    this.coordinatePoint = this.coordinatePointTranslate(opt.series.data, opt.series.attr);

    // 初始化部分数据
    this.context.lineWidth = 1;
    this.context.strokeStyle = '#ccc';
    this.context.font = '12px sans-serif';
    this.context.fillStyle = '#999';

    this.drawXMark();
    this.drawYMark();

    this.drawDot(this.coordinatePoint);
    this.drawLine(this.coordinatePoint);
};

// 绘制X轴刻度
LinesChart.prototype.drawXMark = function() {
    var opt = this.options;

    // 绘制X轴刻度
    for(var i = 0, len = opt.xAxis.data.length; i < len; i++) {
        this.context.fillText(
            opt.xAxis.data[i],
            // 坐标原点 + 间距 + 文本宽度的一半(为了居中显示)
            this.orgin.x + i * this.margin_X - this.context.measureText(opt.xAxis.data[i]).width / 2 ,
            this.orgin.y + 20
        );
    }
};

// 绘制Y轴
LinesChart.prototype.drawYMark = function() {

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
LinesChart.prototype.coordinatePointTranslate = function(value, attr) {
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

// 绘制数据点
LinesChart.prototype.drawDot = function(value) {
    var data = value;

    this.context.fillStyle = '#2ECC71';

    for(var i = 0, len = data.length; i < len; i++) {
        this.context.beginPath();
        this.context.arc(data[i].x, data[i].y, 2, 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.fill();
    }
};

// 绘制折线
LinesChart.prototype.drawLine = function(value) {
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

// 刷新数据
// StockMinuteChart.prototype.refresh = function(data) {
//     this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     this.init(data);
// };
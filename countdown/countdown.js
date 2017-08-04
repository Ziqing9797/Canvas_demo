var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

//const修饰的数据类型是指常类型，常类型的变量或对象的值是不能被更新的  //endtime 截至时间
// const endTime=new Date(2016,10,7,0,0,0); //new date() 不能超过距离现在的99小时 因为小时设定只有两位数 只能99小时 4天 月份0——11
//自动更新时间

//const endTime = new Date(2017,7,5,18,47,52);//截止日期

var endTime = new Date();
endTime.setTime(endTime.getTime() + 3600*1000);//1个小时倒计时

var curShowTimeSeconds = 0;//当前时间秒数为0

var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

window.onload = function(){

    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;

    MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
    RADIUS = Math.round(WINDOW_WIDTH * 4 /5 /108)-1;

    MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSeconds();
    setInterval(
        function () {
            render(context);
            update();//数据的变化
        },
        50
    );
}

//计算当前剩余时间
function getCurrentShowTimeSeconds() {
    var curTime = new Date();//取得当前的时间
    var ret = endTime.getTime() - curTime.getTime();//倒计时=结束时间-当前时间   //getTime()  得到毫秒数
    ret = Math.round(ret/1000);//round() 方法可把一个数字舍入为最接近的整数。//  ret/1000 把毫秒转换为秒
    return ret >= 0? ret:0;//判断reTime是否>=0 如果是 则返回 ret 否则返回0
}
//变化
function update() {
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();//得到下一个时间

    //下一个时间分解  parseInt()解析一个字符串，并返回一个整数
    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600)/60)
    var nextSeconds = nextShowTimeSeconds % 60;

    //当前时间分解
    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600)/60)
    var curSeconds = curShowTimeSeconds % 60;

    if(nextSeconds != curSeconds){

        if( parseInt(curHours/10) != parseInt(nextHours/10) ){
            addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
        }
        if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
        }

        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }
        curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();
}

function updateBalls(){

    for( var i = 0 ; i < balls.length ; i ++ ){

        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = - balls[i].vy*0.75;
        }
    }

    var cnt = 0;
    for(var i =0 ; i<balls.length;i++)
        if ( balls[i].x + RADIUS>0 && balls[i].x -RADIUS<WINDOW_WIDTH){
            balls[cnt++] = balls[i];
        }
        while (balls.length >Math.min(300,cnt)){
            balls.pop();
        }
}

function addBalls( x , y , num ){

    for( var i = 0  ; i < digit[num].length ; i ++ )
        for( var j = 0  ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),//加速度在1.5~2.5之间
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,//随机取正负4
                    vy:-5,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                }

                balls.push( aBall )
            }
}


function render( cxt ){

    //clearRect() 方法清空给定矩形内的指定像素
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);//对矩形图像（整个屏幕）刷新一次

    //当前的时间
    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours * 3600)/60)
    var seconds = curShowTimeSeconds % 60;

    //定义时间的在画布上的显示位置
    renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt )  //小时 //十位数  // 第一位 //起始位置 x y
    renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt )  //小时//个位数//第二位//
    renderDigit( MARGIN_LEFT + 30*(RADIUS + 1) , MARGIN_TOP , 10 , cxt )//冒号
    renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , cxt);
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);

    //绘制小球
    for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;

        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
        cxt.closePath();

        cxt.fill();
    }

}

//具体的循环//规定何处填充颜色
function renderDigit( x , y , num , cxt ){

    cxt.fillStyle = "rgb(0,102,153)";

    for( var i = 0 ; i < digit[num].length ; i ++ )
        for(var j = 0 ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){  //画圆
                cxt.beginPath();
                cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
                cxt.closePath()

                cxt.fill()
            }
}


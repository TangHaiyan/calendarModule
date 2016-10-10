(function() {


    //动态创建日历结构
    function CreateTable(rowCount, cellCount) {
      var table = $("<table>");
      for (var i = 0; i < rowCount; i++) {
        var tr = $("<tr></tr>");
        tr.appendTo(table);
        for (var j = 0; j < cellCount; j++) {
          if (i == 0) {
            var thDay = ["Su", "Mo", "Tu", "We", "Tu", "Fr", "Sa"];
            var th = $('<th>' + thDay[j] + '</th>');
            th.appendTo(tr);
          } else {
            var td = $("<td></td>");
            td.appendTo(tr);
          }
        }
      }
      return table.html();
    }
    //日期显示控件
    var templateControl='<div class="button">\
                           <div class="icon"></div>\
                           <div class="time"></div>\
                         </div>\
                         <div class="dateandday">\
                             <input class="date" type="text" name="date" value="2016-09-08">\
                             <input class="remind" type="text" name="remind" value="无事件">\
                          </div>';

    //所有td
    var dates = document.getElementsByTagName('td');


    //组件构造函数
    function Calendar(config) {
      this.config={
           //选中时间，默认为当前时间
           time:new Date(),
           //组件主题颜色
           customColorClass:"blue",
           //是否启用日期选择
           IsShowControl:true,
           //是否显示日历
           IsShowCalendar:true,           
           //选中单个或选中一段时间
           IsChooseSingle:false,
           //如果选择时间段，可选日期范围
           chooseRange:14,
           //选中一个日期后的回调函数
           chooseSingleCallback:function(){
                                   $('.remind').focus();
                                 },
           //选中一段日期后的回调函数
           chooseRangeCallback:function(){
                                   $('.remind').focus();
                                 },
           //档不满足范围时的回调函数
           chooseDisableCallback:function(){            
                                    alert('超出选择日期范围。');
                                },
           //接收一个日期字符串并返回一个日期对象。
           parseDate:null,
           //日期组件在哪个容器，默认在body
           container:this.body,
           //切换时是否启用动画.默认启用
           IsAnimate:true,

      }

       //默认参数扩展 （是否有传递新的参数，如果有，就替换掉某人参数。没有，就用默认参数。）
      if (config && $.isPlainObject(config)) {
        $.extend(this.config,config)
      }else{
        this.isConfig=true;
      }

      //获取当前的日期
      this.currentTime = new Date() ,
      this.currentDay = this.config.time.getDay(),
      this.currentYear = this.config.time.getFullYear(),
      this.currentMonth = this.config.time.getMonth(),
      this.currentHours=this.config.time.getHours(),
      this.currentMinutes=this.config.time.getMinutes(),
      this.currentDate = this.config.time.getDate();
      //创建基本的组件DOM节点
      this.body = $('body');
      this.container = this.body || this.container;
      this.calendar = $('<div class="m-calendar"></div>');
      this.calenderTitle = $('<div class="title"><span class="before arrow"></span><span class="year"></span><span>年</span><span class="month"></span><span>月</span><span class="after arrow"></span></div>');
      this.calendarBody = $('<div class="m-calendar-body"></div>');
      this.table = $('<table></table>');      
      this.table.html(CreateTable(7, 7));

      //创建控件的DOM节点
      this.control=$('<div class="m-calendar-control"></div>');
      //创建bottom
      this.chooseButton=$('<div class="choose"></div>');
      this.clearButton=$('<button class="clear">清除</button>');
      this.confirmButton=$('<button class="confirm">确认</button>');
      this.cancelButton=$('<button class="cancel">取消</button>');
      
      //初始日期的索引位置
      this.index =this.getIndex(this.currentYear,this.currentMonth,this.currentDate);

      //初始化组件实例
      this.renderUI();
      this.init();
      this.bindUI();
    }
    //日历组件的原型方法
    Calendar.prototype = {
       //注册事件
       on: function(event, fn) {
          var handles = this._handles || (this._handles = {}),
            calls = handles[event] || (handles[event] = []);
          // 找到对应名字的栈
          calls.push(fn);
          return this;
        },
        // 触发事件
        fire: function(event){
          var args = [].slice.call(arguments, 1),
            handles = this._handles, calls;

          if (!handles || !(calls = handles[event])) return this;
          // 触发所有对应名字（event）的listeners
          for (var i = 0, len = calls.length; i < len; i++) {
            calls[i].apply(this, args)
          }
          return this;
        },
        //构建DOM
        renderUI:function(){
            //创建DOM结构
            this.calenderTitle.appendTo(this.calendarBody);
            this.table.appendTo(this.calendarBody);
            this.calendarBody.appendTo(this.calendar);
            this.calendar.appendTo(this.container);
            this.calenderTitle.addClass(this.config.customColorClass);
            //创建日期显示窗口
            if (true) {this.config.IsShowControl}{
             this.control.html(templateControl);
             this.calendarBody.before(this.control);                       
            }
            //创建button
            if (this.config.IsShowControl) {
               this.clearButton.appendTo(this.chooseButton);
               this.confirmButton.appendTo(this.chooseButton);
               this.cancelButton.appendTo(this.chooseButton);
               this.chooseButton.appendTo(this.chooseButton); 
               this.calendarBody.after(this.chooseButton); 
            }         
        },

        //根据当前日期，计算当前日期所在表格位置，并填充title日期及当前日期类名。
        init: function() {

            this.GetDate(this.currentYear, this.currentMonth, this.currentDate);

            $(dates[this.index]).addClass(this.config.customColorClass);
            //$('.currentActive').css("backgroundColor",this.config.colorCss);
            //填充title
            $('.month').text(this.formatDate(this.config.time,"MM"));
            $('.year').text(this.formatDate(this.config.time,"yyyy"));
            //填充控件
            $('.time').text(this.formatDate(this.currentTime,"HH:mm"));
            $('.date').val(this.formatDate(this.config.time,"yyyy-MM-dd"));
            //根据传入参数判断，是否显示选择按钮
            if (this.config.IsChooseSingle) {
               this.chooseButton.hide();
            }else{
               this.chooseButton.show();
            }
            //根据传入参数判断，是否隐藏日历组件
            if (this.config.IsShowCalendar) {
               this.calendarBody.show();
            }else{              
               this.calendarBody.hide();
               this.chooseButton.hide();
            }
        },
        //绑定事件
        bindUI:function(){
            var that=this;

            this.calendar.delegate('.icon','click',function(){
                           that.fire('show');
                        }).delegate($('td'),'click',function(){
                           //that.fire('show');
                        }).delegate('.confirm','click',function(event){
                           that.fire('confirm');
                        }).delegate('.clear','click',function(event){
                           that.fire('clear');
                        }).delegate('.cancel','click',function(event){
                           that.fire('cancel');
                        })
            
            if (this.config.IsChooseSingle) {
                this.calendar.delegate('td','click',function(event){
                  console.log(2);
                   that.fire('single');
                })
            }
 
         },

        //获取给定日期当前索引值
        getIndex:function(year,month,date){
            var time = new Date(year, month, date);
            var  day = time.getDay();
            var x = day,
                y = date % 7 < x ? Math.ceil((date / 7)) : Math.ceil((date / 7)) + 1;
            var index = x + 7 * y - 7;
            return index;
        },
        //以当前日期为基准，向前向后填充整个日历表格。
        GetDate: function(year, month, date) {
          var time = new Date(year, month, date);
          var index=this.getIndex(year, month, date);
          $(dates[index]).text(date);

          //向前填充日期，并为上个月份日期添加类名。
          for (var i = index; i > 0; i--) {
            //闭包传递参数
              (function(num) {
                //如果为1月份，则年份减一，日期天数为12月的31天
                var beforYear = month == 0 ? year - 1 : year;
                var beforeDates = month == 0 ? 31 : new Date(year, month, 0).getDate();
                var firstDate=date + num- index - 1;
                var beforDate = firstDate > 0 ?firstDate : beforeDates + firstDate;
                $(dates[num - 1]).text(beforDate);
                if (firstDate - 1 < 0) {
                  $(dates[num - 1]).addClass('beforeMonth');
                }
              })(i)
          }
          //向后填充日期，并为下个月份日期添加类名。
          for (var i = index, lens = dates.length; i < lens; i++) {
              //闭包传递参数
              (function(num) {
                //如果为12月份，则年份加一。
                var afterYear = month == 11 ? year + 1 : year;
                var currentDates = new Date(year, month + 1, 0).getDate();
                var lastDate=date + num - index+1;
                var afterDate = lastDate-1 < currentDates ? lastDate : lastDate - currentDates ;
                $(dates[num + 1]).text(afterDate);
                if (lastDate > currentDates ) {
                  $(dates[num + 1]).addClass('afterMonth');
                }
              })(i)
          }

        },
        //日期更新，填充日历表格
        NextGetDate: function(event) {
            //先删除样式
            this.clearAllClass();
            this.clearChoose();
            //判断箭头方向，计算下一个月份及年份
            var curMonthText = parseInt($('.month')[0].innerText);
            var curYearText = parseInt($('.year')[0].innerText);
            if ($(event.target).hasClass('after')) {
                if (curMonthText == 12) {
                  nextMonthText = 1;
                  nextYearText = curYearText + 1;
                } else {
                  nextMonthText = curMonthText + 1;
                  nextYearText = curYearText;
                }
            } else if ($(event.target).hasClass('before')) {
                if (curMonthText == 1) {
                  nextMonthText = 12;
                  nextYearText = curYearText - 1;
                } else {
                  nextMonthText = curMonthText - 1;
                  nextYearText = curYearText;
                }
            }
            //如果下一个月份为当前月，添加active类名.
            if (nextMonthText == this.currentMonth + 1) {
              $(dates[this.index]).addClass(this.config.customColorClass);
            }
            //改变title月份数
            $('.month').text(nextMonthText);
            $('.year').text(nextYearText);

            //填充下月日期
            var nextTime = new Date(nextYearText, nextMonthText, this.currentDate),
                 nextDate = nextTime.getDate(),
                 x = nextTime.getDay();
            this.GetDate(nextYearText, nextMonthText - 1, nextDate);
            //添加切换动画
            if (this.config.IsAnimate) {
                $('.m-calendar table').fadeOut().fadeIn();
            }

        }, 
        //根据点击添加的类名长度，选择某个日期后一段日期
        choose:function(event){
          //chooseSingle
          if (this.config.IsChooseSingle) {
              //添加选择日期类名
              if ($('td').hasClass('active')) {
               $('td').removeClass('active');
               }
              $(event.target).addClass('active');
              //根据选中日期填充控件日期
              if (this.config.IsShowControl) {
                  $('.date').val(this.formatDate(this.returnDate(event.target),"yyyy-MM-dd"));
              }
              //如果传递了选中日期后的回调，则执行回调函数
              if (this.config.chooseCallback) {
                this.config.chooseCallback()
              }
          }else{
              $(event.target).addClass('active tobechoose');
              var beginIndex=$('td').index($(event.target));
              //根据第一次点击设置不可选日期
              if ($('.active.tobechoose').length==1) {
                this.setDisable(event);
              //根据第二次点击确定选择范围
              }else if($('.active.tobechoose').length==2){
                  if (!$(event.target).hasClass('disable')){
                      this.setChoosed(event);
                    }else{
                      this.chooseDisable(event);
                     
                    } 
              // 再次点击时，如果是点击不可选择范围，则弹出警告，否则清空选择区间，重新选择。           
              }else if($('.active.tobechoose').length>2) {
                  if ($(event.target).hasClass('disable')) {
                     this.chooseDisable(event);
                  }else if($(event.target).hasClass('tobechoose')){
                     $('td').removeClass('active tobechoose').removeClass('tobechoose');
                     $(event.target).addClass('active tobechoose');
                     this.setDisable(event);
                  }
              }
          }

        },
        //返回的日期对象
        returnDate:function(obj){
            var chooseTime=new Date($('.year')[0].innerText,$('.month')[0].innerText-1,$(obj)[0].innerText);
            return chooseTime;
            //$('.date').val(this.formatDate(chooseTime,"yyyy-MM-dd"));
        },
        //设置不可选日期
        setDisable:function(event){
            if ($('.disable')) {
              $('td').removeClass('disable');
            }
            var beginIndex=$('td').index($(event.target));
            var endIndex=beginIndex+this.config.chooseRange;
             // console.log(beginIndex);
            for (var i = 0; i < beginIndex; i++) {
                $($('td')[i]).addClass('disable');
            }
            for (var i = endIndex; i < $('td').length; i++) {
               $($('td')[i]).addClass('disable');
            }
        },
        //设置选择日期
        setChoosed:function(event){          
            var chooseBeginIndex=$('td').index($('.active.tobechoose'));
            var chooseEndIndex=$('td').index($(event.target));
             for (var i = chooseBeginIndex+1; i < chooseEndIndex; i++) {
                $($('td')[i]).addClass('tobechoose');         
            } 
            var beginDateText=this.formatDate(this.returnDate($('td')[chooseBeginIndex]),"yyyy-MM-dd"),
                endDateText=this.formatDate(this.returnDate($('td')[chooseEndIndex]),"yyyy-MM-dd");
            var timeRange=beginDateText+" ~ "+endDateText;
            // return timeRange;
            $('.date').val(timeRange);
        },
        //清除所有类名
        clearAllClass:function(){
            $('td').removeClass('beforeMonth')
            .removeClass('afterMonth')
            .removeClass('active')
            .removeClass(this.config.customColorClass);
        },
        //当点击不可选日期时，警告
        chooseDisable:function(event){
            $(event.target).removeClass('active tobechoose');
            this.config.chooseDisableCallback();
        },
        //清除时，删除选中类名及不可选类名
        clearChoose:function(){
             $('td').removeClass('active tobechoose').removeClass('tobechoose').removeClass('disable');
        },
        //取消时，删除选中的类名
        cancelChoose:function(){
             $('td').removeClass('active tobechoose').removeClass('tobechoose');
        },
        //确认时，执行传入的回调
        confirmChoose:function(event){
             this.config.chooseRangeCallback();            
        },
        //格式化日期
        formatDate:function (date,pattern){
            function format(m){
                var n=m+1;
                if (n<10) {
                    return "0"+n;
                }
                else{
                    return n
                }     
            }
            var year=date.getFullYear(),
                month=format(date.getMonth()),
                day=format(date.getDate()-1),
                hour=format(date.getHours()-1),
                minute=format(date.getMinutes()-1),
                second=format(date.getSeconds()-1);    
            switch(pattern){
                case "yyyy":  return year;
                break;
                case "MM":  return month;
                break;            
                case "yyyy-MM-dd": return year+"-"+month+"-"+day;
                break;
                case "HH:mm": return hour+":"+ minute;
                break;           
                case "yyyy-MM-dd HH":  return year+"-"+month+"-"+day+" "+hour;
                break;
                case "yyyy-MM-dd HH:mm:ss": return year+"-"+month+"-"+day+" "+hour+":"+ minute+":"+second;
                break;
            }
        },
        //清除事件
        destory:function(){   
            this.calendar.off();
        },

  }
  window.Calendar = Calendar;

})()
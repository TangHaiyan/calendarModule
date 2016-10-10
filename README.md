# calendarModule
日历组件
可设置的接口：
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

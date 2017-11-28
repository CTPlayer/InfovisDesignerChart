/**
 * 监控大屏主体js
 */
require.config({
    baseUrl: 'resources/js',
    paths: {
        "jquery": "lib/bootstrap/js/jquery-2.1.4.min",
        "echarts": "lib/charts/echarts",
        'clolck': "customModule/clock",
        'domReady': 'lib/domReady',
        'modal':"lib/modal/jquery.modal.min"
    },
    shim: {
        'modal': {
            deps: ['jquery']
        }
    }
});

require(['jquery', 'echarts', 'clolck','domReady','modal'],
    function ($, echarts, clolck,domReady,modal) {

        domReady(function () {
            setInterval(function () {
                clolck.digitalClock('datetime');
            }, 1000);

            var apiURL = "http://10.211.55.2:8080/DashBoard/";
            // var uname = 'admin';
            var uname = $("#userName").text().trim();

            var jsonpAjaxCall = function (request_url,successCallback,errorCallback) {
                $.ajax({
                    url:apiURL + request_url,
                    type:'get',
                    dataType:'jsonp',
                    timeout:30000,
                    jsonp:"callback",
                    success:successCallback,
                    error:errorCallback
                });
            };

            var appWarnDetail = function (systemId) {
                alert(systemId);
            };

            var initFoldLineData = function(time){
				jsonpAjaxCall('foldline?uname='+uname+'&time='+time,function (response) {
                    line_option.xAxis[0].data = [];
                    line_option.series[0].data = [];
                    if(response.result && response.result.length >0){
                        $('.waring_type_line_chart_block .no_data').hide();
                        $.each(response.result,function (index,item) {
                            line_option.xAxis[0].data.push(item.alarmtime);
                            line_option.series[0].data.push(item.alarmnum);
                        });
                        myChart3.dispose();
                        myChart3 = echarts.init(document.getElementById('waring_type_line_chart'));

                        myChart3.setOption(line_option);
                        console.log(myChart3);
                    }else{
                        $("#waring_type_line_chart").html("");
                        $('.waring_type_line_chart_block .no_data').show();
                        $('.waring_type_line_chart_block .response_error_data').hide();
                    }
                },function () {
                    $("#waring_type_line_chart").html("");
                    $('.waring_type_line_chart_block .no_data').hide();
                    $('.waring_type_line_chart_block .response_error_data').show();
                });
            }

            var initData = function () {

                //告警总数，红色、黄色警告数
                jsonpAjaxCall('totalnum?uname='+uname,function (response) {
                    $('.warning_cate_list_number .total .number').html(response.result.totalnum);
                    $('.warning_cate_list_number .yellow .number').html(response.result.yellownum);
                    $('.warning_cate_list_number .red .number').html(response.result.rednum);
                },function () {
                    $('.warning_cate_list_number .total .number').html("ERROR");
                    $('.warning_cate_list_number .yellow .number').html("ERROR");
                    $('.warning_cate_list_number .red .number').html("ERROR");
                });

                //默认展示所有系统告警详细
                jsonpAjaxCall('defaultmsg?uname='+uname,function (response) {
                	$('.detailTable').show();
                	$('.bodyTable table tbody').html("");
                	if(response.result && response.result.length>0){
                        $.each(response.result,function (index,item) {
                            $('.bodyTable table tbody').append("<tr>\n" +
                                "                            <td width=\"100\">"+item.alertgroup+"</td>\n" +
                                "                            <td width=\"190\">"+item.cus_ciname+"</td>\n" +
                                "                            <td width=\"380\">"+item.cus_msg_cn+"</td>\n" +
                                "                            <td width=\"190\">"+item.lastoccurrence+"</td>\n" +
                                "                        </tr>");
                        });
                    }else{
                        $('.bodyTable table tbody').append("<tr>\n" +
                            "                                <td colspan=\"4\" align=\"center\" width=\"860\" style=\"color:#cccccc\">暂无数据</td>\n" +
                            "                            </tr>");
                    }
                });

                jsonpAjaxCall('UserPrivilege?uname='+uname,function (response) {

                    if(response.result && response.result.length>0){
                        $('.middleContent .no_data').hide();
                        $('.middleContent .response_error_data').hide();
                        var innerHtml = "";
                        $.each(response.result,function (index,item) {
                            var titleClass = 'title shortTitle';
                            if(item.systemname.length>3){
                                titleClass = 'title longTitle';
                            }
                            if(item.alarmnum == '0'){
                                innerHtml += "<div class=\"icon\" systemid=\""+item.systemid+"\">\n" +
                                    "              <span class=\" app_green icon_back\"></span>\n" +
                                    "              <span class=\""+titleClass+"\">"+item.systemname+"</span>\n" +
                                    "         </div>";
                            }else{
                                var color;
                                if(item.color == "5"){
                                    color="red";
                                }else if(item.color == "3"){
                                    color="yellow";
                                }

                                innerHtml += "<div class=\"icon\" systemid=\""+item.systemid+"\">\n" +
                                    "              <span class=\" app_"+color+" icon_back\"></span>\n" +
                                    "              <span class=\""+titleClass+"\">"+item.systemname+"</span>\n" +
                                    "              <span class=\"number\">"+item.alarmnum+"</span>\n" +
                                    "         </div>";
                            }

                        });
                        $('.middleContent .wrapper').html(innerHtml);
                    }else{
                        $('.middleContent .no_data').show();
                        $('.middleContent .response_error_data').hide();
                        $('.middleContent .wrapper').html("");
                    }

                },function () {
                    $('.middleContent .no_data').hide();
                    $('.middleContent .response_error_data').show();
                    $('.middleContent .wrapper').html("");
                });

                jsonpAjaxCall('barchart?uname='+uname,function (response) {
                    option.xAxis[0].data = [];
                    option.series[0].data = [];
                    if(response.result && response.result.length >0){
                        $('.waring_type_column .no_data').hide();
                        $.each(response.result,function (index,item) {
                            option.xAxis[0].data.push(item.alertgroup);
                            option.series[0].data.push(item.alarmnum);
                        });
                        myChart.dispose();
                        myChart = echarts.init(document.getElementById('waring_type_column_chart'));
                        myChart.setOption(option);
                    }else{
                        $('#waring_type_column_chart').html("");
                        $('.waring_type_column .no_data').show();
                        $('.waring_type_column .response_error_data').hide();
                    }
                },function () {
                    $('#waring_type_column_chart').html("");
                    $('.waring_type_column .no_data').hide();
                    $('.waring_type_column .response_error_data').show();
                });

                jsonpAjaxCall('pie_chart?uname='+uname,function (response) {
                    pieOption.series[0].data = [];
                    if(response.result && response.result.length >0){
                        $('.system_waring_number .no_data').hide();
                        $.each(response.result,function (index,item) {
                            pieOption.series[0].data.push(
                                {
                                    value:item.alarmnum,
                                    name:item.sysname
                                }
                            );
                        });
                        myChart2.dispose();
                        myChart2 = echarts.init(document.getElementById('system_waring_number_chart'));
                        myChart2.setOption(pieOption);
                    }else{
                        $('#system_waring_number_chart').html("");
                        $('.system_waring_number .no_data').show();
                        $('.system_waring_number .response_error_data').hide();
                    }
                },function () {
                    $('#system_waring_number_chart').html("");
                    $('.system_waring_number .no_data').hide();
                    $('.system_waring_number .response_error_data').show();
                });

                if(!localStorage.time){
                	localStorage.time=1
                }

                $('#foldlineTime').val(localStorage.time);

                initFoldLineData(localStorage.time);

                jsonpAjaxCall('categoryNum?uname='+uname,function (response) {
                    var circleHtml = '';
                    
                    if(response.result && response.result.length > 0){
                        $('.waring_type_line .no_data').hide();
                        $.each(response.result,function (index,item) {
                        	var color;
                        	if(item.alarmnum == 0){
                        		color='green';
                        	}else if(item.color=="5"){
                        		color='red';
                        	}else if(item.color=="3"){
                        		color='yellow';
                        	}
                        	
                            circleHtml += "<div class=\"circle_type\" groupname=\""+item.alertgroup+"\">\n" +
                                "               <span class=\"app_"+color+" circle_back\"></span>\n" +
                                "               <span class=\"circle_title\" >"+item.alertgroup+"</span>\n" +
                                "          </div>";
                        });
                        $('.rightContent .waring_type_line .circle_wrapper').html(circleHtml);
                    }else{
                        $('.rightContent .waring_type_line .circle_wrapper').html("");
                        $('.waring_type_line .no_data').show();
                        $('.waring_type_line .response_error_data').hide();
                    }
                },function () {
                    $('.rightContent .waring_type_line .circle_wrapper').html("");
                    $('.waring_type_line .no_data').hide();
                    $('.waring_type_line .response_error_data').show();
                });
            };

            initData();

            //选择时间周期 显示折线图
      
　　　　        $('#foldlineTime').change(function(){
				//获取select的值 有两个???? 两套?对啊 这就要你帮忙了```真不会..而且现在有个问题是在页面刷新的时候会折线图会默认选这1天
				//可能是我默认选择了1天吧 帮忙弄一下呗.对你来说就分分钟的事啦,,这你一看 还有什么难度吗`就几分钟 谢谢哈
				var time=$(this).children('option:selected').val();
				localStorage.time  = time;
				initFoldLineData(localStorage.time);

　　　   　    })  



            //点击系统方块,显示该系统具体告警内容
            $( document ).on( "click", ".middleContent .wrapper .icon", function() {
                var systemid = $(this).attr('systemid') || '';
                $('.detailTable').show();
                $('.bodyTable table tbody').html("");
                jsonpAjaxCall('alarmmsg?systemid='+systemid,function (response) {//success
                    if(response.result && response.result.length>0){
                        $.each(response.result,function (index,item) {
                            $('.bodyTable table tbody').append("<tr>\n" +
                                "                            <td width=\"100\">"+item.alertgroup+"</td>\n" +
                                "                            <td width=\"190\">"+item.cus_ciname+"</td>\n" +
                                "                            <td width=\"380\">"+item.cus_msg_cn+"</td>\n" +
                                "                            <td width=\"190\">"+item.lastoccurrence+"</td>\n" +
                                "                        </tr>");
                        });
                    }else{
                        $('.bodyTable table tbody').append("<tr>\n" +
                            "                                <td colspan=\"4\" align=\"center\" width=\"860\" style=\"color:#cccccc\">暂无数据</td>\n" +
                            "                            </tr>");
                    }

                },function () {//failure
                    $('.bodyTable table tbody').append("<tr>\n" +
                        "                                <td colspan=\"4\" align=\"center\" width=\"860\" style=\"color:red\">API请求数据失败</td>\n" +
                        "                            </tr>");
                });
            });


            //点击告警类型,显示告警类型的告警内容
            $( document ).on( "click", ".rightContent .waring_type_line .circle_wrapper .circle_type", function() {
                var groupname=$(this).attr('groupname') || '';
             	$('.detailTable').show();
                $('.bodyTable table tbody').html("");
                jsonpAjaxCall('groupmsg?uname='+uname+'&groupname='+groupname,function (response) {//success
                    if(response.result && response.result.length>0){
                        $.each(response.result,function (index,item) {
                            $('.bodyTable table tbody').append("<tr>\n" +
                                "                            <td width=\"100\">"+item.alertgroup+"</td>\n" +
                                "                            <td width=\"190\">"+item.cus_ciname+"</td>\n" +
                                "                            <td width=\"380\">"+item.cus_msg_cn+"</td>\n" +
                                "                            <td width=\"190\">"+item.lastoccurrence+"</td>\n" +
                                "                        </tr>");
                        });
                    }else{
                        $('.bodyTable table tbody').append("<tr>\n" +
                            "                                <td colspan=\"4\" align=\"center\" width=\"860\" style=\"color:#cccccc\">暂无数据</td>\n" +
                            "                            </tr>");
                    }

                },function () {//failure
                    $('.bodyTable table tbody').append("<tr>\n" +
                        "                                <td colspan=\"4\" align=\"center\" width=\"860\" style=\"color:red\">API请求数据失败</td>\n" +
                        "                            </tr>");
                });
            });



            var refreshTimeMin = 3*60*1000;//默认3分钟
            if(!localStorage.refreshTimeMin){
                localStorage.refreshTimeMin  = refreshTimeMin;
            }else{
                $("#refreshTime").val(localStorage.refreshTimeMin/60000);
            }

            var refreshIntervalFun = self.setInterval(function () {
                initData();
            },localStorage.refreshTimeMin);

            $("#refreshTime").change(function(){
                refreshIntervalFun = window.clearInterval(refreshIntervalFun);//清除定时器
                localStorage.refreshTimeMin = $(this).val()*60*1000;
                refreshIntervalFun = self.setInterval(function () {//根据新的时间频率设置定时器
                    initData();
                },localStorage.refreshTimeMin);
            });



            var websafecolor = ['#ff4d52', '#3e8e41', '#ffa119', '#777cf2', '#2676cd', '#66ff66', '#9966cc',
                '#4b5cc4', '#f6b3ac', '#ff6400','#f27777', '#f2d177', '#d1f277', '#77f28e', '#77dff2'];

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('waring_type_column_chart'));
            var myChart2 = echarts.init(document.getElementById('system_waring_number_chart'));
            var myChart3 = echarts.init(document.getElementById('waring_type_line_chart'));

            // 指定图表的配置项和数据
            var option = {
                color:['#638dfb'],
                title : {},
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                        	rotate:-45,
                            textStyle: {
                                color: '#aeaeae',
                                fontSize: 14
                            },
                            interval: 0
                        },
                        data : []
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitLine: {
                            show: true
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#aeaeae',
                                fontSize: 14
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'告警数量',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        type:'bar',
                        barWidth: 20,
                        data:[]
                    }
                ]
            };

            var pieOption = {
                color:websafecolor,
                title : {},
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '系统告警占比',
                        type: 'pie',
                        radius : '40%',
                        center: ['50%', '60%'],
                        data:[],
                        label: {
                            normal: {
                                show: true,
                                formatter: "{b}:({d}%)"
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };

            var line_option = {
                color:['#638dfb'],
                title : {},
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#aeaeae',
                                fontSize: 12
                            },
                            interval: 0
                        },
                        data : []
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitLine: {
                            show: true
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#aeaeae',
                                fontSize: 12
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'告警数量',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        type:'line',
                        data:[]
                    }
                ]
            };


            $('#submitAddSysBtn').click(function () {
                $('#closeAddSysBtn').click();
                var sysname = $('#sysname').val();
                if(sysname == ''){
                    alert('请输入系统名称');
                }else{
                    jsonpAjaxCall('addsys?sysname='+sysname,function (response) {
                        if(response.result == 'Success'){
                            alert('新增系统成功');
                            $('#sysname').val('')
                        }else{
                            alert('新增系统失败');
                        }
                    },function () {
                        alert('新增系统失败!');
                    });
                }
            });

        });
    });


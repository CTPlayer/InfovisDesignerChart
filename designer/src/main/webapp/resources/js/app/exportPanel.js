require.config({
    baseUrl: 'resources/js',
    paths: {
        "jquery": "lib/bootstrap/js/jquery-2.1.4.min",
        "bootstrap": "lib/bootstrap/js/bootstrap.min",
        "jquery-ui": "lib/jquery-ui.min",
        "lodash": "lib/gridstack/js/lodash.min",
        "domReady" : 'lib/domReady',
        "zrender": "lib/zrender/zrender",
        "zrender/shape/Rectangle": "lib/zrender/zrender",
        "zrender/shape/Image": "lib/zrender/zrender",
        "zrender/tool/color": "lib/zrender/zrender",
        "zrender/Storage" : "lib/zrender/zrender",
        "CanvasTag" : "customModule/CanvasTag/CanvasTag",
        "CanvasTagOfImage" : "customModule/CanvasTag/CanvasTagOfImage",
        "jrange" : 'lib/jRange/jquery.range',
        "vue": "lib/vue/vue",
        "echarts": "lib/charts/echarts",
        "theme": "lib/charts/theme"
    },
    shim : {
        "bootstrap" : { "deps" :['jquery'] },
        "jrange" : { "deps" :['jquery'] }
    },
    waitSeconds: 30
});

require(['jquery','CanvasTag','CanvasTagOfImage','echarts','vue','domReady','theme',
        'jrange', 'bootstrap'],
    function($,CanvasTag,CanvasTagOfImage,echarts,vue,domReady,theme){
        domReady(function(){
            var app = new vue({
                el: '#app',
                data: {
                    widgets: [],
                    // isRenderFail: false,
                    renderFailList: []
                },
                methods: {
                    overloadItemStyle: function(optItem, theme) {
                        for(k in theme) {
                            if(optItem[k] && (typeof theme[k] !== 'object')){
                                delete optItem[k];
                            } else if(typeof theme[k] == 'object') {
                                this.overloadItemStyle(optItem, theme[k]);
                            }
                        }
                    },
                    changeTheme: function(themeName){
                        this.currentTheme = themeName;
                        var widgets = this.widgets;
                        for(var i=0;i<widgets.length;i++) {
                            var target = $("#" + widgets[i].id);
                            // var chartName = $(target).find('#chartTitle').text();
                            if (widgets[i].chartType.indexOf("text") < 0 && widgets[i].chartType.indexOf('table') < 0) {
                                var chartOption = echarts.getInstanceByDom($(target)[0]).getOption();
                                echarts.dispose($(target)[0]);
                                echarts.registerTheme(themeName, theme[themeName]);
                                var exportChart = echarts.init($(target)[0], themeName);
                                app.overloadItemStyle(chartOption, theme[themeName]);       // 主题与图表option合并
                                if(chartOption.series[0].type == 'line' || chartOption.series[0].type == 'bar'){
                                    chartOption.xAxis[0].axisLine.lineStyle.color = '#999999';
                                    chartOption.yAxis[0].axisLine.lineStyle.color = '#999999';
                                    chartOption.xAxis[0].axisTick.lineStyle.color = '#999999';
                                    chartOption.yAxis[0].axisTick.lineStyle.color = '#999999';
                                    chartOption.xAxis[0].axisLabel.textStyle.color = '#999999';
                                    chartOption.yAxis[0].axisLabel.textStyle.color = '#999999';
                                }
                                exportChart.setOption(chartOption);
                            }
                        }
                    }
                },
                mounted: function(){
                    //背景初始化
                    var deferred01 = $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: 'myPanel/crud',
                        data : {
                            exportId : $("#exportId").val()
                        },
                        headers :{
                            oper : 'query'
                        }
                    });
                    deferred01.done(function(data){
                        if(data.myPanel.backgroundClass){
                            $('body').addClass(data.myPanel.backgroundClass);
                        }else{
                            $('body').addClass('background-default');
                        }
                    });
                    var chartIds = []; //所有图表的id
                    var containerIds = [];
                    //图表初始化
                    var deferred02 = $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: 'myPanel/crud',
                        data : {
                            exportId : $("#exportId").val()
                        },
                        headers :{
                            oper : 'query'
                        }
                    });
                    deferred02.done(function(data){
                        app.widgets = JSON.parse(data.myPanel.htmlCode);
                        app.$nextTick(function(){
                            // var textIds = []; //所有文字组件id
                            for(var i=0;i<app.widgets.length;i++){
                                if(app.widgets[i].chartId){
                                    chartIds.push(app.widgets[i].chartId);
                                    containerIds.push(app.widgets[i].id);
                                }else {
                                    // textIds.push(app.widgets[item].id);
                                    CanvasTag().render(app.widgets[i].id,app.widgets[i].option);
                                    $('#'+app.widgets[i].id).css('background-color', 'unset');
                                }
                            }
                            $.ajax({
                                type: 'POST',
                                url: 'getShareOptions',
                                data: 'cids=' + chartIds,
                                success: function (data) {
                                    var themeName;
                                    for(var i=0;i<chartIds.length;i++){
                                        if(app.widgets[i].themeName){
                                            themeName = app.widgets[i].themeName;
                                        }
                                        if(data[i].chartType.indexOf("text") < 0){
                                            var exportChart = echarts.init($("#" + containerIds[i])[0]);
                                            if(parseInt(data[i].isRealTime) == 0){
                                                if(data[i].chartType == 'table'){
                                                    $("#"+containerIds[i]).html(data[i].jsCode);
                                                }else {
                                                    exportChart.setOption(JSON.parse(data[i].jsCode));
                                                }
                                            }else if(parseInt(data[i].isRealTime) == 1){
                                                $.ajax({
                                                    async: false,
                                                    type: 'POST',
                                                    contentType: "application/json; charset=utf-8",
                                                    url: 'render',
                                                    data: JSON.stringify({
                                                        'chartType': data[i].chartType,
                                                        'dataRecordId': data[i].sqlRecordingId,
                                                        'builderModel': JSON.parse(data[i].buildModel)
                                                    }),
                                                    success: function(option){
                                                        var newOption = JSON.parse(data[i].jsCode);
                                                        newOption.series[0].data = option.series[0].data;
                                                        if('legend' in option){
                                                            newOption.legend.data = option.legend.data;
                                                        }
                                                        if('xAxis' in option){
                                                            newOption.xAxis[0].data = option.xAxis[0].data;
                                                        }
                                                        exportChart.setOption(newOption);
                                                    },
                                                    error: function(){
                                                        app.renderFailList.push(app.widgets[i].id);
                                                    }
                                                });
                                            }
                                        }else{
                                            var option = JSON.parse(data[i].jsCode);
                                            option.image = $("#"+app.widgets[i].id).parent().find("img")[0];
                                            CanvasTagOfImage().render(containerIds[i],"",option,false);
                                        }
                                    }
                                    //theme
                                    app.changeTheme(themeName);
                                }
                            })
                        });
                    })
                }
            })
        });
    });
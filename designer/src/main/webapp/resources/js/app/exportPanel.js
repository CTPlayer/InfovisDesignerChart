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
                            var chartName = $(target).find('#chartTitle').text();
                            if (widgets[i].chartType.indexOf("text") < 0) {
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
                                                exportChart.setOption(JSON.parse(data[i].jsCode));
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
        // $(function(){
        //     var engine = infovis.init(baseOptions.makeAllOptions() || {});
        //     if($("#exportContainer")){
        //         var cids = [];     //图表id
        //         var ids = [];      //容器id
        //         var containers = $("#exportContainer").children();
        //         for(var i=0;i<containers.length;i++){
        //             cids.push($(containers[i]).children().first().attr("chartId"));
        //             ids.push($(containers[i]).children().first().attr("id"));
        //         }
        //         var options = {
        //             float: true,
        //             vertical_margin: 0
        //         };
        //         $('.grid-stack').gridstack(options);
        //
        //         var containerAndModel = []; // 保存div和图表构建模型之间的关系
        //         var currentField = []; // 当前页面用到的所有数据集项,用于渲染过滤选项时只渲染用到的字段
        //         $.ajax({
        //            type: 'POST',
        //             url: 'getShareOptions',
        //            data: 'cids='+cids,
        //         success: function(data){
        //                 for(var i=0;i<cids.length;i++){
        //                     if(data[i].chartType.indexOf("text") < 0) {
        //                         if('mark' in JSON.parse(data[i].buildModel)){
        //                             currentField.push(JSON.parse(data[i].buildModel).mark.color);
        //                             currentField.push(JSON.parse(data[i].buildModel).mark.angle);
        //                         }else {
        //                             currentField.push(JSON.parse(data[i].buildModel).xAxis[0]);
        //                             currentField.push(JSON.parse(data[i].buildModel).yAxis[0]);
        //                         }
        //                         containerAndModel.push({"id":ids[i],"model":{'chartType': data[i].chartType,'dataRecordId': data[i].sqlRecordingId,'builderModel': JSON.parse(data[i].buildModel)}});
        //                         var exportChart = engine.chart.init($("#" + ids[i])[0]);
        //                         if(parseInt(data[i].isRealTime) == 0){
        //                             exportChart.setOption(JSON.parse(data[i].jsCode));
        //                         }else if(parseInt(data[i].isRealTime) == 1){
        //                             $.ajax({
        //                                 async: false,
        //                                 type: 'POST',
        //                                 contentType: "application/json; charset=utf-8",
        //                                 url: 'render',
        //                                 data: JSON.stringify({
        //                                     'chartType': data[i].chartType,
        //                                     'dataRecordId': data[i].sqlRecordingId,
        //                                     'builderModel': JSON.parse(data[i].buildModel)
        //                                 }),
        //                                 success: function(option){
        //                                     var newOption = JSON.parse(data[i].jsCode);
        //                                     newOption.series[0].data = option.series[0].data;
        //                                     if('legend' in option){
        //                                         newOption.legend.data = option.legend.data;
        //                                     }
        //                                     if('xAxis' in option){
        //                                         newOption.xAxis[0].data = option.xAxis[0].data;
        //                                     }
        //                                     exportChart.setOption(newOption);
        //                                 },
        //                                 error: function(){
        //                                     $("#" + ids[i]).text("当前图表渲染失败，请检查数据库连接是否正常。");
        //                                 }
        //                             });
        //                         }
        //
        //                         window.addEventListener("resize", function () {
        //                             exportChart.resize();                                            //自适应窗口
        //                         });
        //                     }else{
        //                         if(data[i].chartType.indexOf("subGroupOfImage") < 0){
        //                             CanvasTag().render(ids[i],JSON.parse(data[i].jsCode));
        //                         }else{
        //                             var imgBase64 = JSON.parse(data[i].jsCode).image;
        //                             var option = JSON.parse(data[i].jsCode);
        //                             $("#"+ids[i]).parent().append([
        //                                 '<img style="display: none" src=\'data:image/jpg;base64,'+imgBase64+'\' >'
        //                             ].join(""));
        //                             option.image = $("#"+ids[i]).parent().find("img")[0];
        //                             CanvasTagOfImage().render(ids[i],"",option);
        //                         }
        //                     }
        //                 }
        //             }
        //         });
        //
        //         var chartBuilderParams = [];
        //         var chartTitle = [];     // 保存每张图表option中的title
        //         $(".filterIcon").click(function(){
        //             $(".loader-container").css("display","block");
        //             var deffer01 = $.ajax({
        //                 type: 'POST',
        //                 async: false,
        //                 url: 'getShareOptions',
        //                 data: 'cids='+cids
        //             });
        //             deffer01.done(function(data){
        //                 for(var i=0;i<cids.length;i++){
        //                     if(data[i].chartType.indexOf("text") < 0) {
        //                         chartTitle.push(JSON.parse(data[i].jsCode).title[0].text);
        //                         chartBuilderParams.push({chartType : data[i].chartType, dataRecordId : data[i].sqlRecordingId, builderModel : JSON.parse(data[i].buildModel)});
        //                     }
        //                 }
        //             });
        //
        //             var deffer02 = $.ajax({
        //                 type: 'POST',
        //                 url: 'myChart/getFilterResults',
        //                 contentType: "application/json",
        //                 data: JSON.stringify(chartBuilderParams)
        //             });
        //             deffer02.done(function(data){
        //                 $(".loader-container").css("display","none");
        //                 var order = 0;                // checkbox id参数 slider-input id参数
        //                 $("#accordion").append(['<div style="margin-bottom: 40px;"><span class="btn btn-success col-md-6">按数据集筛选</span><span class="btn btn-info col-md-6">按图表筛选</span></div><div id="dataSet"></div><div id="chartsInfo" style="display: none"></div>'].join(''));
        //                 for(var key in data){
        //                     $("#dataSet").append([
        //                         '<div class="panel panel-default">',
        //                         '<div class="panel-heading" role="tab" id="heading'+key+'">',
        //                         '<h4 class="panel-title">',
        //                         '<a data-toggle="collapse" data-parent="#dataSet" href="#collapse'+key+'" aria-expanded="true" aria-controls="#collapse'+key+'">',
        //                         '</a>',
        //                         '</h4>',
        //                         '</div>',
        //                         '<div id="collapse'+key+'" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading'+key+'">',
        //                         '<div class="panel-body">',
        //                         '</div>',
        //                         '<button type="button" class="btn btn-success">确认</button>',
        //                         '</div>',
        //                         '</div>'].join(''));
        //                     for(var item in data[key][0]) {
        //                         if($.inArray(item,currentField) >= 0) {
        //                             var value = [];           // 保存数值项
        //                             for (var i = 0; i < data[key].length; i++) {
        //                                 value.push(data[key][i][item]);
        //                             }
        //                             var hasText = false;     // 判断是否有文字
        //                             for (var i = 0; i < value.length; i++) {
        //                                 if (isNaN(value[i])) {
        //                                     hasText = true;
        //                                 }
        //                             }
        //                             if (hasText == false) {
        //                                 $("#collapse" + key).find(".panel-body").append('<div class="row number" id=' + key + item + ' style="margin-top: 20px;margin-left: 5px;"><div style="margin-left: 5px;margin-bottom: 15px;"><div>' + item + '</div></div></div>');
        //                                 var min = Math.min.apply(null, value);
        //                                 var max = Math.max.apply(null, value);
        //                                 $("#" + key + item).append('<input type="hidden" id="slider' + order + '" class="slider-input" value="' + min + "," + max + '"/>');
        //                                 $('#slider' + order).jRange({
        //                                     from: min,
        //                                     to: max,
        //                                     scale: [min, max],
        //                                     step: 1,
        //                                     format: '%s',
        //                                     width: $("#accordion").width() - 55,
        //                                     showLabels: true,
        //                                     isRange: true
        //                                 });
        //                                 order++;
        //                             } else {
        //                                 $("#collapse" + key).find(".panel-body").append('<div class="row text" id=' + key + item + ' style="margin-top: 20px;margin-left: 5px;"><div style="margin-left: 5px;margin-bottom: 15px;"><div>' + item + '</div></div></div>');
        //                                 for (var i = 0; i < $.unique(value).length; i++) {
        //                                     $("#" + key + item).append([
        //                                         '<div class="checkbox3 checkbox-inline checkbox-check checkbox-light">',
        //                                         '<input type="checkbox" id="checkbox-fa-light-1' + order + '" checked="">',
        //                                         '<label for="checkbox-fa-light-1' + order + '">',
        //                                         $.unique(value)[i],
        //                                         '</label>',
        //                                         '</div>'
        //                                     ].join(''));
        //                                     order++;
        //                                 }
        //                             }
        //                         }
        //                     }
        //
        //                     /**
        //                      * 为过滤项绑定事件
        //                      */
        //                     var filter = {};
        //                     $("#collapse"+key).find(".btn-success").click(function(){
        //                         var sqlId = $(this).parent().prev().attr("id").replace("heading","").trim();
        //                         filter[sqlId] = [];
        //                         $(this).prev().find(".row").each(function(){
        //                             var fieldName = $(this).children().eq(0).text().trim();
        //                             var fieldFilter = [];
        //                             if($(this).hasClass("text")){
        //                                 $(this).find("input:checkbox:checked").each(function(){
        //                                     fieldFilter.push($(this).next().text());
        //                                 });
        //                                 var filterParam = {};
        //                                 filterParam[fieldName] = fieldFilter;
        //                                 filter[sqlId].push(JSON.stringify(filterParam));
        //                             }else if($(this).hasClass("number")){
        //                                 var filterParam = {};
        //                                 filterParam[fieldName] = $(this).find("input").val();
        //                                 filter[sqlId].push(JSON.stringify(filterParam));
        //                             }
        //                         });
        //                         for(var i=0;i<containerAndModel.length;i++){
        //                             if(containerAndModel[i].model.dataRecordId == sqlId){
        //                                 containerAndModel[i].model.builderModel.filter = filter[sqlId];
        //                                 var id = containerAndModel[i].id;
        //                                 $.ajax({
        //                                     type: 'POST',
        //                                     async: false,
        //                                     contentType: "application/json; charset=utf-8",
        //                                     url: 'render',
        //                                     data: JSON.stringify(containerAndModel[i].model),
        //                                     success: function(option){
        //                                         var editChart = engine.chart.getInstanceByDom(document.getElementById(id));
        //                                         var editOption = editChart.getOption();
        //                                         editOption.series[0].data = option.series[0].data;
        //                                         if('legend' in option){
        //                                             editOption.legend.data = option.legend.data;
        //                                         }
        //                                         if('xAxis' in option){
        //                                             editOption.xAxis[0].data = option.xAxis[0].data;
        //                                         }
        //                                         editChart.setOption(editOption,true);
        //                                     }
        //                                 });
        //                             }
        //                         }
        //                     });
        //                 }
        //
        //                 $("#accordion").find("span").eq(0).click(function(){
        //                     $("#dataSet").css("display","block");
        //                     $("#chartsInfo").css("display","none");
        //                 });
        //                 var isRender = false;    //每一个图表的可过滤项是否渲染完成
        //                 $("#accordion").find("span").eq(1).click(function(){
        //                     if(isRender == false){
        //                         var deffer03 = $.ajax({
        //                            type: 'POST',
        //                            contentType: "application/json; charset=utf-8",
        //                            url: 'myChart/getFilterResultOfList',
        //                            data: JSON.stringify(chartBuilderParams)
        //                         });
        //                         deffer03.done(function(data){
        //                             for(var i=0;i<data.length;i++){
        //                                 $("#chartsInfo").append(
        //                                     [
        //                                         '<div class="panel panel-default">',
        //                                         '<div class="panel-heading" role="tab" id="headingChart'+i+'">',
        //                                         '<h4 class="panel-title">',
        //                                         '<a data-toggle="collapse" data-parent="#chartsInfo" href="#collapseChart'+i+'" aria-expanded="true" aria-controls="#collapseChart'+i+'">',
        //                                         chartTitle[i],
        //                                         '</a>',
        //                                         '</h4>',
        //                                         '</div>',
        //                                         '<div id="collapseChart'+i+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingChart'+i+'">',
        //                                         '<div class="panel-body">',
        //                                         '</div>',
        //                                         '<button type="button" class="btn btn-success">确认</button>',
        //                                         '</div>',
        //                                         '</div>'
        //                                     ].join('')
        //                                 );
        //                                 var usedField = [];   //每个图表用到的字段
        //                                 if(chartBuilderParams[i].chartType == 'bar' || chartBuilderParams[i].chartType == 'line'){
        //                                     usedField.push(chartBuilderParams[i].builderModel.xAxis[0]);
        //                                     usedField.push(chartBuilderParams[i].builderModel.yAxis[0]);
        //                                 }else if(chartBuilderParams[i].chartType == 'pie' || chartBuilderParams[i].chartType == 'ring'){
        //                                     usedField.push(chartBuilderParams[i].builderModel.mark.angle);
        //                                     usedField.push(chartBuilderParams[i].builderModel.mark.color);
        //                                 }
        //                                 for(var item in data[i][0]){
        //                                     if($.inArray(item,usedField) >= 0){
        //                                         var value = [];   // 保存数据项
        //                                         for(var k=0;k<data[i].length;k++){
        //                                             value.push(data[i][k][item]);
        //                                         }
        //                                         var hasText = false;     // 判断是否有文字
        //                                         for (var j = 0; j < value.length; j++) {
        //                                             if (isNaN(value[j])) {
        //                                                 hasText = true;
        //                                             }
        //                                         }
        //                                         if (hasText == false) {
        //                                             $("#collapseChart" + i).find(".panel-body").append('<div class="row number" id=charts' + i + item + ' style="margin-top: 20px;margin-left: 5px;"><div style="margin-left: 5px;margin-bottom: 15px;"><div>' + item + '</div></div></div>');
        //                                             var min = Math.min.apply(null, value);
        //                                             var max = Math.max.apply(null, value);
        //                                             $("#charts" + i + item).append('<input type="hidden" id="slider' + order + '" class="slider-input" value="' + min + "," + max + '"/>');
        //                                             $('#slider' + order).jRange({
        //                                                 from: min,
        //                                                 to: max,
        //                                                 scale: [min, max],
        //                                                 step: 1,
        //                                                 format: '%s',
        //                                                 width: $("#accordion").width() - 55,
        //                                                 showLabels: true,
        //                                                 isRange: true
        //                                             });
        //                                             order++;
        //                                         }else {
        //                                             $("#collapseChart" + i).find(".panel-body").append('<div class="row text" id=charts' + i + item + ' style="margin-top: 20px;margin-left: 5px;"><div style="margin-left: 5px;margin-bottom: 15px;"><div>' + item + '</div></div></div>');
        //                                             for (var j = 0; j < $.unique(value).length; j++) {
        //                                                 $("#charts" + i + item).append([
        //                                                     '<div class="checkbox3 checkbox-inline checkbox-check checkbox-light">',
        //                                                     '<input type="checkbox" id="checkbox-fa-light-1' + order + '" checked="">',
        //                                                     '<label for="checkbox-fa-light-1' + order + '">',
        //                                                     $.unique(value)[j],
        //                                                     '</label>',
        //                                                     '</div>'
        //                                                 ].join(''));
        //                                                 order++;
        //                                             }
        //                                         }
        //                                     }
        //                                 }
        //
        //                                 //为过滤项绑定事件
        //                                 $("#collapseChart"+i).find(".btn-success").click(function(){
        //                                     var chartId = $(this).parent().prev().attr("id").replace("headingChart","").trim();
        //                                     filter[chartId] = [];
        //                                     $(this).prev().find(".row").each(function(){
        //                                         var fieldName = $(this).children().eq(0).text().trim();
        //                                         var fieldFilter = [];
        //                                         if($(this).hasClass("text")){
        //                                             $(this).find("input:checkbox:checked").each(function(){
        //                                                 fieldFilter.push($(this).next().text());
        //                                             });
        //                                             var filterParam = {};
        //                                             filterParam[fieldName] = fieldFilter;
        //                                             filter[chartId].push(JSON.stringify(filterParam));
        //                                         }else if($(this).hasClass("number")){
        //                                             var filterParam = {};
        //                                             filterParam[fieldName] = $(this).find("input").val();
        //                                             filter[chartId].push(JSON.stringify(filterParam));
        //                                         }
        //                                     });
        //                                     containerAndModel[chartId].model.builderModel.filter = filter[chartId];
        //                                     var id = containerAndModel[chartId].id;
        //                                     $.ajax({
        //                                         type: 'POST',
        //                                         async: false,
        //                                         contentType: "application/json; charset=utf-8",
        //                                         url: 'render',
        //                                         data: JSON.stringify(containerAndModel[chartId].model),
        //                                         success: function(option){
        //                                             var editChart = engine.chart.getInstanceByDom(document.getElementById(id));
        //                                             var editOption = editChart.getOption();
        //                                             editOption.series[0].data = option.series[0].data;
        //                                             if('legend' in option){
        //                                                 editOption.legend.data = option.legend.data;
        //                                             }
        //                                             if('xAxis' in option){
        //                                                 editOption.xAxis[0].data = option.xAxis[0].data;
        //                                             }
        //                                             editChart.setOption(editOption,true);
        //                                         }
        //                                     });
        //                                 });
        //                             }
        //                             isRender = true;
        //                         });
        //                     }
        //                     $("#dataSet").css("display","none");
        //                     $("#chartsInfo").css("display","block");
        //                 });
        //             }).fail(function(){
        //                 $(".loader-container").css("display","none");
        //                 $("#accordion").html("筛选控件加载失败请刷新网页重试！");
        //             });
        //
        //             $(this).unbind("click");
        //             $(this).click(function(){
        //                 $("#accordion").toggle();
        //             });
        //         });
        //     }
        // })
    });
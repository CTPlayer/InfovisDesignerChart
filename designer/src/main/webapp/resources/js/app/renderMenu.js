/**
 * Created by ct on 2016/9/7.
 */
define(['jquery', 'formatData', 'zrender', 'CanvasTag', 'CanvasTagOfImage', 'echarts', 'generateTableHtml',
    'bootstrap', 'spectrum'],function($,formatData,zrender,CanvasTag,CanvasTagOfImage,echarts,generateTableHtml){
    /**
     * 渲染设计面板图表菜单
     * @param target
     */
    var renderMenu = function(target,chartName,app){
        //根据target判断不同的渲染方式以及事件绑定
        var charttype = target.attr("chartType");
        if(charttype == 'chart') {
            target.append('<div id="operate" style="width:100%;height:0px;background-color:rgb(53,61,71);position:absolute;top:0px;opacity:0.8">' +
                '<span style="display:none;">' +
                '<span id="chartTitle">'+chartName+'</span>' +
                '<a href="#"><i class="glyphicon glyphicon-remove" style="color: white"></i></a>' +
                '<a href="#" data-toggle="modal" data-target="#optionModal"><i class="glyphicon glyphicon-pencil" style="color: white"></i></a>' +
                '<a href="#"><i class="fa fa-cog" style="color: white"></i></a>' +
                '</span>' +
                '</div>');
        }else if(charttype.indexOf("text") >= 0){
            target.append('<div id="operate" style="width:100%;height:0px;background-color:rgb(53,61,71);position:absolute;top:0px;opacity:0.8">' +
                '<span style="display:none;">' +
                '<span id="chartTitle">'+chartName+'</span>' +
                '<a href="#"><i class="glyphicon glyphicon-remove" style="color: white"></i></a>' +
                '<a href="#" data-toggle="modal" data-target="#textOptionModal"><i class="glyphicon glyphicon-pencil" style="color: white"></i></a>' +
                '</span>' +
                '</div>');
        }else if(charttype == 'table'){
            target.append('<div id="operate" style="width:100%;height:0px;background-color:rgb(53,61,71);position:absolute;top:0px;opacity:0.8">' +
                '<span style="display:none;">' +
                '<span id="chartTitle">'+chartName+'</span>' +
                '<a href="#"><i class="glyphicon glyphicon-remove" style="color: white"></i></a>' +
                '<a href="#"><i class="fa fa-cog" style="color: white"></i></a>' +
                '<a href="#"><i class="glyphicon glyphicon-download-alt" style="color: white"></i></a>' +
                '</span>' +
                '</div>');
            target.find("table").prepend('<caption align="top" style="text-align: center;font-weight: 900;height: 15%;">'+
                                            '<div>'+chartName+'</div>'+
                                            '<div><button style="margin-top: 3px;width: 50px;" type="button" onclick="search(this)" class="btn btn-xs">查询</button></div>'+
                                         '</caption>');
        }

        target.on('mouseenter mouseleave',function(e){
            var target = $("#operate",$(this));
            if(e.type == 'mouseenter'){
                target.stop();
                target.children().css("display","block");
                target.animate({height:'40px'});
            }else if(e.type == 'mouseleave'){
                target.stop();
                target.children().css("display","none");
                if(target.css('height') != '0px') {
                    target.animate({height: "0"});
                }
            }
        });

        //删除当前容器
        target.find('#operate').find('a').eq(0).click(function(){
            var ids = [];
            for(var i=0;i<app.widgets.length;i++){
                ids.push(app.widgets[i].id);
            }
            var index;
            for(var i=0;i<ids.length;i++){
                if(ids[i] == $(this).parent().parent().parent().attr('id')){
                    index = i;
                }
            }
            app.widgets[index].width = 0;
            app.widgets[index].height = 0;
            $("#"+$(this).parent().parent().parent().attr('id')).remove();
            app.isSave = false;
        });

        //根据target判断不同的渲染方式以及事件绑定
        if(charttype == 'chart') {
            //将选中即将配置的图表渲染到配置面板
            //双向绑定
            target.find('a').eq(1).click(function () {
                var instance = echarts.getInstanceByDom($(this).parent().parent().parent()[0]);
                app.chartOption = instance.getOption();
            });

            target.find('a').eq(2).click(function () {
                var index = $(this).parent().parent().parent().attr("chartId");
                var exportId = $("#exportId").val();
                if (app.isSave == false) {
                   app.saveCurrentPanel();
                }
                top.window.location = "dataAnalysis.page?chartId=" + index + "&exportId=" + exportId;
            });
        }else if(charttype.indexOf("text") >= 0) {
            target.find('#operate').find('a').eq(1).click(function () {
                var pzr = zrender.getInstance(target.attr("zid"));//原控件
                var option = $.extend(true, {}, pzr.storage.getShapeList()[0].style);
                if(charttype.indexOf("subGroupOfImage") < 0){
                    app.currentView = 'text';
                    app.textOption = option;
                }else {
                    app.currentView = 'img';
                    app.subGroupOption = option;
                }
            });
        }else if(charttype == 'table'){
            target.find('#operate').find('a').eq(1).click(function () {
                var index = $(this).parent().parent().parent().attr("chartId");
                var exportId = $("#exportId").val();
                if (app.isSave == false) {
                    app.saveCurrentPanel();
                }
                top.window.location = "dataAnalysis.page?chartId=" + index + "&exportId=" + exportId;
            });
            target.find('#operate').find('a').eq(2).click(function () {
                var table = target.find("table").tableExport({
                    exportButtons: true,
                    formats: ['xls'],
                    filename: chartName,
                    ignoreRows: 0
                });
                $(".tableexport-caption").find("button").eq(0).trigger("click");
                table.remove();
            });
        }
    };

    /**
     * panel页面table渲染
     * @param dom
     * @param data
     * @param app
     */
    var renderTableInPanel = function(dom, data, app){
        var backupsData = data;
        app.currentPage = app.tableCurrentPage[data.id];
        var chartName = data.chartName;
        var xAxis = JSON.parse(data.buildModel).xAxis;
        var yAxis = JSON.parse(data.buildModel).yAxis;
        var allColumn = [];
        for(var i=0;i<xAxis.length;i++){
            allColumn.push(xAxis[i]);
        }
        for(var i=0;i<yAxis.length;i++){
            allColumn.push(yAxis[i]);
        }
        $.ajax({
            async: false,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: 'render',
            data: JSON.stringify({
                'chartType': data.chartType,
                'dataRecordId': data.sqlRecordingId,
                'builderModel': JSON.parse(data.buildModel),
                'page': app.currentPage,
                'pageSize': 12,
                'pageOrNo': "true"
                // 'filterModels': [],
                // 'filterOrNo': false
            }),
            success: function(result){
                generateTableHtml.render(dom, result.data, allColumn, result.totalPages, {}, result.totalCount, app);
                //点击翻页
                dom.find(".paging").find("li").click(function(){
                    if($(this).hasClass("pagePre")){
                        if(app.currentPage > 1){
                            dom.find(".paging").find(".pageNumber").removeClass("active");
                            app.tableCurrentPage[data.id]--;
                            renderTableInPanel(dom, backupsData, app);
                        }
                    }else if($(this).hasClass("pageNext")){
                        if(app.currentPage < result.totalPages){
                            dom.find(".paging").find(".pageNumber").removeClass("active");
                            app.tableCurrentPage[data.id]++;
                            renderTableInPanel(dom, backupsData, app);
                        }
                    }else{
                        app.tableCurrentPage[data.id] = $(this).text().trim();
                        renderTableInPanel(dom, backupsData, app);
                    }
                });
                renderMenu(dom,chartName,app);
            }
        })
    };

    return {
        renderMenu : renderMenu,
        renderTableInPanel : renderTableInPanel
    }
});
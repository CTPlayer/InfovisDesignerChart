/**
 * Created by ct on 2016/9/7.
 */
define(['jquery', 'formatData', 'zrender', 'CanvasTag', 'CanvasTagOfImage', 'echarts',
    'bootstrap', 'spectrum'],function($,formatData,zrender,CanvasTag,CanvasTagOfImage,echarts){
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
                '</span>' +
                '</div>');
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
        target.find('a').eq(0).click(function(){
            for(var i=0;i<app.widgets.length;i++){
                if(app.widgets[i].id == $(this).parent().parent().parent()[0].id){
                    app.widgets.splice(i, 1);
                }
            }
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
            target.find('a').eq(1).click(function () {
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
            target.find('a').eq(1).click(function () {
                var index = $(this).parent().parent().parent().attr("chartId");
                var exportId = $("#exportId").val();
                if (app.isSave == false) {
                    app.saveCurrentPanel();
                }
                top.window.location = "dataAnalysis.page?chartId=" + index + "&exportId=" + exportId;
            });
        }
    };

    return {
        renderMenu : renderMenu
    }
});
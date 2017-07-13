/**
 * Created by ct on 2016/9/7.
 */
define(['jquery','knockout','echarts','jrange'], function($,ko,echarts){
    var renderChart = function(chartType,sqlRecordingId,app,filterContent){
        var color = $(".mark-item-color").find("span").children().eq(0).text().trim();
        var angle = $(".mark-item-corner").find("span").children().eq(0).text().trim();
        var tag = $(".mark-item-tag").find("span").children().eq(0).text().trim();
        var xAxis = [];
        var yAxis = [];
        xAxis.push($(".xAxis").find("span").text().trim());
        yAxis.push($(".yAxis").find("span").text().trim());

        var builderModel = {};
        if(chartType == 'pie' || chartType == 'ring'){
             builderModel = {
                'mark': {
                    'color': color,
                    'angle': angle,
                    'tag': tag
                },
                'filter':filterContent
            }
        }else if(chartType == 'line' || chartType == 'bar'){
             builderModel = {
                'xAxis':  xAxis,
                'yAxis':  yAxis,
                'filter':filterContent
            }
        }

        app.builderModel = builderModel;         //用于插入图表关联信息

        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: 'render',
            data: JSON.stringify({
                'chartType': chartType,
                'dataRecordId': sqlRecordingId,
                'builderModel': builderModel
            }),
            success: function(option){
                echarts.dispose(document.getElementById("editArea"));
                var editChart = echarts.init(document.getElementById("editArea"));
                editChart.setOption(option);
            }
        });
    };

    /**
     * 渲染过滤视图
     * @param chartType 图表类型
     * @param sqlRecordingId 数据集id
     * @param targetText 当前拖动图标值
     * @param dragDataType 当前拖动图标值类型
     * @param filterPanel 过滤视图jquery对象
     */
    var getFilterResult = function(chartType,sqlRecordingId,targetText,dragDataType,app){
        var filter = [];
        if(targetText != null){
            filter.push(targetText);
        }else {
            filter.push('');
        }
        var builderModel = {
            'filter': filter
        };

        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: 'myChart/getFilterResult',
            data: JSON.stringify({
                'chartType': chartType,
                'dataRecordId': sqlRecordingId,
                'builderModel': builderModel
            }),
            success: function(data){
                if(dragDataType == 'text'){
                    app.filterType = 'text';
                    var numberResult = [];
                    for(var i=0;i<data.filterResult.length;i++) {
                        numberResult.push(data.filterResult[i][targetText]);
                    }
                    app.numberResult = numberResult;
                }else if(dragDataType == 'number'){
                    app.filterType = 'number';
                    numberResult = [];
                    var hasText = false;     // 判断是否有文字
                    for(var i=0;i<data.filterResult.length;i++){
                        numberResult.push(data.filterResult[i][targetText]);
                        if(isNaN(data.filterResult[i][targetText])){
                            hasText = true;
                        }
                    }
                    app.$nextTick(function(){
                        if(hasText == false){
                            var min = Math.min.apply(null,numberResult);
                            var max = Math.max.apply(null,numberResult);
                            app.rangeMin = min;
                            app.rangeMax = max;
                        }else {
                            $(".numberContainer").html("当前值范围中包含非数字项，请检查或者转换为维度");
                        }
                    });
                }
            }
        });
    };

    return {
        renderChart : renderChart,
        getFilterResult : getFilterResult
    }
});
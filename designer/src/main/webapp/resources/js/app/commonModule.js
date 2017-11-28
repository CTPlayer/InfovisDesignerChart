/**
 * Created by ct on 2016/9/7.
 */
define(['jquery','echarts','generateTableHtml','thenBy', 'jquery-confirm', 'jquery-loading'], function($, echarts, generateTableHtml){
    var renderChart = function(chartType,sqlRecordingId,app,filterContent){
        $('.row-editArea').loading('toggle');
        var color = $(".mark-item-color").find("span").children().eq(0).text().trim();
        var angle = $(".mark-item-corner").find("span").children().eq(0).text().trim();
        var tag = $(".mark-item-tag").find("span").children().eq(0).text().trim();
        var xAxis = app.xAxis;
        var yAxis = app.yAxis;

        var builderModel = {};
        if(chartType == 'pie'){
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
                $('.row-editArea').loading('toggle');
                echarts.dispose(document.getElementById("editArea"));
                var editChart = echarts.init(document.getElementById("editArea"));
                addToolBox(option);
                editChart.setOption(option);
            }
        });
    };

    var renderTable = function(chartType,sqlRecordingId,filterContent,groupParam,currentPage,order,app){
        $('.row-editArea').loading('toggle');
        var xAxis = [];
        var yAxis = [];

        for(var i=0;i<$(".xAxis").find(".dragName").length;i++){
            var targetNodeText = $(".xAxis").find(".dragName").eq(i).text().trim();
            if(targetNodeText != ""){
                xAxis.push(targetNodeText);
            }
        }
        for(var i=0;i<$(".yAxis").find(".dragName").length;i++){
            var targetNodeText = $(".yAxis").find(".dragName").eq(i).text().trim();
            if(targetNodeText != ""){
                yAxis.push(targetNodeText);
            }
        }


        var builderModel = {
            'xAxis': xAxis,
            'yAxis': yAxis
        };

        app.builderModel = builderModel;         //用于插入图表关联信息

        var filterModels = [];
        var isFilter = "false";
        for(var i in filterContent){
            var filterParam = JSON.parse(filterContent[i]);
            for(var key in filterParam){
                var filterModel = {};
                if($.isArray(filterParam[key])){
                    filterModel.column = key;
                    filterModel.columnType = 'text';
                    filterModel.value = filterParam[key];
                }else {
                    var min = parseInt(filterParam[key].split(',')[0]);
                    var max = parseInt(filterParam[key].split(',')[1]);
                    filterModel.column = key;
                    filterModel.columnType = 'number';
                    filterModel.min = min;
                    filterModel.max = max;
                }
            }
            filterModels.push(filterModel);
        }
        if(filterModels.length > 0){
            isFilter = "true";
        }

        builderModel.filterModels = filterModels;
        builderModel.filterOrNo = isFilter;

        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: 'render',
            data: JSON.stringify({
                'chartType': chartType,
                'dataRecordId': sqlRecordingId,
                'builderModel': builderModel,
                'page': Math.ceil(currentPage),
                'pageSize': 12,
                'pageOrNo': "true",
                'sidx': order.column,
                'sord': order.sort
                // 'filterModels': filterModels,
                // 'filterOrNo': isFilter
            }),
            success: function(result){
                var data = result.data;
                function getArray(a) {
                    var hash = {},
                        len = a.length,
                        result = [];

                    for (var i = 0; i < len; i++){
                        if (!hash[a[i]]){
                            hash[a[i]] = true;
                            result.push(a[i]);
                        }
                    }
                    return result;
                }

                /**
                 * 合并分组
                 */
                if(!$.isEmptyObject(groupParam)){
                    var thenByOrder1 = 1;
                    if(order.column == groupParam.groupFactor[0] && order.sort == 'desc'){
                        thenByOrder1 = -1;
                    }
                    var group = firstBy(function(v){ return v[groupParam.groupFactor[0]] }, thenByOrder1);
                    for(var i=1;i<groupParam.groupFactor.length;i++){
                        var thenByOrder2 = 1;
                        if(order.column == groupParam.groupFactor[i] && order.sort == 'desc'){
                            thenByOrder2 = -1;
                        }
                        group = group.thenBy(groupParam.groupFactor[i], thenByOrder2);
                    }
                    data.sort(group);
                }

                var allColumn = [];
                for(var i=0;i<xAxis.length;i++){
                    allColumn.push(xAxis[i]);
                }
                for(var i=0;i<yAxis.length;i++){
                    allColumn.push(yAxis[i]);
                }

                $('.row-editArea').loading('toggle');
                generateTableHtml.render($("#editArea"), data, allColumn, result.totalPages, app.order, result.totalCount, app);
                if(!$.isEmptyObject(groupParam)){
                    mergeCell(data, groupParam, allColumn);
                }
                //点击翻页
                $(".paging").find("li").click(function(){
                    if($(this).hasClass("pagePre")){
                        if(app.currentPage > 1){
                            $(".paging").find(".pageNumber").removeClass("active");
                            app.currentPage--;
                            renderTable(app.chartType,app.sqlRecordingId,app.filterParam,app.groupParam,app.currentPage,app.order,app);
                        }
                    }else if($(this).hasClass("pageNext")){
                        if(app.currentPage < result.totalPages){
                            $(".paging").find(".pageNumber").removeClass("active");
                            app.currentPage++;
                            renderTable(app.chartType,app.sqlRecordingId,app.filterParam,app.groupParam,app.currentPage,app.order,app);
                        }
                    }else{
                        app.currentPage = $(this).text().trim();
                        renderTable(app.chartType,app.sqlRecordingId,app.filterParam,app.groupParam,app.currentPage,app.order,app);
                    }
                });

                //点击排序
                // $("#editArea").find("tr").eq(0).find("td").click(function(){
                //     if($(this).find("span").hasClass("glyphicon-arrow-up")){
                //         window.order.sort = "desc";
                //         window.order.column = $(this).text().trim();
                //     }else if($(this).find("span").hasClass("glyphicon-arrow-down")){
                //         window.order.sort = "asc";
                //         window.order.column = $(this).text().trim();
                //     }else {
                //         $("#editArea").find("tr").eq(0).find(".glyphicon-arrow-up").remove();
                //         $("#editArea").find("tr").eq(0).find(".glyphicon-arrow-down").remove();
                //         $(this).append('<span class="glyphicon glyphicon-arrow-up"></span>');
                //         window.order.sort = "asc";
                //         window.order.column = $(this).text().trim();
                //     }
                //     renderChart(chartType,window.sqlRecordingId,filterParam,groupParam,window.currentPage,window.order);
                // });
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
        $(".panel-info").loading('toggle');
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
                $(".panel-info").loading('toggle');
                if(dragDataType == 'text'){
                    app.filterType = 'text';
                    var textResult = [];
                    for(var i=0;i<data.filterResult.length;i++) {
                        if($.inArray(data.filterResult[i][targetText], textResult) == -1){
                            textResult.push(data.filterResult[i][targetText]);
                        }
                    }
                    app.filterContent.push({tagText: targetText,result: textResult,tagType: 'text'});
                    app.checkedNames[targetText] = textResult;
                }else if(dragDataType == 'number'){
                    app.filterType = 'number';
                    var numberResult = [];
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
                            app.filterContent.push({tagText: targetText,rangeMin: min,rangeMax: max,tagType: 'number'});
                        }else {
                            $(".numberContainer").html("当前值范围中包含非数字项，请检查或者转换为维度");
                        }
                    });
                }
            }
        });
    };

    /**
     * table合并分组
     */
    var arrayToTimes = function(dataArray){
        var rowSpans = [];
        var rowSpan = 1;
        if(dataArray.length == 1){
            rowSpans.push(rowSpan);
        }else if(dataArray.length > 1){
            for(var j=0;j<dataArray.length-1;j++){
                if(dataArray[j] == dataArray[j+1]){
                    rowSpan ++;
                    if(j == dataArray.length - 2){
                        rowSpans.push(rowSpan);
                    }
                }else {
                    if(j == dataArray.length - 2){
                        rowSpans.push(rowSpan);
                        rowSpans.push(1);
                    }else {
                        rowSpans.push(rowSpan);
                    }
                    rowSpan = 1;
                }
            }
        }
        return rowSpans;
    };

    var mergeCell = function(data, groupParam, allColumn){
        var preRowSpans = [];
        var rows = $("#editArea").find("tr");
        for(var i=0;i<groupParam.groupFactor.length;i++){
            var dataArray = [];
            var rowSpans = [];
            var index = $.inArray(groupParam.groupFactor[i], allColumn);
            for(var j=0;j<data.length;j++){
                dataArray.push(data[j][groupParam.groupFactor[i]]);
            }

            if(preRowSpans.length == 0){
                rowSpans = arrayToTimes(dataArray);
            }else {
                var allRowSpans = [];
                for(var j=0;j<preRowSpans.length;j++){
                    var partRowSpans = [];
                    for(var k=0;k<preRowSpans[j];k++){
                        partRowSpans.push(dataArray.shift());
                    }
                    allRowSpans.push(arrayToTimes(partRowSpans));
                }
                for(var j=0;j<allRowSpans.length;j++){
                    for(var k=0;k<allRowSpans[j].length;k++){
                        rowSpans.push(allRowSpans[j][k]);
                    }
                }
            }
            preRowSpans = rowSpans;

            //跨行合并
            var rowIndex = 1;
            for(var j=0;j<rowSpans.length;j++){
                $(rows[rowIndex]).find("td").eq(index).attr("rowSpan", rowSpans[j]);
                for(var k=rowIndex+1;k<(rowIndex+rowSpans[j]);k++){
                    $(rows[k]).find("td").eq(index).hide();
                }
                rowIndex += rowSpans[j];
            }
            // 添加总计单元
            var preSpan = 0;
            for(var j=0;j<rowSpans.length;j++){
                var count = '';
                for(var k=0;k<allColumn.length;k++){
                    if($("#editArea").find("tr").eq(0).find("td").eq(k).attr("dataType") == "number"){
                        var totalNumber = 0;
                        for(var m=preSpan;m<(rowSpans[j]+preSpan);m++){
                            if(!isNaN(data[m][allColumn[k]])){
                                totalNumber += parseInt(data[m][allColumn[k]]);
                            }
                        }
                        count += '<td>'+totalNumber+'</td>';
                    }else {
                        count += '<td>'+$(rows[rowSpans[j]+preSpan]).find("td").eq(index).text().trim()+'</td>';
                    }
                }
                $(rows[rowSpans[j]+preSpan]).after([
                    '<tr class="totalCount ',groupParam.groupFactor[i],'">',
                    count,
                    '</tr>'
                ].join(''));
                preSpan += rowSpans[j];
            }
        }
        //总计单元合并,计算
        var dataTypeArray = [];
        $("#editArea").find("tr").eq(0).find("td").each(function(){
            if($(this).attr("dataType") == "text"){
                dataTypeArray.push("text");
            }else if($(this).attr("dataType") == "number"){
                dataTypeArray.push("number");
            }
        });
        var colSpans = arrayToTimes(dataTypeArray);
        var differ = 0;
        for(var k=0;k<groupParam.groupFactor.length;k++){
            $("#editArea").find("."+groupParam.groupFactor[k]).each(function(){
                var colIndex = 0;
                for(var i=0;i<colSpans.length;i++){
                    if($("#editArea").find("tr").eq(0).find("td").eq(colIndex).attr("datatype") == "text"){
                        for(var j=colIndex+1;j<(colSpans[i]+colIndex);j++){
                            $(this).find("td").eq(colIndex).attr("colSpan",colSpans[i]-parseInt(differ));
                            $(this).find("td").eq(j).hide();
                        }
                    }
                    colIndex += colSpans[i];
                }
            });
            differ = $.inArray(groupParam.groupFactor[k], allColumn) + 1;
        }
        //colspan计算
        for(var i=0;i<parseInt(groupParam.groupFactor.length)-1;i++){
            var preGroupData = [];
            var rowNumbers = [];
            $(rows).each(function(){
                if($(this).find("td").eq($.inArray(groupParam.groupFactor[i], allColumn)).attr("rowspan") != undefined){
                    preGroupData.push($(this).find("td").eq($.inArray(groupParam.groupFactor[i], allColumn)).attr("rowspan"));
                    rowNumbers.push(0);
                }
            });
            for(var m=(i+1);m<parseInt(groupParam.groupFactor.length);m++){
                var lastGroupData = [];
                var lastGroupKey = groupParam.groupFactor[m];
                $(rows).each(function(){
                    if($(this).find("td").eq($.inArray(lastGroupKey, allColumn)).attr("rowspan") != undefined){
                        lastGroupData.push($(this).find("td").eq($.inArray(lastGroupKey, allColumn)).attr("rowspan"));
                    }
                });
                for(var j=0;j<preGroupData.length;j++){
                    var markData = preGroupData[j];
                    var length = lastGroupData.length;
                    for(var k=0;k<length;k++){
                        markData = parseInt(markData) - parseInt(lastGroupData.shift());
                        if(parseInt(markData) > 0){
                            rowNumbers[j]++;
                        }else if(parseInt(markData) == 0){
                            rowNumbers[j]++;
                            break;
                        }else {
                            break;
                        }
                    }
                }
            }
            var tds = [];
            $(rows).each(function(){
                if($(this).find("td").eq($.inArray(groupParam.groupFactor[i], allColumn)).attr("rowspan") != undefined){
                    tds.push($(this).find("td").eq($.inArray(groupParam.groupFactor[i], allColumn)));
                }
            });
            for(var j=0;j<tds.length;j++){
                $(tds[j]).attr("rowspan", parseInt(rowNumbers[j])+parseInt($(tds[j]).attr("rowspan")));
            }
        }
    };

    /**
     * 为option添加toolbox
     * @param option
     */
    var addToolBox = function(option){
        var toolbox = {
              show : true,
              feature : {
                  saveAsImage : {show: true}
              }
        };
        option.toolbox = toolbox;
    };

    var renderTableInPanel = function(dom, data, app){
        var backupsData = data;
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
            }),
            success: function(result){
                generateTableHtml.render(dom, result.data, allColumn, result.totalPages, {}, result.totalCount, app);
                //点击翻页
                dom.find(".paging").find("li").click(function(){
                    if($(this).hasClass("pagePre")){
                        if(app.currentPage > 1){
                            dom.find(".paging").find(".pageNumber").removeClass("active");
                            app.currentPage--;
                            renderTableInPanel(dom, backupsData, app);
                        }
                    }else if($(this).hasClass("pageNext")){
                        if(app.currentPage < result.totalPages){
                            dom.find(".paging").find(".pageNumber").removeClass("active");
                            app.currentPage++;
                            renderTableInPanel(dom, backupsData, app);
                        }
                    }else{
                        app.currentPage = $(this).text().trim();
                        renderTableInPanel(dom, backupsData, app);
                    }
                });
            }
        })
    };

    return {
        renderChart : renderChart,
        renderTable : renderTable,
        getFilterResult : getFilterResult,
        addToolBox : addToolBox,
        renderTableInPanel : renderTableInPanel
    }
});
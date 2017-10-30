define(['jquery','tooltipster'], function($){
    var render = function (dom, data, keys, totalPages, order, totalCount, app) {
        var tableWidth = dom.width();
        var table = '';
        var dataType = '';
        var pageTag = '';

        table += "<tr>";
        for(var i=0;i<keys.length;i++){
            table += '<td style="height: 34px;"><input type="text" class="form-control" style="display: inline-block;" placeholder="'+keys[i]+'"></td>';
        }
        table += "</tr>";

        table += "<tr>";
        for(var i=0;i<keys.length;i++){
            var orderTag = '';
            if(keys[i] == order.column){
                if(order.sort == 'desc'){
                    orderTag = '<span class="glyphicon glyphicon-arrow-down"></span>';
                }else if(order.sort == 'asc'){
                    orderTag = '<span class="glyphicon glyphicon-arrow-up"></span>';
                }
            }
            if($.inArray(keys[i], app.xAxis) >= 0){
                dataType = 'text';
            }else if($.inArray(keys[i], app.yAxis) >= 0){
                dataType = 'number';
            }
            table += '<td dataType="'+dataType+'">'+keys[i]+orderTag+'</td>';
        }
        table += "</tr>";

        for(var i=0;i<data.length;i++){
            table += "<tr>";
            for(var j=0;j<keys.length;j++){
                table += "<td class='tip' title='"+data[i][keys[j]]+"'>"+data[i][keys[j]]+"</td>";
                // table += "<td class='tip'>"+data[i][keys[j]]+"</td>";
            }
            table += "</tr>";
        }

        if(!$.isEmptyObject(data[0])){
            pageTag += '<nav aria-label="...">';
            pageTag += '<ul class="pagination" style="margin-bottom: -10px">';
            pageTag += '<li class="pagePre"><a href="javascript:void(0)" aria-label="Previous"><span aria-hidden="true">«</span></a></li>';
            if(totalPages < 6){
                for(var i=1;i<(totalPages + 1);i++){
                    pageTag += '<li class="pageNumber"><a href="javascript:void(0)">'+i+'</a></li>';
                }
            }else {
                var startPage = parseInt(app.currentPage%5) == 0 ? (app.currentPage/5-1)*5+1 : parseInt(app.currentPage/5)*5+1;
                var endPage = startPage+5 > totalPages+1 ? totalPages+1 : startPage+5;
                for(var i=startPage;i<endPage;i++){
                    pageTag += '<li class="pageNumber"><a href="javascript:void(0)">'+i+'</a></li>';
                }
            }
            pageTag += '<li class="pageNext"><a href="javascript:void(0)" aria-label="Next"><span aria-hidden="true">»</span></a></li>';
            pageTag += '</ul>';
            pageTag += '<span style="line-height: 47px;font-size: 15px;"><strong>&nbsp;&nbsp;总计&nbsp;&nbsp;' + totalCount + '&nbsp;&nbsp;条数据</strong></span>';
            pageTag += '</nav>';
        }

        dom.html([
            '<table  border="0" cellpadding="0" cellspacing="10"  width="'+tableWidth+'">',
                table,
            '</table>',
            '<div class="paging">',
                pageTag,
            '</div>'
        ].join(''));

        if(app.currentPage <= 1){
            dom.find(".paging").find(".pagePre").addClass("disabled");
        }
        if(app.currentPage >= totalPages){
            dom.find(".paging").find(".pageNext").addClass("disabled");
        }
        dom.find(".paging").find(".pageNumber").eq(app.currentPage%5 == 0 ? 4 : app.currentPage%5 - 1).addClass("active");

        // dom.find('.tip').tooltipster({
        //     delay: 0
        // });
    };

    return {
        render : render
    }
});
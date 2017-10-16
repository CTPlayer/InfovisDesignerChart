<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="/resources/include.jsp"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <META http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>报表展示</title>
    <!--background theme-->
    <link rel="stylesheet" type="text/css" href="resources/css/backgroundTheme.css">
    <!-- Bootstrap Core CSS -->
    <link href="resources/js/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="resources/js/lib/bootstrap/css/bootstrap.vertical-tabs.css" rel="stylesheet">
    <!-- Font Icons -->
    <link href="resources/js/lib/bootstrap/css/font-awesome.css" rel="stylesheet">
    <!-- Animate -->
    <link href="resources/js/lib/bootstrap/css/animate.css" rel="stylesheet">
    <!--flat admin-->
    <link rel="stylesheet" type="text/css" href="resources/js/lib/flatadmin/css/style.css">
    <link rel="stylesheet" type="text/css" href="resources/js/lib/flatadmin/css/themes/flat-blue.css">
    <!-- checkbox -->
    <link rel="stylesheet" type="text/css" href="resources/js/lib/flatadmin/lib/css/checkbox3.min.css">
    <!--custome CSS-->
    <link href="resources/css/dataAnalysis.css" rel="stylesheet">
    <!--jRange CSS-->
    <link href="resources/js/lib/jRange/jquery.range.css" rel="stylesheet">
    <!--table CSS-->
    <link href="resources/css/svgTable.css" rel="stylesheet">

    <style>
        .filterIcon{
            margin-top: 30px;
            right: 30px;;
            font-size: 30px;
            position: fixed;
            color: cornflowerblue;
            border:solid 2px cornflowerblue;
            padding: 3px;
        }

        #accordion{
            position: fixed;
            margin-top: 80px;
            right: 15px;
            overflow: auto;
            overflow-y: visible;
            height: 400px;
            padding: 0px;
        }

        .loader-container{
            display: none;
            position :fixed;
            top:80px;
            z-index: 99999999;
            right: 30px;
        }

        [v-cloak] {
            display: none;
        }

        .draggable {
            background: white;
            position: absolute;
            display: inline-block;
        }
    </style>
</head>
<body>
<div class="container" id="app" style="width: 100%">
    <%--<span class="glyphicon glyphicon-filter filterIcon" aria-hidden="true"></span>--%>

    <%--<div class="loader-container text-center color-blue">--%>
    <%--<div><i class="fa fa-spinner fa-pulse fa-3x"></i></div>--%>
    <%--</div>--%>
    <%--<div class="panel-group col-md-3" id="accordion" role="tablist" aria-multiselectable="true" style="z-index: 99999999">--%>
    <%--</div>--%>

    <input type="hidden" value="${exportId}" id="exportId">
    <div class="container-fluid">
        <div v-for="item in widgets" style="overflow: auto" v-bind:style="{ width:item.width, height:item.height, transform: 'translate(' + item.datax + 'px,' + item.datay + 'px)' }" class="draggable" v-bind:chartType="item.chartType" v-bind:id="item.id" v-bind:chartId="item.chartId" v-bind:data-x="item.datax" v-bind:data-y="item.datay" >
            <img style="display: none" v-if="item.chartType === 'text:subGroupOfImage' " v-bind:src="item.hideImg">
            <div v-if="item.id  in renderFailList" v-cloak style="text-align: center;padding-top: 40%;"><span class="glyphicon glyphicon-flash" style="font-size: 40px;display:block" aria-hidden="true"></span><span class="glyphicon-class" style="font-size:25px;">当前图表渲染失败，请检查数据库链接是否正常!</span></div>
        </div>
    </div>
</div>
<script>
    var search = function(thisObj) {
        var table = $(thisObj).closest('table')[0];
        var rowLength = table.rows.length;
        for(var i=2;i<rowLength;i++){
            var display = '';
            $(thisObj).closest('table').find("input").each(function(index){
                var key = $(this).val();
                var cellText = table.rows[i].cells[index].innerHTML;

                if(!cellText.match(key) && key != ''){
                    display = 'none';
                }
                table.rows[i].style.display = display;
            });
        }
    }
</script>
<script src="resources/js/lib/require.js" defer async="true" data-main="resources/js/app/exportPanel"></script>
</body>
</html>
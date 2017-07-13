<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="/resources/include.jsp"%>
<!DOCTYPE html>
<html>
<head>
    <title>Infovis-Designer</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap Core CSS -->
    <link href="resources/js/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="resources/js/lib/bootstrap/css/bootstrap.vertical-tabs.css" rel="stylesheet">
    <!-- Animate -->
    <link href="resources/js/lib/bootstrap/css/animate.css" rel="stylesheet">
    <!--flat admin-->
    <link rel="stylesheet" type="text/css" href="resources/js/lib/flatadmin/css/style.css">
    <link rel="stylesheet" type="text/css" href="resources/js/lib/flatadmin/css/themes/flat-blue.css">
    <link rel="stylesheet" type="text/css" href="resources/js/lib/flatadmin/lib/css/bootstrap-switch.min.css">
    <!-- checkbox -->
    <link rel="stylesheet" type="text/css" href="resources/js/lib/flatadmin/lib/css/checkbox3.min.css">
    <!-- Font Icons -->
    <link href="resources/js/lib/bootstrap/css/font-awesome.css" rel="stylesheet">
    <!--ztree-->
    <link href="resources/js/lib/ztree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet">
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <!--mCustomScrollbar-->
    <link href="resources/js/lib/mCustomScrollbar/jquery.mCustomScrollbar.min.css" rel="stylesheet">
    <!--custome CSS-->
    <link href="resources/css/dataAnalysis.css" rel="stylesheet">

    <link href="resources/css/customZtreeStyle.css" rel="stylesheet">
    <!--jRange CSS-->
    <link href="resources/js/lib/jRange/jquery.range.css" rel="stylesheet">
    <!--bootstrapDatePicker CSS-->
    <link href="resources/js/lib/bootstrapTimePicker/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <![endif]-->

    <style>
        [v-cloak] {
            display: none;
        }
    </style>
</head>

<body class="flat-blue">
<div class="app-container" id="app">
    <div class="row content-container">
        <nav class="navbar navbar-inverse navbar-static-top">
            <div class="container-fluid">
                <ul class="nav navbar-nav navbar-left">
                    <a class="navbar-brand" href="#" style="color: #ffffff"><i class="glyphicon glyphicon-equalizer" aria-hidden="true"></i> 数据分析</a>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown" v-bind:class="{danger: dangerIndex == 0}" @mouseenter="topMenuMouseEnter(0)" >
                        <a href="query.page" role="button"><i class="glyphicon glyphicon-folder-close"></i>&nbsp;&nbsp;我的作品</a>
                    </li>
                    <li class="dropdown" v-bind:class="{danger: dangerIndex == 1}" @mouseenter="topMenuMouseEnter(1)" >
                        <a href="sqlClient.page"  role="button"><i class="icon fa fa-database"></i>&nbsp;&nbsp;数据源</a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="navbar-default sidebar scrollable" role="navigation" style="height: 550px;">
            <div class="panel panel-default">
                <div class="panel-heading" role="tab" id="heading">
                    <h4 class="panel-title">
                            <span class="glyphicon glyphicon-indent-left" aria-hidden="true"></span> 数据集
                    </h4>
                </div>
                <div id="collapse" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading">
                    <div class="panel-body leftScrollPanel" style="overflow: auto;height: 120px;background-color: #f9f9f9">
                        <div id="dataListTree" class="ztree"></div>
                    </div>
                </div>
            </div>
            <div class="sidebar-nav  navbar-collapse">
                <ul class="nav" id="side-menu">
                    <li class="active">
                        <a href="#"><i class="fa fa-sitemap fa-fw"></i>请选择数据集<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                            <li class="active">
                                <a href="#"><b>维度</b> <span class="fa arrow"></span></a>
                                <ul class="nav nav-third-level">
                                    <li v-cloak v-for="item in dimension">
                                        <a href="javascript:void(0)">
                                            <i class="glyphicon glyphicon-text-color leftBarLiIcon"></i>
                                            <span style="display:inline-block;max-width: 120px;overflow: hidden;vertical-align:bottom">
                                                {{ item }}
                                            </span>
                                            <i class="glyphicon glyphicon-download leftBarLiIcon pull-right" title="转换为度量" @click="changeTagType('text',item)" ></i>
                                        </a>
                                    </li>
                                </ul>
                                <!-- /.nav-third-level -->
                            </li>
                            <li class="active">
                                <a href="#"><b>度量</b> <span class="fa arrow"></span></a>
                                <ul class="nav nav-third-level">
                                    <li v-cloak v-for="item in measure">
                                        <a href="javascript:void(0)">
                                            <i class="fa fa-sort-numeric-asc leftBarLiIcon"></i>
                                            <span style="display:inline-block;max-width: 120px;overflow: hidden;vertical-align:bottom">
                                                {{ item }}
                                            </span>
                                            <i class="glyphicon glyphicon-upload leftBarLiIcon pull-right" title="转换为维度" @click="changeTagType('number',item)" ></i>
                                        </a>
                                    </li>
                                </ul>
                                <!-- /.nav-third-level -->
                            </li>
                        </ul>
                        <!-- /.nav-second-level -->
                    </li>
                </ul>
            </div>
        </div>
        <!-- Main Content -->
        <div id="page-wrapper">
            <div>
                <div class="col-lg-11 backUp">
                    <a v-bind:href="'showPanel.page?exportId=' + exportId" role="button">
                        <button class="btn btn-info">
                            <span class="glyphicon glyphicon-menu-left"></span> 返回
                        </button>
                    </a>
                </div>
                <div class="col-lg-1">
                    <a href="#" data-toggle="modal" data-target="#addChartModal"><button class="btn btn-info saveChartInfo" type="submit"><span class="glyphicon glyphicon-floppy-saved"></span> 保存</button></a>
                </div>
            </div>
            <div class="row content-container">
                <div class="col-lg-12 container-fluid">
                    <form class="form-horizontal make-model-region">
                        <div class="form-group">
                            <div class="col-lg-6">
                                <label class="col-sm-1 control-label">列</label>
                                <div class="col-sm-11 labelDiv trigger-column xAxis" style="overflow: hidden;">
                                    <div v-for="item in xAxis" v-cloak class="trigger-column-tag trigger-column-tag-text">
                                        <a>
                                            <i class="glyphicon glyphicon-text-color" style="display: none;"></i>
                                            <span class="dragName">
                                                {{ item }}
                                            </span>
                                            <button type="button" class="close trigger-column-tag-close" @click="tagRemove('xAxis',item)" >&times;</button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <label class="col-sm-1 control-label">行</label>
                                <div class="col-sm-11 labelDiv trigger-column yAxis" style="overflow: hidden;">
                                    <div v-for="item in yAxis" v-cloak class="trigger-column-tag trigger-column-tag-number">
                                        <a>
                                            <i class="fa fa-sort-numeric-asc" style="display: none;"></i>
                                            <span class="dragName">
                                                {{ item }}
                                            </span>
                                            <button type="button" class="close trigger-column-tag-close" @click="tagRemove('yAxis',item)" >&times;</button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-lg-6">
                                <label class="col-sm-1 control-label">标记</label>
                                <div class="col-sm-11 labelDiv mark-down-column">
                                    <div class="mark-item col-sm-4 mark-item-color">
                                        <i class="fa fa-tachometer" v-show="color.length == 0">颜色</i>
                                        <span v-for="item in color" v-cloak>
                                            <span style="width:100px;display: inline-block; overflow: hidden;">
                                                <i v-bind:class="item.iclass" style="display: inline;"></i>&nbsp;
                                                {{ item.targetNodeText }}
                                            </span>
                                            <button type="button" class="close mark-item-close" @click="tagRemove('color')">&times;</button>
                                        </span>
                                    </div>
                                    <div class="mark-item col-sm-4 mark-item-corner">
                                        <i class="fa fa-clock-o" v-show="corner.length == 0">角度</i>
                                        <span v-for="item in corner" v-cloak>
                                            <span style="width:100px;display: inline-block; overflow: hidden;">
                                                <i v-bind:class="item.iclass" style="display: inline;"></i>&nbsp;
                                                {{ item.targetNodeText }}
                                            </span>
                                            <button type="button" class="close mark-item-close" @click="tagRemove('corner')">&times;</button>
                                        </span>
                                    </div>
                                    <div class="mark-item-right col-sm-4 mark-item-tag">
                                        <i class="fa fa-tags" v-show="tag.length == 0">标签</i>
                                        <span v-for="item in tag" v-cloak>
                                            <span style="width:100px;display: inline-block; overflow: hidden;">
                                                <i v-bind:class="item.iclass" style="display: inline;"></i>&nbsp;
                                                {{ item.targetNodeText }}
                                            </span>
                                            <button type="button" class="close mark-item-close" @click="tagRemove('tag')">&times;</button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <label class="col-sm-1 control-label">筛选</label>
                                <div class="col-sm-11 labelDiv column-filter" style="overflow: hidden;z-index:0">

                                    <div v-for="(item,index) in filter" v-if="item.dragDataType === 'text'" v-cloak class="trigger-column-tag trigger-column-tag-text" @click="showFilterContent(index,'text')">
                                        <a>
                                            <i class="glyphicon glyphicon-text-color" style="display: none;"></i>
                                            <span class="dragName">
                                                {{ item.targetNodeText }}
                                            </span>
                                            <button type="button" class="close trigger-column-tag-close" @click.stop="tagRemove('filter',item)" >&times;</button>
                                        </a>
                                    </div>
                                    <div v-for="(item,index) in filter" v-if="item.dragDataType === 'number'" v-cloak class="trigger-column-tag trigger-column-tag-number" @click="showFilterContent(index,'number')">
                                        <a>
                                            <i class="fa fa-sort-numeric-asc" style="display: none;"></i>
                                            <span class="dragName">
                                                {{ item.targetNodeText }}
                                            </span>
                                            <button type="button" class="close trigger-column-tag-close" @click.stop="tagRemove('filter',item)" >&times;</button>
                                        </a>
                                    </div>

                                </div>
                                <div class="panel fresh-color panel-info col-sm-11" style="position: absolute;right:0px;z-index: 9999999" v-for="(item, index) in filter" v-bind:style="{top: filterHeight}" v-show="showFilterIndex === index" v-cloak @mousedown.stop>
                                    <div class="panel-heading">{{ item.targetNodeText }}</div>
                                    <div class="panel-body">
                                        <div v-show="'text' === filterType">
                                            <div class="alert fresh-color alert-info" role="alert" style="text-align: center;font-size: 15px;">
                                                <strong>列选项</strong>
                                            </div>
                                            <div class="row textContainer" style="margin-left:30px;height: 100px;overflow: auto">
                                                <div class="checkbox3 checkbox-inline checkbox-check checkbox-light" v-for="(item,index) in numberResult">
                                                    <input type="checkbox" v-bind:id="'checkbox-fa-light-'+index" checked="">
                                                    <label v-bind:for="'checkbox-fa-light-'+index" style="padding-left: 30px;line-height: 25px;">
                                                        {{ item }}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-show="'number' === filterType">
                                            <div class="alert fresh-color alert-info" role="alert" style="text-align: center;font-size: 15px;">
                                                <strong>值范围</strong>
                                            </div>
                                            <div class="numberContainer" style="margin-bottom: 20px;text-align: center">
                                                <div>
                                                    <input type="number" placeholder="左边界" v-model="rangeMin" style="display: inline-block;float: left">
                                                    <input type="number" placeholder="右边界" v-model="rangeMax" style="display: inline-block;float: right">
                                                </div>
                                                <div style="clear: both"></div>
                                                <%--<div style="margin-top: 20px;" class="numberRange">--%>
                                                    <%--<input type="hidden" class="slider-input" value="55,99"/>--%>
                                                    <%--{{range}}--%>
                                                <%--</div>--%>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-info col-md-offset-10 doFilter" @click="doFilter">确认</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row row-editArea">
                <div class="col-lg-12 col-xs-12 col-sm-12">
                    <div class="col-lg-10 col-xs-10">
                        <div id="editArea">
                            <h3>
                                <p><i class="glyphicon glyphicon-info-sign"></i>  请选择数据集</p>
                                <p>将维度、度量拖入工作区（行、列、标记）</p>
                            </h3>
                        </div>
                    </div>
                    <div class="col-lg-2 col-xs-2 col-sm-2">
                        <div class="panel fresh-color panel-default chart-type-select-panel" style="width:100px;top:300px;position: fixed">
                            <div class="panel-heading">图表类型</div>
                            <div class="chart-type">
                                <span class="bar" @click="chartTypeSelect('bar')" v-bind:class="{ active: 'bar' === chartType }">
                                    <img src="resources/img/bar_chart.png">
                                </span>
                                <span class="line" @click="chartTypeSelect('line')" v-bind:class="{ active: 'line' === chartType }">
                                    <img src="resources/img/line_chart.png">
                                </span>
                                <span class="pie" @click="chartTypeSelect('pie')" v-bind:class="{ active: 'pie' === chartType }">
                                    <img src="resources/img/pie_chart.png">
                                </span>
                                <%--<span class="ring" @click="chartTypeSelect('bar')">--%>
                                    <%--<img src="resources/img/ring_chart.png">--%>
                                <%--</span>--%>
                            </div>
                            <div class="drag-tips">
                                <div class="tips-bar" v-cloak v-show= " chartType == 'bar' "  >
                                    <p><b>标准柱状图</b></p>
                                    <p><b>维度</b> 拖入列</p>
                                    <p><b>度量</b> 拖入行</p>
                                </div>
                                <div class="tips-line" v-cloak v-show= " chartType == 'line' ">
                                    <p><b>折线图</b></p>
                                    <p><b>维度</b> 拖入列</p>
                                    <p><b>度量</b> 拖入行</p>
                                </div>
                                <div class="tips-pie" v-cloak v-show= " chartType == 'pie' ">
                                    <p><b>饼图</b></p>
                                    <p><b>维度</b> 拖入颜色</p>
                                    <p><b>度量</b> 拖入角度</p>
                                </div>
                                <%--<div class="tips-ring" style="display: none">--%>
                                    <%--<p><b>环形图</b></p>--%>
                                    <%--<p><b>维度</b> 拖入颜色</p>--%>
                                    <%--<p><b>度量</b> 拖入角度</p>--%>
                                <%--</div>--%>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade modal-success" id="addChartModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">保存图表</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal" id="addChartForm" method="post">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">图表名称</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control chartName" name="chartName" v-model="chartName" >
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">数据模式</label>
                            <div class="col-sm-10">
                                <div class="radio3 radio-check radio-inline">
                                    <input type="radio" id="radio4" name="radio2" value="0" v-model="dataSourcePicked" >
                                    <label for="radio4">
                                        镜像
                                    </label>
                                </div>
                                <div class="radio3 radio-check radio-success radio-inline">
                                    <input type="radio" id="radio5" name="radio2" value="1" v-model="dataSourcePicked">
                                    <label for="radio5">
                                        实时
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" v-show="isShowUpdateCheck" v-cloak >
                            <label class="col-sm-2 control-label">定时更新</label>
                            <div class="col-sm-10">
                                <div class="bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-small bootstrap-switch-animate bootstrap-switch-off" style="width: 89.3333px;">
                                    <div class="bootstrap-switch-container" style="width: 132px; margin-left: 0px;">
                                        <input type="checkbox" class="toggle-checkbox" name="my-checkbox" checked="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" v-show="isShowJobSetting" v-cloak >
                            <label class="col-sm-2 control-label">触发间隔</label>
                            <div class="col-sm-10">
                                <div>
                                    <select class="form-control" v-model="selectedPeriod">
                                        <option value="day" >每天</option>
                                        <option value="week" >每周</option>
                                        <option value="month" >每月</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" v-show="isShowJobSetting" v-cloak >
                            <label class="col-sm-2 control-label">触发时间</label>
                            <div class="col-sm-10">
                                <div>
                                    <div class="input-group date form_datetime" data-link-field="dtp_input1">
                                        <input class="form-control" size="16" type="text" name="triggerName" v-model="startTime" readonly>
                                        <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
                                        <span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>
                                    </div>
                                    <input type="hidden" id="dtp_input1" value="" /><br/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-success" @click="saveChart" >确认</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="resources/js/lib/require.js" defer async="true" data-main="resources/js/app/dataAnalysis"></script>
</body>
</html>

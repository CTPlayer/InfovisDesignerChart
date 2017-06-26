<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="/resources/include.jsp"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>Infovis-Designer</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap Core CSS -->
    <link href="resources/js/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="resources/js/lib/bootstrap/css/bootstrap.vertical-tabs.css" rel="stylesheet">
    <!-- Font Icons -->
    <link href="resources/js/lib/bootstrap/css/font-awesome.css" rel="stylesheet">
    <!-- Animate -->
    <link href="resources/js/lib/bootstrap/css/animate.css" rel="stylesheet">
    <!-- gridstack CSS -->
    <link rel="stylesheet" href="resources/js/lib/gridstack/css/gridstack.min.css"/>
    <link rel="stylesheet" type="text/css" href="resources/js/lib/gridstack/css/default.css">
    <!--Color Picker CSS-->
    <link rel="stylesheet" type="text/css" href="resources/js/lib/bootstrap/css/spectrum.css">
    <!--flat admin-->
    <link rel="stylesheet" type="text/css" href="resources/js/lib/flatadmin/css/style.css">
    <link rel="stylesheet" type="text/css" href="resources/js/lib/flatadmin/css/themes/flat-blue.css">
    <!--background theme-->
    <link rel="stylesheet" type="text/css" href="resources/css/backgroundTheme.css">
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <link rel="stylesheet" type="text/css" href="resources/js/lib/bootstrapFileStyle/fileinput.min.css">
    <style type="text/css">
        .grid-stack {
            margin-bottom: 2em;
            margin-left: 3em;
            margin-top: 5em;
        }

        #operate i {
            font-size: 20px;
            float:right;
            padding-right:20px;
            margin-top:10px
        }

        #data input {
            border:none;
            outline:medium;
            width:70px;
        }

        #optionModal tr {
            height:20px;
        }

        #optionModal form {
            font-size: 10px;
        }

        .loader .loader-container {
            z-index: 99999999;
        }

        .loader:after {
            z-index: 1000000;
        }

        .selected {
            border-color:#3ac34f;
        }

        #chartTitle {
            font-size: 24px;
            color: white;
            padding-left:20px;
            margin-top:10px
        }

        .background-text-pick-block span{
            width:50px;
            height: 50px;
            margin-top:5px;
            margin-left: 5px;
            display: inline-block;
            cursor: pointer;
        }

        .background-text-pick-block div{
            color:white;
            width: 50px;
            text-align: center;
            margin-left: 5px;
            margin-bottom: 5px;
        }

        .background-color-pick-block span{
            width:50px;
            height: 50px;
            margin-top:5px;
            margin-left: 5px;
            display: inline-block;
            cursor: pointer;
        }

        .background-color-pick-block{
            display: inline-block;
        }

        .background-color-pick-block div{
            color:white;
            width: 50px;
            text-align: center;
            margin-left: 5px;
            margin-bottom: 5px;
        }

        #myChart .thumbnail .glyphicon-ok{
            display: none;
        }

        #mySubGroup .thumbnail .glyphicon-ok{
            display: none;
        }

        #myChart .selected .glyphicon-ok{
             position: absolute;
             right: 5px;
             top:130px;
             color:white;
             display: block;
             height: 10px;
             width: 10px;
         }

        #mySubGroup .selected .glyphicon-ok{
            position: absolute;
            right: 5px;
            top:130px;
            color:white;
            display: block;
            height: 10px;
            width: 10px;
        }

        #myChart .thumbnail .glyphicon-remove{
            position: absolute;
            right: 5px;
            top:5px;
            color:white;
            display: block;
            height: 10px;
            width: 10px;
        }

        #mySubGroup .thumbnail .glyphicon-remove{
            position: absolute;
            right: 5px;
            top:5px;
            color:white;
            display: block;
            height: 10px;
            width: 10px;
        }

        #myChart .selected .arrow_left{
            border-color: transparent #3ac34f #3ac34f transparent;
            border-style: solid;
            border-width: 18px;
            font-size: 0;
            display: block;
            height: 0;
            line-height: 0;
            position: absolute;
            right: 0;
            bottom: 0;
            width: 0;
        }

        #mySubGroup .selected .arrow_left{
            border-color: transparent #3ac34f #3ac34f transparent;
            border-style: solid;
            border-width: 18px;
            font-size: 0;
            display: block;
            height: 0;
            line-height: 0;
            position: absolute;
            right: 0;
            bottom: 0;
            width: 0;
        }

        .thumbnail .arrow_top{
            border-color: #337ab7 #337ab7 transparent transparent;
            border-style: solid;
            border-width: 18px;
            font-size: 0;
            display: block;
            height: 0;
            line-height: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: 0;
        }

        #myChart .thumbnail{
            cursor: pointer;
        }

        #mySubGroup .thumbnail{
            cursor: pointer;
        }

        #myChart .thumbnail p{
            position: absolute;
            bottom:5px;
            left:15px;
            color: rgba(70, 49, 49, 0.49);
            font-weight: bolder;
            width:180px;
            height:18px;
            display:block;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }

        #dropdown-theme-choose li{
            margin-top: 10px;
        }

        .theme {
            border:1px solid #ffffff;
            padding-left: 0px;
            padding-right: 0px;
            cursor:pointer;
        }

        .theme-color {
            height: 25px;
            padding-left: 0px;
            padding-right: 0px;
        }

        .btn {
            margin-top: 0px;
        }

        .draggable {
            background: white;
            position: absolute;
            display: inline-block;
        }

        [v-cloak] {
            display: none;
        }

        #app {
            overflow: auto;
        }
    </style>
</head>

<body class="flat-blue">
<div class="app-container" id="app" v-bind:class="[backgroundClass, {expanded: isExpanded}]">
    <div class="loader-container text-center color-white" style="display: none;position :fixed;top:300px;">
        <div><i class="fa fa-spinner fa-pulse fa-3x"></i></div>
        <div>正在生成外部可访问页面，请稍后...</div>
    </div>
    <div class="row content-container">
        <div style="margin-left: 48%;width: 25px;position: absolute" v-cloak v-show="isAllScreen" @click="allScreen" >
            <a href="javascript:void(0)"><span aria-hidden="true" class="glyphicon glyphicon-chevron-down" style="font-size: 20px;"></span></a>
        </div>
        <nav v-show="!isAllScreen" class="navbar navbar-default navbar-fixed-top navbar-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-expand-toggle" v-bind:class="[{'fa-rotate-90': isExpanded}]" @click="toggleSideMenu">
                        <i class="fa fa-bars icon"></i>
                    </button>
                    <button type="button" class="navbar-right-expand-toggle pull-right visible-xs" v-bind:class="[{'fa-rotate-90': isExpanded}]" @click="toggleSideMenu">
                        <i class="fa fa-th icon"></i>
                    </button>
                </div>
                <ul class="nav navbar-nav navbar-right" v-bind:class="[{expanded: isExpanded}]">
                    <li class="dropdown" v-bind:class="{danger: dangerIndex == 0}" @mouseenter="topMenuMouseEnter(0)">
                        <a href="query.page"  role="button"><i class="glyphicon glyphicon-folder-close"></i>&nbsp;&nbsp;我的作品</a>
                    </li>
                    <li class="dropdown" id="exportHtml" v-bind:class="{danger: dangerIndex == 1}" @mouseenter="topMenuMouseEnter(1)">
                        <a href="#"  role="button"><i class="glyphicon glyphicon-floppy-save"></i>&nbsp;&nbsp;保存</a>
                    </li>
                    <li class="dropdown profile" v-bind:class="{danger: dangerIndex == 2}" @mouseenter="topMenuMouseEnter(2)">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">试用人员1<span class="caret"></span></a>
                        <ul class="dropdown-menu animated fadeInDown">
                            <li class="profile-img">
                                <img src="resources/js/lib/flatadmin/img/profile/picjumbo.com_HNCK4153_resize.jpg" class="profile-img">
                            </li>
                            <li>
                                <div class="profile-info">
                                    <h4 class="username">试用人员1</h4>
                                    <p>test@jiudaotech.com</p>
                                    <div class="btn-group margin-bottom-2x" role="group">
                                        <button type="button" class="btn btn-default"><i class="fa fa-user"></i> 个人信息</button>
                                        <button type="button" class="btn btn-default"><i class="fa fa-sign-out"></i> 登出</button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown" id="allScreen" @click="allScreen" v-bind:class="{danger: dangerIndex == 3}" @mouseenter="topMenuMouseEnter(3)">
                        <a href="#"  role="button"><i class="glyphicon glyphicon-fullscreen"></i>&nbsp;&nbsp;全屏</a>
                    </li>
                </ul>
            </div>
        </nav>
        <div v-show="!isAllScreen" class="side-menu sidebar-inverse" style="overflow-y:visible">
                <nav class="navbar navbar-default" role="navigation">
                    <div class="side-menu-container">
                        <div class="navbar-header">
                            <a class="navbar-brand" href="#">
                                <div class="icon fa fa-desktop"></div>
                                <div class="title">可视化图表设计器</div>
                            </a>
                            <%--<button type="button" class="navbar-expand-toggle pull-right visible-xs">--%>
                                <%--<i class="fa fa-times icon"></i>--%>
                            <%--</button>--%>
                        </div>
                        <ul class="nav navbar-nav">
                            <li class="panel-default" @click="toggleSecondMenu(0)" v-bind:class="{active: 0 === currentActiveIndex}">
                                <a href="dataAnalysis.page?exportId=${exportId}"><span class="icon fa fa-plus"></span><span class="title">新建图表</span></a>
                            </li>
                            <li class="panel-default" @click="toggleSecondMenu(1);getAllCharts()" v-bind:class="{active: 1 === currentActiveIndex}">
                                <a href="#" data-toggle="modal" data-target="#myChart"><span class="icon fa fa-area-chart"></span><span class="title">添加已有图表</span></a>
                            </li>
                            <li class="panel panel-default dropdown" @click="toggleSecondMenu(2)" v-bind:class="{active: 2 === currentActiveIndex}">
                                <a data-toggle="collapse" href="#dropdown-theme-choose">
                                    <span class="icon fa fa-magic"></span><span class="title">配色设置</span>
                                </a>
                                <div id="dropdown-theme-choose" class="panel-collapse collapse">
                                    <div class="panel-body">
                                        <ul class="nav navbar-nav">
                                            <li>
                                                <div class="vintage col-md-6 theme" title="vintage">
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(216, 124, 124);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(145, 158, 139);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(215, 171, 130);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(110, 112, 116);"></div>
                                                </div>
                                                <div class="dark col-md-6 theme" title="dark">
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(221, 107, 102);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(117, 154, 160);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(230, 157, 135);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(141, 193, 169);"></div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="westeros col-md-6 theme" title="westeros">
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(81, 107, 145);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(89, 196, 230);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(237, 175, 218);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(147, 183, 227);"></div>
                                                </div>
                                                <div class="essos col-md-6 theme" title="essos">
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(137, 52, 72);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(217, 88, 80);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(235, 129, 70);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(255, 178, 72);"></div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="wonderland col-md-6 theme" title="wonderland">
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(78, 163, 151);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(34, 195, 170);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(123, 217, 165);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(208, 100, 138);"></div>
                                                </div>
                                                <div class="walden col-md-6 theme" title="walden">
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(63, 177, 227);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(107, 230, 193);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(98, 108, 145);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(160, 167, 230);"></div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="chalk col-md-6 theme" title="chalk">
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(252, 151, 175);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(135, 247, 207);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(247, 244, 148);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(114, 204, 255);"></div>
                                                </div>
                                                <div class="infographic col-md-6 theme" title="infographic">
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(193, 35, 43);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(39, 114, 123);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(252, 206, 16);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(232, 124, 37);"></div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="macarons col-md-6 theme" title="macarons">
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(46, 199, 201);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(182, 162, 222);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(182, 162, 222);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(255, 185, 128);"></div>
                                                </div>
                                                <div class="roma col-md-6 theme" title="roma">
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(224, 31, 84);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(0, 24, 82);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(245, 232, 200);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(184, 210, 199);"></div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="shine col-md-6 theme" title="shine">
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(193, 46, 52);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(230, 182, 0);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(0, 152, 217);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(43, 130, 29);"></div>
                                                </div>
                                                <div class="purple-passion col-md-6 theme" title="purple-passion">
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(138, 124, 168);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(224, 152, 199);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(143, 211, 232);"></div>
                                                    <div class="col-md-3 theme-color" style="background-color: rgb(113, 102, 158);"></div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li class="panel panel-default dropdown" @click="toggleSecondMenu(3)" v-bind:class="{active: 3 === currentActiveIndex}">
                                <a data-toggle="collapse" href="#dropdown-background-choose">
                                    <span class="icon glyphicon glyphicon-picture"></span><span class="title">背景设置</span>
                                </a>
                                <div id="dropdown-background-choose" class="panel-collapse collapse">
                                    <div class="panel-body">
                                        <ul class="nav navbar-nav">
                                            <li>
                                                <div class="background-color-pick-block">
                                                    <span class="background-default img-thumbnail" @click="saveCurrentBackground"></span>
                                                    <div>默认</div>
                                                </div>
                                                <div class="background-color-pick-block">
                                                    <span class="background-white img-thumbnail" @click="saveCurrentBackground"></span>
                                                    <div>优雅白</div>
                                                </div>
                                                <div class="background-color-pick-block">
                                                    <span class="background-black img-thumbnail" @click="saveCurrentBackground"></span>
                                                    <div>高端黑</div>
                                                </div>
                                                <div class="background-color-pick-block">
                                                    <span class="background-env-green img-thumbnail" @click="saveCurrentBackground"></span>
                                                    <div>环保绿</div>
                                                </div>
                                                <div class="background-color-pick-block">
                                                    <span class="background-business-grey img-thumbnail" @click="saveCurrentBackground"></span>
                                                    <div>商务灰</div>
                                                </div>
                                                <div class="background-color-pick-block">
                                                    <span class="background-dream-blue img-thumbnail" @click="saveCurrentBackground"></span>
                                                    <div>梦幻蓝</div>
                                                </div>
                                                <div class="background-color-pick-block">
                                                    <span class="background-dream-sky img-thumbnail" @click="saveCurrentBackground"></span>
                                                    <div>星空蓝</div>
                                                </div>
                                                <div class="background-color-pick-block">
                                                    <span class="background-dream-purple img-thumbnail" @click="saveCurrentBackground"></span>
                                                    <div>绚丽紫</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li class="panel panel-default dropdown" @click="toggleSecondMenu(4)" v-bind:class="{active: 4 === currentActiveIndex}">
                                <a data-toggle="collapse" href="#dropdown-text-choose">
                                    <span class="icon glyphicon glyphicon-text-size"></span><span class="title">文字组件</span>
                                </a>
                                <div id="dropdown-text-choose" class="panel-collapse collapse">
                                    <div class="panel-body">
                                        <ul class="nav navbar-nav">
                                            <li>
                                                <div style="display:inline-block;" class="background-text-pick-block">
                                                    <span class="background-default img-thumbnail" textType="rectangle"></span>
                                                    <div>默认</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li class="panel-default" @click="toggleSecondMenu(5)" v-bind:class="{active: 5 === currentActiveIndex}">
                                <a href="#" data-toggle="modal" data-target="#subGroupModal"><span class="icon fa fa-cog"></span><span class="title">新建标题框</span></a>
                            </li>
                            <li class="panel-default" @click="toggleSecondMenu(6)" v-bind:class="{active: 6 === currentActiveIndex}">
                                <a href="#" data-toggle="modal" data-target="#mySubGroup"><span class="icon fa fa-archive"></span><span class="title">我的标题框</span></a>
                            </li>
                        </ul>
                    </div>
                    <!-- /.navbar-collapse -->
                </nav>
            </div>
        <!-- Main Content -->
        <div class="container-fluid">
            <%--<div class="grid-stack">--%>
                <div v-for="item in widgets" v-bind:style="{ width:item.width + 'px', height:item.height + 'px', transform: 'translate(' + item.datax + 'px,' + item.datay + 'px)' }" class="draggable" v-bind:chartType="item.chartType" v-bind:id="item.id" v-bind:chartId="item.chartId" v-bind:data-x="item.datax" v-bind:data-y="item.datay" >
                    <img style="display: none" v-if="item.chartType === 'text:subGroupOfImage' " v-bind:src="item.hideImg">
                    <div v-if="isRenderFail" v-cloak style="text-align: center;padding-top: 40%;"><span class="glyphicon glyphicon-flash" style="font-size: 40px;display:block" aria-hidden="true"></span><span class="glyphicon-class" style="font-size:25px;">当前图表渲染失败，请检查数据库链接是否正常!</span></div>
                </div>
                <%--${htmlCode}--%>
            <%--</div>--%>
        </div>
    </div>

    <!--Strart Config Panel-->
    <div class="modal fade bs-option-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" id="optionModal">
        <div class="modal-dialog modal-lg" style="width: 90%">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">自定义配置</h4>
                </div>
                <div class="modal-body">
                    <div id="loading" class="loader-container text-center color-black" style="display: none;">
                        <div><i class="fa fa-spinner fa-pulse fa-3x"></i></div>
                        <div>正在加载,请稍后...</div>
                    </div>
                    <div id="optionContainer" style="width:40%;height:410px;float:left;">
                    </div>
                    <div id="optionPanel" style="width:50%;height:410px;float:left;margin-left:50px;">
                        <ul class="nav nav-tabs" role="tablist">
                            <li role="presentation" class="active"><a href="#param" data-toggle="tab">配置项</a></li>
                        </ul>
                        <chart-option-component v-bind:chart-option="chartOption"></chart-option-component>
                    </div>
                </div>
                <div class="modal-footer" style="clear:both">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">确认</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="myChart" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="width: 70%">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title" id="myModalLabel">我的图表</h4>
                </div>
                <div class="modal-body" style="height: 386px;overflow-y: scroll">
                    <div class=" text-center color-black" v-bind:style="{display : isChartsLoad}">
                        <div><i class="fa fa-spinner fa-pulse fa-3x"></i></div>
                        <div>正在加载,请稍后...</div>
                    </div>
                    <div class="row">
                        <div class="thumbnail" v-for="(chart, index) in myCharts" :data-cid="chart.chartId" @click="select(chart.chartId)" v-bind:class="{selected: chart.chartId == currentSelectedIndex}" style="width: 200px;height:150px;margin-left: 10px;float: left;position: relative">
                            <img style="height: 100px" :src="chart.imgSrc" alt="...">
                            <div class="arrow_top"></div>
                            <div class="glyphicon glyphicon-remove deleteOneChart"></div>
                            <div class="arrow_left"></div>
                            <div class="glyphicon glyphicon-ok"></div>
                            <p :title="chart.chartName">
                                {{chart.chartName}}&nbsp;&nbsp;&nbsp;&nbsp;
                                <span class="dataType">{{chart.dataType}}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="renderSelected">确认</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade bs-option-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" id="textOptionModal">
        <div class="modal-dialog modal-lg" style="width: 90%">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">自定义配置</h4>
                </div>
                <div class="modal-body">
                    <div id="textLoading" class="loader-container text-center color-black" style="display: none;">
                        <div><i class="fa fa-spinner fa-pulse fa-3x"></i></div>
                        <div>正在加载,请稍后...</div>
                    </div>
                    <div id="textOptionContainer" style="width:40%;height:410px;float:left;">
                    </div>
                    <div id="textOptionPanel" style="width:50%;height:410px;float:left;margin-left:50px;">
                        <ul class="nav nav-tabs" role="tablist">
                            <li role="presentation" class="active"><a href="#param" data-toggle="tab">配置项</a></li>
                        </ul>
                        <%--<text-option-component v-bind:text-option="textOption"></text-option-component>--%>
                        <%--<img-option-component v-bind:sub-group-option="subGroupOption"></img-option-component>--%>
                        <component v-bind:is="currentView" v-bind:options="options"></component>
                    </div>
                </div>
                <div class="modal-footer" style="clear:both">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">确认</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade bs-option-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" id="subGroupModal">
        <div class="modal-dialog modal-lg" style="width: 90%">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">自定义组件</h4>
                </div>
                <div class="modal-body">
                    <div v-html="hideImg" style="display: none"></div>
                    <div id="subGroupContainer" class="thumbnail" style="width:45%;height:410px;float:left;overflow: auto;border:1px dashed rgb(238,238,238);">
                        <div id="subGroupLoading" class="text-center color-black" v-bind:style="{display : isImgLoad}">
                            <div><i class="fa fa-spinner fa-pulse fa-3x"></i></div>
                            <div>正在加载图片...</div>
                        </div>
                    </div>
                    <div id="subGroupOptionPanel" style="width:50%;height:410px;float:left;margin-left:50px;">
                        <div class="col-xs-11" style="height:350px;overflow:auto;margin-top: 10px;" id="subGroupConfig">
                            <div>
                                <form enctype="multipart/form-data" id="imgFile">
                                    <input name="imgFile" id="input-id" type="file" />
                                    <button type="reset" class="btn btn-sm btn-warning" style="margin-left: 10px;float: right">重置</button>
                                    <button type="button" class="btn btn-sm btn-success" style="float: right" @click="makeSelfWidget">上传</button>
                                    <p class="help-block">{{ helpTip }}</p>
                                </form>
                            </div>
                            <div v-show="isShowImgSetting">
                                <form role="form">
                                    <div class="form-group form-group-sm">
                                        <label >文字内容&nbsp;&nbsp;</label>
                                        <input class="form-control" v-model="subGroupText">
                                    </div>
                                    <div class="form-group form-group-sm">
                                        <label >文字颜色&nbsp;&nbsp;</label>
                                        <input id="subGroupTextColor" class="form-control" v-model="subGroupTextColor">
                                    </div>
                                    <div class="form-group form-group-sm">
                                        <label >文字大小&nbsp;&nbsp;<span id="subGroupFontSize"></span></label>
                                        <input type="range" class="form-control" v-model="subGroupFontSize">
                                    </div>
                                    <div class="form-group form-group-sm">
                                        <label >文字位置&nbsp;&nbsp;</label>
                                        <select v-model="subGroupFontLocation" class="form-control">
                                            <option>inside</option>
                                            <option>left</option>
                                            <option>right</option>
                                            <option>top</option>
                                            <option>bottom</option>
                                        </select>
                                    </div>
                                    <div class="form-group form-group-sm">
                                        <label >图片宽度&nbsp;&nbsp;</label>
                                        <input type="range" min="0" max="448" class="form-control" v-model="subGroupImageWidth">
                                    </div>
                                    <div class="form-group form-group-sm">
                                        <label >图片高度&nbsp;&nbsp;</label>
                                        <input type="range" min="0" max="410" class="form-control" v-model="subGroupImageHeight">
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="clear:both">
                    <button type="button" class="btn btn-primary" data-dismiss="modal" @click="renderMySubGroup">确认</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="mySubGroup" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog" style="width: 70%">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">我的组件</h4>
                </div>
                <div class="modal-body" style="height: 386px;overflow-y: scroll">
                    <div class=" text-center color-black" v-bind:style="{display : isChartsLoad}">
                        <div><i class="fa fa-spinner fa-pulse fa-3x"></i></div>
                        <div>正在加载,请稍后...</div>
                    </div>
                    <div class="row">
                        <div class="thumbnail" v-for="subGroup in mySubGroup" :data-cid="subGroup.chartId" @click="select" style="width: 200px;height:150px;margin-left: 10px;float: left;position: relative">
                            <img style="height: 100px" :src="subGroup.base64" alt="...">
                            <div class="arrow_top"></div>
                            <div class="glyphicon glyphicon-remove deleteOneChart"></div>
                            <div class="arrow_left"></div>
                            <div class="glyphicon glyphicon-ok"></div>
                            <p>
                                <span class="dataType"></span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary">确认</button>
                </div>
            </div>
        </div>
    </div>
</div>
<input type="hidden" value="${exportId}" id="exportId">

<script src="resources/js/lib/require.js" defer async="true" data-main="resources/js/app/designPanel"></script>
</body>

</html>

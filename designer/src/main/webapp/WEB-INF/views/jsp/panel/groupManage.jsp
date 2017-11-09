<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="/resources/include.jsp"%>
<!DOCTYPE html>
<html>
<head>
    <title>Infovis-Designer</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
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
    <!--dataTable-->
    <%--<link rel="stylesheet" type="text/css" href="../resources/js/lib/dataTables/css/jquery.dataTables.min.css">--%>
    <link rel="stylesheet" type="text/css" href="resources/js/lib/dataTables/css/dataTables.bootstrap.min.css">
    <!--jquery-loading css-->
    <link href="resources/js/lib/jqueryLoading/jquery.loading.css" rel="stylesheet">
    <!-- checkbox -->
    <link rel="stylesheet" type="text/css" href="resources/js/lib/flatadmin/lib/css/checkbox3.min.css">
    <!--jquery-confirm css-->
    <link href="resources/css/jquery-confirm.min.css" rel="stylesheet">
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <style type="text/css">
        .warning-block{
            color : #d16e6c;
        }

        .card-title, .flat-blue .navbar .navbar-nav > li > a, .flat-blue .navbar.navbar-default .navbar-nav > li > a{
            color: #0f77b1;
            margin-top: 0px;
        }

        .card-title button {
            float: right;
        }

        #operate i {
            font-size: 20px;
            float:right;
            padding-right:20px;
            margin-top:10px
        }

        #operate span {
            font-size: 30px;
            color: white;
            padding-left:20px;
        }

        .thumbnail {
            margin-left: 20px;
        }

        .card {
            background-color: #f5f5f5;
        }

        .overhide {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }

        td {
            vertical-align:middle
        }

        .checkbox3 {
            float: left;
            margin-left: 10px;
        }

        [v-cloak] {
            display: none;
        }
    </style>
</head>

<body class="flat-blue">
<div class="app-container" style="background-color: rgb(240,240,240)" id="app">
    <div class="row content-container">
        <nav class="navbar navbar-inverse navbar-static-top">
            <div class="container-fluid">
                <ul class="nav navbar-nav navbar-left">
                    <a class="navbar-brand" href="#" style="color: #ffffff"><i class="glyphicon glyphicon-equalizer" aria-hidden="true"></i> 系统管理</a>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown danger">
                        <a href="query.page"  role="button"><i class="glyphicon glyphicon-folder-close"></i>&nbsp;&nbsp;我的作品</a>
                    </li>
                </ul>
            </div>
        </nav>
        <!-- Main Content -->
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title" style="width: 100%">
                                <div class="title" style="width: 100%;font-size: 23px;">系统
                                    <shiro:hasRole name="admin">
                                        <a href="#"  role="button" data-toggle="modal" data-target="#addGroupModal"><button type="button" class="btn btn-success">新增系统</button></a>
                                    </shiro:hasRole>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="datatable table table-striped" cellspacing="0" width="100%">
                                <thead>
                                <tr>
                                    <th>系统名称</th>
                                    <th>描述</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in groups" v-cloak >
                                    <td style="vertical-align:middle">{{ item.groupName }}</td>
                                    <td style="vertical-align:middle">{{ item.descride }}</td>
                                    <td style="vertical-align:middle">
                                        <shiro:hasRole name="admin">
                                            <button type="button" class="btn btn-xs btn-primary" @click="deleteOneGroup(index)"><i class="glyphicon glyphicon-trash" aria-hidden="true"></i></button>
                                            <button type="button" class="btn btn-xs" @click="showUpdateModal(index)"><i class="glyphicon glyphicon-list-alt" aria-hidden="true"></i></button>
                                        </shiro:hasRole>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade modal-success" id="addGroupModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">新增系统</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal" id="addGroupForm" method="post">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">分组名称</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" name="groupName">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">描述</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" name="descride">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-success" @click="addNewGroup()">确认</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade modal-success" id="updateGroupModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">修改系统信息</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal" id="updateGroupForm" method="post">
                        <input type="hidden" class="form-control" name="groupId" v-model="updateGroupId">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">分组名称</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" name="groupName" v-model="updateGroupName">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">描述</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" name="descride" v-model="updateGroupDescride">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-success" @click="updateGroup()">确认</button>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="resources/js/lib/require.js" defer async="true" data-main="resources/js/app/groupManage"></script>
</body>
</html>

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
    <link href="../resources/js/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="../resources/js/lib/bootstrap/css/bootstrap.vertical-tabs.css" rel="stylesheet">
    <!-- Font Icons -->
    <link href="../resources/js/lib/bootstrap/css/font-awesome.css" rel="stylesheet">
    <!-- Animate -->
    <link href="../resources/js/lib/bootstrap/css/animate.css" rel="stylesheet">
    <!--flat admin-->
    <link rel="stylesheet" type="text/css" href="../resources/js/lib/flatadmin/css/style.css">
    <link rel="stylesheet" type="text/css" href="../resources/js/lib/flatadmin/css/themes/flat-blue.css">
    <!--dataTable-->
    <%--<link rel="stylesheet" type="text/css" href="../resources/js/lib/dataTables/css/jquery.dataTables.min.css">--%>
    <link rel="stylesheet" type="text/css" href="../resources/js/lib/dataTables/css/dataTables.bootstrap.min.css">
    <!--jquery-loading css-->
    <link href="../resources/js/lib/jqueryLoading/jquery.loading.css" rel="stylesheet">
    <!-- checkbox -->
    <link rel="stylesheet" type="text/css" href="../resources/js/lib/flatadmin/lib/css/checkbox3.min.css">
    <!--jquery-confirm css-->
    <link href="../resources/css/jquery-confirm.min.css" rel="stylesheet">
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
                    <a class="navbar-brand" href="#" style="color: #ffffff"><i class="glyphicon glyphicon-equalizer" aria-hidden="true"></i> 用户管理</a>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown danger">
                        <a href="../query.page"  role="button"><i class="glyphicon glyphicon-folder-close"></i>&nbsp;&nbsp;我的作品</a>
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
                                <div class="title" style="width: 100%;font-size: 23px;">系统用户
                                    <shiro:hasRole name="admin">
                                        <a href="#"  role="button" data-toggle="modal" data-target="#addUserModal"><button type="button" class="btn btn-danger">新增用户</button></a>
                                    </shiro:hasRole>
                                    <a href="#"  role="button" data-toggle="modal" data-target="#updateUserModal"><button type="button" class="btn btn-success">修改密码</button></a>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="datatable table table-striped" cellspacing="0" width="100%">
                                <thead>
                                <tr>
                                    <th>用户</th>
                                    <th>角色</th>
                                    <th>描述</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in userInfo" v-bind:class="{ danger: 0 === index }" v-cloak >
                                    <td style="vertical-align:middle">{{ item.userName }}</td>
                                    <td style="vertical-align:middle" v-if="item.userType === 'consumer'">普通用户</td>
                                    <td style="vertical-align:middle" v-if="item.userType === 'admin'">超级用户</td>
                                    <td style="vertical-align:middle">{{ item.descride }}</td>
                                    <td style="vertical-align:middle">
                                        <shiro:hasRole name="admin">
                                            <a href="#"  role="button" data-toggle="modal" data-target="#groupManageModal"><button type="button" @click="getGroupInfo(index)" class="btn btn-xs btn-info">用户组管理</button></a>
                                            <button type="button" class="btn btn-xs btn-primary" @click="deleteOneUser(index)" v-if="0 !== index"><i class="glyphicon glyphicon-trash" aria-hidden="true"></i></button>
                                            <button type="button" class="btn btn-xs" @click="upToAdmin(index)" v-if="item.userType === 'consumer'">提升为超级用户</button>
                                        </shiro:hasRole>
                                        <span class="glyphicon glyphicon-user" aria-hidden="true" v-if=" 0 === index "></span>
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
    <div class="modal fade modal-success" id="addUserModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">添加新用户</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal" id="addUserForm" method="post">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">用户名</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" name="userName">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">密码</label>
                            <div class="col-sm-10">
                                <input type="password" id="password" class="form-control" name="password">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">确认密码</label>
                            <div class="col-sm-10">
                                <input type="password" class="form-control" name="passwordRepeat">
                            </div>
                        </div>
                        <div class="form-group" style="text-align: center">
                            <div class="radio3 radio-check radio-success radio-inline">
                                <input type="radio" id="radio5" name="userType" value="0" v-model="userType">
                                <label for="radio5">
                                    添加为普通用户
                                </label>
                            </div>
                            <div class="radio3 radio-check radio-warning radio-inline">
                                <input type="radio" id="radio6" name="userType" value="1" v-model="userType">
                                <label for="radio6">
                                    添加为超级用户
                                </label>
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
                    <button type="button" class="btn btn-success" @click="addNewUser()">确认</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade modal-success" id="updateUserModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">修改密码</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal" id="updateUserForm" method="post">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">原密码</label>
                            <div class="col-sm-10">
                                <input type="password" class="form-control" name="oldPassword">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">新密码</label>
                            <div class="col-sm-10">
                                <input type="password" id="newPassword" class="form-control" name="newPassword">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">确认新密码</label>
                            <div class="col-sm-10">
                                <input type="password" class="form-control" name="newPasswordRepeat">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-success" @click="updateUser()">确认</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade modal-success" id="groupManageModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">用户组管理</h4>
                </div>
                <div class="modal-body" style="height: 400px;">
                    <div class="col-sm-12">
                        <div class="panel fresh-color panel-success">
                            <div class="panel-heading">未加入分组，选择加入</div>
                            <div class="panel-body row" style="height: 125px;overflow: auto">
                                <div class="loader-container text-center color-red" v-bind:style="{display: isShow}">
                                    <div><i class="fa fa-spinner fa-pulse fa-3x"></i></div>
                                    <div>Loading</div>
                                </div>
                                <div class="checkbox3 checkbox-round" v-for="(item,index) in noJoinGroup" @click="changeGroup(item, 'noJoin')">
                                    <input type="checkbox" v-bind:id="'checkbox-'+item" v-bind:value="item" checked="checked" disabled>
                                    <label v-bind:for="'checkbox-'+item">
                                        {{ item }}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12" style="height: 200px;">
                        <div class="panel fresh-color panel-success">
                            <div class="panel-heading">已加入分组，选择移出</div>
                            <div class="panel-body row" style="height: 125px;overflow: auto">
                                <div class="loader-container text-center color-red" v-bind:style="{display: isShow}">
                                    <div><i class="fa fa-spinner fa-pulse fa-3x"></i></div>
                                    <div>Loading</div>
                                </div>
                                <div class="checkbox3 checkbox-round" v-for="(item,index) in joinedGroup" @click="changeGroup(item, 'joined')">
                                    <input type="checkbox" v-bind:id="'checkbox-'+item" checked="checked" disabled>
                                    <label v-bind:for="'checkbox-'+item">
                                        {{ item }}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal">确认</button>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="../resources/js/lib/require.js" defer async="true" data-main="../resources/js/app/userManage"></script>
</body>
</html>

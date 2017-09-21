<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="/resources/include.jsp"%>
<!DOCTYPE html>
<html>

<head>
    <title>Infovis-Designer</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Fonts -->
    <link href='http://fonts.googleapis.com/css?family=Roboto+Condensed:300,400' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Lato:300,400,700,900' rel='stylesheet' type='text/css'>
    <!-- CSS Libs -->
    <link rel="stylesheet" type="text/css" href="resources/js/lib/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="resources/js/lib/bootstrap/css/font-awesome.css">
    <link rel="stylesheet" type="text/css" href="resources/js/lib/bootstrap/css/animate.css">
    <!-- CSS App -->
    <link rel="stylesheet" type="text/css" href="resources/js/lib/flatadmin/css/style.css">
    <link rel="stylesheet" type="text/css" href="resources/js/lib/flatadmin/css/themes/flat-blue.css">
</head>

<body class="flat-blue login-page">
    <div class="container" id="app">
        <div class="login-box">
            <div>
                <div class="login-form row">
                    <div class="col-sm-12 text-center login-header">
                        <i class="login-logo fa fa-connectdevelop fa-5x"></i>
                        <h4 class="login-title">Infovis-designer</h4>
                    </div>
                    <div class="col-sm-12">
                        <div class="login-body">
                            <div class="progress hidden" id="login-progress">
                                <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                                    Login...
                                </div>
                            </div>
                            <form>
                                <div class="control">
                                    <input type="text" class="form-control" v-model="userName" placeholder="请填写账号"/>
                                </div>
                                <div class="control">
                                    <input type="password" class="form-control" v-model="passWord" placeholder="请填写密码"/>
                                </div>
                                <div class="login-button text-center">
                                    <input type="submit" class="btn btn-primary" value="登录" @click="login">
                                </div>
                            </form>
                        </div>
                        <%--<div class="login-body" v-show="currentView === 'register'">--%>
                            <%--<div class="progress hidden" id="register-progress">--%>
                                <%--<div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">--%>
                                    <%--Register...--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <%--<form>--%>
                                <%--<div class="control">--%>
                                    <%--<input type="text" class="form-control" placeholder="请填写账号"/>--%>
                                <%--</div>--%>
                                <%--<div class="control">--%>
                                    <%--<input type="password" class="form-control" placeholder="请填写密码"/>--%>
                                <%--</div>--%>
                                <%--<div class="control">--%>
                                    <%--<input type="password" class="form-control" placeholder="请再次输入密码"/>--%>
                                <%--</div>--%>
                                <%--<div class="login-button text-center">--%>
                                    <%--<input type="submit" class="btn btn-primary" value="注册">--%>
                                <%--</div>--%>
                            <%--</form>--%>
                        <%--</div>--%>
                        <%--<div class="login-footer">--%>
                            <%--<span class="text-right" @click="changeView">--%>
                                <%--<a href="#" class="color-white" v-show="'login' === currentView">点击此处注册</a>--%>
                                <%--<a href="#" class="color-white" v-show="'register' === currentView">点击此处登录</a>--%>
                            <%--</span>--%>
                        <%--</div>--%>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="resources/js/lib/require.js" defer async="true" data-main="resources/js/app/index"></script>
</body>

</html>

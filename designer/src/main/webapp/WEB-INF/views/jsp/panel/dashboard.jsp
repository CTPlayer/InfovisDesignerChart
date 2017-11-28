<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="/resources/include.jsp"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>太平监控大屏展示系统</title>
    <link rel="stylesheet" type="text/css" href="resources/css/common.css">
    <link rel="stylesheet" type="text/css" href="resources/js/lib/material-design-icons/css/css.css">
    <script src="resources/js/lib/require.js" defer async="true" data-main="resources/js/app/dashboard"></script>
</head>
<body style="overflow-y: visible;">
    <div class="pageContent">
        <div class="titleContent">
             <span class="logo">
                 <img src="resources/img/monitor/taiping-logo.png">
             </span>
            <span class="title">太平监控大屏展示系统</span>
            <span id="datetime"></span>
            <div class="dropdown">
                <span class="user_info">欢迎您，<span id="userName"><shiro:principal property="userName"/></span> <i class="material-icons md-18">arrow_drop_down</i></span>
                <span class="dropdown-content">
                <a href="#">刷新频率
                    <select id="refreshTime">
                        <option value="1">1分钟</option>
                        <option value="3">3分钟</option>
                        <option value="5">5分钟</option>
                        <option value="10">10分钟</option>
                        <option value="15">15分钟</option>
                    </select>
                </a>
                <a href="groupManage.page">新增系统</a>
                <a href="query.page">报表系统</a>
                <a href="authority/userManage.page">用户管理</a>
                <a href="authority/logout">退出登录</a>
            </span>
            </div>
        </div>
        <div class="leftContent">
            <div class="warning_cate_list_number">
                <div class="total"><i class="material-icons md-20">reorder</i> 监控系统数:<span class="number">0</span></div>
                <div class="yellow"><i class="material-icons md-20">warning</i> 黄色警告:<span class="number">0</span></div>
                <div class="red"><i class="material-icons md-20">warning</i> 红色警告:<span class="number">0</span></div>
            </div>
            <div class="waring_type_column">
                 <div class="title">告警类型柱状图</div>
                 <div class="title_bg"></div>
                 <div id="waring_type_column_chart"></div>
                 <div class="no_data">暂无数据</div>
                 <div class="response_error_data">API请求数据失败</div>
            </div>
            <div class="system_waring_number">
                <div class="title">系统告警数</div>
                <div class="title_bg"></div>
                <div id="system_waring_number_chart"></div>
                <div class="no_data">暂无数据</div>
                <div class="response_error_data">API请求数据失败</div>
            </div>
        </div>

        <div class="middleContent">
            <div class="wrapper">
            </div>
            <div class="detailTable">
                <div class="headerTable">
                    <table>
                        <thead>
                        <th width="100">告警类型</th>
                        <th width="190">系统/单元</th>
                        <th width="380">事件描述</th>
                        <th width="190">最后发生时间</th>
                        <th width="12"></th>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                <div class="bodyTable">
                    <table class="table-hover">
                        <tbody>
                            <tr>
                                <td colspan="4" align="center" width="860" style="color:#cccccc">暂无数据</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="no_data" style="left:380px;">暂无数据</div>
            <div class="response_error_data" style="left:380px;">API请求数据失败</div>
        </div>
        <div class="rightContent">
            <div class="waring_type_line">
                <div class="title">告警类型</div>
                <div class="title_bg"></div>
                <div class="circle_wrapper">
                </div>
                <div class="no_data">暂无数据</div>
                <div class="response_error_data">API请求数据失败</div>
            </div>
            <div class="waring_type_line_chart_block">
                <div class="title">近
                    <select id="foldlineTime">
                        <option value="1" selected="selected">1</option>
                        <option value="2">2</option>
                        <option value="week">7</option>
                        <option value="month">30</option>
                    </select>天告警波动情况</div>
                <div class="title_bg"></div>
                <div id="waring_type_line_chart"></div>
                <div class="no_data">暂无数据</div>
                <div class="response_error_data">API请求数据失败</div>
            </div>
        </div>
    </div>

    <!-- Modal HTML embedded directly into document -->
    <div id="ex1" style="display:none;">
        <p>系统名称 : <input type="text" name="sysname" id="sysname"/><button id="submitAddSysBtn">提交</button></p><a href="#" id="closeAddSysBtn" rel="modal:close"></a>
    </div>

</body>
</html>
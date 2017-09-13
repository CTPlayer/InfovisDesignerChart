require.config({
    baseUrl: 'resources/js',
    paths: {
        "jquery": "lib/bootstrap/js/jquery-2.1.4.min",
        "jquery-ui": "lib/jquery-ui.min",
        "bootstrap": "lib/bootstrap/js/bootstrap.min",
        "validate": "lib/jquery.validate.min",
        "metisMenu": "lib/metisMenu/metisMenu.min",
        "ztree": "lib/ztree/js/jquery.ztree.all.min",
        "infovis": "lib/infovis.min",
        "jqueryCookie": "lib/jquery.cookie",
        "jqueryMd5": "lib/jquery.md5",
        "mousewheel": 'lib/mCustomScrollbar/jquery.mousewheel.min',
        "scrollbar" : 'lib/mCustomScrollbar/jquery.mCustomScrollbar.min',
        "commonModule" : 'app/commonModule',
        "jrange" : 'lib/jRange/jquery.range',
        "datetimepicker": "lib/bootstrapTimePicker/bootstrap-datetimepicker",
        "dateTimepicker-cn": "lib/bootstrapTimePicker/bootstrap-datetimepicker.zh-CN",
        "bootstrap-switch": "lib/flatadmin/lib/js/bootstrap-switch.min",
        "domReady" : 'lib/domReady',
        "vue": "lib/vue/vue",
        "echarts": "lib/charts/echarts",
        "generateTableHtml": "app/generateTableHtml",
        "tooltipster": "lib/gridly/tooltipster.bundle.min",
        "sortable": "lib/gridly/jquery.sortable",
        "thenBy": "lib/gridly/thenBy",
        "jquery-confirm": "lib/confirm/jquery-confirm.min",
        "jquery-loading": "lib/jqueryLoading/jquery.loading"
    },
    shim : {
        "bootstrap" : { "deps" :['jquery'] },
        "jquery-ui" : { "deps" :['jquery'] },
        "jqueryMd5" : { "deps" :['jquery'] },
        "metisMenu" : { "deps" :['jquery'] },
        "ztree" : { "deps" :['jquery'] },
        "dateTimepicker-cn" : { "deps" :['jquery', 'datetimepicker'] },
        "sortable" : { "deps" :['jquery'] },
        "bootstrap-switch" : { "deps" :['jquery'] }
    },
    waitSeconds: 30
});

require(['jquery', 'domReady', 'vue', 'echarts','commonModule','ztree','validate',
    'bootstrap','metisMenu','mousewheel','scrollbar','jqueryCookie','jqueryMd5','jquery-ui','datetimepicker','dateTimepicker-cn','bootstrap-switch'],
    function($,domReady,vue,echarts,commonModule,ztree,validate){
    domReady(function(){
        var app = new vue({
            el: '#app',
            data: {
                dangerIndex: -1,
                //图表类型
                chartType: 'table',
                //标记可接受数据类型(维度、度量)以及图表类型
                axisTagMap: {
                    xAxis: {
                        dataType: "text",
                        line:true,
                        bar:true,
                        pie:false,
                        table:true
                    },
                    yAxis:{
                        dataType: "number",
                        line:true,
                        bar:true,
                        pie:false,
                        table:true
                    },
                    filter:{
                        dataType: "all",
                        line:true,
                        bar:true,
                        pie:true,
                        table: true
                    },
                    color :{
                        dataType: "text",
                        line:false,
                        bar:false,
                        pie:true,
                        tale:false
                    },
                    corner :{
                        dataType: "number",
                        line:false,
                        bar:false,
                        pie:true,
                        table:false
                    },
                    tag : {
                        dataType: "",
                        line:false,
                        bar:false,
                        pie:false,
                        table:false
                    }
                },
                //通知第一层树，第二层树加载
                firstLevelDeferred: $.Deferred(),
                secondLevelDeferred: $.Deferred(),
                //chartId 对应myCharts表的主键，默认是0，即新建图表时，查询参数为0
                chartId: 0,
                //对应的设计面板
                exportId: 0,
                jobGroup: '',
                chartName: '',
                sqlRecordingId: 0,
                startTime: '',
                selectedPeriod: '',
                isShowJobSetting: true,
                isShowUpdateCheck: true,
                dataSourcePicked: 0,
                showFilterIndex: -1,
                filterHeight: '0px',
                filterType: '',
                numberResult: [],
                rangeMin: 0,
                rangeMax: 1,
                //localStorage存储的key
                key: '',
                //行、列、筛选标识
                tagType: '',
                //拖拽元素数据类型
                dragDataType: '',
                //图表构建模型
                builderModel: '',
                //维度
                dimension: [],
                //度量
                measure: [],
                //x轴
                xAxis: [],
                //y轴
                yAxis: [],
                //颜色
                color: [],
                //角度
                corner: [],
                //标记
                tag: [],
                //过滤
                filter: [],
                //color,corner接收框样式
                backgroundColor: '',
                border: '',
                borderRight: '',
                //table过滤内容模型
                filterParam: {},
                //table分组内容模型
                groupParam: {},
                //table排序模型
                order: {},
                //table当前页
                currentPage: 1
            },
            methods: {
                //顶部菜单划过事件
                topMenuMouseEnter: function(index){
                    app.dangerIndex = index;
                },
                //图表类型选择
                chartTypeSelect: function (chartType) {
                    this.chartType = chartType;
                },
                //获取tag图标class
                getTagIclassType: function(tagType){
                    var iclass = '';
                    switch(tagType)
                    {
                        case 'color':
                            iclass = 'fa-tachometer';
                            break;
                        case 'corner':
                            iclass = 'fa-clock-o';
                            break;
                        case 'tag':
                            iclass = 'fa-tags';
                            break;
                        default:
                            iclass = '';
                    }
                    return iclass;
                },
                //tag恢复样式
                restoreTagStyle: function(target,tagType){
                    if(tagType == 'xAxis' || tagType == 'yAxis'){
                        target.css("background-color",'#ffffff');
                        target.css("border",'1px dashed #ccc');
                    }else if(tagType == 'corner' || tagType == 'color'){
                        target.css("background-color",'#ffffff');
                        target.css("border",'none');
                        target.css("border-right",'1px dashed #ccc');
                    }
                },
                //tag删除事件
                tagRemove: function(tagType, targetNodeText){
                    var items;
                    if(tagType == 'color'){
                        this.restoreTagStyle($(".mark-item-color"),'color');
                        this[tagType] = [];
                    }else if(tagType == 'corner'){
                        this.restoreTagStyle($(".mark-item-corner"),'corner');
                        this[tagType] = [];
                    }else if(tagType == 'xAxis'){
                        items = this[tagType];
                        items.splice($.inArray(targetNodeText, items),1);
                        this[tagType] = items;
                        this.restoreTagStyle($(".xAxis"),'xAxis');
                    }else if(tagType == 'yAxis'){
                        items = this[tagType];
                        items.splice($.inArray(targetNodeText, items),1);
                        this[tagType] = items;
                        this.restoreTagStyle($(".yAxis"),'yAxis');
                    }else if(tagType == 'filter'){
                        var filterContent = this.filter;
                        filterContent.splice($.inArray(targetNodeText, filterContent),1);
                        this.filter = filterContent;
                    }
                    this.$nextTick(function(){
                        if(app.chartType == 'table'){
                            commonModule.renderTable(app.chartType,app.sqlRecordingId,app.filterParam,app.groupParam,app.currentPage,app.order,app);
                        }else {
                            commonModule.renderChart(this.chartType,this.sqlRecordingId,app);
                        }
                    });
                },
                showFilterContent: function(index, dragDataType){
                    this.showFilterIndex = index;
                    $(document).mousedown(function(){
                        app.showFilterIndex = -1;
                    });
                    app.filterType = dragDataType;
                },
                /**
                 * tag拖拽渲染
                 * @param targetNodeText tag文本信息即字段信息
                 * @param tagType 目标区域类型
                 * @param target 所要添加的目标区域
                 * @param dragDataType 字段类型
                 */
                renderTag: function(targetNodeText,tagType,target,dragDataType,chartType){
                    var acceptDataType = this.axisTagMap[tagType].dataType;
                    var isAcceptChartType = this.axisTagMap[tagType][chartType];
                    var iclass = this.getTagIclassType(tagType);
                    if(((acceptDataType == dragDataType)&&isAcceptChartType) || acceptDataType == "all"){
                        switch (tagType) {
                            case 'color':
                                var color = [];
                                this.color = color;
                                this.color.push({iclass: 'fa '+iclass, targetNodeText: targetNodeText});
                                target.css("background-color",'#f6eedb');
                                target.css("border",'1px #f9e7bb solid');
                                target.css("cursor","move");
                                app.$nextTick(function(){
                                    commonModule.renderChart(app.chartType,this.sqlRecordingId,app);
                                });
                                break;
                            case 'corner':
                                var corner = [];
                                this.corner = corner;
                                this.corner.push({iclass: 'fa '+iclass, targetNodeText: targetNodeText});
                                target.css("background-color",'#d2ddf0');
                                target.css("border",'1px #b1caf4 solid');
                                target.css("cursor","move");
                                app.$nextTick(function(){
                                    commonModule.renderChart(app.chartType,this.sqlRecordingId,app);
                                });
                                break;
                            case 'tag':
                                this.tag.push({iclass: 'fa '+iclass, targetNodeText: targetNodeText});
                                target.css("cursor","move");
                                break;
                            case 'xAxis':
                                if(app.chartType == 'table'){
                                    if($.inArray(targetNodeText, app.xAxis) < 0){
                                        this.xAxis.push(targetNodeText);
                                    }
                                }else {
                                    var xAxis = [];
                                    xAxis.push(targetNodeText);
                                    this.xAxis = xAxis;
                                }
                                target.css("background-color",'#f6eedb');
                                target.css("border",'1px #f9e7bb solid');
                                app.$nextTick(function(){
                                    if(app.chartType == 'table'){
                                        commonModule.renderTable(app.chartType,app.sqlRecordingId,app.filterParam,app.groupParam,app.currentPage,app.order,app);
                                    }else {
                                        commonModule.renderChart(app.chartType,this.sqlRecordingId,app);
                                    }
                                });
                                break;y
                            case 'yAxis':
                                if($.inArray(targetNodeText, app.yAxis) < 0){
                                    this.yAxis.push(targetNodeText);
                                }
                                target.css("background-color",'#d2ddf0');
                                target.css("border",'1px #b1caf4 solid');
                                app.$nextTick(function(){
                                    if(app.chartType == 'table'){
                                        commonModule.renderTable(app.chartType,app.sqlRecordingId,app.filterParam,app.groupParam,app.currentPage,app.order,app);
                                    }else {
                                        commonModule.renderChart(app.chartType,this.sqlRecordingId,app);
                                    }
                                });
                                break;
                            case 'filter':
                                var filterText = [];
                                for(var item in this.filter){
                                    filterText.push(this.filter[item].targetNodeText);
                                }
                                if($.inArray(targetNodeText,filterText) == -1 && ($.inArray(targetNodeText,this.xAxis) >= 0 ||
                                    $.inArray(targetNodeText,this.yAxis) >= 0 || $.inArray(targetNodeText,this.color) >= 0 ||
                                    $.inArray(targetNodeText,this.corner) >= 0)){
                                    this.filter.push({targetNodeText: targetNodeText, dragDataType: dragDataType});
                                    app.$nextTick(function(){
                                        var height = target.height();
                                        app.filterHeight = height+'px';
                                        this.showFilterIndex = this.filter.length-1;
                                        $(document).mousedown(function(){
                                            app.showFilterIndex = -1;
                                        });
                                    });
                                    commonModule.getFilterResult(this.chartType,this.sqlRecordingId,targetNodeText,dragDataType,app);
                                }
                        }
                    }else {
                        this.restoreTagStyle(target,tagType);
                    }
                    var xAxis= app.xAxis;
                    var yAxis = app.yAxis;
                },
                //重置全部标签内容
                resetTagContent: function(){
                    this.restoreTagStyle($(".xAxis"),'xAxis');
                    this.xAxis = [];
                    this.restoreTagStyle($(".yAxis"),'yAxis');
                    this.yAxis = [];
                    this.restoreTagStyle($('form.make-model-region .mark-item-color'),'color');
                    this.color = [];
                    this.restoreTagStyle($('form.make-model-region .mark-item-corner'),'corner');
                    this.corner = [];
                    echarts.dispose(document.getElementById("editArea"));
                },
                //获取localStorage中的维度与度量
                getLocalStorageInfo: function(res){
                    var key = $.md5(JSON.stringify(res));
                    var result;
                    var localStorageResult = localStorage.getItem(key);
                    if(localStorageResult){
                        result = {
                            data : JSON.parse(localStorageResult),
                            type : 'localStorage'
                        }
                    }else{
                        //维度和度量模型
                        var columnModle ={
                            dimension :[],
                            measure :[]
                        };
                        $.each(res,function(index,element){
                            if(element.type === 'varchar') {
                                columnModle.dimension.push(element.name);
                            }else{
                                columnModle.measure.push(element.name);
                            }
                        });
                        result = {
                            data : columnModle,
                            type : 'ajax'
                        };
                        localStorage.setItem(key,JSON.stringify(columnModle));
                    }
                    return result
                },
                //将维度与度量保存到localStorage
                saveLocalStorageInfo: function () {
                    //维度和度量模型
                    var columnModle ={
                        dimension :this.dimension,
                        measure :this.measure
                    };
                    localStorage.setItem($.md5(JSON.stringify(this.key)), JSON.stringify(columnModle));
                },
                //切换维度度量
                changeTagType: function(tagType,targetNodeText){
                    var dimension = this.dimension;
                    var measure = this.measure;
                    if(tagType == 'text'){
                        dimension.splice($.inArray(targetNodeText,dimension),1);
                        measure.push(targetNodeText);
                        this.dimension = dimension;
                        this.measure = measure;
                    }else if(tagType == 'number'){
                        measure.splice($.inArray(targetNodeText,dimension),1);
                        dimension.push(targetNodeText);
                        this.dimension = dimension;
                        this.measure = measure;
                    }
                    //移动后保存到localStorage
                    this.saveLocalStorageInfo();
                },
                //返回行、列、筛选标识
                axisTagType: function(target){
                    if(target.hasClass("xAxis")){
                        this.tagType = 'xAxis';
                    }else if(target.hasClass("yAxis")){
                        this.tagType = 'yAxis';
                    }else if(target.hasClass("column-filter")){
                        this.tagType = 'filter';
                    }
                },
                //拖拽元素数据类型
                dragUIDataType: function (ui) {
                    var textTag = $(ui.draggable).find("a").find("i").hasClass("glyphicon-text-color");
                    var numberTag = $(ui.draggable).find("a").find("i").hasClass("fa-sort-numeric-asc");
                    if(textTag){
                        this.dragDataType = 'text';
                    }else if(numberTag){
                        this.dragDataType = 'number';
                    }
                },
                //tag拖拽OVER样式
                tagDropOverRender: function(chartType,tagType,target,dataType) {
                    var acceptdataType = this.axisTagMap[tagType].dataType;
                    var isAcceptChartType = this.axisTagMap[tagType][chartType];
                    if((acceptdataType == dataType && isAcceptChartType) || acceptdataType == "all"){
                        target.css("border","1px dashed #22a7f0");
                        target.css("background-color","#cfe9f7");
                    }else if(!isAcceptChartType || acceptdataType!= dataType){
                        target.css("border","1px dashed #ff2828");
                        target.css("background-color","#ffeeee");
                    }
                },
                //图表保存
                saveChart: function(){
                    if((this.xAxis > 0 && this.yAxis > 0) || (this.corner > 0 && this.color > 0)){
                        $("#addChartForm").submit();
                    }else{
                        alert("请先绘制图表");
                    }
                },
                doFilter: function(){
                    var filterContent = [];  //经过过滤的内容
                    for(var item in this.filter){
                        if(this.filter[item].dragDataType == 'text'){
                            var filterParam = {};
                            var checkedOptions = [];
                            $("input:checkbox:checked").each(function(){
                                checkedOptions.push($(this).parent().text());
                            });
                            filterParam[this.filter[item].targetNodeText] = checkedOptions;
                            filterContent.push(JSON.stringify(filterParam));
                        }else if(this.filter[item].dragDataType == 'number'){
                            var filterParam = {};
                            filterParam[this.filter[item].targetNodeText] = app.rangeMin+','+app.rangeMax;
                            filterContent.push(JSON.stringify(filterParam));
                        }
                    }
                    commonModule.renderChart(this.chartType,this.sqlRecordingId,app,filterContent);
                }
            },
            mounted: function () {
                //日期格式化方法
                Date.prototype.Format = function(fmt)
                {
                    var o = {
                        "M+" : this.getMonth()+1,                 //月份
                        "d+" : this.getDate(),                    //日
                        "h+" : this.getHours(),                   //小时
                        "m+" : this.getMinutes(),                 //分
                        "s+" : this.getSeconds(),                 //秒
                        "q+" : Math.floor((this.getMonth()+3)/3), //季度
                        "S"  : this.getMilliseconds()             //毫秒
                    };
                    if(/(y+)/.test(fmt))
                        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                    for(var k in o)
                        if(new RegExp("("+ k +")").test(fmt))
                            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                    return fmt;
                };
                //若通过点击设计面板中的表进入时，则chartId对应其在MyCharts表中的主键
                if(window.location.href.indexOf("chartId") > 0){
                    this.chartId = window.location.href.split("=")[1].replace("&exportId","");
                    this.exportId = window.location.href.split("=")[2].replace("#","");
                }else{
                    this.exportId = window.location.href.split("=")[1].replace("#","");
                }
                //初始化图表
                var deferred = $.ajax({
                    type: 'POST',
                    url: 'selectOneChartInfo',
                    data: "id="+this.chartId
                });
                deferred.done(function(data){
                    if(data){
                        var editChart = echarts.init(document.getElementById("editArea"));
                        app.jobGroup = data.chartType;
                        app.builderModel = JSON.parse(data.buildModel);
                        if(parseInt(data.isRealTime) == 0){
                            editChart.setOption(JSON.parse(data.jsCode));
                        }else if(parseInt(data.isRealTime) == 1){
                            $.ajax({
                                type: 'POST',
                                contentType: "application/json; charset=utf-8",
                                url: 'render',
                                data: JSON.stringify({
                                    'chartType': data.chartType,
                                    'dataRecordId': data.sqlRecordingId,
                                    'builderModel': JSON.parse(data.buildModel)
                                }),
                                success: function(option){
                                    var newOption = JSON.parse(data.jsCode);
                                    newOption.series = option.series;
                                    editChart.setOption(newOption);
                                },
                                error: function(){
                                    $("editArea").text("当前图表渲染失败，请检查远程数据库连接是否正常或刷新重试。");
                                }
                            });
                        }
                        app.chartName = data.chartName;
                        app.dataSourcePicked = parseInt(data.isRealTime);
                        // 获取当前定时任务信息
                        $.ajax({
                            type: 'POST',
                            url: 'myChart/getSchedulerInfo',
                            data: {
                                triggerName: app.chartId,
                                triggerGroup: data.chartType
                            },
                            success: function(info){
                                if(info.haveJob == true){
                                    $(".toggle-checkbox").bootstrapSwitch('state', true);
                                    app.startTime = info.startTime;
                                    app.selectedPeriod = info.period;
                                }else {
                                    $(".toggle-checkbox").bootstrapSwitch('state', false);
                                }
                            }
                        });
                    }
                });
                //初始化插件
                $('.toggle-checkbox').bootstrapSwitch({
                    size: "small",
                    onSwitchChange: function(event, state){
                        if(state == true){
                            app.isShowJobSetting = true;
                            $.ajax({
                                type: 'POST',
                                url: 'myChart/resumeJob',
                                data: {
                                    jobName: app.chartId,
                                    jobGroup: app.jobGroup
                                }
                            });
                        }else if(state == false){
                            app.isShowJobSetting = false;
                            $.ajax({
                                type: 'POST',
                                url: 'myChart/pauseJob',
                                data: {
                                    jobName: app.chartId,
                                    jobGroup: app.jobGroup
                                }
                            });
                        }
                    }
                });
                $('.form_datetime').datetimepicker({
                    format: "yyyy-mm-dd hh:ii:ss",
                    language:  'zh-CN',
                    weekStart: 1,
                    todayBtn:  1,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 2,
                    forceParse: 0,
                    showMeridian: 1
                });
                if(this.startTime == ''){
                    var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
                    this.startTime = time;   //设置默认值
                }
                $("#addChartForm").validate({
                    errorElement : 'div',
                    errorClass : 'warning-block',
                    focusInvalid : true,
                    ignore : "",
                    rules : {
                        chartName : {
                            required : true,
                            maxlength:300
                        }
                    },
                    messages : {
                        chartName : {
                            required : "图表名称为必填项",
                            maxlength: "最大长度为50个字符"
                        }
                    },
                    submitHandler : function(form){
                        if(app.chartId == 0){
                            var jsCode;
                            if(app.chartType == 'table'){
                                jsCode = $("#editArea").html();
                            }else {
                                jsCode = JSON.stringify(echarts.getInstanceByDom(document.getElementById("editArea")).getOption());
                            }
                            var paramId;
                            var deferred01 = $.ajax({
                                type: 'POST',
                                url: 'addCharts',
                                data : {
                                    'chartType': app.chartType,
                                    'sqlRecordingId': app.sqlRecordingId,
                                    'buildModel': JSON.stringify(app.builderModel),
                                    'jsCode': jsCode,
                                    'chartName': app.chartName,
                                    'isRealTime' : app.dataSourcePicked
                                }
                            });
                            deferred01.done(function(data){
                                paramId = data;
                                $(form)[0].reset();
                                $("#addChartModal").modal('toggle');
                                top.window.location = "showPanel.page?exportId="+app.exportId+"&chartId="+data;
                            });
                            if($(".toggle-checkbox").bootstrapSwitch('state') == true){
                                var time = $('.form_datetime').find("input").val();
                                $.when(deferred01).done(function(){
                                    var deferred02 = $.ajax({
                                        type: 'POST',
                                        url: 'myChart/addSchedulerJob',
                                        data: {
                                            'chartId': paramId,
                                            'chartType': app.chartType,
                                            'startTime': time,
                                            'period': app.selectedPeriod,
                                            'triggerName': paramId,
                                            'triggerGroup': app.chartType
                                        }
                                    });
                                    deferred02.fail(function(){
                                        alert("定时任务设置失败!");
                                    });
                                });
                            }
                        }else {
                            var deferred = $.ajax({
                                type: 'POST',
                                url: 'updateChartInfo',
                                data : {
                                    'id': app.chartId,
                                    'chartType': app.chartType,
                                    'sqlRecordingId': app.sqlRecordingId,
                                    'buildModel': JSON.stringify(app.builderModel),
                                    'jsCode': JSON.stringify(echarts.getInstanceByDom(document.getElementById("editArea")).getOption()),
                                    'chartName': app.chartName,
                                    'isRealTime' : app.dataSourcePicked
                                }
                            });
                            deferred.done(function(data){
                                $(form)[0].reset();
                                $("#addChartModal").modal('toggle');
                                top.window.location = "showPanel.page?exportId="+app.exportId;
                            });

                            $.ajax({
                                type: 'POST',
                                url: 'myChart/retScheduleJob',
                                data: {
                                    'triggerName': app.chartId,
                                    'triggerGroup': app.jobGroup,
                                    'startTime': app.startTime,
                                    'period': app.selectedPeriod
                                }
                            })
                        }
                    }
                });
                $('#side-menu').metisMenu({
                    toggle: false
                });
                //页面图表和树初始化
                if(window.location.href.indexOf("chartId") > 0){
                    this.chartId = window.location.href.split("=")[1].replace("&exportId","");
                }
                $.fn.zTree.init($("#dataListTree"),{
                    async: {
                        enable: true,
                        url:"sqlRecordingManage/queryTree",
                        autoParam:["queryParam", "level=lv"],
                        dataType: "JSON",
                        dataFilter: function(treeId, parentNode, responseData) {
                            //批量增加iconSkin
                            $.each(responseData,function(index,object){
                                if(object.type === 'database'){
                                    switch(object.dbType)
                                    {
                                        case 'Oracle':
                                            object.iconSkin = "oracleIcon";
                                            break;
                                        case 'MySql':
                                            object.iconSkin = "mysqlIcon";
                                            break;
                                        case 'SqlServer':
                                            object.iconSkin = "sqlserverIcon";
                                            break;
                                        case 'H2':
                                            object.iconSkin = "h2Icon";
                                            break;
                                        default:
                                            object.iconSkin = "dbIcon";
                                    }
                                }else{
                                    object.iconSkin = "tableIcon";
                                }
                            });
                            return responseData;
                        }
                    },
                    data: {
                        key: {
                            name: "dbName"
                        }
                    },
                    callback: {
                        onAsyncSuccess :function () {
                            $("div.leftScrollPanel").mCustomScrollbar({
                                autoHideScrollbar:true,
                                axis:"yx",
                                theme:"dark"
                            });
                            if(arguments[3][0].dbUrl){
                                app.firstLevelDeferred.resolve();
                            }else{
                                app.secondLevelDeferred.resolve();
                            }
                        },
                        onClick: function(event, treeId, treeNode){
                            var tree = $.fn.zTree.getZTreeObj("dataListTree");
                            var sqlRecordingId = tree.getSelectedNodes()[0].id;       //数据集id
                            if(sqlRecordingId != app.sqlRecordingId){//数据源切换，重置标签
                                app.resetTagContent();
                            }
                            app.sqlRecordingId = sqlRecordingId;     //用于插入图表关联信息

                            if(!treeNode.dbUrl) {
                                $('#side-menu li a:eq(0)').html("<i class='fa fa-sitemap fa-fw'></i>" + treeNode.dbName + "<span class='fa arrow'></span>");
                                var queryParam = {};
                                queryParam.id = treeNode.getParentNode().id;
                                queryParam.sql = treeNode.sql;
                                queryParam.queryMaxRows = 1;
                                queryParam.paging = false;
                                var deferred = $.ajax({
                                    type: 'POST',
                                    dataType: 'json',
                                    url: 'connectionManage/getQuerySqlInfo',
                                    data : queryParam
                                });
                                deferred.done(function(result){
                                    var columnModle = app.getLocalStorageInfo(result).data;
                                    app.dimension = [];
                                    app.measure = [];
                                    $.each(columnModle.dimension,function (index,element) {
                                        app.dimension.push(element);
                                    });
                                    $.each(columnModle.measure,function (index,element) {
                                        app.measure.push(element);
                                    });
                                    app.key = result;
                                    //滚动条插件
                                    $(".scrollable").mCustomScrollbar({
                                        autoHideScrollbar:true,
                                        theme:"dark"
                                    });

                                    //在droppable事件中发送option组装请求
                                    $("form.make-model-region .trigger-column").droppable({
                                        drop: function (event, ui) {
                                            app.axisTagType($(this));
                                            app.dragUIDataType(ui);
                                            var targetNodeText = $(ui.draggable).find("a").find("span")[0].innerText;
                                            app.renderTag(targetNodeText,app.tagType,$(this),app.dragDataType,app.chartType);
                                        },
                                        over: function (event, ui) {
                                            app.dragUIDataType(ui);
                                            app.axisTagType($(this));
                                            app.tagDropOverRender(app.chartType,app.tagType,$(this),app.dragDataType);
                                        },
                                        out:function (event,ui) {
                                            if($(this).children().length == 1){
                                                if(app.tagType == 'xAxis'){
                                                    $(this).css("background-color",'#f6eedb');
                                                    $(this).css("border",'1px #f9e7bb solid');
                                                }else if(app.tagType == 'yAxis'){
                                                    $(this).css("background-color",'#d2ddf0');
                                                    $(this).css("border",'1px #b1caf4 solid');
                                                }
                                            }else {
                                                $(this).css("border","1px dashed #ccc");
                                                $(this).css("background-color","white");
                                            }
                                        }
                                    });

                                    /**
                                     * 颜色tag
                                     */
                                    $("form.make-model-region .mark-down-column .mark-item-color").droppable({
                                        drop: function(event,ui){
                                            app.dragUIDataType(ui);
                                            var targetNodeText = $(ui.draggable).find("a").find("span")[0].innerText;
                                            app.renderTag(targetNodeText,'color',$(this),app.dragDataType,app.chartType);
                                        },
                                        over: function (event, ui) {
                                            app.dragUIDataType(ui);
                                            app.tagDropOverRender(app.chartType,'color',$(this),app.dragDataType);
                                        },
                                        out:function (event,ui) {
                                            if($(this).children().length == 1){
                                                $(this).css("border","");
                                                $(this).css("background-color","white");
                                            }else{
                                                $(this).css("background-color",'#f6eedb');
                                                $(this).css("border",'1px #f9e7bb solid');
                                            }
                                        }
                                    });

                                    /**
                                     * 角度tag
                                     */
                                    $("form.make-model-region .mark-down-column .mark-item-corner").droppable({
                                        drop: function(event,ui){
                                            app.dragUIDataType(ui);
                                            var targetNodeText = $(ui.draggable).find("a").find("span")[0].innerText;
                                            app.renderTag(targetNodeText,'corner',$(this),app.dragDataType,app.chartType);
                                        },
                                        over: function (event, ui) {
                                            app.dragUIDataType(ui);
                                            app.tagDropOverRender(app.chartType,'corner',$(this),app.dragDataType);
                                        },
                                        out:function (event,ui) {
                                            if($(this).children().length == 1){
                                                $(this).css("border","");
                                                $(this).css("background-color","white");
                                            }else{
                                                $(this).css("background-color",'#d2ddf0');
                                                $(this).css("border",'1px #b1caf4 solid');
                                            }
                                        }
                                    });

                                    /**
                                     * 标签tag
                                     */
                                    $("form.make-model-region .mark-down-column .mark-item-tag").droppable({
                                        drop: function(event,ui){
                                            app.dragUIDataType(ui);
                                            var targetNodeText = $(ui.draggable).find("a").find("span")[0].innerText;
                                            app.renderTag(targetNodeText,'tag',$(this),app.dragDataType,app.chartType);
                                        },
                                        over: function (event, ui) {
                                            app.dragUIDataType(ui);
                                            app.tagDropOverRender(app.chartType,'tag',$(this),app.dragDataType);
                                        },
                                        out:function (event,ui) {
                                            $(this).css("border","");
                                            $(this).css("background-color","white");
                                        }
                                    });

                                    /**
                                     * 筛选tag
                                     */
                                    $("form.make-model-region .column-filter").droppable({
                                        drop: function (event, ui) {
                                            app.axisTagType($(this));
                                            app.dragUIDataType(ui);
                                            var targetNodeText = $(ui.draggable).find("a").find("span")[0].innerText;
                                            app.renderTag(targetNodeText,app.tagType,$(this),app.dragDataType,app.chartType);
                                            $(this).css("border","1px dashed #ccc");
                                            $(this).css("background-color","white");
                                        },
                                        over: function (event, ui) {
                                            app.axisTagType($(this));
                                            app.dragUIDataType(ui);
                                            app.tagDropOverRender(app.chartType,app.tagType,$(this),app.dragDataType);
                                        },
                                        out:function (event,ui) {
                                            $(this).css("border","1px dashed #ccc");
                                            $(this).css("background-color","white");
                                        }
                                    });
                                    /**
                                     * 左侧维度、度量拖拽
                                     */
                                    setTimeout(function(){
                                        $('#side-menu ul.nav.nav-third-level li').draggable({
                                            cursor: "move",
                                            opacity: 0.7,
                                            appendTo :'body',
                                            cursorAt: { top: 10, left: 34 },
                                            helper: function(event) {
                                                var dragText = $(this).find("a").find("span").html();
                                                return $( "<div class='drag-helper'>"+dragText+"</div>" );
                                            }
                                        });
                                    },0);
                                });
                            }
                        }
                    }
                });
                var binddefferd = $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: 'selectOneChartInfo',
                    data: {
                        'id': this.chartId
                    }
                });
                //标签的初始化
                binddefferd.done(function (result) {
                    var buildModel = JSON.parse(result.buildModel);
                    if(buildModel.mark){
                        if(buildModel.mark.color && buildModel.mark.color != '') {
                            app.renderTag(buildModel.mark.color,'color',$("form.make-model-region .mark-down-column .mark-item-color"),'text','pie');
                        }
                        if(buildModel.mark.angle && buildModel.mark.angle != ''){
                            app.renderTag(buildModel.mark.angle,'corner',$("form.make-model-region .mark-down-column .mark-item-corner"),'number','pie');
                        }
                    }
                    if(buildModel.xAxis && buildModel.xAxis != ''){
                        app.renderTag(buildModel.xAxis[0],'xAxis',$("form.make-model-region .xAxis"),'text',result.chartType);
                    }

                    if(buildModel.yAxis && buildModel.yAxis != ''){
                        app.renderTag(buildModel.yAxis[0],'yAxis',$("form.make-model-region .yAxis"),'number',result.chartType);
                    }
                    app.sqlRecordingId = result.sqlRecordingId;
                    if(result.chartType){
                        app.chartType = result.chartType;
                    }
                });
                binddefferd.done(function (result) {
                    var parentNode;
                    var treeObj = $.fn.zTree.getZTreeObj("dataListTree");

                    var queryParentDeferred = $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: 'sqlRecordingManage/query',
                        data: {
                            'id': result.sqlRecordingId
                        }
                    });

                    queryParentDeferred.done(function (v) {
                        parentNode = treeObj.getNodesByFilter(function (node) {
                            return (node.id == v[0].connectionId && node.dbUrl);
                        }, true); // 仅查找一个节点
                        treeObj.expandNode(parentNode, true, true, true);
                    });

                    //当树第一层第二层加载好时执行以下逻辑
                    $.when(app.firstLevelDeferred,app.secondLevelDeferred).done(function (v1, v2) {
                        var childNode = treeObj.getNodesByFilter(function (node) {
                            return node.id == result.sqlRecordingId;
                        }, true, parentNode); // 仅查找一个节点
                        treeObj.selectNode(childNode);
                        treeObj.setting.callback.onClick(null,"dataListTree",childNode)
                    })
                });
                //table标签拖拽排序
                $(".xAxis").sortable().bind('sortupdate');
                $(".yAxis").sortable().bind('sortupdate');
            },
            watch: {
                chartType: function () {
                    var xAxisText = this.xAxis.length > 0 ? this.xAxis[0]:'';
                    var yAxisText = this.yAxis.length > 0 ? this.yAxis[0]:'';
                    var colorText = this.color.length > 0 ? this.color[0].targetNodeText:'';
                    var cornerText = this.corner.length > 0 ? this.corner[0].targetNodeText:'';
                    if(this.chartType == 'pie'){
                        if(xAxisText != ''){
                            this.xAxis = [];
                            this.$nextTick(function(){
                                this.restoreTagStyle($('.xAxis'),'xAxis');
                                this.renderTag(xAxisText,'color',$("form.make-model-region .mark-down-column .mark-item-color"),'text',this.chartType);
                            });
                        }
                        if(yAxisText != ''){
                            this.yAxis = [];
                            this.$nextTick(function(){
                                this.restoreTagStyle($('.yAxis'),'yAxis');
                                this.renderTag(yAxisText,'corner',$("form.make-model-region .mark-down-column .mark-item-corner"),'number',this.chartType);
                            });
                        }
                    }else  if(this.chartType == 'bar' || this.chartType == 'line'){
                        if(colorText != ''){
                            this.color = [];
                            this.$nextTick(function(){
                                this.restoreTagStyle($('form.make-model-region .mark-item-color'),'color');
                                this.renderTag(colorText,'xAxis',$("form.make-model-region .xAxis"),'text',this.chartType);
                            });
                        }
                        if(cornerText != ''){
                            this.corner = [];
                            this.$nextTick(function(){
                                this.restoreTagStyle($('form.make-model-region .mark-item-corner'),'corner');
                                this.renderTag(cornerText,'yAxis',$("form.make-model-region .yAxis"),'number',this.chartType);
                            });
                        }
                        if (this.sqlRecordingId) {
                            commonModule.renderChart(this.chartType, this.sqlRecordingId, app);
                        }
                    }
                },
                dataSourcePicked: function(){
                    if(this.dataSourcePicked == 0){
                        this.isShowUpdateCheck = true;
                        this.isShowJobSetting = true;
                        $(".toggle-checkbox").bootstrapSwitch('state', true);
                    }else if(this.dataSourcePicked == 1){
                        this.isShowUpdateCheck = false;
                        this.isShowJobSetting = false;
                        $(".toggle-checkbox").bootstrapSwitch('state', false);
                    }
                }
            }
        });
    });
});

/**
 * Created by ct on 2016/8/13.
 */
require.config({
    baseUrl: 'resources/js',
    paths: {
        "formatData": "lib/charts/formatData",
        "jquery": "lib/bootstrap/js/jquery-2.1.4.min",
        "bootstrap": "lib/bootstrap/js/bootstrap.min",
        "jquery-ui": "lib/jquery-ui.min",
        "lodash": "lib/gridstack/js/lodash.min",
        "underscore": "lib/underscore/underscore-min",
        "spectrum": "lib/bootstrap/js/spectrum",
        "renderMenu" : 'app/renderMenu',
        "domReady" : 'lib/domReady',
        "zrender": "lib/zrender/zrender",
        "zrender/shape/Rectangle": "lib/zrender/zrender",
        "zrender/shape/Image": "lib/zrender/zrender",
        "zrender/tool/color": "lib/zrender/zrender",
        "zrender/Storage" : "lib/zrender/zrender",
        "CanvasTag" : "customModule/CanvasTag/CanvasTag",
        "CanvasTagOfImage" : "customModule/CanvasTag/CanvasTagOfImage",
        "confirmModal": "lib/confirm/confirm-bootstrap",
        "vue": "lib/vue/vue",
        "bootstrapFileStyle": "lib/bootstrapFileStyle/fileinput.min",
        "interact": "lib/interact/interact",
        "echarts": "lib/charts/echarts",
        "theme": "lib/charts/theme",
        "nicescroll": "lib/nicescroll/jquery.nicescroll.min",
        "tableExport": "lib/tableExport/tableexport.min",
        "file-saverjs": "lib/tableExport/FileSaver",
        "blobjs": "lib/tableExport/Blob",
        "xlsx": "lib/tableExport/xlsx",
        "jzip": "lib/tableExport/jszip",
        "tooltipster": "lib/gridly/tooltipster.bundle.min",
        "generateTableHtml": "app/generateTableHtml",
        "commonModule" : 'app/commonModule',
        "thenBy": "lib/thenBy",
        "jquery-confirm": "lib/confirm/jquery-confirm.min",
        "jquery-loading": "lib/jqueryLoading/jquery.loading"
    },
    shim : {
        "bootstrap" : { "deps" :['jquery'] },
        "confirmModal" : { "deps" :['jquery'] },
        "bootstrapFileStyle" : { "deps" :['bootstrap'] },
        "tableExport": { "deps" :['blobjs', 'file-saverjs', 'xlsx', 'jzip'] }
    },
    waitSeconds: 30
});

require(['jquery','domReady','vue','CanvasTagOfImage','renderMenu','echarts','interact','formatData','CanvasTag','zrender','theme','commonModule',
        'bootstrapFileStyle','spectrum','confirmModal','nicescroll','tableExport'],
    function ($,domReady,vue,CanvasTagOfImage,renderMenu,echarts,interact,formatData,CanvasTag,zrender,theme,commonModule) {
        domReady(function () {
            //charts配置双向绑定组件
            vue.component('chart-option-component',{
                template: formatData.tableAndConfigOfBarAndLine(),
                props: ['chartOption'],
                data: function(){
                    return {
                        option: '',
                        myChart: '',
                        optionSetting: {
                            titleContent: '',
                            titleTop: '',
                            titleX: '',
                            titleFontFamily: '',
                            titleFontSize: '',
                            titleFontWeight: '',
                            titleFontStyle: '',
                            titleFontColor: '',
                            subtitleContent: '',
                            subtitleFontFamily: '',
                            subtitleFontSize: '',
                            subtitleFontWeight: '',
                            subtitleFontStyle: '',
                            subtitleFontColor: '',
                            tooltipShow: '',
                            tooltipBorderColor: '',
                            tooltipBorderWidth: '',
                            tooltipBackgroundColor: '',
                            tooltipFontFamily: '',
                            tooltipFontSize: '',
                            tooltipFontWeight: '',
                            tooltipFontColor: '',
                            backgroundOpacity: '',
                            // xRotate: '',
                            // yAxisContent: ''
                            legendLeft: 195,
                            legendTop: ''
                        }
                    }
                },
                watch: {
                    chartOption: function(){
                        var self  = this;
                        //颜色选择器初始化
                        $("#titleFontColor").spectrum({
                            showInput: true,
                            allowEmpty:true,
                            color: this.chartOption.title[0].textStyle.color,
                            change: function(color){
                                self.optionSetting.titleFontColor = color.toHexString();
                            }
                        });
                        $("#subtitleFontColor").spectrum({
                            showInput: true,
                            allowEmpty:true,
                            color: this.chartOption.title[0].subtextStyle.color,
                            change: function(color) {
                                self.optionSetting.subtitleFontColor = color.toHexString();
                            }
                        });
                        $("#tooltipBorderColor").spectrum({
                            showInput: true,
                            allowEmpty:true,
                            color: this.chartOption.tooltip[0].borderColor,
                            change: function(color) {
                                self.optionSetting.tooltipBorderColor = color.toHexString();
                            }
                        });
                        $("#tooltipBackgroundColor").spectrum({
                            showInput: true,
                            allowEmpty:true,
                            color: this.chartOption.tooltip[0].backgroundColor,
                            change: function(color) {
                                self.optionSetting.tooltipBackgroundColor = color.toHexString();
                            }
                        });
                        $("#tooltipFontColor").spectrum({
                            showInput: true,
                            allowEmpty:true,
                            color: this.chartOption.tooltip[0].textStyle.color,
                            change: function(color) {
                                self.optionSetting.tooltipFontColor = color.toHexString();
                            }
                        });
                        if(JSON.stringify(this.chartOption.backgroundColor).split(",").length<4){
                            this.chartOption.backgroundColor = 'rgba(255,255,255,1)';
                        }
                        if(this.chartOption.title[0] || this.chartOption.tooltip[0]){
                            var settings = {
                                titleContent: this.chartOption.title[0].text,
                                titleTop: this.chartOption.title[0].top,
                                titleX: this.chartOption.title[0].left,
                                titleFontFamily: this.chartOption.title[0].textStyle.fontFamily,
                                titleFontSize: this.chartOption.title[0].textStyle.fontSize,
                                titleFontWeight: this.chartOption.title[0].textStyle.fontWeight,
                                titleFontStyle: this.chartOption.title[0].textStyle.fontStyle,
                                titleFontColor: this.chartOption.title[0].textStyle.color,
                                subtitleContent: this.chartOption.title[0].subtext,
                                subtitleFontFamily: this.chartOption.title[0].subtextStyle.fontFamily,
                                subtitleFontSize: this.chartOption.title[0].subtextStyle.fontSize,
                                subtitleFontWeight: this.chartOption.title[0].subtextStyle.fontWeight,
                                subtitleFontStyle: this.chartOption.title[0].subtextStyle.fontStyle,
                                subtitleFontColor: this.chartOption.title[0].subtextStyle.color,
                                tooltipShow: this.chartOption.tooltip[0].show,
                                tooltipBorderColor: this.chartOption.tooltip[0].borderColor,
                                tooltipBorderWidth: this.chartOption.tooltip[0].borderWidth,
                                tooltipBackgroundColor: this.chartOption.tooltip[0].backgroundColor,
                                tooltipFontFamily: this.chartOption.tooltip[0].textStyle.fontFamily,
                                tooltipFontSize: this.chartOption.tooltip[0].textStyle.fontSize,
                                tooltipFontWeight: this.chartOption.tooltip[0].textStyle.fontWeight,
                                tooltipFontColor: this.chartOption.tooltip[0].textStyle.color,
                                backgroundOpacity: JSON.stringify(this.chartOption.backgroundColor).split(",")[3].replace(')"','')*100,
                                // xRotate: this.chartOption.xAxis[0].axisLabel.rotate ? this.chartOption.xAxis[0].axisLabel.rotate : 0,
                                // yAxisContent: ''
                                legendLeft: this.chartOption.legend[0].left,
                                legendTop: this.chartOption.legend[0].top
                            };
                            this.optionSetting = settings;
                        }
                        this.option = this.chartOption;
                        $("#optionModal").unbind("shown.bs.modal");
                        $("#optionModal").on("shown.bs.modal", function (e) {
                            self.myChart = echarts.init(document.getElementById("optionContainer"));
                            self.myChart.setOption(self.option,true);
                        });
                    },
                    optionSetting: {
                        handler: function(val, oldVal){
                            this.chartOption.title[0].text = this.optionSetting.titleContent;
                            this.chartOption.title[0].top = this.optionSetting.titleTop;
                            this.chartOption.title[0].left = this.optionSetting.titleX;
                            this.chartOption.title[0].textStyle.fontFamily = this.optionSetting.titleFontFamily;
                            this.chartOption.title[0].textStyle.fontSize = this.optionSetting.titleFontSize;
                            this.chartOption.title[0].textStyle.fontWeight = this.optionSetting.titleFontWeight;
                            this.chartOption.title[0].textStyle.fontStyle = this.optionSetting.titleFontStyle;
                            this.chartOption.title[0].textStyle.color = this.optionSetting.titleFontColor;
                            this.chartOption.title[0].subtext = this.optionSetting.subtitleContent;
                            this.chartOption.title[0].subtextStyle.fontFamily = this.optionSetting.subtitleFontFamily;
                            this.chartOption.title[0].subtextStyle.fontSize = this.optionSetting.subtitleFontSize;
                            this.chartOption.title[0].subtextStyle.fontWeight = this.optionSetting.subtitleFontWeight;
                            this.chartOption.title[0].subtextStyle.fontStyle = this.optionSetting.subtitleFontStyle;
                            this.chartOption.title[0].subtextStyle.color = this.optionSetting.subtitleFontColor;
                            this.chartOption.tooltip[0].show = 'false' == this.optionSetting.tooltipShow ? false : true;
                            this.chartOption.tooltip[0].borderColor = this.optionSetting.tooltipBorderColor;
                            this.chartOption.tooltip[0].borderWidth = this.optionSetting.tooltipBorderWidth;
                            this.chartOption.tooltip[0].backgroundColor = this.optionSetting.tooltipBackgroundColor;
                            this.chartOption.tooltip[0].textStyle.fontFamily = this.optionSetting.tooltipFontFamily;
                            this.chartOption.tooltip[0].textStyle.fontSize = this.optionSetting.tooltipFontSize;
                            this.chartOption.tooltip[0].textStyle.fontWeight = this.optionSetting.tooltipFontWeight;
                            this.chartOption.tooltip[0].textStyle.color = this.optionSetting.tooltipFontColor;
                            if(JSON.stringify(this.chartOption.backgroundColor).split(",").length == 4){
                                this.chartOption.backgroundColor = this.chartOption.backgroundColor.split(",")[0]+","+this.chartOption.backgroundColor.split(",")[1]+","+this.chartOption.backgroundColor.split(",")[2]+","+this.optionSetting.backgroundOpacity*0.01+")";
                            }
                            // this.chartOption.xAxis[0].axisLabel.rotate = this.optionSetting.xRotate;
                            // this.chartOption.yAxis[0].name = this.optionSetting.yAxisContent;
                            this.chartOption.legend[0].left = this.optionSetting.legendLeft;
                            this.chartOption.legend[0].top = this.optionSetting.legendTop;
                            if(this.myChart != ''){
                                this.myChart.setOption(this.option,true);
                            }
                        },
                        deep: true
                    }
                }
            });
            //text配置双向绑定组件
            vue.component('text-option-component',{
                template: formatData.tableAndConfigOfText(),
                props: ['textOption'],
                data: function(){
                    return {
                        option: '',
                        optionSetting: {
                            text: '',
                            textColor: '',
                            fontSize: '',
                            color: '',
                            strokeColor: ''
                        }
                    }
                },
                watch: {
                    textOption: function(){
                        var self = this;
                        $("#textColor").spectrum({
                            showInput: true,
                            allowEmpty:true,
                            color: self.textOption.textColor,
                            change: function(color) {
                                self.optionSetting.textColor = color.toHexString();
                            }
                        });

                        $("#tagColor").spectrum({
                            showInput: true,
                            allowEmpty:true,
                            color: self.textOption.color,
                            showAlpha: true,
                            change: function(color) {
                                var c = color.toRgb();
                                self.optionSetting.color = "rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")";
                            }
                        });


                        $("#tagStrokeColor").spectrum({
                            showInput: true,
                            allowEmpty:true,
                            color: self.textOption.strokeColor,
                            showAlpha: true,
                            change: function(color) {
                                var c = color.toRgb();
                                self.optionSetting.strokeColor = "rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")";
                            }
                        });
                        self.optionSetting.text = self.textOption.text;
                        self.optionSetting.textColor = self.textOption.textColor;
                        self.optionSetting.fontSize = self.textOption.textFont.split(" ")[1].replace("px","");
                        self.optionSetting.color = self.textOption.color;
                        self.optionSetting.strokeColor = self.textOption.strokeColor;
                        self.option = self.textOption;
                        $("#textOptionModal").unbind("shown.bs.modal");
                        $("#textOptionModal").on("shown.bs.modal", function (e) {
                            CanvasTag().render("textOptionContainer",self.option);
                        });

                    },
                    optionSetting: {
                        handler: function(){
                            this.option.text = this.optionSetting.text;
                            this.option.textColor = this.optionSetting.textColor;
                            this.option.textFont = this.textOption.textFont.split(" ")[0] + " " +this.optionSetting.fontSize + "px " + this.textOption.textFont.split(" ")[2];
                            this.option.color = this.optionSetting.color;
                            this.option.strokeColor = this.optionSetting.strokeColor;
                            CanvasTag().render("textOptionContainer",this.option);
                        },
                        deep: true
                    }
                }
            });
            //image配置双向绑定组件
            vue.component('img-option-component',{
                template: formatData.tableAndConfigOfSubGroup(),
                props: ['subGroupOption'],
                data: function(){
                    return {
                        option: '',
                        optionSetting: {
                            subGroupText: '',
                            subGroupTextColor: '',
                            subGroupFontSize: ''
                        }
                    }
                },
                watch: {
                    subGroupOption: function(){
                        var self = this;
                        $("#subGroupTextColor").spectrum({
                            showInput: true,
                            allowEmpty:true,
                            color: self.subGroupOption.textColor,
                            change: function(color){
                                self.optionSetting.subGroupTextColor = color.toHexString();
                            }
                        });
                        self.optionSetting.subGroupText = self.subGroupOption.text;
                        self.optionSetting.subGroupTextColor = self.subGroupOption.textColor;
                        self.optionSetting.subGroupFontSize = self.subGroupOption.textFont.split(" ")[1].replace("px","");
                        self.option = self.subGroupOption;
                        $("#textOptionModal").unbind("shown.bs.modal");
                        $("#textOptionModal").on("shown.bs.modal", function (e)  {
                            CanvasTagOfImage().render("textOptionContainer",'',self.option,false);
                        });
                    },
                    optionSetting: {
                        handler: function(){
                            this.option.text = this.optionSetting.subGroupText;
                            this.option.textColor = this.optionSetting.subGroupTextColor;
                            this.option.textFont = this.subGroupOption.textFont.split(" ")[0] + " " +this.optionSetting.subGroupFontSize+ "px " + this.subGroupOption.textFont.split(" ")[2];
                            CanvasTagOfImage().render("textOptionContainer",'',this.option,false);
                        },
                        deep: true
                    }
                }
            });

            var app = new vue({
                el: '#app',
                data: {
                    backgroundClass: 'background-default',
                    isExpanded: false,
                    isLoader: false,
                    isSaveLoader: 'none',
                    currentActiveIndex: -1,
                    currentSelectedIndex: -1,
                    dangerIndex: -1,
                    helpTip: '请上传组件图片.',
                    isImgLoad: 'none',
                    isChartsLoad: 'none',
                    hideImg: '',
                    isShowImgSetting: false,
                    order: 0,
                    //自定义组件option属性
                    myWidgetOption: '',
                    subGroupText: '',
                    subGroupTextColor: '',
                    subGroupFontSize: '',
                    subGroupImageWidth: '',
                    subGroupImageHeight: '',
                    subGroupFontLocation: '',
                    //“我的图表”和“我的组件”所需动态渲染的数据
                    myCharts: [],
                    mySubGroup: [],
                    //可拖拽模块的配置
                    widgets: [],
                    //选中渲染是否失败
                    // isRenderFail: false,
                    //当前页是否保存
                    isSave:true,
                    //组件参数
                    chartOption: '',
                    textOption: '',
                    subGroupOption: '',
                    //当前渲染组件
                    currentView: '',
                    //是否全屏
                    isAllScreen: false,
                    //自定义组件图片base64编码
                    subGroupBase64: '',
                    //获取从哪一个图表或者组件菜单进入细节设置模态框
                    domId: 0,
                    chartType: '',
                    //是否切换了主题
                    currentTheme: '',
                    renderFailList: [],
                    //每一个图表container的overflow属性
                    scrollType: 'visible',
                    tableCurrentPage: {},
                    currentPage: 1,
                    allSubGroupPage: 0
                },
                methods: {
                    //背景样式切换
                    saveCurrentBackground: function(event){
                        var target = $(event.target);
                        var targetClass = event.target.className.replace("img-thumbnail", "").trim();
                        $.each(target.parent().siblings().find('span'),function (index,obj) {
                            var sibClass = $(obj).attr("class").replace("img-thumbnail", "").trim() || "";
                            if(app.backgroundClass == sibClass){
                                app.backgroundClass = '';
                            }
                        });
                        app.backgroundClass = targetClass;
                        var deferred = $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            url: 'myPanel/crud',
                            data : {
                                exportId : $("#exportId").val(),
                                backgroundClass : targetClass
                            },
                            headers :{
                                oper : 'update'
                            },
                            success: function(){
                                app.isSave = false;
                            }
                        });
                    },
                    //侧边菜单栏显示/隐藏
                    toggleSideMenu: function(){
                        if(app.isExpanded == false){
                            app.isExpanded = true
                        }else {
                            app.isExpanded = false
                        }
                    },
                    //标记当前菜单所选项
                    toggleSecondMenu: function(index){
                        this.currentActiveIndex = index;
                        $(".side-menu .nav .dropdown .collapse").collapse('hide');
                    },
                    //顶部菜单划过动画
                    topMenuMouseEnter: function(index){
                        app.dangerIndex = index;
                    },
                    //自定义控件
                    makeSelfWidget: function(){
                        if($("[name='imgFile']").val() == ""){
                            app.helpTip = '请先选择您要上传的控件背景图';
                        }else {
                            app.isImgLoad = 'block';
                            $.ajax({
                                type: 'POST',
                                url: 'imgToBase64',
                                data: new FormData($("#imgFile")[0]),
                                async: false,
                                cache: false,
                                contentType: false,
                                processData: false,
                                success: function(data){
                                    if(data.imgBase64 == "noFile"){
                                        app.helpTip = "请先选择您要上传的控件背景图";
                                        app.isImgLoad = 'none';
                                    }else if(data.imgBase64 == "noImage"){
                                        app.helpTip = "请上传图片类型文件";
                                        app.isImgLoad = 'none';
                                    }else{
                                        app.hideImg = ['<img src=\'data:image/jpg;base64,'+data.imgBase64+'\' onerror="this.src=\'resources/img/white.jpg\'">'].join("");
                                        setTimeout(function(){
                                            if($("#subGroupContainer").parent().find("img")[0]){
                                                app.isImgLoad = 'none';
                                                var canvasTagOfImage = CanvasTagOfImage().render("subGroupContainer",$("#subGroupContainer").parent().find("img")[0]);
                                                app.isShowImgSetting = true;
                                                app.myWidgetOption = canvasTagOfImage.getOption();
                                                app.subGroupBase64 = data.imgBase64;
                                                //初始化
                                                app.subGroupText = app.myWidgetOption.text;
                                                app.subGroupTextColor = app.myWidgetOption.textColor;
                                                app.subGroupFontSize = app.myWidgetOption.textFont.split(" ")[1].replace('px','');
                                                app.subGroupFontLocation = app.myWidgetOption.textPosition;
                                            }
                                        }, 0);
                                    }
                                },
                                error: function(){
                                    alert("上传失败，请重试！");
                                }
                            });
                        }
                    },
                    //获取所有图表和控件
                    getAllCharts: function(tag){
                        app.allSubGroupPage++;
                        //先置空以防止vue就地复用
                        if(tag == 'init'){
                            app.myCharts = [];
                            app.mySubGroup = [];
                            app.allSubGroupPage = 1;
                        }
                        this.currentSelectedIndex = -1;
                        this.isChartsLoad = 'block';
                        $.ajax({
                            type: 'POST',
                            url: 'selectChartInfo',
                            data: {
                                page: app.allSubGroupPage,
                                pageSize: 10
                            },
                            success: function(response){
                                app.isChartsLoad = 'none';
                                // var myCharts = [];
                                // var mySubGroup = [];
                                for(var i=0;i<response.data.length;i++){
                                    var dataType;
                                    if(parseInt(response.data[i].isRealTime) == 0){
                                        dataType = "引用当前数据库";
                                    }else if(parseInt(response.data[i].isRealTime) == 1){
                                        dataType = "实时获取";
                                    }
                                    if(response.data[i].chartType == 'text:subGroupOfImage'){
                                        app.mySubGroup.push({ chartId: response.data[i].id, base64: "data:image/jpg;base64,"+JSON.parse(response.data[i].jsCode).image});
                                    }else if($.inArray(response.data[i].chartType,['bar','line','pie','table']) != -1){
                                        app.myCharts.push({ chartId: response.data[i].id,chartType: response.data[i].chartType, chartName: response.data[i].chartName, dataType: dataType, imgSrc: "resources/img/"+response.data[i].chartType+"_chart.png" });
                                    }
                                }
                                // app.myCharts = myCharts;
                                // app.mySubGroup = mySubGroup;
                                /**
                                 * 注册图表删除事件
                                 */
                                setTimeout(function(){
                                    $('.deleteOneChart').click(function (event) {
                                        event.stopPropagation();//屏蔽父元素select样式选择
                                    });
                                    $('.deleteOneChart').confirmModal({
                                        confirmTitle     : '提示',
                                        confirmMessage   : '你确定删除该图表？',
                                        confirmOk        : '是的',
                                        confirmCancel    : '取消',
                                        confirmDirection : 'rtl',
                                        confirmStyle     : 'primary',
                                        confirmCallback  : function (target) {
                                            var cid = target.parent().attr('data-cid');
                                            $.ajax({
                                                type: 'POST',
                                                url: 'authority/checkUserAuthority',
                                                data: {
                                                    chartId: cid
                                                },
                                                success: function(data){
                                                    if(data.haveAuthority == true){
                                                        var deferred = $.ajax({
                                                            type: 'POST',
                                                            dataType: 'json',
                                                            url: 'myChart/deleteOneChart',
                                                            data : {
                                                                "chartId": cid
                                                            },
                                                            headers :{
                                                                oper : 'delete'
                                                            }
                                                        });
                                                        deferred.done(function(data){
                                                            if(data.isDelete == true){
                                                                target.parent().remove();//当前面板的图表类型选择框删除
                                                                $.each($('.draggable'),function (index,target) {//删除panel中该图表的div元素
                                                                    if(cid == $(target).attr("chartid")){
                                                                        $(target).remove();
                                                                    }
                                                                });
                                                            }else{
                                                                alert("部分设计面板中使用了本图表，暂不可删除!");
                                                            }
                                                        })
                                                    }else if(data.haveAuthority == false){
                                                        alert("您没有权限！");
                                                    }
                                                }
                                            });
                                        },
                                        confirmDismiss   : true,
                                        confirmAutoOpen  : false
                                    });
                                },0);
                            }
                        });
                    },
                    //图表和控件是否选中
                    select: function(index){
                        if(index == this.currentSelectedIndex){
                            this.currentSelectedIndex = -1;
                        }else {
                            this.currentSelectedIndex = index;
                        }
                    },
                    //图表，组件选中渲染
                    renderSelected: function(type){
                        if( this.currentSelectedIndex != -1 ){
                            var defer = $.ajax({
                                type: 'POST',
                                url: 'selectOneChartInfo',
                                data: "id=" + this.currentSelectedIndex
                            });
                            defer.done(function(data){
                                app.isSave = false;
                                var $targetDiv;
                                if(data.chartType.indexOf("subGroupOfImage") >= 0){
                                    var imgBase64 = JSON.parse(data.jsCode).image;
                                    var option = JSON.parse(data.jsCode);
                                    app.order = app.order + 1;
                                    app.widgets.push({ chartType: 'text:subGroupOfImage',id: app.order,chartId: data.id,width: option.width + 'px',height: option.height + 'px', hideImg: 'data:image/jpg;base64,'+imgBase64, chartName: '' });
                                    setTimeout(function(){
                                        $targetDiv = $("#"+app.order);
                                        option.image = $targetDiv.parent().find("img")[0];
                                        CanvasTagOfImage().render(app.order,"",option,false);
                                        renderMenu.renderMenu($targetDiv,'',app);
                                    }, 0);
                                }else {
                                    app.order = app.order + 1;
                                    var chartTag;
                                    if(data.chartType == 'table'){
                                        chartTag = 'table';
                                    }else {
                                        chartTag = 'chart';
                                    }
                                    app.widgets.push({ chartType: chartTag,id: app.order,chartId: data.id,width: '400px',height: '400px', chartName: data.chartName });
                                    setTimeout(function(){
                                        if(parseInt(data.isRealTime) == 0){
                                            $targetDiv = $("#"+app.order);
                                            if(data.chartType == 'table'){
                                                app.scrollType = 'auto';
                                                // $targetDiv.html(data.jsCode);
                                                app.tableCurrentPage[data.id] = 1;
                                                renderMenu.renderTableInPanel($targetDiv,data,app);
                                            }else {
                                                echarts.init($targetDiv[0]).setOption(JSON.parse(data.jsCode));
                                                app.$nextTick(function(){
                                                    renderMenu.renderMenu($targetDiv, data.chartName, app);
                                                });
                                            }
                                        }else if(parseInt(data.isRealTime) == 1){
                                            $.ajax({
                                                async: false,
                                                type: 'POST',
                                                contentType: "application/json; charset=utf-8",
                                                url: 'render',
                                                data: JSON.stringify({
                                                    'chartType': data.chartType,
                                                    'dataRecordId': data.sqlRecordingId,
                                                    'builderModel': JSON.parse(data.buildModel)
                                                }),
                                                success: function(option){
                                                    $targetDiv = $("#"+app.order);
                                                    var newOption = JSON.parse(data.jsCode);
                                                    newOption.series[0].data = option.series[0].data;
                                                    if('legend' in option){
                                                        newOption.legend.data = option.legend.data;
                                                    }
                                                    if('xAxis' in option){
                                                        newOption.xAxis[0].data = option.xAxis[0].data;
                                                    }
                                                    echarts.init($targetDiv.get(0)).setOption(newOption);
                                                    renderMenu.renderMenu($targetDiv, data.chartName, app);
                                                },
                                                error: function(){
                                                    app.renderFailList.push(app.order);
                                                }
                                            });
                                        }
                                        $(".draggable").niceScroll();
                                    }, 0);
                                }
                            });
                        }
                        if(type == 'mySubGroup'){
                            $("#mySubGroup").modal('toggle');
                        }else if( type == 'myChart' ){
                            $("#myChart").modal('toggle');
                        }
                    },
                    //全屏/取消全屏
                    allScreen: function(){
                        this.isAllScreen = this.isAllScreen == false ? true : false;
                    },
                    //保存并渲染自定义组件
                    renderMySubGroup: function(){
                        if($("#subGroupContainer").attr("zid")){
                            var pzr = zrender.getInstance($("#subGroupContainer").attr("zid"));//原控件
                            var option = $.extend(true, {}, pzr.storage.getShapeList()[0].style);
                            //保存时只能保存图片的base64编码
                            option.image = app.subGroupBase64;
                            var deffer = $.ajax({
                                type: 'POST',
                                url: 'addCharts',
                                data : {
                                    'chartType': "text:subGroupOfImage",
                                    'sqlRecordingId': "0",
                                    'buildModel': JSON.stringify({}),
                                    'jsCode': JSON.stringify(option),
                                    'chartName': "自定义组件"
                                }
                            });
                            deffer.done(function(result){
                                app.order++;
                                app.widgets.push({ id: app.order, chartId: result, chartType: 'text:subGroupOfImage', width: option.width + 'px', height: option.height + 'px', hideImg: 'data:image/jpg;base64,'+app.subGroupBase64 });
                                app.isSave = false;
                                setTimeout(function(){
                                    var $target  = $("#"+app.order);
                                    option.image = $target.parent().find("img")[0];
                                    //渲染时
                                    CanvasTagOfImage().render(app.order,"",option,false);
                                    renderMenu.renderMenu($target,'',app);
                                    //重置模态框
                                    app.isShowImgSetting = false;
                                    $(".fileinput-remove").trigger("click");
                                    $('#subGroupContainer').replaceWith('<div id="subGroupContainer" class="thumbnail" style="width:45%;height:410px;float:left;overflow: auto;border:1px dashed rgb(238,238,238);"></div>');
                                }, 0);
                            });
                        }
                        $("#subGroupModal").modal('toggle');
                    },
                    //主题切换递归运算
                    overloadItemStyle: function(optItem, theme) {
                        for(k in theme) {
                            if(optItem[k] && (typeof theme[k] !== 'object')){
                                delete optItem[k];
                            } else if(typeof theme[k] == 'object') {
                                this.overloadItemStyle(optItem, theme[k]);
                            }
                        }
                    },
                    //修改图表，组件细节后保存
                    saveOptionChange: function(){
                        var domOption;
                        if(this.chartType.indexOf('text') >= 0){
                            //id为domId div的zid
                            var domZid = $("#"+this.domId).attr("zid");
                            var domPzr = zrender.getInstance(domZid);//原控件
                            domOption = $.extend(true, {}, domPzr.storage.getShapeList()[0].style);
                            //id为textOptionContainer div的zid
                            var zid = $("#textOptionContainer").attr("zid");
                            var pzr = zrender.getInstance(zid);//原控件
                            var option = $.extend(true, {}, pzr.storage.getShapeList()[0].style);
                            if(this.chartType.indexOf("subGroupOfImage") < 0){
                                domOption.text =  option.text;
                                domOption.textColor = option.textColor;
                                domOption.textFont = option.textFont;
                                domOption.color = option.color;
                                domOption.strokeColor = option.strokeColor;
                                //文字组件不存在复用，不保存到T_MY_CHARTS表中
                                var index= this.order - 1;
                                this.widgets[index].option = domOption;
                                // domPzr.storage.getShapeList()[0].style = domOption;
                                CanvasTag().render(this.domId,domOption);
                                renderMenu.renderMenu($("#" + this.domId),'',app);
                                // domPzr.refresh();
                            }else {
                                domOption.text = option.text;
                                domOption.textColor = option.textColor;
                                domOption.textFont = option.textFont;
                                //不能直接把option给domPzr实例，有些属性不能同步，例如画布宽高
                                // domPzr.storage.getShapeList()[0].style = domOption;
                                CanvasTagOfImage().render(this.domId,'',domOption,false);
                                renderMenu.renderMenu($("#"+this.domId),'',app);
                                // domPzr.refresh();
                                // domOption.image = option.image.currentSrc.split(',')[1];
                            }
                        }else if(this.chartType.indexOf('chart') >= 0){
                            var instance = echarts.getInstanceByDom(document.getElementById("optionContainer"));
                            echarts.getInstanceByDom(document.getElementById(this.domId)).setOption(instance.getOption());
                            domOption = instance.getOption();
                        }
                        if(this.chartType.indexOf('subGroupOfImage') >= 0 || this.chartType.indexOf('chart') >= 0){
                            var imageBase64 = '';
                            if(this.chartType.indexOf('subGroupOfImage') >= 0){
                                imageBase64 = domOption.image.currentSrc.split(',')[1];
                            }
                            $.ajax({
                                type: 'POST',
                                url: 'updateChartInfo',
                                headers: {
                                    imgBase64: imageBase64
                                },
                                data: {
                                    'id': $("#"+this.domId).attr("chartId"),
                                    'jsCode': JSON.stringify(domOption)
                                },
                                success: function(){
                                    app.isSave = false;
                                },
                                error: function(){
                                    alert("保存时失败，请重试!");
                                }
                            });
                        }
                    },
                    //保存当前面板图表
                    saveCurrentPanel: function(){
                        this.isLoader = true;
                        this.isSaveLoader = 'block';

                        var arr = window.location.href.split("/");
                        var exportId = $("#exportId").val();
                        var shareHref = arr[0]+"//"+arr[2]+"/"+arr[3]+"/share.page?exportId="+exportId;

                        var widgets = this.widgets;
                        var chartIds = [];          //保存图表id
                        var containerIds = [];           //保存容器id
                        for(var i=0;i<widgets.length;i++) {
                            var chartId = widgets[i].chartId;
                            var containerId = widgets[i].id;
                            if(widgets[i].chartType.indexOf('rectangle') < 0){
                                chartIds.push(chartId);
                                containerIds.push(containerId);
                            }

                            var target = $('#'+containerId);
                            if(widgets[i].width == 0 && widgets[i].height == 0){     //如果已删除，height和width为0
                                this.widgets[i].datax = 0;
                                this.widgets[i].datay = 0
                            }else {
                                if(target.css('transform').toString() == 'none'){     //如果未拖动，css属性transform属性为none
                                    this.widgets[i].datax = 0;
                                    this.widgets[i].datay = 0;
                                }else {
                                    this.widgets[i].datax = typeof($(target).attr('data-x')) == 'undefined' ? target.css('transform').toString().split(',')[4] : $(target).attr('data-x');
                                    this.widgets[i].datay = typeof($(target).attr('data-y')) == 'undefined' ? target.css('transform').toString().split(',')[5].replace(')','') : $(target).attr('data-y');
                                }
                                this.widgets[i].width = target.css('width');
                                this.widgets[i].height = target.css('height');
                            }
                            if(this.currentTheme != '' && widgets[i].chartType.indexOf('text') < 0 && widgets[i].chartType.indexOf('table') < 0){
                                this.widgets[i].themeName = this.currentTheme;
                            }
                        }

                        $.ajax({
                            type: 'POST',
                            url: "panelChartsWrapper/updateWrapper",
                            data: "chartIds="+chartIds+"&containerIds="+containerIds+"&exportId="+exportId
                        });

                        $.ajax({
                            type: 'POST',
                            url: "export",
                            data: {
                                "htmlCode": JSON.stringify(this.widgets),
                                "exportId": exportId,
                                "extraMsg": shareHref
                            },
                            success : function(){
                                app.isSave = true;                           //点击导出后表明已保存
                                app.isLoader = false;
                                app.isSaveLoader = 'none';
                                // location.reload();
                            },
                            error : function(){
                                app.isLoader = false;
                                app.isSaveLoader = 'none';
                                alert("保存失败，请重试！");
                            }
                        });
                    },
                    //改变图表主题
                    changeTheme: function(themeName){
                        this.isSave = false;
                        this.currentTheme = themeName;
                        var widgets = this.widgets;
                        for(var i=0;i<widgets.length;i++) {
                            var target = $("#" + widgets[i].id);
                            var chartName = $(target).find('#chartTitle').text();
                            if (widgets[i].chartType.indexOf("text") < 0 && widgets[i].chartType.indexOf('table') < 0) {
                                var chartOption = echarts.getInstanceByDom($(target)[0]).getOption();
                                echarts.dispose($(target)[0]);
                                echarts.registerTheme(themeName, theme[themeName]);
                                var exportChart = echarts.init($(target)[0], themeName);
                                app.overloadItemStyle(chartOption, theme[themeName]);       // 主题与图表option合并
                                if(chartOption.series[0].type == 'line' || chartOption.series[0].type == 'bar'){
                                    chartOption.xAxis[0].axisLine.lineStyle.color = '#999999';
                                    chartOption.yAxis[0].axisLine.lineStyle.color = '#999999';
                                    chartOption.xAxis[0].axisTick.lineStyle.color = '#999999';
                                    chartOption.yAxis[0].axisTick.lineStyle.color = '#999999';
                                    chartOption.xAxis[0].axisLabel.textStyle.color = '#999999';
                                    chartOption.yAxis[0].axisLabel.textStyle.color = '#999999';
                                }
                                exportChart.setOption(chartOption);
                                renderMenu.renderMenu($(target), chartName, app);
                            }
                        }
                    }
                },
                mounted: function () {
                    //初始化设计面板背景
                    var deferred = $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: 'myPanel/crud',
                        data : {
                            exportId : $("#exportId").val()
                        },
                        headers :{
                            oper : 'query'
                        }
                    });
                    deferred.done(function(data){
                        if(data.myPanel.backgroundClass){
                            app.backgroundClass = data.myPanel.backgroundClass;
                        }
                    });
                    //fileInput初始化
                    $("#input-id").fileinput({
                        language: 'zh',
                        showUpload: false,
                        allowedFileExtensions : ['jpg', 'png','gif']
                    });
                    //颜色选择器初始化(自定义组件)
                    $("#subGroupTextColorMounted").spectrum({
                        showInput: true,
                        allowEmpty:true,
                        color: 'black',
                        change: function(color){
                            app.subGroupTextColor = color.toHexString();
                        }
                    });
                    //初始化拖拽
                    interact('.draggable')
                        .draggable({
                            inertia: true,
                            restrict: {
                                restriction: "#app",
                                endOnly: true,
                                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                            },
                            onmove: function(event){
                                app.isSave = false;
                                var target = event.target,
                                    // keep the dragged position in the data-x/data-y attributes
                                    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                                    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                                // translate the element
                                target.style.webkitTransform =
                                    target.style.transform =
                                        'translate(' + x + 'px, ' + y + 'px)';

                                // update the posiion attributes
                                target.setAttribute('data-x', x);
                                target.setAttribute('data-y', y);
                            }
                        })
                        .resizable({
                            preserveAspectRatio: false,
                            edges: { left: true, right: true, bottom: true, top: true }
                        })
                        .on('resizemove', function (event) {
                            var target = event.target,
                                x = (parseFloat(target.getAttribute('data-x')) || 0),
                                y = (parseFloat(target.getAttribute('data-y')) || 0);

                            // update the element's style
                            target.style.width  = event.rect.width + 'px';
                            target.style.height = event.rect.height + 'px';

                            // translate when resizing from top or left edges
                            x += event.deltaRect.left;
                            y += event.deltaRect.top;

                            target.style.webkitTransform = target.style.transform =
                                'translate(' + x + 'px,' + y + 'px)';

                            target.setAttribute('data-x', x);
                            target.setAttribute('data-y', y);

                            //自适应容器变化
                            app.isSave = false;
                            var chartType = target.getAttribute('charttype');
                            var id = target.getAttribute('id');
                            var zid = target.getAttribute('zid');
                            if(chartType.indexOf("text") >= 0){
                                var zrInstance = zrender.getInstance(zid);
                                var width = parseInt($(target).css('width').replace('px',''));
                                var height = parseInt($(target).css('height').replace('px',''));
                                if(chartType.indexOf("subGroup") >= 0){
                                    zrInstance.storage.getShapeList()[0].style.height = height;
                                    zrInstance.storage.getShapeList()[0].style.width = width;
                                }else {
                                    zrInstance.storage.getShapeList()[0].style.height = height - (height / 4);
                                    zrInstance.storage.getShapeList()[0].style.width = width - (width / 4);
                                }
                                zrInstance.resize();
                            }else if( chartType == 'chart' ){
                                echarts.getInstanceByDom(document.getElementById(id)).resize();
                            }else if( chartType == 'table' ){
                                width = parseInt($(target).css('width').replace('px',''));
                                height = parseInt($(target).css('height').replace('px',''))*0.77;
                                $(target).find('table').css('width', width);
                                $(target).find('table').css('height', height);
                            }
                        });
                    //文字组件初始化
                    $('.background-text-pick-block').draggable({
                        cursor: "move",
                        opacity: 0.7,
                        appendTo :'#app',
                        helper: function (event) {
                            var target = $(this).clone();
                            target.zIndex( 100000000 );
                            target.css('position','absolute');
                            return target;
                        }
                    });
                    $(".app-container").droppable({
                        drop : function (event,ui) {
                            //屏蔽重复拖拽
                            if(ui.draggable.hasClass("background-text-pick-block")) {
                                app.order ++;
                                app.widgets.push({ chartType: 'text:rectangle',id: app.order,width: '400px',height: '100px',datax: (ui.position.left),datay:(ui.position.top) });
                                setTimeout(function(){
                                    CanvasTag().render(app.order);
                                    renderMenu.renderMenu($("#" + app.order),'',app);
                                    $("#"+app.order).css('background-color', 'unset');
                                }, 0);
                            }
                        }
                    });
                    //domId,chartType初始化
                    $("#optionModal").on("show.bs.modal",function(e){
                        app.domId = e.relatedTarget.parentNode.parentNode.parentNode.getAttribute('id');
                        app.chartType = e.relatedTarget.parentNode.parentNode.parentNode.getAttribute('charttype');
                    });
                    $("#textOptionModal").on("show.bs.modal",function(e){
                        app.domId = e.relatedTarget.parentNode.parentNode.parentNode.getAttribute('id');
                        app.chartType = e.relatedTarget.parentNode.parentNode.parentNode.getAttribute('charttype');
                    });
                    //显示面板
                    var chartIds = [];
                    var containerIds = [];
                    // var textIds = [];
                    var initCharts = $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: 'myPanel/crud',
                        data : {
                            exportId : $("#exportId").val()
                        },
                        headers :{
                            oper : 'query'
                        }
                    });
                    initCharts.done(function(data){
                        if(data.myPanel.htmlCode){
                            app.widgets = JSON.parse(data.myPanel.htmlCode);
                            app.$nextTick(function(){
                                app.order = app.widgets.length;
                                for(item in app.widgets){
                                    if(app.widgets[item].chartId){
                                        chartIds.push(app.widgets[item].chartId);
                                        containerIds.push(app.widgets[item].id);
                                    }else {
                                        // textIds.push(app.widgets[item].id);
                                        CanvasTag().render(app.widgets[item].id,app.widgets[item].option);
                                        renderMenu.renderMenu($('#'+app.widgets[item].id),'',app);
                                        $('#'+app.widgets[item].id).css('background-color', 'unset');
                                    }
                                }
                                //查询所有chart的option
                                var defer = $.ajax({
                                    type: 'POST',
                                    url: 'getShareOptions',
                                    data: 'cids='+chartIds
                                });
                                defer.done(function(data) {
                                    var themeName;
                                    var chartNames = [];
                                    for (var i = 0; i < chartIds.length; i++) {
                                        if(app.widgets[i].themeName){
                                            themeName = app.widgets[i].themeName;
                                        }
                                        var target = $('#'+containerIds[i]);
                                        if (data[i].chartType.indexOf("text") < 0) {
                                            var exportChart = echarts.init($(target)[0]);
                                            if (parseInt(data[i].isRealTime) == 0) {
                                                if(data[i].chartType == 'table'){
                                                    app.scrollType = 'auto';
                                                    // $("#"+containerIds[i]).html(data[i].jsCode);
                                                    app.tableCurrentPage[data[i].id] = 1;
                                                    renderMenu.renderTableInPanel(target,data[i],app);

                                                    var menuInfo = [];
                                                    menuInfo.push(target);
                                                    menuInfo.push(data[i].chartName);
                                                    chartNames.push(menuInfo);
                                                }else {
                                                    exportChart.setOption(JSON.parse(data[i].jsCode));
                                                    renderMenu.renderMenu($(target), data[i].chartName, app);
                                                }
                                            } else if (parseInt(data[i].isRealTime) == 1) {
                                                $.ajax({
                                                    async: false,
                                                    type: 'POST',
                                                    contentType: "application/json; charset=utf-8",
                                                    url: 'render',
                                                    data: JSON.stringify({
                                                        'chartType': data[i].chartType,
                                                        'dataRecordId': data[i].sqlRecordingId,
                                                        'builderModel': JSON.parse(data[i].buildModel)
                                                    }),
                                                    success: function (option) {
                                                        var newOption = JSON.parse(data[i].jsCode);        // 若本图表选择数据获取模式为实时获取，
                                                        newOption.series[0].data = option.series[0].data;  // 在渲染时将数据库中的option中的series部分替换为新生成的option的series部分即可
                                                        if ('legend' in option) {
                                                            newOption.legend.data = option.legend.data;
                                                        }
                                                        if ('xAxis' in option) {
                                                            newOption.xAxis[0].data = option.xAxis[0].data;
                                                        }
                                                        exportChart.setOption(newOption);
                                                        renderMenu.renderMenu($(target), data[i].chartName, app);
                                                    },
                                                    error: function () {
                                                        app.renderFailList.push(app.order);
                                                    }
                                                });
                                            }
                                        } else {
                                            if (data[i].chartType.indexOf("subGroupOfImage") >= 0) {
                                                var option = JSON.parse(data[i].jsCode);
                                                option.image = $(target).find("img")[0];
                                                option.width = app.widgets[i].width.replace('px','');
                                                option.height = app.widgets[i].height.replace('px','');
                                                CanvasTagOfImage().render(containerIds[i],"",option,false);
                                                renderMenu.renderMenu($(target),'',app);
                                            }
                                        }
                                    }
                                    app.$nextTick(function(){
                                        //table的menu渲染
                                        // for(var i=0;i<chartNames.length;i++){
                                        //     renderMenu.renderMenu(chartNames[i][0], chartNames[i][1], app);
                                        // }
                                        $(".draggable").niceScroll();
                                    });
                                    //theme
                                    app.changeTheme(themeName);
                                    app.isSave = true;
                                })
                            });
                        }
                        //保存返回图表渲染
                        if(window.location.href.indexOf("chartId") > 0){
                            var chartId = window.location.href.split("=")[2].replace("#","");
                            var defer01 = $.ajax({
                                type: 'POST',
                                url: 'selectOneChartInfo',
                                data: "id="+chartId
                            });
                            defer01.done(function(data){
                                if(data && $('[chartId='+data.id+']').length <= 0) {
                                    app.isSave = false;
                                    app.order = app.order + 1;
                                    var chartTag;
                                    if(data.chartType == 'table'){
                                        chartTag = 'table';
                                    }else {
                                        chartTag = 'chart';
                                    }
                                    app.widgets.push({ chartType: chartTag,id: app.order,chartId: data.id,width: '400px',height: '400px', chartName: data.chartName });
                                    app.$nextTick(function(){
                                        if(parseInt(data.isRealTime) == 0){
                                            if(data.chartType == 'table'){
                                                app.scrollType = 'auto';
                                                // $("#"+app.order).html(data.jsCode);
                                                app.tableCurrentPage[data.id] = 1;
                                                renderMenu.renderTableInPanel($("#"+app.order),data,app);
                                            }else {
                                                echarts.init($("#"+app.order)[0]).setOption(JSON.parse(data.jsCode));
                                                // setTimeout(function(){
                                                    renderMenu.renderMenu($("#"+app.order),data.chartName,app);
                                                // }, 0);
                                            }
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
                                                    echarts.init($("#"+app.order)[0]).setOption(option);
                                                    renderMenu.renderMenu($("#"+app.order),data.chartName,app);
                                                },
                                                error: function(){
                                                    app.renderFailList.push(app.order);
                                                }
                                            });
                                        }
                                        $(".draggable").niceScroll();
                                    })
                                }
                            });
                        }
                    });
                    //窗口关闭监听
                    //关闭窗口时弹出确认提示
                    $(window).bind('beforeunload', function(){
                        // 只有在标识变量is_confirm不为false时，才弹出确认提示
                        if(app.isSave == false)
                            return '您可能有数据没有保存';
                    });
                },
                watch: {
                    subGroupText: function(){
                        this.myWidgetOption.text = this.subGroupText;
                        CanvasTagOfImage().render("subGroupContainer","",this.myWidgetOption);
                    },
                    subGroupTextColor: function(){
                        this.myWidgetOption.textColor = this.subGroupTextColor;
                        CanvasTagOfImage().render("subGroupContainer","",this.myWidgetOption);
                    },
                    subGroupFontSize: function(){
                        this.myWidgetOption.textFont = this.myWidgetOption.textFont.split(" ")[0] + " " +this.subGroupFontSize+ "px " + this.myWidgetOption.textFont.split(" ")[2];
                        CanvasTagOfImage().render("subGroupContainer","",this.myWidgetOption);
                    },
                    subGroupFontLocation: function(){
                        this.myWidgetOption.textPosition = this.subGroupFontLocation;
                        CanvasTagOfImage().render("subGroupContainer","",this.myWidgetOption);
                    },
                    isSave: function(){
                        if(app.isSave == false){
                            $("title").html("*Infovis-Designer");
                        }else if(app.isSave == true) {
                            $("title").html("Infovis-Designer");
                        }
                    }
                }
            });
        });
    });
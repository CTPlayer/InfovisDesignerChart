/**
 * Created by ct on 2016/8/13.
 */
require.config({
    baseUrl: 'resources/js',
    paths: {
        "options": "lib/charts/options",           //图表初始option配置文件
        "formatData": "lib/charts/formatData",
        "jquery": "lib/bootstrap/js/jquery-2.1.4.min",
        "bootstrap": "lib/bootstrap/js/bootstrap.min",
        "jquery-ui": "lib/jquery-ui.min",
        "lodash": "lib/gridstack/js/lodash.min",
        "gridstack": "lib/gridstack/js/gridstack.min",
        "knockout": "lib/knockout/knockout-3.4.0",
        "backbone": "lib/backbone/backbone-min",
        "underscore": "lib/underscore/underscore-min",
        "knockback": "lib/knockback.min",
        "spectrum": "lib/bootstrap/js/spectrum",
        "infovis": "lib/infovis.min",
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
        "echarts": "lib/charts/echarts"
    },
    shim : {
        "bootstrap" : { "deps" :['jquery'] },
        "gridstack" : { "deps" :['bootstrap', 'jquery-ui', 'lodash'] },
        "confirmModal" : { "deps" :['jquery'] },
        "bootstrapFileStyle" : { "deps" :['bootstrap'] }
    },
    waitSeconds: 30
});

/**
 * 覆盖Java Echarts默认生成样式
 */
function overloadItemStyle(optItem, theme) {
    for(k in theme) {
        if(optItem[k] && (typeof theme[k] !== 'object')){
            delete optItem[k];
        } else if(typeof theme[k] == 'object') {
            overloadItemStyle(optItem, theme[k]);
        }
    }
}

require(['jquery','domReady','vue','CanvasTagOfImage','renderMenu','echarts','interact','formatData','CanvasTag','zrender','CanvasTagOfImage',
    'bootstrapFileStyle','spectrum','confirmModal'], function ($,domReady,vue,CanvasTagOfImage,renderMenu,echarts,interact,formatData,CanvasTag,zrender,CanvasTagOfImage) {
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
                        backgroundOpacity: ''
                        // xRotate: '',
                        // yAxisContent: ''
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
            props: ['options'],
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
                options: function(){
                    console.log('first running');
                    var self = this;
                    $("#textColor").spectrum({
                        showInput: true,
                        allowEmpty:true,
                        color: self.options.textColor,
                        change: function(color) {
                            self.optionSetting.textColor = color.toHexString();
                        }
                    });

                    $("#tagColor").spectrum({
                        showInput: true,
                        allowEmpty:true,
                        color: self.options.color,
                        showAlpha: true,
                        change: function(color) {
                            var c = color.toRgb();
                            self.optionSetting.color = "rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")";
                        }
                    });


                    $("#tagStrokeColor").spectrum({
                        showInput: true,
                        allowEmpty:true,
                        color: self.options.strokeColor,
                        showAlpha: true,
                        change: function(color) {
                            var c = color.toRgb();
                            self.optionSetting.strokeColor = "rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + c.a + ")";
                        }
                    });
                    self.optionSetting.text = self.options.text;
                    self.optionSetting.textColor = self.options.textColor;
                    self.optionSetting.fontSize = self.options.textFont.split(" ")[1].replace("px","");
                    self.optionSetting.color = self.options.color;
                    self.optionSetting.strokeColor = self.options.strokeColor;
                    self.option = self.options;
                    $("#textOptionModal").unbind("shown.bs.modal");
                    $("#textOptionModal").on("shown.bs.modal", function (e) {
                        CanvasTag().render("textOptionContainer",self.option);
                    });

                },
                optionSetting: {
                    handler: function(){
                        console.log('running');
                        this.option.text = this.optionSetting.text;
                        this.option.textColor = this.optionSetting.textColor;
                        this.option.textFont = this.options.textFont.split(" ")[0] + " " +this.optionSetting.fontSize + "px " + this.options.textFont.split(" ")[2];
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
            props: ['options'],
            data: function(){
                return {
                    option: '',
                    optionSetting: {
                        subGroupText: '',
                        subGroupTextColor: '',
                        subGroupFontSize: '',
                        subGroupImageWidth: '',
                        subGroupImageHeight: ''
                    }
                }
            },
            watch: {
                options: function(){
                    var self = this;
                    $("#subGroupTextColor").spectrum({
                        showInput: true,
                        allowEmpty:true,
                        color: self.options.textColor,
                        change: function(color){
                            self.optionSetting.subGroupTextColor = color.toHexString();
                        }
                    });
                    self.optionSetting.subGroupText = self.options.text;
                    self.optionSetting.subGroupTextColor = self.options.textColor;
                    self.optionSetting.subGroupFontSize = self.options.textFont.split(" ")[1].replace("px","");
                    self.optionSetting.subGroupImageWidth = self.options.width;
                    self.optionSetting.subGroupImageHeight = self.options.height;
                    self.option = self.options;
                    $("#textOptionModal").unbind("shown.bs.modal");
                    $("#textOptionModal").on("shown.bs.modal", function (e) {
                        CanvasTagOfImage().render("textOptionContainer",'',self.option);
                    });
                },
                optionSetting: {
                    handler: function(){
                        this.option.text = this.optionSetting.subGroupText;
                        this.option.textColor = this.optionSetting.subGroupTextColor;
                        this.option.textFont = this.options.textFont.split(" ")[0] + " " +this.optionSetting.subGroupFontSize+ "px " + this.options.textFont.split(" ")[2];
                        this.option.width = this.optionSetting.subGroupImageWidth;
                        this.option.height = this.optionSetting.subGroupImageHeight;
                        CanvasTagOfImage().render("textOptionContainer",'',this.option);
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
                isRenderFail: false,
                //当前页是否保存
                isSave: true,
                //组件参数
                chartOption: '',
                // textOption: '',
                // subGroupOption: '',
                options: '',
                //当前渲染组件
                currentView: '',
                //是否全屏
                isAllScreen: false,
                //自定义组件图片base64编码
                subGroupBase64: ''
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
                                    app.subGroupText = '';
                                    app.subGroupTextColor = '';
                                    app.subGroupFontSize = '';
                                    app.subGroupImageWidth = '';
                                    app.subGroupImageHeight = '';
                                    app.subGroupFontLocation = 'inside';
                                    app.hideImg = ['<img src=\'data:image/jpg;base64,'+data.imgBase64+'\' onerror="this.src=\'resources/img/white.jpg\'">'].join("");
                                    setTimeout(function(){
                                        if($("#subGroupContainer").parent().find("img")[0]){
                                            app.isImgLoad = 'none';
                                            var canvasTagOfImage = CanvasTagOfImage().render("subGroupContainer",$("#subGroupContainer").parent().find("img")[0]);
                                            app.isShowImgSetting = true;
                                            app.myWidgetOption = canvasTagOfImage.getOption();
                                            app.subGroupBase64 = data.imgBase64;
                                        }
                                    },0);
                                }
                            },
                            error: function(){
                                alert("上传失败，请重试！");
                            }
                        });
                    }
                },
                //获取所有图表和控件
                getAllCharts: function(){
                    this.currentSelectedIndex = -1;
                    this.isChartsLoad = 'block';
                    $.ajax({
                        type: 'POST',
                        url: 'selectChartInfo',
                        success: function(response){
                            app.isChartsLoad = 'none';
                            var myCharts = [];
                            var mySubGroup = [];
                            for(var i=0;i<response.data.length;i++){
                                var dataType;
                                if(parseInt(response.data[i].isRealTime) == 0){
                                    dataType = "引用当前数据库";
                                }else if(parseInt(response.data[i].isRealTime) == 1){
                                    dataType = "实时获取";
                                }
                                if(response.data[i].chartType == 'text:subGroupOfImage'){
                                    mySubGroup.push({ chartId: response.data[i].id, base64: "data:image/jpg;base64,"+JSON.parse(response.data[i].jsCode).image});
                                }else if($.inArray(response.data[i].chartType,['bar','line','ring','pie']) != -1){
                                    myCharts.push({ chartId: response.data[i].id,chartType: response.data[i].chartType, chartName: response.data[i].chartName, dataType: dataType, imgSrc: "resources/img/"+response.data[i].chartType+"_chart.png" });
                                }
                            }
                            app.myCharts = myCharts;
                            app.mySubGroup = mySubGroup;
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
                                                $.each($('.grid-stack-item-content'),function (index,target) {//删除htmlcode中该图表的div元素
                                                    if(cid == $(target).attr("chartid")){
                                                        $(target).parent().remove();
                                                    }
                                                });
                                            }else{
                                                alert("部分设计面板中使用了本图表，暂不可删除!");
                                            }
                                        })
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
                renderSelected: function(){
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
                            app.order ++;
                            app.widgets.push({ chartType: 'text:subGroupOfImage',id: app.order,chartId: data.id,width: option.width,height: option.height, hideImg: 'data:image/jpg;base64,'+imgBase64, chartName: '' });
                            setTimeout(function(){
                                $targetDiv = $("#"+app.order);
                                option.image = $targetDiv.parent().find("img")[0];
                                CanvasTagOfImage().render(app.order,"",option);
                                // renderMenu.renderMenu($targetDiv);
                            }, 0);
                        }else{
                            app.order ++;
                            app.widgets.push({ chartType: 'chart',id: app.order,chartId: data.id,width: 400,height: 400, chartName: data.chartName });
                            setTimeout(function(){
                                if(parseInt(data.isRealTime) == 0){
                                    $targetDiv = $("#"+app.order);
                                    echarts.init($targetDiv[0]).setOption(JSON.parse(data.jsCode));
                                    renderMenu.renderMenu($targetDiv, data.chartName, app);
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
                                            app.isRenderFail = true;
                                        }
                                    });
                                }
                            }, 0);
                        }
                    });
                    $("#myChart").modal('toggle');
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
                        // option.image = app.subGroupBase64;
                        var deffer = $.ajax({
                            type: 'POST',
                            url: 'addCharts',
                            data : {
                                'chartType': "text:subGroupOfImage",
                                'sqlRecordingId': "0",
                                'buildModel': "",
                                'jsCode': JSON.stringify(option),
                                'chartName': "自定义组件"
                            }
                        });
                        deffer.done(function(result){
                            app.order++;
                            app.widgets.push({ id: app.order, chartId: result, chartType: 'text:subGroupOfImage', width: option.width, height: option.height, hideImg: 'data:image/jpg;base64,'+app.subGroupBase64 });
                            setTimeout(function(){
                                var $target  = $("#"+app.order);
                                option.image = $target.parent().find("img")[0];
                                CanvasTagOfImage().render(app.order,"",option);
                                renderMenu.renderMenu($target,'',app);
                            }, 0);
                        });
                    }
                    $("#subGroupModal").modal('toggle');
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
                $("#subGroupTextColor").spectrum({
                    showInput: true,
                    allowEmpty:true,
                    color: this.myWidgetOption.textColor,
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
                        edges: { left: true, right: true, bottom: true, top: true },
                        onresizemove:  function (event) {
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
                        }
                    })
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
                            app.widgets.push({ chartType: 'text:rectangle',id: app.order,width: 400,height: 100,datax: (ui.position.left),datay:(ui.position.top) });
                            setTimeout(function(){
                                CanvasTag().render(app.order);
                                renderMenu.renderMenu($("#" + app.order),'',app);
                            }, 0);
                        }
                    }
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
                subGroupImageWidth: function(){
                    this.myWidgetOption.width = this.subGroupImageWidth;
                    CanvasTagOfImage().render("subGroupContainer","",this.myWidgetOption);
                },
                subGroupImageHeight: function(){
                    this.myWidgetOption.height = this.subGroupImageHeight;
                    CanvasTagOfImage().render("subGroupContainer","",this.myWidgetOption);
                },
                subGroupFontLocation: function(){
                    this.myWidgetOption.textPosition = this.subGroupFontLocation;
                    CanvasTagOfImage().render("subGroupContainer","",this.myWidgetOption);
                },
                isSave: function(){
                    if(app.isSave == false){
                        $("title").html("*Infovis-Designer");
                    }else {
                        $("title").html("Infovis-Designer");
                    }
                }
            }
        });
    });
});

require(['jquery', 'infovis', 'knockout', 'knockback', 'options', 'formatData', 'app/appViewModel', 'renderMenu','CanvasTag','confirmModal','zrender','CanvasTagOfImage',
        'bootstrap', 'gridstack', 'spectrum'],
    function($, infovis, ko, kb, baseOptions, formatData, appViewModel, renderMenu,CanvasTag,confirmModal,zrender,CanvasTagOfImage){
        // $(function() {
        //     $(".navbar-expand-toggle").click(function() {
        //         $(".app-container").toggleClass("expanded");
        //         return $(".navbar-expand-toggle").toggleClass("fa-rotate-90");
        //     });
        //     return $(".navbar-right-expand-toggle").click(function() {
        //         $(".navbar-right").toggleClass("expanded");
        //         return $(".navbar-right-expand-toggle").toggleClass("fa-rotate-90");
        //     });
        // });

        // $(function() {
        //     return $(".side-menu .nav .dropdown").on('show.bs.collapse', function() {
        //         return $(".side-menu .nav .dropdown .collapse").collapse('hide');
        //     });
        // });

        // $(function(){
        //     $(".panel-default").click(function(){
        //         $(".panel-default").removeClass("active");
        //         $(this).addClass("active");
        //     });
        // });

        // $(function () {
        //     $(".side-menu-container").find("li").eq(1).click(function(){
        //         $(".thumbnail").removeClass("selected");
        //     });
        // });

        // $(function(){
        //     $(".navbar-right").children().on('mouseenter mouseleave',function(e){
        //         console.log(e.type);
        //         if(e.type == 'mouseenter'){
        //             $(this).addClass("danger");
        //         }else if(e.type == 'mouseleave'){
        //             $(this).removeClass("danger");
        //         }
        //     });
        // });

        // $(function(){
        //     $("#subGroupModal").find(".btn-success").click(function(){
        //         if($("[name='imgFile']").val() == ""){
        //             $(".help-block").text("请先选择您要上传的控件背景图");
        //         }else{
        //             $("#subGroupContainer").find(".loader-container").css("display", "block");
        //             $.ajax({
        //                 type: 'POST',
        //                 url: 'imgToBase64',
        //                 data: new FormData($("#imgFile")[0]),
        //                 async: false,
        //                 cache: false,
        //                 contentType: false,
        //                 processData: false,
        //                 success: function(data){
        //                     if(data.imgBase64 == "noFile"){
        //                         $(".help-block").text("请先选择您要上传的控件背景图");
        //                         $("#subGroupContainer").find(".loader-container").css("display", "none");
        //                     }else if(data.imgBase64 == "noImage"){
        //                         $(".help-block").text("请上传图片类型文件");
        //                         $("#subGroupContainer").find(".loader-container").css("display", "none");
        //                     }else{
        //                         $("#subGroupContainer").parent().prepend([
        //                             '<img style="display: none" src=\'data:image/jpg;base64,'+data.imgBase64+'\' onerror="this.src=\'resources/img/white.jpg\'">'
        //                         ].join(""));
        //                         var canvasTagOfImage;
        //                         setTimeout(function(){                   //等待一秒保证新的节点已加入
        //                             $("#subGroupContainer").find(".loader-container").css("display", "none");
        //                             canvasTagOfImage = CanvasTagOfImage().render("subGroupContainer",$("#subGroupContainer").parent().find("img")[0]);
        //                             $("#subGroupConfig").children().eq(1).html(formatData.tableAndConfigOfSubGroup());
        //                             ko.cleanNode($("#subGroupConfig").children()[1]);     //解除之前的绑定
        //                             ko.applyBindings(appViewModel.bindTableAndConfigOfSubGroup("subGroupContainer",canvasTagOfImage.getOption(),canvasTagOfImage),$("#subGroupConfig").children()[1]);
        //                         },500);
        //                         window.subGroupBase64 = data.imgBase64;
        //                     }
        //                 },
        //                 error: function(){
        //                     alert("上传失败，请重试！");
        //                 }
        //             });
        //         }
        //     });
        // });

        // $(function(){
        //     window.getAllCharts = function(){
        //         $("#myChart").find(".row").html("");
        //         $("#mySubGroup").find(".row").html("");
        //         $.ajax({
        //            type: 'POST',
        //            url: 'selectChartInfo',
        //            success: function(response){
        //                for(var i=0;i<response.data.length;i++){
        //                    var dataType;
        //                    if(parseInt(response.data[i].isRealTime) == 0){
        //                        dataType = "引用当前数据库";
        //                    }else if(parseInt(response.data[i].isRealTime) == 1){
        //                        dataType = "实时获取";
        //                    }
        //                    if(response.data[i].chartType == 'pie'){
        //                        $("#myChart").find(".row").append('<div class="thumbnail" data-cid="'+response.data[i].id+'" style="width: 200px;height:150px;margin-left: 10px;float: left;position: relative"><img style="height: 100px" src="resources/img/pie_chart.png" alt="...">' +
        //                            '<div class="arrow_top"></div><div class="glyphicon glyphicon-remove deleteOneChart"></div><div class="arrow_left"></div><div class="glyphicon glyphicon-ok"></div><p title="'+response.data[i].chartName+'">'+response.data[i].chartName+'&nbsp;&nbsp;&nbsp;&nbsp;<span class="dataType">'+dataType+'</span></p></div>');
        //                    }else if(response.data[i].chartType == 'line'){
        //                        $("#myChart").find(".row").append('<div class="thumbnail" data-cid="'+response.data[i].id+'" style="width: 200px;height:150px;margin-left: 10px;float: left;position: relative"><img style="height: 100px" src="resources/img/line_chart.png" alt="...">' +
        //                            '<div class="arrow_top"></div><div class="glyphicon glyphicon-remove deleteOneChart"></div><div class="arrow_left"></div><div class="glyphicon glyphicon-ok"></div><p title="'+response.data[i].chartName+'">'+response.data[i].chartName+'&nbsp;&nbsp;&nbsp;&nbsp;<span class="dataType">'+dataType+'</span></p></div>');
        //                    }else if(response.data[i].chartType == 'bar'){
        //                        $("#myChart").find(".row").append('<div class="thumbnail" data-cid="'+response.data[i].id+'" style="width: 200px;height:150px;margin-left: 10px;float: left;position: relative"><img style="height: 100px" src="resources/img/bar_chart.png" alt="...">' +
        //                            '<div class="arrow_top"></div><div class="glyphicon glyphicon-remove deleteOneChart"></div><div class="arrow_left"></div><div class="glyphicon glyphicon-ok"></div><p title="'+response.data[i].chartName+'">'+response.data[i].chartName+'&nbsp;&nbsp;&nbsp;&nbsp;<span class="dataType">'+dataType+'</span></p></div>');
        //                    }else if(response.data[i].chartType == 'ring'){
        //                        $("#myChart").find(".row").append('<div class="thumbnail" data-cid="'+response.data[i].id+'" style="width: 200px;height:150px;margin-left: 10px;float: left;position: relative"><img style="height: 100px" src="resources/img/ring_chart.png" alt="...">' +
        //                            '<div class="arrow_top"></div><div class="glyphicon glyphicon-remove deleteOneChart"></div><div class="arrow_left"></div><div class="glyphicon glyphicon-ok"></div><p title="'+response.data[i].chartName+'">'+response.data[i].chartName+'&nbsp;&nbsp;&nbsp;&nbsp;<span class="dataType">'+dataType+'</span></p></div>');
        //                    }else if(response.data[i].chartType == 'text:subGroupOfImage'){
        //                        var imgBase64 = JSON.parse(response.data[i].jsCode).image;
        //                        $("#mySubGroup").find(".row").append('<div class="thumbnail" data-cid="'+response.data[i].id+'" style="width: 200px;height:150px;margin-left: 10px;float: left;position: relative"><img style="height: 100px" src=\'data:image/jpg;base64,'+imgBase64+'\' alt="...">' +
        //                            '<div class="arrow_top"></div><div class="glyphicon glyphicon-remove deleteOneChart"></div><div class="arrow_left"></div><div class="glyphicon glyphicon-ok"></div><p><span class="dataType"></span></p></div>');
        //                    }
        //                }
        //                $(".thumbnail").click(function(){
        //                    if($(this).hasClass("selected")){
        //                        $(this).removeClass("selected");
        //                    }else{
        //                        $(this).addClass("selected");
        //                    }
        //                });
        //
        //                /**
        //                 * 注册图表删除事件
        //                 */
        //                $('.deleteOneChart').click(function (event) {
        //                    event.stopPropagation();//屏蔽父元素select样式选择
        //                });
        //                $('.deleteOneChart').confirmModal({
        //                    confirmTitle     : '提示',
        //                    confirmMessage   : '你确定删除该图表？',
        //                    confirmOk        : '是的',
        //                    confirmCancel    : '取消',
        //                    confirmDirection : 'rtl',
        //                    confirmStyle     : 'primary',
        //                    confirmCallback  : function (target) {
        //                        var cid = target.parent().attr('data-cid');
        //                        var deferred = $.ajax({
        //                            type: 'POST',
        //                            dataType: 'json',
        //                            url: 'myChart/deleteOneChart',
        //                            data : {
        //                                "chartId": cid
        //                            },
        //                            headers :{
        //                                oper : 'delete'
        //                            }
        //                        });
        //                        deferred.done(function(data){
        //                            if(data.isDelete == true){
        //                                target.parent().remove();//当前面板的图表类型选择框删除
        //                                $.each($('.grid-stack-item-content'),function (index,target) {//删除htmlcode中该图表的div元素
        //                                    if(cid == $(target).attr("chartid")){
        //                                        $(target).parent().remove();
        //                                    }
        //                                });
        //                            }else{
        //                                alert("部分设计面板中使用了本图表，暂不可删除");
        //                            }
        //                        })
        //                    },
        //                    confirmDismiss   : true,
        //                    confirmAutoOpen  : false
        //                });
        //            }
        //         });
        //     };
        //     window.getAllCharts();
        // });

        $(function(){
            var allOptions = baseOptions.makeAllOptions();
            var engine = infovis.init(allOptions || {});

            window.isSave = true;   //记录页面是否有改动
            window.isSaveTheme = false;  //是否保存图表主题

            // var order  = 0;
            //给order赋值，用来在已有面板中继续添加图表时能接着前面已有图表的order顺序
            var containers = $(".grid-stack").children();
            for(var i=0;i<containers.length;i++){
                if($(containers[i]).children().first().attr("id")){
                    order = $(containers[i]).children().first().attr("id");
                }
            }

            // var options = {
            //     float: true,
            //     auto: false,
            //     vertical_margin: 0
            // };
            // $('.grid-stack').gridstack(options);

            var grid = $('.grid-stack').data('gridstack');

            var add_new_widget = function (pagex,pagey,cid) {
                order++;
                var node = {
                    x: pagex,
                    y: pagey,
                    width: 4,
                    height: 4
                };
                var nWidget = grid.add_widget($('<div>'+
                    '<div class="grid-stack-item-content" chartType="chart" ' + 'id="'+ order + '"chartId="' + cid+ '">'+
                    '</div>'+
                    '</div>'),node.x, node.y, node.width, node.height);
            };

            if(window.location.href.indexOf("chartId") > 0){
                var chartId = window.location.href.split("=")[2].replace("#","");
                var defer01 = $.ajax({
                    type: 'POST',
                    url: 'selectOneChartInfo',
                    data: "id="+chartId
                });
                defer01.done(function(data){
                    if(data && $('[chartId='+data.id+']').length <= 0) {
                        $("title").html("*Infovis-Designer");                                     //改动标记
                        window.isSave = false;

                        add_new_widget(0,0,data.id);
                        if(parseInt(data.isRealTime) == 0){
                            engine.chart.init($("#"+order)[0]).setOption(JSON.parse(data.jsCode));
                            renderMenu.renderMenu($("#"+order));
                            $("#"+order).find("#chartTitle").text(data.chartName);
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
                                    engine.chart.init($("#"+order)[0]).setOption(option);
                                    renderMenu.renderMenu($("#"+order));
                                    $("#"+order).find("#chartTitle").text(data.chartName);
                                },
                                error: function(){
                                    $("#"+order).text("当前图表渲染失败，请检查数据库连接是否正常。");
                                    renderMenu.renderFailMenu($("#"+order));
                                }
                            });
                        }
                    }
                });
            }

            // /**
            //  *
            //  * 图表，组件选中渲染方法
            //  * @param selects
            //  */
            // var renderSelected = function(selects){
            //     if($(selects).hasClass("selected")){
            //         var cid = $(selects).attr("data-cid");
            //         var defer02 = $.ajax({
            //             type: 'POST',
            //             url: 'selectOneChartInfo',
            //             data: "id=" + cid
            //         });
            //         defer02.done(function(data){
            //             $("title").html("*Infovis-Designer");                                     //改动标记
            //             window.isSave = false;
            //             if(data.chartType.indexOf("subGroupOfImage") >= 0){
            //                 var imgBase64 = JSON.parse(data.jsCode).image;
            //                 var option = JSON.parse(data.jsCode);
            //                 order++;
            //                 grid.add_widget($('<div>'+
            //                     '<div class="grid-stack-item-content" chartType="text:subGroupOfImage" ' + 'id="'+ order + '"chartId="' + data.id+ '">'+
            //                     '</div>'+
            //                     '</div>'),0, 0,Math.ceil(option.width / 100), Math.ceil(option.height / 65));
            //                 $("#"+order).parent().append([
            //                     '<img style="display: none" src=\'data:image/jpg;base64,'+imgBase64+'\' >'
            //                 ].join(""));
            //                 option.image = $("#"+order).parent().find("img")[0];
            //                 CanvasTagOfImage().render(order,"",option);
            //                 renderMenu.renderMenu($("#"+order));
            //             }else{
            //                 add_new_widget(0,0,data.id);
            //                 if(parseInt(data.isRealTime) == 0){
            //                     engine.chart.init($("#"+order)[0]).setOption(JSON.parse(data.jsCode));
            //                     renderMenu.renderMenu($("#"+order));
            //                     $("#"+order).find("#chartTitle").text(data.chartName);
            //                 }else if(parseInt(data.isRealTime) == 1){
            //                     $.ajax({
            //                         async: false,
            //                         type: 'POST',
            //                         contentType: "application/json; charset=utf-8",
            //                         url: 'render',
            //                         data: JSON.stringify({
            //                             'chartType': data.chartType,
            //                             'dataRecordId': data.sqlRecordingId,
            //                             'builderModel': JSON.parse(data.buildModel)
            //                         }),
            //                         success: function(option){
            //                             var newOption = JSON.parse(data.jsCode);
            //                             newOption.series[0].data = option.series[0].data;
            //                             if('legend' in option){
            //                                 newOption.legend.data = option.legend.data;
            //                             }
            //                             if('xAxis' in option){
            //                                 newOption.xAxis[0].data = option.xAxis[0].data;
            //                             }
            //                             engine.chart.init($("#"+order)[0]).setOption(newOption);
            //                             renderMenu.renderMenu($("#"+order));
            //                             $("#"+order).find("#chartTitle").text(data.chartName);
            //                         },
            //                         error: function(){
            //                             $("#"+order).text("当前图表渲染失败，请检查数据库连接是否正常。");
            //                             renderMenu.renderFailMenu($("#"+order));
            //                         }
            //                     });
            //                 }
            //             }
            //         });
            //     }
            // };

            // $("#myChart").find(".btn-primary").click(function(){
            //     $("#myChart").find(".thumbnail").each(function(){
            //         renderSelected(this);
            //     });
            //     $("#myChart").modal('toggle');
            // });

            $("#mySubGroup").find(".btn-primary").click(function(){
                $("#mySubGroup").find(".thumbnail").each(function(){
                    renderSelected(this);
                });
                $("#mySubGroup").modal('toggle');
                $("#mySubGroup").find(".thumbnail").removeClass("selected");
            });

            // /**
            //  *
            //  * 保存并渲染自定义组建件到设计面板
            //  */
            // $("#subGroupModal").find(".btn-primary").click(function(){
            //     if($("#subGroupContainer").attr("zid")){
            //         var pzr = zrender.getInstance($("#subGroupContainer").attr("zid"));//原控件
            //         var option = $.extend(true, {}, pzr.storage.getShapeList()[0].style);
            //         option.image = window.subGroupBase64;
            //         var deffer = $.ajax({
            //             type: 'POST',
            //             url: 'addCharts',
            //             data : {
            //                 'chartType': "text:subGroupOfImage",
            //                 'sqlRecordingId': "0",
            //                 'buildModel': "",
            //                 'jsCode': JSON.stringify(option),
            //                 'chartName': "自定义组件"
            //             }
            //         });
            //         deffer.done(function(result){
            //             window.getAllCharts();      //自定义组件完成后需要即时更新已有组件库
            //             order++;
            //             grid.add_widget($('<div>'+
            //                 '<div class="grid-stack-item-content" chartType="text:subGroupOfImage" ' + 'id="'+ order + '"chartId="' + result+ '">'+
            //                 '</div>'+
            //                 '</div>'),0, 0,Math.ceil(option.width / 100), Math.ceil(option.height / 65));
            //             $("#"+order).parent().append([
            //                 '<img style="display: none" src=\'data:image/jpg;base64,'+option.image+'\' >'
            //             ].join(""));
            //             option.image = $("#"+order).parent().find("img")[0];
            //             CanvasTagOfImage().render(order,"",option);
            //             renderMenu.renderMenu($("#"+order));
            //         });
            //     }
            //     $("#subGroupModal").modal('toggle');
            //     $("#subGroupModal").find(".modal-body").html(formatData.resetCanvasTagOfImage());
            // });

            /**
             * 自适应容器变化
             */
            $(".grid-stack").on("resizestop",function(event,ui){
                $("title").html("*Infovis-Designer");                                     //改动标记
                window.isSave = false;
                //判断chart类型
                if(ui.element.find("div:eq(0)").attr("chartType").indexOf("text") >= 0){
                    if(ui.element.find("div:eq(0)").attr("chartType").indexOf("subGroup") <= 0){
                        var pzr = zrender.getInstance(ui.element.find("div:eq(0)").attr("zid"));//原控件
                        var option = $.extend(true, {}, pzr.storage.getShapeList()[0].style);
                        CanvasTag().render(ui.element.find("div:eq(0)").attr("id"),option);
                        renderMenu.renderMenu($("#" + ui.element.find("div:eq(0)").attr("id")));
                    }

                }else {
                    var id = ui.element[0].firstChild.getAttribute("id");
                    engine.chart.getInstanceByDom(document.getElementById(id)).resize();
                }
            });

            /**
             * 自适应窗口变化
             */
            window.addEventListener("resize", function () {
                $(".grid-stack-item-content").each(function(index,item){
                    if($(item).attr("chartType").indexOf("text") < 0){
                        engine.chart.getInstanceByDom(item).resize();
                    }
                });
            });

            $(".grid-stack").on("dragstop",function(event,ui){
                $("title").html("*Infovis-Designer");                                     //改动标记
                window.isSave = false;
            });

            /**
             * 保存当前设计面板
             */

            window.saveCurrentPanel = function () {
                $("title").html("Infovis-Designer");

                $(".grid-stack-placeholder").remove();
                $("#fill").parent().remove();

                $(".app-container").addClass("loader");
                $(".loader-container").css("display","block");

                var arr = window.location.href.split("/");
                var exportId = $("#exportId").val();
                var shareHref = arr[0]+"//"+arr[2]+"/"+arr[3]+"/share.page?exportId="+exportId;

                $.ajax({
                    type: 'POST',
                    url: "export",
                    data: {
                        "htmlCode": $(".grid-stack").html().trim(),
                        "exportId": exportId,
                        "extraMsg": shareHref
                    },
                    success : function(){
                        window.isSave = true;                           //点击导出后表明已保存

                        $(".app-container").removeClass("loader");
                        $(".loader-container").css("display","none");
                        location.reload();
                    },
                    error : function(){
                        $(".app-container").removeClass("loader");
                        $(".loader-container").css("display","none");
                        alert("保存失败，请重试！");
                    }
                });

                var containers = $(".grid-stack").children();
                var chartIds = [];          //保存图表id
                var containerIds = [];           //保存容器id
                var chartsInfo = [];        //保存图表option和chartId
                for(var i=0;i<containers.length;i++) {
                    var chartId = $(containers[i]).children().attr("chartId");
                    var containerId = $(containers[i]).children().attr("id");
                    chartIds.push(chartId);
                    containerIds.push(containerId);

                    if(window.isSaveTheme == true && $("#"+containerId).attr('charttype').indexOf('text') < 0){
                        var instance = engine.chart.getInstanceByDom(document.getElementById(containerId));
                        chartsInfo.push({'id' : chartId, 'jsCode' : JSON.stringify(instance.getOption())});
                    }
                }

                $.ajax({
                   type: 'POST',
                   url: "panelChartsWrapper/updateWrapper",
                   data: "chartIds="+chartIds+"&containerIds="+containerIds+"&exportId="+exportId
                });

                if(chartsInfo.length > 0){
                    $.ajax({
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        url: 'updateChartsInfo',
                        data: JSON.stringify(chartsInfo)
                    });
                }
            };

            $("#exportHtml").click(function(){
                window.saveCurrentPanel();
            });

            // 为了防止再次进入以后设计面板时先前的图表不能自定义大小，这里获取先前图表的容器属性，重新添加容器并渲染图表
            var containers = $(".grid-stack").children();

            containers.remove();
            var cids = [];          //保存图表id
            var ids = [];           //保存容器id

            for(var i=0;i<containers.length-1;i++) {
                var x = $(containers[i]).attr("data-gs-x");
                var y = $(containers[i]).attr("data-gs-y");
                var width = $(containers[i]).attr("data-gs-width");
                var height = $(containers[i]).attr("data-gs-height");
                var cid = $(containers[i]).children().attr("chartId");
                var id = $(containers[i]).children().attr("id");
                var chartType = $(containers[i]).children().attr("chartType");
                cids.push(cid);
                ids.push(id);

                if(chartType.indexOf("text") < 0) {
                    grid.add_widget($('<div>' +
                        '<div class="grid-stack-item-content" chartType="chart" ' + 'id="' + id + '"chartId="' + cid + '">' +
                        '</div>' +
                        '</div>'), x, y, width, height);
                }else{
                    grid.add_widget($('<div>'+
                        '<div class="grid-stack-item-content" style="overflow: hidden;" chartType="' + chartType+ '" ' + 'id="'+ id + '"chartId="' + cid + '">'+
                        '</div>'+
                        '</div>'), x, y, width, height);
                }
            }

            var defer03 = $.ajax({
                type: 'POST',
                url: 'getShareOptions',
                data: 'cids='+cids
            });
            defer03.done(function(data){
                for(var i=0;i<cids.length;i++){
                    if(data[i].chartType.indexOf("text") < 0) {
                        var exportChart = engine.chart.init($("#" + ids[i])[0]);
                        if(parseInt(data[i].isRealTime) == 0){
                            var chartOption = JSON.parse(data[i].jsCode);
                            exportChart.setOption(chartOption);
                            renderMenu.renderMenu($("#"+ids[i]));
                            $("#"+ids[i]).find("#chartTitle").text(data[i].chartName);
                        }else if(parseInt(data[i].isRealTime) == 1){
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
                                success: function(option){
                                    var newOption = JSON.parse(data[i].jsCode);        // 若本图表选择数据获取模式为实时获取，
                                    newOption.series[0].data = option.series[0].data;  // 在渲染时将数据库中的option中的series部分替换为新生成的option的series部分即可
                                    if('legend' in option){
                                        newOption.legend.data = option.legend.data;
                                    }
                                    if('xAxis' in option){
                                        newOption.xAxis[0].data = option.xAxis[0].data;
                                    }
                                    exportChart.setOption(newOption);
                                    renderMenu.renderMenu($("#"+ids[i]));
                                    $("#"+ids[i]).find("#chartTitle").text(data[i].chartName);
                                },
                                error: function(){
                                    $("#" + ids[i]).text("当前图表渲染失败，请检查数据库连接是否正常。");
                                    renderMenu.renderFailMenu($("#" + ids[i]));
                                }
                            });
                        }
                    }else{
                        if(data[i].chartType.indexOf("subGroupOfImage") < 0) {
                            CanvasTag().render(ids[i],JSON.parse(data[i].jsCode));
                            renderMenu.renderMenu($("#"+ids[i]));
                        }else{
                            var imgBase64 = JSON.parse(data[i].jsCode).image;
                            var option = JSON.parse(data[i].jsCode);
                            $("#"+ids[i]).parent().append([
                                '<img style="display: none" src=\'data:image/jpg;base64,'+imgBase64+'\' >'
                            ].join(""));
                            option.image = $("#"+ids[i]).parent().find("img")[0];
                            CanvasTagOfImage().render(ids[i],"",option);
                            renderMenu.renderMenu($("#"+ids[i]));
                        }
                    }
                }

                $("#dropdown-theme-choose").find(".nav").find("div").click(function(){
                    window.isSaveTheme = true;
                    for(var i=0;i<cids.length;i++) {
                        if (data[i].chartType.indexOf("text") < 0) {
                            engine.chart.dispose($("#" + ids[i])[0]);
                            var themeName = $(this).attr("class").replace("col-md-6 theme", "").trim();
                            var exportChart = engine.chart.init($("#" + ids[i])[0], themeName);

                            if(parseInt(data[i].isRealTime) == 0){
                                var chartOption = JSON.parse(data[i].jsCode);
                                overloadItemStyle(chartOption, engine.chart.theme[themeName]);       // 主题与图表option合并

                                if(chartOption.series[0].type == 'line' || chartOption.series[0].type == 'bar'){
                                    chartOption.xAxis[0].axisLine.lineStyle.color = '#999999';
                                    chartOption.yAxis[0].axisLine.lineStyle.color = '#999999';
                                    chartOption.xAxis[0].axisTick.lineStyle.color = '#999999';
                                    chartOption.yAxis[0].axisTick.lineStyle.color = '#999999';
                                    chartOption.xAxis[0].axisLabel.textStyle.color = '#999999';
                                    chartOption.yAxis[0].axisLabel.textStyle.color = '#999999';
                                }

                                exportChart.setOption(chartOption);
                                renderMenu.renderMenu($("#"+ids[i]));
                                $("#"+ids[i]).find("#chartTitle").text(data[i].chartName);
                            }else if(parseInt(data[i].isRealTime) == 1){
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
                                    success: function(option){
                                        var newOption = JSON.parse(data[i].jsCode);        // 若本图表选择数据获取模式为实时获取，
                                        newOption.series[0].data = option.series[0].data;                  // 在渲染时将数据库中的option中的series部分替换为新生成的option的series部分即可
                                        if('legend' in option){
                                            newOption.legend.data = option.legend.data;
                                        }
                                        if('xAxis' in option){
                                            newOption.xAxis[0].data = option.xAxis[0].data;
                                        }
                                        overloadItemStyle(newOption, engine.chart.theme[themeName]);       // 主题与图表option合并

                                        if(newOption.series[0].type == 'line' || newOption.series[0].type == 'bar') {
                                            newOption.xAxis[0].axisLine.lineStyle.color = '#999999';
                                            newOption.yAxis[0].axisLine.lineStyle.color = '#999999';
                                            newOption.xAxis[0].axisTick.lineStyle.color = '#999999';
                                            newOption.yAxis[0].axisTick.lineStyle.color = '#999999';
                                            newOption.xAxis[0].axisLabel.textStyle.color = '#999999';
                                            newOption.yAxis[0].axisLabel.textStyle.color = '#999999';
                                        }

                                        exportChart.setOption(newOption);
                                        renderMenu.renderMenu($("#"+ids[i]));
                                        $("#"+ids[i]).find("#chartTitle").text(data[i].chartName);
                                    },
                                    error: function(){
                                        $("#" + ids[i]).text("当前图表渲染失败，请检查数据库连接是否正常。");
                                        renderMenu.renderFailMenu($("#" + ids[i]));
                                    }
                                });
                            }
                        }
                    }
                });
            });

            var domId;
            $("#optionModal").on("show.bs.modal",function(e){
                domId = e.relatedTarget.parentNode.parentNode.parentNode.getAttribute('id');
            });

            $("#optionModal").find(".btn-primary").click(function(){
                $("title").html("*Infovis-Designer");                                     //改动标记
                var instance = engine.chart.getInstanceByDom(document.getElementById("optionContainer"));
                engine.chart.getInstanceByDom(document.getElementById(domId)).setOption(instance.getOption());
                $.ajax({
                   type: 'POST',
                   url: 'updateChartInfo',
                   data: {
                       'id': $("#"+domId).attr("chartId"),
                       'jsCode': JSON.stringify(instance.getOption())
                   },
                   error: function(){
                       alert("保存时失败，请重试!");
                   }
                });
            });

            // 关闭窗口时弹出确认提示
            $(window).bind('beforeunload', function(){
                // 只有在标识变量is_confirm不为false时，才弹出确认提示
                if(window.isSave == false)
                    return '您可能有数据没有保存';
            });


            //左边拖动文本框业务逻辑
            // $('.background-text-pick-block').draggable({
            //     cursor: "move",
            //     opacity: 0.7,
            //     appendTo :'body',
            //     helper: function (event) {
            //         var target = $(this).clone();
            //         target.zIndex( 100000000 );
            //         target.css('position','absolute');
            //         return target;
            //     }
            // });
            // $(".app-container").droppable({
            //     drop : function (event,ui) {
            //         //屏蔽重复拖拽
            //         if(ui.draggable.hasClass("background-text-pick-block")) {
            //             addTextWidget(ui);
            //             var canvasTag = CanvasTag().render(order);
            //             renderMenu.renderMenu($("#" + order));
            //             var deferred = $.ajax({
            //                 type: 'POST',
            //                 url: 'addCharts',
            //                 data : {
            //                     'chartType': "text:" + ui.draggable.find("span").attr('textType'),
            //                     'sqlRecordingId': "0",
            //                     'buildModel': "",
            //                     'jsCode': JSON.stringify(canvasTag.getOption()),
            //                     'chartName': "文字组件"
            //                 }
            //             });
            //             deferred.done(function(result){
            //                 $("#" + order).attr("chartId",result);
            //             })
            //         }
            //     }
            // });
            //
            // var addTextWidget = function (ui) {
            //     order++;
            //     var pagex = (ui.position.left - 60) /  105;
            //     var pagey = (ui.position.top - 60+$(document).scrollTop()) /  70;
            //     var node = {
            //         x: pagex,
            //         y: pagey,
            //         width: 3,
            //         height: 1
            //     };
            //
            //     //获取文字组件子类型
            //     var textType = ui.draggable.find("span").attr('textType');
            //     return grid.add_widget($('<div>'+
            //         '<div class="grid-stack-item-content" style="overflow: hidden;" chartType="text:' + textType+ '" ' + 'id="'+ order + '">'+
            //         '</div>'+
            //         '</div>'),node.x, node.y, node.width, node.height);
            // }
        });
    });
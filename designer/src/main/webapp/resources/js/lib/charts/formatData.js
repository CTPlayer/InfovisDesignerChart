define(function(){    
    var tableAndConfigOfBarAndLine = function(){
        var table = [  '<ul class="nav nav-tabs" role="tablist">',
                           '<li role="presentation" class="active"><a href="#param" data-toggle="tab">配置项</a></li>',
                        '</ul>',
                        '<div class="tab-content">',
                            '<div role="tabpanel" class="tab-pane bhjj" id="param" style="display: block;height:320px;overflow:auto;clear:both;">',
                                '<div>',
                                '<span style="color:#5D5BA8;margin-top;10px;">主标题</span>',
                                '<hr style="margin-top:10px;">',
                                '<form role="form">',
                                '<div class="form-group form-group-sm">',
                                '<label >内容&nbsp;&nbsp;</label>',
                                '<input class="form-control" data-bind="value: titleContent, valueUpdate: \'keyup\'">',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >上边距&nbsp;&nbsp;</label>',
                                '<input type="number" class="form-control" data-bind="value: titleTop, valueUpdate: \'input\'">',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >位置&nbsp;&nbsp;</label>',
                                '<select class="form-control" data-bind="options: titleLeft, value: selectedLeft, valueUpdate: \'keyup\'"></select>',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >字体&nbsp;&nbsp;</label>',
                                '<select class="form-control" data-bind="options: titleFontFamily, value: selectedFontFamily, valueUpdate: \'keyup\'"></select>',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >字号&nbsp;&nbsp;</label>',
                                '<input type="number" class="form-control" data-bind="value: titleFontSize, valueUpdate: \'input\'">',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >粗细&nbsp;&nbsp;</label>',
                                '<select class="form-control" data-bind="options: titleFontWeight, value: selectedFontWeight, valueUpdate: \'keyup\'"></select>',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >风格&nbsp;&nbsp;</label>',
                                '<select class="form-control" data-bind="options: titleFontStyle, value: selectedFontStyle, valueUpdate: \'keyup\'"></select>',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >文字颜色&nbsp;&nbsp;</label>',
                                '<input type="text" id="titleFontColor" data-bind="value: titleFontColor, valueUpdate: \'input\'"/>',
                                '</div>',
                                '</form>',
                                '</div>',
                                '<div>',
                                '<span style="color:#5D5BA8;margin-top;10px;">副标题</span>',
                                '<hr style="margin-top:10px;">',
                                '<form role="form">',
                                '<div class="form-group form-group-sm">',
                                '<label >内容&nbsp;&nbsp;</label>',
                                '<input class="form-control" data-bind="value: subtitleContent, valueUpdate: \'keyup\'">',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >子标题相对于主标题位置&nbsp;&nbsp;</label>',
                                '<select class="form-control" data-bind="options: subtitleLocation, value: subselectedLocation, valueUpdate: \'keyup\'"></select>',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >字体&nbsp;&nbsp;</label>',
                                '<select class="form-control" data-bind="options: subtitleFontFamily, value: subselectedFontFamily, valueUpdate: \'keyup\'"></select>',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >字号&nbsp;&nbsp;</label>',
                                '<input type="number" class="form-control" data-bind="value: subtitleFontSize, valueUpdate: \'input\'">',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >粗细&nbsp;&nbsp;</label>',
                                '<select class="form-control" data-bind="options: subtitleFontWeight, value: subselectedFontWeight, valueUpdate: \'keyup\'"></select>',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >风格&nbsp;&nbsp;</label>',
                                '<select class="form-control" data-bind="options: subtitleFontStyle, value: subselectedFontStyle, valueUpdate: \'keyup\'"></select>',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >文字颜色&nbsp;&nbsp;</label>',
                                '<input type="text" id="subtitleFontColor" data-bind="value: subtitleFontColor, valueUpdate: \'input\'"/>',
                                '</div>',
                                '</form>',
                                '</div>',
                                '<div>',
                                '<span style="color:#5D5BA8;margin-top;10px;">基础</span>',
                                '<hr style="margin-top:10px;">',
                                '<form role="form">',
                                '<div class="form-group form-group-sm">',
                                '<label >是否显示&nbsp;&nbsp;</label>',
                                '<select class="form-control" data-bind="options: tooltipShow, value: selectedToolTipShow, valueUpdate: \'keyup\'"></select>',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >边框颜色&nbsp;&nbsp;</label>',
                                '<input type="text" id="tooltipBorderColor" data-bind="value: tooltipBorderColor, valueUpdate: \'input\'"/>',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >边框宽度&nbsp;&nbsp;</label>',
                                '<input type="number" class="form-control" data-bind="value: tooltipBorderWidth, valueUpdate: \'input\'">',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >背景颜色&nbsp;&nbsp;</label>',
                                '<input type="text" id="tooltipBackgroundColor" data-bind="value: tooltipBackgroundColor, valueUpdate: \'input\'"/>',
                                '</div>',
                                '</form>',
                                '</div>',
                                '<div>',
                                '<span style="color:#5D5BA8;margin-top;10px;">文本样式</span>',
                                '<hr style="margin-top:10px;">',
                                '<form role="form">',
                                '<div class="form-group form-group-sm">',
                                '<label >字体&nbsp;&nbsp;</label>',
                                '<select class="form-control" data-bind="options: tooltipFontFamily, value: selectedToolTipFontFamily, valueUpdate: \'keyup\'"></select>',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >字号&nbsp;&nbsp;</label>',
                                '<input type="number" class="form-control" data-bind="value: tooltipFontSize, valueUpdate: \'input\'">',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >粗细&nbsp;&nbsp;</label>',
                                '<select class="form-control" data-bind="options: tooltipFontWeight, value: selectedToolTipFontWeight, valueUpdate: \'keyup\'"></select>',
                                '</div>',
                                '<div class="form-group form-group-sm">',
                                '<label >文字颜色&nbsp;&nbsp;</label>',
                                '<input type="text" id="tooltipFontColor" data-bind="value: tooltipFontColor, valueUpdate: \'input\'"/>',
                                '</div>',
                                '</form>',
                                '</div>',
                            '</div>',
                        '</div>'].join("");

        return table;
    };

    var tableAndConfigOfPie = function(){
        var table = ['<ul class="nav nav-tabs" role="tablist">',
                    '<li role="presentation" class="active"><a href="#param" data-toggle="tab">配置项</a></li>',
                    '</ul>',
                    '<div class="tab-content">',
                    '<div role="tabpanel" class="tab-pane bhjj" id="param" style="display: block;height:320px;overflow:auto;clear:both;">',
                    '<div>',
                    '<span style="color:#5D5BA8;margin-top;10px;">主标题</span>',
                    '<hr style="margin-top:10px;">',
                    '<form role="form">',
                    '<div class="form-group form-group-sm">',
                    '<label >内容&nbsp;&nbsp;</label>',
                    '<input class="form-control" data-bind="value: titleContent, valueUpdate: \'keyup\'">',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >上边距&nbsp;&nbsp;</label>',
                    '<input type="number" class="form-control" data-bind="value: titleTop, valueUpdate: \'input\'">',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >位置&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: titleLeft, value: selectedLeft, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >字体&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: titleFontFamily, value: selectedFontFamily, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >字号&nbsp;&nbsp;</label>',
                    '<input type="number" class="form-control" data-bind="value: titleFontSize, valueUpdate: \'input\'">',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >粗细&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: titleFontWeight, value: selectedFontWeight, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >风格&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: titleFontStyle, value: selectedFontStyle, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >文字颜色&nbsp;&nbsp;</label>',
                    '<input type="text" id="titleFontColor" data-bind="value: titleFontColor, valueUpdate: \'input\'"/>',
                    '</div>',
                    '</form>',
                    '</div>',
                    '<div>',
                    '<span style="color:#5D5BA8;margin-top;10px;">副标题</span>',
                    '<hr style="margin-top:10px;">',
                    '<form role="form">',
                    '<div class="form-group form-group-sm">',
                    '<label >内容&nbsp;&nbsp;</label>',
                    '<input class="form-control" data-bind="value: subtitleContent, valueUpdate: \'keyup\'">',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >子标题相对于主标题位置&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: subtitleLocation, value: subselectedLocation, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >字体&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: subtitleFontFamily, value: subselectedFontFamily, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >字号&nbsp;&nbsp;</label>',
                    '<input type="number" class="form-control" data-bind="value: subtitleFontSize, valueUpdate: \'input\'">',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >粗细&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: subtitleFontWeight, value: subselectedFontWeight, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >风格&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: subtitleFontStyle, value: subselectedFontStyle, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >文字颜色&nbsp;&nbsp;</label>',
                    '<input type="text" id="subtitleFontColor" data-bind="value: subtitleFontColor, valueUpdate: \'input\'"/>',
                    '</div>',
                    '</form>',
                    '</div>',
                    '<div>',
                    '<span style="color:#5D5BA8;margin-top;10px;">提示框</span>',
                    '<hr style="margin-top:10px;">',
                    '<form role="form">',
                    '<div class="form-group form-group-sm">',
                    '<label >是否显示&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: tooltipShow, value: selectedToolTipShow, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >边框颜色&nbsp;&nbsp;</label>',
                    '<input type="text" id="tooltipBorderColor" data-bind="value: tooltipBorderColor, valueUpdate: \'input\'"/>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >边框宽度&nbsp;&nbsp;</label>',
                    '<input type="number" class="form-control" data-bind="value: tooltipBorderWidth, valueUpdate: \'input\'">',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >背景颜色&nbsp;&nbsp;</label>',
                    '<input type="text" id="tooltipBackgroundColor" data-bind="value: tooltipBackgroundColor, valueUpdate: \'input\'"/>',
                    '</div>',
                    '</form>',
                    '</div>',
                    '<div>',
                    '<span style="color:#5D5BA8;margin-top;10px;">提示框样式</span>',
                    '<hr style="margin-top:10px;">',
                    '<form role="form">',
                    '<div class="form-group form-group-sm">',
                    '<label >字体&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: tooltipFontFamily, value: selectedToolTipFontFamily, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >字号&nbsp;&nbsp;</label>',
                    '<input type="number" class="form-control" data-bind="value: tooltipFontSize, valueUpdate: \'input\'">',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >粗细&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: tooltipFontWeight, value: selectedToolTipFontWeight, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >文字颜色&nbsp;&nbsp;</label>',
                    '<input type="text" id="tooltipFontColor" data-bind="value: tooltipFontColor, valueUpdate: \'input\'"/>',
                    '</div>',
                    '</form>',
                    '</div>',
                    '<div>',
                    '<span style="color:#5D5BA8;margin-top;10px;">图例项</span>',
                    '<hr style="margin-top:10px;">',
                    '<form role="form">',
                    '<div class="form-group form-group-sm">',
                    '<label >图标间距&nbsp;&nbsp;</label>',
                    '<input type="number" class="form-control" data-bind="value: legendItemGap, valueUpdate: \'input\'">',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >图标样式&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: legendIcon, value: selectedLegendIcon, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >字体&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: legendFontFamily, value: selectedLegendFontFamily, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >字号&nbsp;&nbsp;</label>',
                    '<input type="number" class="form-control" data-bind="value: legendFontSize, valueUpdate: \'input\'">',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >粗细&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: legendFontWeight, value: selectedLegendFontWeight, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >文字颜色&nbsp;&nbsp;</label>',
                    '<input type="text" id="legendFontColor" data-bind="value: legendFontColor, valueUpdate: \'input\'"/>',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >上边距&nbsp;&nbsp;</label>',
                    '<input type="number" class="form-control" data-bind="value: legendTop, valueUpdate: \'input\'">',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >左边距&nbsp;&nbsp;</label>',
                    '<input type="number" class="form-control" data-bind="value: legendLeft, valueUpdate: \'input\'">',
                    '</div>',
                    '<div class="form-group form-group-sm">',
                    '<label >布局方式&nbsp;&nbsp;</label>',
                    '<select class="form-control" data-bind="options: legendOrient, value: selectedLegendOrient, valueUpdate: \'keyup\'"></select>',
                    '</div>',
                    '</form>',
                    '</div>',
                '</div>',
            '</div>'].join("");

        return table;
    }
                    
	return {
        tableAndConfigOfBarAndLine : tableAndConfigOfBarAndLine,
        tableAndConfigOfPie : tableAndConfigOfPie
	};
});
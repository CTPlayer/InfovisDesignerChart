/*************************************************************************
 * Copyright (C) Unpublished JiuDaoTech Software, Inc. All rights reserved.
 * JiuDaoTech Software, Inc., Confidential and Proprietary.
 * <p>
 * This software is subject to copyright protection
 * under the laws of the Public of China and other countries.
 * <p>
 * Unless otherwise explicitly stated, this software is provided
 * by JiuDaoTech "AS IS".
 *************************************************************************/
package service.chart.line.echarts;

import com.github.abel533.echarts.Option;
import com.github.abel533.echarts.axis.Axis;
import com.github.abel533.echarts.axis.CategoryAxis;
import com.github.abel533.echarts.axis.ValueAxis;
import com.github.abel533.echarts.code.Trigger;
import com.github.abel533.echarts.series.Series;
import model.chart.ChartBuilderParams;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.Transformer;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import service.chart.ChartOption;
import service.chart.ChartsUtil;
import service.system.helper.DataSetProvider;

import javax.annotation.Resource;
import java.util.*;

/**
 * 标准折线图实现
 *
 * @author CSJ
 */
@Service
public class Line implements ChartOption {

    @Resource
    private DataSetProvider dataSetProvider;

    @Resource
    private ChartsUtil chartsUtil;

    @Override
    public Option transform(final ChartBuilderParams chartBuilderParams) throws Exception {

        List<Map<String, Object>> dataSet = dataSetProvider.prepareDataSet(chartBuilderParams);

        dataSet = chartsUtil.dataGroupBy(chartBuilderParams,dataSet,"line");
        chartsUtil.dataFilter(dataSet,chartBuilderParams,"line");
        // 拆分数据, 结构化
        Option option = new Option();
        // backgroundColor
        option.backgroundColor("white");
        // title
        option.title("标题", "副标题");
        // tooltip
        option.tooltip().trigger(Trigger.axis);
        //legend
        option.legend().data().addAll(chartBuilderParams.getBuilderModel().getyAxis());
        // xAxis
        final Axis axis = new CategoryAxis();
        Collection<Map<String, Object>> xAxisData = CollectionUtils.collect(dataSet, new Transformer<Map<String, Object>, Map<String, Object>>() {
            @Override
            public Map<String, Object> transform(Map<String, Object> input) {
                Object obj = input.get(chartBuilderParams.getBuilderModel().getxAxis().get(0));
                LinkedHashMap<String, Object> category = new LinkedHashMap<>();
                if (obj != null && StringUtils.isNoneEmpty(obj.toString())) {
                    category.put("value", String.valueOf(obj));
                }
                return category;
            }
        });
        axis.data().addAll(xAxisData);
        option.xAxis().add(axis);
        option.yAxis().add(new ValueAxis());
        // series
        List<Series> list = new ArrayList<>();
        for(final int[] i = {0};i[0] < chartBuilderParams.getBuilderModel().getyAxis().size();i[0]++){
            Series series = new com.github.abel533.echarts.series.Line();
            Collection<Object> seriesData = CollectionUtils.collect(dataSet, new Transformer<Map<String, Object>, Object>() {
                @Override
                public Object transform(Map<String, Object> input) {
                    Object v = input.get(chartBuilderParams.getBuilderModel().getyAxis().get(i[0]));
                    return v;
                }
            });
            series.setName(chartBuilderParams.getBuilderModel().getyAxis().get(i[0]));
            series.data().addAll(seriesData);
            list.add(series);
        }
        option.series(list);

        return option;
    }
}

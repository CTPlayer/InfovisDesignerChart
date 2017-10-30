package service.chart.common.echarts;

import common.util.TemplateUtil;
import model.chart.ChartBuilderParams;
import model.chart.FilterModel;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.Transformer;
import org.springframework.stereotype.Service;
import service.chart.ChartsUtil;
import service.system.helper.DataSetProvider;

import javax.annotation.Resource;
import java.util.*;

/**
 * Created by ct on 2016/10/13.
 */
@Service
public class CommonUtilImpl implements ChartsUtil {

    @Resource
    private DataSetProvider dataSetProvider;

    @Override
    public List<Map<String, Object>> getFilterResult(final ChartBuilderParams chartBuilderParams) throws Exception {
//        List<Map<String, Object>> dataSet = dataSetProvider.prepareDataSet(chartBuilderParams);
//        Collection<Object> filterResult = CollectionUtils.collect(dataSet, new Transformer<Map<String, Object>, Object>() {
//            @Override
//            public Object transform(Map<String, Object> input) {
//                Map<String, Object> transformData = new HashMap<>();
//                for(int i=0;i<chartBuilderParams.getBuilderModel().getFilter().size();i++){
//                    Object v = input.get(chartBuilderParams.getBuilderModel().getFilter().get(i));
//                    transformData.put(chartBuilderParams.getBuilderModel().getFilter().get(i), v);
//                }
//                return transformData;
//            }
//        });
        List<Map<String, Object>> dataSet = dataSetProvider.prepareDataSetForFilter(chartBuilderParams);
        return dataSet;
    }

    @Override
    public void dataFilter(List<Map<String, Object>> dataSet, ChartBuilderParams chartBuilderParams, String chartType) throws Exception {
        switch (chartType){
            case "bar" :
            case "line" :
                List<String> aAxis = chartBuilderParams.getBuilderModel().getxAxis();
                List<String> yAxis = chartBuilderParams.getBuilderModel().getyAxis();
                if(chartBuilderParams.getBuilderModel().getFilter() != null) {
                    for (int i = 0; i < chartBuilderParams.getBuilderModel().getFilter().size(); i++) {
                        String filterName = "";   //当前所过滤的字段
                        String filter = chartBuilderParams.getBuilderModel().getFilter().get(i);
                        Set<String> set = TemplateUtil.genObjFormJson(filter, Map.class).keySet();
                        for (String s : set) {
                            filterName = s;
                        }
                        if (aAxis.contains(filterName)) {
                            for (int j = 0; j < dataSet.size(); j++) {
                                if (!TemplateUtil.genObjFormJson(filter, Map.class).get(filterName).toString().contains(dataSet.get(j).get(filterName).toString())) {
                                    dataSet.remove(j);
                                    j--;
                                }
                            }
                        } else if (yAxis.contains(filterName)) {
                            String[] area = TemplateUtil.genObjFormJson(filter, Map.class).get(filterName).toString().split(",");
                            int min = Integer.parseInt(area[0]);
                            int max = Integer.parseInt(area[1]);
                            for (int k = 0; k < dataSet.size(); k++) {
                                int value = Integer.parseInt(dataSet.get(k).get(filterName).toString());
                                if (value < min || value > max) {
                                    dataSet.remove(k);
                                    k--;
                                }
                            }
                        }
                    }
                }
                break;
            case "pie" :
                String color = chartBuilderParams.getBuilderModel().getMark().getColor();
                String angle = chartBuilderParams.getBuilderModel().getMark().getAngle();
                if(chartBuilderParams.getBuilderModel().getFilter() != null){
                    for(int i=0;i<chartBuilderParams.getBuilderModel().getFilter().size();i++){
                        String filterName = "";   //当前所过滤的字段
                        String filter = chartBuilderParams.getBuilderModel().getFilter().get(i);
                        Set<String> set = TemplateUtil.genObjFormJson(filter,Map.class).keySet();
                        for(String s:set){
                            filterName = s;
                        }
                        if(color.equals(filterName)){
                            for(int j=0;j<dataSet.size();j++){
                                if(!TemplateUtil.genObjFormJson(filter,Map.class).get(filterName).toString().contains(dataSet.get(j).get(filterName).toString())){
                                    dataSet.remove(j);
                                    j--;
                                }
                            }
                        }else if(angle.equals(filterName)){
                            String[] area = TemplateUtil.genObjFormJson(filter,Map.class).get(filterName).toString().split(",");
                            int min = Integer.parseInt(area[0]);
                            int max = Integer.parseInt(area[1]);
                            for(int k=0;k<dataSet.size();k++){
                                int value = Integer.parseInt(dataSet.get(k).get(filterName).toString());      //当前角度值
                                if(value < min || value > max){
                                    dataSet.remove(k);
                                    k--;
                                }
                            }
                        }
                    }
                }
                break;
            case "table":
                List<String> text = chartBuilderParams.getBuilderModel().getxAxis();
                List<String> number = chartBuilderParams.getBuilderModel().getyAxis();
                List<FilterModel> filterModels = chartBuilderParams.getBuilderModel().getFilterModels();
                for(FilterModel filterModel : filterModels){
                    for(int i=0;i<dataSet.size();i++){
                        if("text".equals(filterModel.getColumnType())){
                            boolean isContain = false;
                            for(String columnValue : filterModel.getValue()){
                                if(columnValue.equals(dataSet.get(i).get(filterModel.getColumn()))){
                                    isContain = true;
                                }
                            }
                            if(!isContain){
                                dataSet.remove(i);
                                i--;
                            }
                        }else if("number".equals(filterModel.getColumnType())){
                            int value = Integer.parseInt(dataSet.get(i).get(filterModel.getColumn()).toString());
                            if(value < filterModel.getMin() || value > filterModel.getMax()){
                                dataSet.remove(i);
                                i--;
                            }
                        }
                    }
                }
                break;
        }
    }

    @Override
    public List<Map<String, Object>> getChartResult(final ChartBuilderParams chartBuilderParams) throws Exception {
        List<Map<String, Object>> dataSet = dataSetProvider.prepareDataSet(chartBuilderParams);
        return dataSet;
    }

    @Override
    public List<Map<String, Object>> dataGroupBy(ChartBuilderParams chartBuilderParams, List<Map<String, Object>> dataSet,String chartType) throws Exception {
        List<Map<String, Object>> newDataSet = new ArrayList<>();
        List<String> xAxis = new ArrayList<>();
        List<String> yAxis = new ArrayList<>();
        if(chartType == "bar" || chartType == "line"){
            if(chartBuilderParams.getBuilderModel().getxAxis().size() > 0){
                xAxis = chartBuilderParams.getBuilderModel().getxAxis();
            }
            if(chartBuilderParams.getBuilderModel().getyAxis().size() > 0){
                yAxis = chartBuilderParams.getBuilderModel().getyAxis();
            }
        }else if(chartType == "pie"){
            xAxis.add(chartBuilderParams.getBuilderModel().getMark().getColor());
            yAxis.add(chartBuilderParams.getBuilderModel().getMark().getAngle());
        }
        if(xAxis.size() > 0 && yAxis.size() > 0){
            String xValue = "";
            Integer yValue = 0;
            LinkedHashMap<String, List<Integer>> map = new LinkedHashMap<>();
            for(Map<String, Object> data : dataSet){
                if(data.containsKey(xAxis.get(0))){
                    Object object = data.get(xAxis.get(0));
                    xValue = object == null ? "null" : data.get(xAxis.get(0)).toString();
                    List<Integer> yValues = new ArrayList<>();
                    for(int i=0;i<yAxis.size();i++){
                        yValues.add(0);
                        object = data.get(yAxis.get(i));
                        String yValueStr = object == null ? "0" : data.get(yAxis.get(i)).toString();
                        yValue = Integer.parseInt(yValueStr.indexOf(".") > 0 ? yValueStr.split("\\.")[0] : yValueStr);
                        if(map.containsKey(xValue)){
                            yValue = yValue + map.get(xValue).get(i);
                        }
                        yValues.set(i, yValue);
                        map.put(xValue,yValues);
                    }
                }
            }
            for(String key:map.keySet()){
                LinkedHashMap<String, Object> newMap = new LinkedHashMap<>();
                newMap.put(xAxis.get(0),key);
                for(int i=0;i<yAxis.size();i++){
                    newMap.put(yAxis.get(i), map.get(key).get(i));
                }
                newDataSet.add(newMap);
            }
        }
        return newDataSet;
    }
}

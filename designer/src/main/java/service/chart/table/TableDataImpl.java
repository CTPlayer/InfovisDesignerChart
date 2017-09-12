package service.chart.table;

import model.chart.ChartBuilderParams;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.Transformer;
import org.apache.commons.collections4.map.LinkedMap;
import org.springframework.stereotype.Service;
import service.chart.TableData;
import service.system.helper.DataSetProvider;

import javax.annotation.Resource;
import java.util.*;

/**
 * @author CTPlayer
 * @since 2017/9/12 23:30
 */
@Service
public class TableDataImpl implements TableData {

    @Resource
    private DataSetProvider dataSetProvider;

    @Override
    public Map<String, Object> getTableData(final ChartBuilderParams chartBuilderParams) throws Exception {
        Map<String, Object> map = new HashMap<>();
        ArrayList list = (ArrayList) dataSetProvider.prepareDataSetForTable(chartBuilderParams);
        List<Map<String, Object>> dataSet = (List<Map<String, Object>>) list.get(0);
        Collection<Map<String, Object>> data = CollectionUtils.collect(dataSet, new Transformer<Map<String, Object>, Map<String, Object>>() {
            @Override
            public Map<String, Object> transform(Map<String, Object> input) {
                LinkedMap<String, Object> map = new LinkedMap<>();
                List<String> list = chartBuilderParams.getBuilderModel().getxAxis();
                for(int i=0;i<list.size();i++){
                    Object obj = input.get(list.get(i));
                    if(obj != null){
                        map.put(list.get(i), String.valueOf(obj));
                    }
                }
                List<String> list2 = chartBuilderParams.getBuilderModel().getyAxis();
                for(int i=0;i<list2.size();i++){
                    Object obj = input.get(list2.get(i));
                    if(obj != null){
                        map.put(list2.get(i), String.valueOf(obj));
                    }
                }
                return map;
            }
        });

        map.put("data", data);
        map.put("totalPages", list.get(1));
        map.put("totalCount", list.get(2));
        return map;
    }
}

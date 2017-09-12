package service.system.impl;

import model.chart.ChartBuilderParams;
import model.database.JdbcProps;
import org.springframework.stereotype.Service;
import service.system.SqlEditService;

import java.util.ArrayList;
import java.util.List;

/**
 * sql查询处理（sum, groupBy）
 * Created by 10562 on 2017/7/11.
 */
@Service("sqlEditService")
public class SqlEditServiceImpl implements SqlEditService {
    @Override
    public String groupBySql(ChartBuilderParams chartBuilderParams, String sql) {
        List<String> xAxis = new ArrayList<>();
        if (chartBuilderParams.getChartType() == ChartBuilderParams.ChartType.pie) {
            xAxis.add(chartBuilderParams.getBuilderModel().getMark().getColor());
        }else {
            xAxis = chartBuilderParams.getBuilderModel().getxAxis();
        }

        if(xAxis.size() > 0){
            sql = sql + " group by ";
            for(int i=0;i<xAxis.size();i++){
                if(i == 0){
                    sql = sql + xAxis.get(i);
                }else {
                    sql = sql + "," + xAxis.get(i);
                }
            }
        }
        return sql;
    }
}

package service.system;

import model.chart.ChartBuilderParams;
import model.database.JdbcProps;

/**
 * Created by ct on 2017/7/11.
 */
public interface SqlEditService {
    String groupBySql(ChartBuilderParams chartBuilderParams, String sql);
}

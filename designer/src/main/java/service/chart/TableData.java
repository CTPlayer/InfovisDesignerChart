package service.chart;

import model.chart.ChartBuilderParams;

import java.util.Map;

/**
 * @author CTPlayer
 * @since 2017/9/12 23:27
 */
public interface TableData {
    Map<String, Object> getTableData(final ChartBuilderParams chartBuilderParams) throws Exception;
}

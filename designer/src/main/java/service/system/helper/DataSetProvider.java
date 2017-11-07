/************************************************************************
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ************************************************************************/
package service.system.helper;

import model.chart.ChartBuilderParams;
import model.chart.FilterModel;
import model.connectionManage.ConnectionManage;
import model.connectionManage.SqlRecordingManage;
import model.database.JdbcProps;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import service.connectionManage.ConnectionManageService;
import service.connectionManage.SqlRecordingManageService;
import service.system.SqlEditService;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 数据集采集辅助类
 *
 * @author CSJ
 */
@Component
public final class DataSetProvider {
    private static final Logger L = LoggerFactory.getLogger(DataSetProvider.class);

    @Resource
    private SqlRecordingManageService sqlRecordingManageService;

    @Resource
    private ConnectionManageService connectionManageService;

    @Resource
    private DataBaseMetadataHelper dataBaseMetadataHelper;

    public List<Map<String, Object>> prepareDataSet(ChartBuilderParams chartBuilderParams) throws Exception {

        SqlRecordingManage sqlRecordingManage = new SqlRecordingManage();
        sqlRecordingManage.setId(chartBuilderParams.getDataRecordId());
        sqlRecordingManage = sqlRecordingManageService.queryAsObject(sqlRecordingManage);

        ConnectionManage connectionManage = new ConnectionManage();
        connectionManage.setId(sqlRecordingManage.getConnectionId());
        connectionManage = connectionManageService.queryAsObject(connectionManage);

        JdbcProps jdbcProps = new JdbcProps();
        jdbcProps.setSql(sqlRecordingManage.getSqlRecording());
        jdbcProps.setUrl(connectionManage.getDbUrl());
        jdbcProps.setUsername(connectionManage.getUserName());
        jdbcProps.setPassword(connectionManage.getPassword());

        L.info("执行查询语句: {}", jdbcProps.getSql());

        return dataBaseMetadataHelper.prepareDataSet(jdbcProps);

    }

    /**
     * 构建table数据
     * @param chartBuilderParams
     * @return
     * @throws Exception
     */
    public List<Map<String, Object>> prepareDataSetForTable(ChartBuilderParams chartBuilderParams) throws Exception {
        SqlRecordingManage sqlRecordingManage = new SqlRecordingManage();
        sqlRecordingManage.setId(chartBuilderParams.getDataRecordId());
        sqlRecordingManage = sqlRecordingManageService.queryAsObject(sqlRecordingManage);

        ConnectionManage connectionManage = new ConnectionManage();
        connectionManage.setId(sqlRecordingManage.getConnectionId());
        connectionManage = connectionManageService.queryAsObject(connectionManage);

        JdbcProps jdbcProps = new JdbcProps();
        jdbcProps.setSql(sqlRecordingManage.getSqlRecording());
        jdbcProps.setUrl(connectionManage.getDbUrl());
        jdbcProps.setUsername(connectionManage.getUserName());
        jdbcProps.setPassword(connectionManage.getPassword());

        //分页
        if(chartBuilderParams.isPageOrNo()){
            jdbcProps.setPaging(true);
            jdbcProps.setPage(chartBuilderParams.getPage());
            jdbcProps.setPageSize(chartBuilderParams.getPageSize());
        }else {
            jdbcProps.setPaging(false);
        }

        //按字段排序
        if(chartBuilderParams.getSidx() != null && !"".equals(chartBuilderParams.getSidx())){
            jdbcProps.setSidx(chartBuilderParams.getSidx());
            jdbcProps.setSord(chartBuilderParams.getSord());
        }

        //过滤
        if(chartBuilderParams.getBuilderModel().isFilterOrNo()){
            jdbcProps.setFilterOrNo(true);
            jdbcProps.setFilterModels(chartBuilderParams.getBuilderModel().getFilterModels());
        }else {
            jdbcProps.setFilterOrNo(false);
        }

        //拼接字段名
        List<String> allAxis = new ArrayList<>();

        List<String> xAxis = chartBuilderParams.getBuilderModel().getxAxis();
        List<String> yAxis = chartBuilderParams.getBuilderModel().getyAxis();

        StringBuffer sb = new StringBuffer();
        String sql = jdbcProps.getSql();

        if(!sql.contains("group by") && xAxis.size() > 0 && sql.contains("*")){
            sql = sql + " group by ";
            for(int i=0;i<xAxis.size();i++){
                if(i == 0){
                    sql = sql + xAxis.get(i);
                }else {
                    sql = sql + "," + xAxis.get(i);
                }
            }
        }

        if (xAxis.size() > 0) {
            for (String xColumn : xAxis) {
                allAxis.add(xColumn);
            }
        }
        if (yAxis.size() > 0) {
            for (String yColumn : yAxis) {
                allAxis.add(yColumn);
            }
        }
        if (allAxis.size() > 0) {
            for (int i = 0; i < xAxis.size(); i++) {
                if (i == 0) {
                    sb.append(allAxis.get(i));
                } else {
                    sb.append(",");
                    sb.append(allAxis.get(i));
                }
            }
            if (xAxis.size() > 0 && yAxis.size() > 0) {
                sb.append(",");
            }
            for (int i = xAxis.size(); i < allAxis.size(); i++) {
                if (i == xAxis.size()) {
                    sb.append("sum(" + allAxis.get(i) + ")" + " as " + allAxis.get(i));
                } else {
                    sb.append(",");
                    sb.append("sum(" + allAxis.get(i) + ")" + " as " + allAxis.get(i));
                }
            }
            sql = sql.replace("*", sb.toString());
            jdbcProps.setSql(sql);
        }

        L.info("执行查询语句: {}", jdbcProps.getSql());

        return dataBaseMetadataHelper.prepareDataSetForTable(jdbcProps, xAxis);
    }

    public List<Map<String, Object>> prepareDataSetForFilter(ChartBuilderParams chartBuilderParams) throws Exception {
        SqlRecordingManage sqlRecordingManage = new SqlRecordingManage();
        sqlRecordingManage.setId(chartBuilderParams.getDataRecordId());
        sqlRecordingManage = sqlRecordingManageService.queryAsObject(sqlRecordingManage);

        ConnectionManage connectionManage = new ConnectionManage();
        connectionManage.setId(sqlRecordingManage.getConnectionId());
        connectionManage = connectionManageService.queryAsObject(connectionManage);

        JdbcProps jdbcProps = new JdbcProps();

        String sql = sqlRecordingManage.getSqlRecording();
        List<String> filters = chartBuilderParams.getBuilderModel().getFilter();
        if(sql.contains("*") && !sql.contains("group")) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < filters.size(); i++) {
                if (i == filters.size() - 1) {
                    sb.append(filters.get(i));
                } else {
                    sb.append(filters.get(i));
                    sb.append(",");
                }
                sql += " GROUP BY " + filters.get(i);
            }
            sql = sql.replace("*", sb.toString());
        }else if(sql.contains("*") && !sql.contains("group")){
            for (int i = 0; i < filters.size(); i++) {
                sql += " GROUP BY " + filters.get(i);
            }
        }
        jdbcProps.setSql(sql);
        jdbcProps.setUrl(connectionManage.getDbUrl());
        jdbcProps.setUsername(connectionManage.getUserName());
        jdbcProps.setPassword(connectionManage.getPassword());

        L.info("执行查询语句: {}", jdbcProps.getSql());

        return dataBaseMetadataHelper.prepareDataSet(jdbcProps);
    };

}

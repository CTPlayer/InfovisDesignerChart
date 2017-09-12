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
package model.chart;

import java.util.List;

/**
 * 构建图形页面参数
 *
 * @author CSJ
 */
public class ChartBuilderParams {

    // 图表panel导出访问ID
    private String exportId;
    // 数据集ID
    private String dataRecordId;
    // 图形类型
    private ChartType chartType;
    // 页面构建模型
    private BuilderModel builderModel;
    // 分页参数
    private int page = 0; // 当前页数

    private int pageSize = 0;// 每页记录数
    // 是否分页
    private boolean pageOrNo;

    private String sidx;// 列序号或列名

    private String sord;// 排序方式asc|desc
    //过滤
    private List<FilterModel> filterModels;

    private boolean filterOrNo;

    public String getExportId() {
        return exportId;
    }

    public void setExportId(String exportId) {
        this.exportId = exportId;
    }

    public String getDataRecordId() {
        return dataRecordId;
    }

    public void setDataRecordId(String dataRecordId) {
        this.dataRecordId = dataRecordId;
    }

    public ChartType getChartType() {
        return chartType;
    }

    public void setChartType(ChartType chartType) {
        this.chartType = chartType;
    }

    public BuilderModel getBuilderModel() {
        return builderModel;
    }

    public void setBuilderModel(BuilderModel builderModel) {
        this.builderModel = builderModel;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public boolean isPageOrNo() {
        return pageOrNo;
    }

    public void setPageOrNo(boolean pageOrNo) {
        this.pageOrNo = pageOrNo;
    }

    public String getSidx() {
        return sidx;
    }

    public void setSidx(String sidx) {
        this.sidx = sidx;
    }

    public String getSord() {
        return sord;
    }

    public void setSord(String sord) {
        this.sord = sord;
    }

    public List<FilterModel> getFilterModels() {
        return filterModels;
    }

    public void setFilterModels(List<FilterModel> filterModels) {
        this.filterModels = filterModels;
    }

    public boolean isFilterOrNo() {
        return filterOrNo;
    }

    public void setFilterOrNo(boolean filterOrNo) {
        this.filterOrNo = filterOrNo;
    }

    public enum ChartType {
        pie, line, bar, table
    }
}

package model.chart;

/**
 * Created by 10562 on 2017/3/10.
 */
public class FilterModel {
    //过滤字段
    private String column;

    //过滤字段类型
    private String columnType;

    //维度过滤值
    private String[] value;

    //度量过滤最小值
    private Integer min;

    //度量过滤最大值
    private Integer max;

    public String getColumn() {
        return column;
    }

    public void setColumn(String column) {
        this.column = column;
    }

    public String getColumnType() {
        return columnType;
    }

    public void setColumnType(String columnType) {
        this.columnType = columnType;
    }

    public String[] getValue() {
        return value;
    }

    public void setValue(String[] value) {
        this.value = value;
    }

    public Integer getMin() {
        return min;
    }

    public void setMin(Integer min) {
        this.min = min;
    }

    public Integer getMax() {
        return max;
    }

    public void setMax(Integer max) {
        this.max = max;
    }
}

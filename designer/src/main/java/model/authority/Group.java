package model.authority;

import common.model.BaseModel;

/**
 * @author CTPlayer
 * @since 2017/9/25 18:36
 */
public class Group extends BaseModel {
    private String groupId;
    private String groupName;
    private String descride;

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getDescride() {
        return descride;
    }

    public void setDescride(String descride) {
        this.descride = descride;
    }
}

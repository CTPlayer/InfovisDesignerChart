package model.authority;

import java.util.List;

/**
 * @author CTPlayer
 * @since 2017/9/28 16:31
 */
public class Authority {
    //普通用户读权限
    private int consumerRead;
    //普通用户写权限
    private int consumerWrite;
    //超级用户写权限
    private int adminRead;
    //超级用户写权限
    private int adminWrite;
    //可读用户组
    private List<String> groupRead;
    //可写用户组
    private List<String> groupWrite;

    public int getConsumerRead() {
        return consumerRead;
    }

    public void setConsumerRead(int consumerRead) {
        this.consumerRead = consumerRead;
    }

    public int getConsumerWrite() {
        return consumerWrite;
    }

    public void setConsumerWrite(int consumerWrite) {
        this.consumerWrite = consumerWrite;
    }

    public int getAdminRead() {
        return adminRead;
    }

    public void setAdminRead(int adminRead) {
        this.adminRead = adminRead;
    }

    public int getAdminWrite() {
        return adminWrite;
    }

    public void setAdminWrite(int adminWrite) {
        this.adminWrite = adminWrite;
    }

    public List<String> getGroupRead() {
        return groupRead;
    }

    public void setGroupRead(List<String> groupRead) {
        this.groupRead = groupRead;
    }

    public List<String> getGroupWrite() {
        return groupWrite;
    }

    public void setGroupWrite(List<String> groupWrite) {
        this.groupWrite = groupWrite;
    }
}

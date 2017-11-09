package service.authority;

import model.authority.Group;
import model.authority.User;
import model.myPanel.MyCharts;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @author CTPlayer
 * @since 2017/9/21 14:38
 */
public interface UserService {
    /**
     * 根据用户名查找用户
     * @param userName
     * @return
     */
    User findByUsername(String userName);

    Set<String> findRolesByUsername(String userName);

    Set<String> findPermissionsByUsername(String userName);

    /**
     * 查询所有用户所有信息
     * @return
     */
    List<Map<String, Object>> findAllUsersInfo();

    /**
     * 查询当前用户信息
     * @return
     */
    List<Map<String, Object>> findCurrentUserInfo();

    /**
     * 新增并查询所有用户
     * @param user
     * @return
     */
    List<Map<String, Object>> addNewUser(User user);

    /**
     * 检查用户名是否已被占用
     * @param userName
     * @return
     */
    boolean checkUser(String userName);

    /**
     * 检查分组名是否已被占用
     * @param groupName
     * @return
     */
    boolean checkGroup(String groupName);

    /**
     * 更新用户
     * @param password
     * @return
     */
    int updateUser(String password);

    /**
     * 提升权限
     * @return
     */
    List<Map<String, Object>> updateToAdmin(String userName);

    /**
     * 添加用户分组
     * @param group
     * @return
     */
    List<Group> addNewGroup(Group group);

    /**
     * 将用户添加到用户分组
     * @param userId
     * @param groupName
     * @return
     */
    Map addUserToGroup(String userId,String groupName);

    /**
     * 将用户从用户分组中去除
     * @param userId
     * @param groupName
     * @return
     */
    Map deleteUserFromGroup(String userId,String groupName);

    /**
     * 获取当前用户已加入分组
     * @param user
     * @return
     */
    List getJoinedGroup(User user);

    /**
     * 获取当前用户未已加入分组
     * @param user
     * @return
     */
    List getNoJoinGroup(User user);

    /**
     * 获取所有分组
     * @return
     */
    List<Group> getAllGroups();

    /**
     * 获取用户拥有所有权限的图表
     * @return
     */
    Set<String> getAllChartsOfWriteByUser();

    /**
     * 获取图表用户组权限
     * @param chartId
     * @return
     */
    Map<String, Object> getChartGroup(String chartId);

    void updateGroupAuthorityOfChart(MyCharts myCharts) throws Exception;

    List<Map<String, Object>> deleteOneUser(User user);

    List<Group> deleteOneGroup(Group group);

    List<Group> updateGroup(Group group);
}

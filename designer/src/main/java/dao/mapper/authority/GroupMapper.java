package dao.mapper.authority;

import core.plugin.mybatis.annotation.MapperMaker;
import model.authority.Group;
import model.authority.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author CTPlayer
 * @since 2017/9/25 18:52
 */
@MapperMaker
public interface GroupMapper {
    /**
     * 按groupName查询用户组信息
     * @param user
     * @return
     */
    List<Group> queryByUserId(User user);

    /**
     * 新增用户组
     * @param group
     * @return
     */
    int addGroup(Group group);

    /**
     * 将用户加入用户组
     * @param groupId
     * @param userId
     * @return
     */
    int addUserToGroup(@Param("groupId")String groupId, @Param("userId")String userId);

    /**
     * 将用户从用户组中删除
     * @param groupId
     * @param userId
     * @return
     */
    int deleteUserFromGroup(@Param("groupId")String groupId, @Param("userId")String userId);

    List<Group> queryByGroupName(String groupName);

    List<Group> queryNoJoinGroup(User user);

    List<Group> query();

    List<String> queryGroupIdFromRelation(@Param("userId")String userId);

    List<String> queryGroupIdFromPrivs(@Param("reporterId")String reporterId, @Param("write")int write);

    int deleteGroupAuthorityByChart(@Param("reporterId")String reporterId, @Param("privsResourceId")String privsResourceId);

    int delete(Group group);

    int update(Group group);

    int deletePrivsByChart(@Param("reporterId")String reporterId);

    int deleteRelationByGroup(Group group);

    int deletePrivsByGroup(Group group);

    int deleteRelationByUser(User user);

    int deletePrivsByUser(User user);
}

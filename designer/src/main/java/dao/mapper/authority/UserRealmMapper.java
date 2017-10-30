package dao.mapper.authority;

import core.plugin.mybatis.annotation.MapperMaker;
import model.authority.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * @author CTPlayer
 * @since 2017/9/21 14:57
 */
@MapperMaker
public interface UserRealmMapper {
    User queryAsObject(String userName);

    /**
     * 查询所有的用户
     * @return
     */
    List<User> query();

    /**
     * 新增用户
     * @param user
     * @return
     */
    int insert(User user);

    /**
     * 更新用户
     * @param user
     * @return
     */
    int update(User user);

    /**
     * 分配权限
     * @param reporterId
     * @param privsResourceId
     * @param write
     * @param read
     * @return
     */
    int insertAuthority(@Param("reporterId")String reporterId, @Param("privsResourceId")String privsResourceId, @Param("read")int read, @Param("write")int write);

    int insertAuthorityForBatch(List<Map<String, Object>> list);

    List<User> queryByUserType(int userType);

    List<String> queryReporterIdByUser(User user);

    List<String> queryReporterIdByGroupId(@Param("groupId")String groupId);

    int updateAuthority(@Param("privsResourceId")String privsResourceId);

    int updateAuthorityForBatch(List<Map<String, Object>> list);

    List<String> queryReporterIdOfWriteByUser(@Param("userId")String userId);

    List<String> queryReporterIdOfWriteByGroup(@Param("groupId")String groupId);


    int deleteOneUser(User user);
}

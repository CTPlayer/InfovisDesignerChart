package dao.mapper.authority;

import core.plugin.mybatis.annotation.MapperMaker;
import model.authority.User;

/**
 * @author CTPlayer
 * @since 2017/9/21 14:57
 */
@MapperMaker
public interface UserRealmMapper {
    User queryAsObject(String userName);
}

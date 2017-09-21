package service.authority;

import model.authority.User;

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
}

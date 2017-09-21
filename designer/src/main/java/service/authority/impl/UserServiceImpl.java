package service.authority.impl;

import dao.BaseMapper;
import dao.mapper.authority.UserRealmMapper;
import model.authority.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import realm.UserRealm;
import service.authority.UserService;

import javax.annotation.Resource;

/**
 * @author CTPlayer
 * @since 2017/9/21 14:39
 */
@Service
public class UserServiceImpl implements UserService{
    private static final Logger log = LoggerFactory.getLogger(UserRealm.class);

    @Resource
    private UserRealmMapper userRealmMapper;

    @Override
    public User findByUsername(String userName) {
        return userRealmMapper.queryAsObject(userName);
    }
}

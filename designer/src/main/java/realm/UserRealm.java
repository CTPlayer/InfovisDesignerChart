package realm;

import model.authority.User;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import service.authority.UserService;

import javax.annotation.Resource;


/**
 * @author CTPlayer
 * @since 2017/9/21 4:04
 */
public class UserRealm extends AuthorizingRealm {
    private static final Logger log = LoggerFactory.getLogger(UserRealm.class);

    @Resource
    private UserService userService;

    public String getName(){
        return "userRealm";
    }

    /**
     * 获取授权信息
     * @param principals
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        return null;
    }

    /**
     * 获取身份验证信息
     * @param token
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        String username = (String)token.getPrincipal();
        String password = (String)token.getCredentials();
        User user = userService.findByUsername(username);
        System.out.println(user.getUserName());
        System.out.println(user.getPassword());

        if("".equals(user.getPassword()) || user.getPassword() == null){
            throw new UnknownAccountException(); //没找到账号
        }
        if(password != user.getPassword()){
            throw new IncorrectCredentialsException(); //密码错误
        }
        SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(user.getUserName(), user.getPassword(), getName());
        return authenticationInfo;
    }
}

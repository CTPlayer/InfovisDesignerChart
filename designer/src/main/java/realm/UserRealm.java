package realm;

import model.authority.User;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import service.authority.UserService;

import javax.annotation.Resource;
import java.util.Set;


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
        final User user = (User)super.getAvailablePrincipal(principals);

        final SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        final Set<String> roles = userService.findRolesByUsername(user.getUserName());
        final Set<String> permissions = userService.findPermissionsByUsername(user.getUserName());
        info.setRoles(roles);
        info.setStringPermissions(permissions);
        return info;
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
        User user = userService.findByUsername(username);

        if("".equals(user.getUserName()) || user.getPassword() == null){
            throw new UnknownAccountException(); //没找到账号
        }
        SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(user, user.getPassword(), getName());
        return authenticationInfo;
    }
}

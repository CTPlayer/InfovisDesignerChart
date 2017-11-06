package web.authority;

import model.authority.Group;
import model.authority.User;
import model.myPanel.MyCharts;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import service.authority.UserService;

import javax.annotation.Resource;
import java.util.*;

/**
 * @author CTPlayer
 * @since 2017/9/25 13:48
 */

@Controller
@RequestMapping("/authority")
public class AuthorityController {

    @Resource
    private UserService userService;

    @RequestMapping("/logout")
    public Object logout(){
        Subject currentUser = SecurityUtils.getSubject();
        currentUser.logout();
        return "redirect:../index.page";
    }

    @RequestMapping("/userManage.page")
    public Object userManage(){
        return "panel/userManage";
    }

    @RequestMapping("/getAllUsersInfo")
    @ResponseBody
    public Object getAllUsersInfo(){
        Subject currentUser = SecurityUtils.getSubject();
        List<Map<String, Object>> result = new ArrayList<>();
        if(currentUser.hasRole("consumer")){
            result = userService.findCurrentUserInfo();
        }else if(currentUser.hasRole("admin")){
            result = userService.findAllUsersInfo();
        }
        return result;
    }

    @RequestMapping("/addNewUser")
    @ResponseBody
    public Object addNewUser(User user){
        return userService.addNewUser(user);
    }

    @RequestMapping("/addNewGroup")
    @ResponseBody
    public Object addNewGroup(Group group){
        return userService.addNewGroup(group);
    }

    @RequestMapping("/checkUser")
    @ResponseBody
    public Object checkUser(String userName){
        return userService.checkUser(userName);
    }

    @RequestMapping("/checkGroup")
    @ResponseBody
    public Object checkGroup(String groupName){
        return userService.checkGroup(groupName);
    }

    @RequestMapping("/updateUser")
    @ResponseBody
    public Object updateUser(String password){
        return userService.updateUser(password);
    }

    @RequestMapping("/upToAdmin")
    @ResponseBody
    public Object upToAdmin(String userName){
        return userService.updateToAdmin(userName);
    }

    @RequestMapping("/checkPassword")
    @ResponseBody
    public Object checkPassword(String password){
        boolean isSame = false;
        User user = (User)SecurityUtils.getSubject().getPrincipal();
        String oldPassword = user.getPassword();
        if(oldPassword.equals(password)){
            isSame = true;
        }
        return isSame;
    }

    @RequestMapping("/addUserToGroup")
    @ResponseBody
    public Object addUserToGroup(String userId,String groupName){
        return userService.addUserToGroup(userId,groupName);
    }

    @RequestMapping("/deleteUserFromGroup")
    @ResponseBody
    public Object deleteUserFromGroup(String userId,String groupName){
        return userService.deleteUserFromGroup(userId,groupName);
    }

    @RequestMapping("/getJoinedGroup")
    @ResponseBody
    public Object getJoinedGroup(User user){
        return userService.getJoinedGroup(user);
    }

    @RequestMapping("/getNoJoinGroup")
    @ResponseBody
    public Object getNoJoinGroup(User user){
        return userService.getNoJoinGroup(user);
    }

    @RequestMapping("/getAllGroups")
    @ResponseBody
    public Object getAllGroups(){
        return userService.getAllGroups();
    }

    @RequestMapping("/checkUserAuthority")
    @ResponseBody
    public Object checkUserAuthority(String chartId) {
        Map<String, Object> resMap = new HashMap<>();
        if(SecurityUtils.getSubject().hasRole("consumer")){
            Set<String> reporterIdsSet = userService.getAllChartsOfWriteByUser();
            if(reporterIdsSet.contains(chartId)) {
                resMap.put("haveAuthority", true);
            }else {
                resMap.put("haveAuthority", false);
            }
        }else if(SecurityUtils.getSubject().hasRole("admin")) {
            resMap.put("haveAuthority", true);
        }
        return resMap;
    }

    @RequestMapping("/getChartGroup")
    @ResponseBody
    public Object getChartGroup(String chartId){
        return userService.getChartGroup(chartId);
    }

    @RequestMapping("/updateChartGroup")
    @ResponseBody
    public Object updateChartGroup(MyCharts myCharts) throws Exception {
        Map<String, Object> resMap = new HashMap<>();
        userService.updateGroupAuthorityOfChart(myCharts);
        resMap.put("success", true);
        return resMap;
    }

    @RequestMapping("/deleteOneUser")
    @ResponseBody
    public Object deleteOneUser(User user){
        return userService.deleteOneUser(user);
    }
}

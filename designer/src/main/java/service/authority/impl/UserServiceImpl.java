package service.authority.impl;

import dao.mapper.authority.GroupMapper;
import dao.mapper.authority.UserRealmMapper;
import model.authority.Authority;
import model.authority.Group;
import model.authority.User;
import model.myPanel.MyCharts;
import org.apache.shiro.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import realm.UserRealm;
import service.authority.UserService;

import javax.annotation.Resource;
import java.util.*;

/**
 * @author CTPlayer
 * @since 2017/9/21 14:39
 */
@Service
public class UserServiceImpl implements UserService{
    private static final Logger log = LoggerFactory.getLogger(UserRealm.class);

    @Resource
    private UserRealmMapper userRealmMapper;

    @Resource
    private GroupMapper groupMapper;

    @Override
    public User findByUsername(String userName) {
        return userRealmMapper.queryAsObject(userName);
    }

    @Override
    public Set<String> findRolesByUsername(String userName) {
        User user = userRealmMapper.queryAsObject(userName);
        Set<String> roles = new HashSet<>();
        if(user.getUserType() == 0){
            roles.add("consumer");
        }else if(user.getUserType() == 1){
            roles.add("admin");
        }
        return roles;
    }

    @Override
    public Set<String> findPermissionsByUsername(String userName) {
        User user = userRealmMapper.queryAsObject(userName);
        Set<String> permissions = new HashSet<>();
        if(user.getUserType() == 0){
            permissions.add("read");
        }else if(user.getUserType() == 1){
            permissions.add("read");
            permissions.add("write");
        }
        return permissions;
    }

    @Override
    public List<Map<String, Object>> findAllUsersInfo() {
        List<User> users = userRealmMapper.query();
        List<Map<String, Object>> result = new ArrayList<>();

        //先查当前用户，将当前用户放在第一个
        User currentUser = (User)SecurityUtils.getSubject().getPrincipal();
        Map<String, Object> currentUserMap = new HashMap<>();
        currentUserMap.put("userId", currentUser.getUserId());
        currentUserMap.put("userName", currentUser.getUserName());
        currentUserMap.put("descride", currentUser.getDescride());
        currentUserMap.put("userType", currentUser.getUserType() == 0 ? "consumer" : "admin");
        List<Group> groups = groupMapper.queryByUserId(currentUser);
        currentUserMap.put("groups", groups);
        result.add(currentUserMap);

        for(User user : users){
            if(!user.getUserId().equals(currentUser.getUserId())){
                Map<String, Object> map = new HashMap<>();
                map.put("userId", user.getUserId());
                map.put("userName", user.getUserName());
                map.put("descride", user.getDescride());
                map.put("userType", user.getUserType() == 0 ? "consumer" : "admin");
                groups = groupMapper.queryByUserId(user);
                map.put("groups", groups);
                result.add(map);
            }
        }
        return result;
    }

    @Override
    public List<Map<String, Object>> findCurrentUserInfo() {
        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> map = new HashMap<>();
        User user = (User)SecurityUtils.getSubject().getPrincipal();
        map.put("userId", user.getUserId());
        map.put("userName", user.getUserName());
        map.put("descride", user.getDescride());
        map.put("userType", user.getUserType() == 0 ? "consumer" : "admin");
        List<Group> groups = groupMapper.queryByUserId(user);
        map.put("groups", groups);
        result.add(map);
        return result;
    }

    @Override
    public List<Map<String, Object>> addNewUser(User user) {
        userRealmMapper.insert(user);
        if(user.getUserType() == 0){

        }else if(user.getUserType() == 1){

        }
        return findAllUsersInfo();
    }

    @Override
    public boolean checkUser(String userName) {
        boolean isExist = false;
        User user = userRealmMapper.queryAsObject(userName);
        if(user == null){
            isExist = true;
        }
        return isExist;
    }

    @Override
    public boolean checkGroup(String groupName) {
        boolean isExist = false;
        List<Group> groups = groupMapper.queryByGroupName(groupName);
        if(groups.size() == 0){
            isExist = true;
        }
        return isExist;
    }

    @Override
    public int updateUser(String password) {
        User user = (User)SecurityUtils.getSubject().getPrincipal();
        user.setPassword(password);
        return userRealmMapper.update(user);
    }

    @Override
    public List<Map<String, Object>> updateToAdmin(String userName) {
//        User user = userRealmMapper.queryAsObject(userName);
        User user = (User)SecurityUtils.getSubject().getPrincipal();
        user.setUserType(1);
        userRealmMapper.update(user);
        return findAllUsersInfo();
    }

    @Override
    public int addNewGroup(Group group) {
        return groupMapper.addGroup(group);
    }

    @Override
    public Map addUserToGroup(String userId, String groupName) {
        Map map = new HashMap();
        String groupId = groupMapper.queryByGroupName(groupName).get(0).getGroupId();
        groupMapper.addUserToGroup(groupId, userId);
        User user = new User();
        user.setUserId(userId);
        List<String> joinedGroup = getJoinedGroup(user);
        List<String> noJoinGroup = getNoJoinGroup(user);
        map.put("joinedGroup", joinedGroup);
        map.put("noJoinGroup", noJoinGroup);
        return map;
    }

    @Override
    public Map deleteUserFromGroup(String userId, String groupName) {
        Map map = new HashMap();
        String groupId = groupMapper.queryByGroupName(groupName).get(0).getGroupId();
        groupMapper.deleteUserFromGroup(groupId, userId);
        User user = new User();
        user.setUserId(userId);
        List<String> joinedGroup = getJoinedGroup(user);
        List<String> noJoinGroup = getNoJoinGroup(user);
        map.put("joinedGroup", joinedGroup);
        map.put("noJoinGroup", noJoinGroup);
        return map;
    }

    @Override
    public List<String> getJoinedGroup(User user) {
        List<String> list = new ArrayList<>();
        List<Group> groups = groupMapper.queryByUserId(user);
        for(Group group : groups){
            list.add(group.getGroupName());
//            Map<String, String> map = new HashMap<>();
//            map.put("groupId", group.getGroupId());
//            map.put("groupName", group.getGroupName());
//            list.add(map);
        }
        return list;
    }

    @Override
    public List getNoJoinGroup(User user) {
        List<String> list = new ArrayList<>();
        List<Group> groups = groupMapper.queryNoJoinGroup(user);
        for(Group group : groups){
            list.add(group.getGroupName());
//            Map<String, String> map = new HashMap<>();
//            map.put("groupId", group.getGroupId());
//            map.put("groupName", group.getGroupName());
//            list.add(map);
        }
        return list;
    }

    @Override
    public List<Group> getAllGroups() {
        return groupMapper.query();
    }

    @Override
    public Set<String> getAllChartsOfWriteByUser() {
        Set<String> reporterIdsSet = new HashSet<>();
        User user = (User)SecurityUtils.getSubject().getPrincipal();
        User currentUser = userRealmMapper.queryAsObject(user.getUserName());

        if(SecurityUtils.getSubject().hasRole("consumer")){
            List<String> groupIdsByGroup = groupMapper.queryGroupIdFromRelation(currentUser.getUserId());

            for(String groupId : groupIdsByGroup){
                List<String> reporterIds = userRealmMapper.queryReporterIdOfWriteByGroup("GR"+groupId);
                for(String reporterId : reporterIds){
                    reporterIdsSet.add(reporterId);
                }
            }
        }

//        List<String> reporeterIdsByUser = userRealmMapper.queryReporterIdOfWriteByUser("US"+currentUser.getUserId());
//        for(String reporterId : reporeterIdsByUser){
//            reporterIdsSet.add(reporterId);
//        }
        return reporterIdsSet;
    }

    @Override
    public Map<String, List<String>> getChartGroup(String chartId) {
        Map<String, List<String>> groupMap = new HashMap<>();
        List<String> groupOfRead = groupMapper.queryGroupIdFromPrivs(chartId, 0);
        List<String> groupOfWrite = groupMapper.queryGroupIdFromPrivs(chartId,1);
        groupMap.put("groupOfRead", groupOfRead);
        groupMap.put("groupOfWrite", groupOfWrite);
        return groupMap;
    }

    @Override
    public void updateGroupAuthorityOfChart(MyCharts myCharts) {
        List<Group> groups = groupMapper.query();
        for(Group group : groups){
            groupMapper.deleteGroupAuthorityByChart(myCharts.getId(), "GR"+group.getGroupId());
        }

        Authority authority = myCharts.getAuthority();
        List<String> groupsForRead = authority.getGroupRead();
        List<String> groupsForWrite = authority.getGroupWrite();
        for(String groupId : groupsForRead){
            userRealmMapper.insertAuthority(myCharts.getId(),"GR"+groupId,1,0);
        }
        //添加有写权限的分组
        for(String groupId : groupsForWrite){
            if(groupsForRead.contains(groupId)){
                userRealmMapper.updateAuthority("GR"+groupId);
            }else {
                userRealmMapper.insertAuthority(myCharts.getId(),"GR"+groupId,1,1);
            }
        }
    }
}

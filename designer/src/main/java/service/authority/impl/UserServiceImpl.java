package service.authority.impl;

import common.util.TemplateUtil;
import dao.BaseMapper;
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
import service.myPanel.MyChartsService;

import javax.annotation.Resource;
import java.util.*;

/**
 * @author CTPlayer
 * @since 2017/9/21 14:39
 */
@Service
public class UserServiceImpl implements UserService{
    private static final Logger log = LoggerFactory.getLogger(UserRealm.class);

    private static final String NAMESPACE = MyCharts.class.getName();
    @Resource
    private BaseMapper<MyCharts> baseMapper;

    @Resource
    private UserRealmMapper userRealmMapper;

    @Resource
    private GroupMapper groupMapper;

    @Resource
    private MyChartsService myChartsService;

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
        if("".equals(user.getDescride()) || user.getDescride() == null){
            user.setDescride("未添加描述");
        }
        userRealmMapper.insert(user);
        String userId = user.getUserId();

        MyCharts myCharts = new MyCharts();
        myCharts.setPaging(false);
        myCharts.setStatmentId(NAMESPACE + ".selectList");
        List<MyCharts> list = baseMapper.selectList(myCharts);

        List<Map<String, Object>> paramList = new ArrayList<>();
        for(MyCharts chart : list){
            Authority authority = TemplateUtil.genObjFormJson(chart.getAuthority(), Authority.class);
            Map<String, Object> map = new HashMap<>();
            map.put("reporterId", chart.getId());
            map.put("privsResourceId", "US"+userId);
            map.put("read", authority.getConsumerRead());
            map.put("write", authority.getConsumerWrite());
            paramList.add(map);
        }
        userRealmMapper.insertAuthorityForBatch(paramList);
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
        User user = userRealmMapper.queryAsObject(userName);
        user.setUserType(1);
        userRealmMapper.update(user);
        userRealmMapper.updateAuthority("US"+user.getUserId());
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
        HashSet<String> reporterIdSet = new HashSet<>();
        User currentUser = (User)SecurityUtils.getSubject().getPrincipal();

        User paramUser = userRealmMapper.queryAsObject(currentUser.getUserName());
        paramUser.setUserId("US"+currentUser.getUserId());
        //当前用户所在的用户组
        List<String> groupIds = groupMapper.queryGroupIdFromRelation(paramUser.getUserId());

        List<String> reporterIds1 = userRealmMapper.queryReporterIdOfWriteByUser(paramUser.getUserId());
        reporterIdSet.addAll(reporterIds1);
        for(String groupId : groupIds){
            List<String> reporterIds2 = userRealmMapper.queryReporterIdOfWriteByGroup(groupId);
            reporterIdSet.addAll(reporterIds2);
        }
        return reporterIdSet;
    }

    @Override
    public Map<String, Object> getChartGroup(String chartId) {
        Map<String, Object> groupMap = new HashMap<>();

        MyCharts myCharts = new MyCharts();
        myCharts.setId(chartId);
        myCharts.setStatmentId(NAMESPACE + ".selectOne");
        myCharts = baseMapper.selectOne(myCharts);
        System.out.println(myCharts.getAuthority());
        Authority authority = TemplateUtil.genObjFormJson(myCharts.getAuthority(), Authority.class);

        if(authority.getConsumerRead() == 0){
            groupMap.put("authorityForConsumer", "none");
        }else if(authority.getConsumerRead() == 1 && authority.getConsumerWrite() == 0){
            groupMap.put("authorityForConsumer", "read");
        }else if(authority.getConsumerRead() == 1 && authority.getConsumerWrite() == 1){
            groupMap.put("authorityForConsumer", "write");
        }

        List<String> groupOfRead = groupMapper.queryGroupIdFromPrivs(chartId, 0);
        List<String> groupOfWrite = groupMapper.queryGroupIdFromPrivs(chartId,1);
        groupMap.put("groupOfRead", groupOfRead);
        groupMap.put("groupOfWrite", groupOfWrite);
        return groupMap;
    }

    @Override
    public void updateGroupAuthorityOfChart(MyCharts myCharts) throws Exception {
        User currentUser = (User)SecurityUtils.getSubject().getPrincipal();
        Authority authority = TemplateUtil.genObjFormJson(myCharts.getAuthority(), Authority.class);
        if(!"".equals(authority) && authority != null){
            //有读权限的用户组
            List<String> groupsForRead = authority.getGroupRead();
            //有写权限的用户组
            List<String> groupsForWrite = authority.getGroupWrite();
            //所有普通用户
            List<User> consumers = userRealmMapper.queryByUserType(0);

            List<Map<String, Object>> paramList = new ArrayList<>();
            for(User user : consumers){
                Map<String, Object> map = new HashMap<>();
                map.put("reporterId", myCharts.getId());
                map.put("privsResourceId", "US"+user.getUserId());
                map.put("read", authority.getConsumerRead());
                map.put("write", authority.getConsumerWrite());
                paramList.add(map);
            }
            userRealmMapper.updateAuthorityForBatch(paramList);

            List<Group> groups = groupMapper.query();
            for(Group group : groups){
                groupMapper.deleteGroupAuthorityByChart(myCharts.getId(), "GR"+group.getGroupId());
            }
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
        myChartsService.update(myCharts);
    }

    @Override
    public List<Map<String, Object>> deleteOneUser(User user) {
        userRealmMapper.deleteOneUser(user);
        return findAllUsersInfo();
    }
}

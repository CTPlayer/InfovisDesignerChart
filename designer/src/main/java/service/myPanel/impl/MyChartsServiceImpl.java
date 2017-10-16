package service.myPanel.impl;

import dao.BaseMapper;
import dao.mapper.authority.GroupMapper;
import dao.mapper.authority.UserRealmMapper;
import model.authority.Authority;
import model.authority.Group;
import model.authority.User;
import model.myPanel.MyCharts;
import org.apache.shiro.SecurityUtils;
import org.omg.CosNaming.NamingContextExtPackage.StringNameHelper;
import org.springframework.stereotype.Service;
import service.authority.UserService;
import service.myPanel.MyChartsService;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by ct on 2016/8/30.
 */
@Service
public class MyChartsServiceImpl implements MyChartsService{

    private static final String NAMESPACE = MyCharts.class.getName();
    @Resource
    private BaseMapper<MyCharts> baseMapper;

    @Resource
    private UserRealmMapper userRealmMapper;

    @Resource
    private GroupMapper groupMapper;

    @Override
    public int insert(MyCharts myCharts) throws Exception {
        User currentUser = (User)SecurityUtils.getSubject().getPrincipal();
        myCharts.setStatmentId(NAMESPACE + ".insert");
        baseMapper.insert(myCharts);
        int reporterId = Integer.parseInt(myCharts.getId()) - 1;

        Authority authority = myCharts.getAuthority();
//        List<User> consumers = userRealmMapper.queryByUserType(0);
//        List<User> admins = userRealmMapper.queryByUserType(1);
        List<String> groupsForRead = authority.getGroupRead();
        List<String> groupsForWrite = authority.getGroupWrite();
        String currentUserId = userRealmMapper.queryAsObject(currentUser.getUserName()).getUserId();

        userRealmMapper.insertAuthority(Integer.toString(reporterId), "US"+currentUserId,1,1);
//        //添加普通用户权限
//        for(User user : consumers){
//            if(!user.getUserId().equals(currentUserId) && authority.getConsumerRead() == 1){
//                userRealmMapper.insertAuthority(Integer.toString(reporterId), "US"+user.getUserId(),1,0);
//            }
//        }
//        //添加超级用户权限
//        for(User user : admins) {
//            if(!user.getUserId().equals(currentUserId)) {
//                userRealmMapper.insertAuthority(Integer.toString(reporterId), "US"+user.getUserId(), 1, 1);
//            }
//        }
        //添加有读权限分组
        for(String groupId : groupsForRead){
            userRealmMapper.insertAuthority(Integer.toString(reporterId),"GR"+groupId,1,0);
        }
        //添加有写权限的分组
        for(String groupId : groupsForWrite){
            if(groupsForRead.contains(groupId)){
                userRealmMapper.updateAuthority("GR"+groupId);
            }else {
                userRealmMapper.insertAuthority(Integer.toString(reporterId),"GR"+groupId,1,1);
            }
        }
        return reporterId;
    }

    @Override
    public int update(MyCharts myCharts) throws Exception {
        myCharts.setStatmentId(NAMESPACE + ".update");
        return baseMapper.update(myCharts);
    }

    @Override
    public int delete(MyCharts myCharts) throws Exception {
        myCharts.setStatmentId(NAMESPACE + ".delete");
        return baseMapper.delete(myCharts);
    }

    @Override
    public MyCharts selectOneChartInfo(MyCharts myCharts) throws Exception {
        myCharts.setStatmentId(NAMESPACE + ".selectOne");
        return baseMapper.selectOne(myCharts);
    }

    @Override
    public List<MyCharts> selectChartInfo(MyCharts myCharts) throws Exception {
//        Set<String> reporterIdsSet = new HashSet<>();
//        List<MyCharts> list = new ArrayList<>();
//        User user = (User)SecurityUtils.getSubject().getPrincipal();
//        User currentUser = userRealmMapper.queryAsObject(user.getUserName());
//        List<String> groupIdsByGroup = groupMapper.queryGroupIdFromRelation(currentUser.getUserId());
//
//        for(String groupId : groupIdsByGroup){
//            List<String> reporterIds = userRealmMapper.queryReporterIdByGroupId("GR"+groupId);
//            for(String reporterId : reporterIds){
//                reporterIdsSet.add(reporterId);
//            }
//        }
//
//        String userId = user.getUserId();
//        currentUser.setUserId("US"+userId);
//        List<String> reporeterIdsByUser = userRealmMapper.queryReporterIdByUser(currentUser);
//        for(String reporterId : reporeterIdsByUser){
//            reporterIdsSet.add(reporterId);
//        }
//
//        System.out.println("此用户拥有的报表id："+reporterIdsSet);
//
//        myCharts.setStatmentId(NAMESPACE + ".selectOne");
//        for(String reporterId : reporterIdsSet){
//            myCharts.setId(reporterId);
//            list.add(baseMapper.selectOne(myCharts));
//        }
//
//        return list;

        myCharts.setStatmentId(NAMESPACE + ".selectList");
        return baseMapper.selectList(myCharts);
    }
}

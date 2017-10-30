package service.myPanel.impl;

import common.util.TemplateUtil;
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
import java.util.*;

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

        Authority authority = TemplateUtil.genObjFormJson(myCharts.getAuthority(), Authority.class);
        if(!"".equals(authority) && authority != null){
            //有读权限的用户组
            List<String> groupsForRead = authority.getGroupRead();
            //有写权限的用户组
            List<String> groupsForWrite = authority.getGroupWrite();
            //当前用户id
            String currentUserId = userRealmMapper.queryAsObject(currentUser.getUserName()).getUserId();
            //所有普通用户
            List<User> consumers = userRealmMapper.queryByUserType(0);
            //所有超级用户
            List<User> admins = userRealmMapper.queryByUserType(1);

            List<Map<String, Object>> paramList = new ArrayList<>();

            //添加普通用户对于该图表的权限
            for(User user : consumers){
                Map<String, Object> map = new HashMap<>();
                map.put("reporterId", reporterId);
                map.put("privsResourceId", "US"+user.getUserId());
                if(user.getUserId().equals(currentUserId)){
                    map.put("read", 1);
                    map.put("write", 1);
                }else {
                    map.put("read", authority.getConsumerRead());
                    map.put("write", authority.getConsumerWrite());
                }
                paramList.add(map);
            }
            //添加超级用户对于该表的权限
            userRealmMapper.insertAuthorityForBatch(paramList);
            paramList.clear();
            for(User user : admins){
                Map<String, Object> map = new HashMap<>();
                map.put("reporterId", reporterId);
                map.put("privsResourceId", "US"+user.getUserId());
                map.put("read", 1);
                map.put("write", 1);
                paramList.add(map);
            }
            userRealmMapper.insertAuthorityForBatch(paramList);
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
        HashSet<String> reporterIdSet = new HashSet<>();
        User currentUser = (User)SecurityUtils.getSubject().getPrincipal();

        User paramUser = userRealmMapper.queryAsObject(currentUser.getUserName());
        paramUser.setUserId("US"+currentUser.getUserId());
        //当前用户所在的用户组
        List<String> groupIds = groupMapper.queryGroupIdFromRelation(paramUser.getUserId());

        List<String> reporterIds1 = userRealmMapper.queryReporterIdByUser(paramUser);
        reporterIdSet.addAll(reporterIds1);
        for(String groupId : groupIds){
            List<String> reporterIds2 = userRealmMapper.queryReporterIdByGroupId(groupId);
            reporterIdSet.addAll(reporterIds2);
        }

        List<MyCharts> result = new ArrayList<>();
        myCharts.setStatmentId(NAMESPACE + ".selectOne");
        for(String reporterId : reporterIdSet){
            myCharts.setId(reporterId);
            result.add(baseMapper.selectOne(myCharts));
        }
        return result;
    }
}

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

    @Override
    public int insert(MyCharts myCharts) throws Exception {
        myCharts.setStatmentId(NAMESPACE + ".insert");
        baseMapper.insert(myCharts);
        return Integer.parseInt(myCharts.getId());
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
        myCharts.setStatmentId(NAMESPACE + ".selectList");
        return baseMapper.selectList(myCharts);
    }
}

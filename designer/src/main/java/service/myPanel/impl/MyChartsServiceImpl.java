package service.myPanel.impl;

import dao.BaseMapper;
import model.myPanel.MyCharts;
import org.springframework.stereotype.Service;
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
    public List<MyCharts> queryAsList(MyCharts myCharts) throws Exception {
        myCharts.setStatmentId(NAMESPACE + ".selectList");
        return baseMapper.selectList(myCharts);
    }
}

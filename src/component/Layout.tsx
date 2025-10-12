import { HomeOutlined, ListAltOutlined, PeopleAltOutlined, ScheduleOutlined, SwapVertOutlined, ViewTimelineOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { Button, Layout } from 'antd';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
const { Header, Sider, Content } = Layout;

interface LayoutCompProps {
  children: ReactNode;
}

const contentStyle: React.CSSProperties = {
  padding: '1rem 2rem',
  backgroundColor: '#f7f7f7',
};

const siderStyle: React.CSSProperties = {
  color: '#fff',
  background: 'linear-gradient(225deg, #8863ed, #b1a7d3, #5cbcf4)',
};

const items = [
  {
    key: 'house-report',
    label: 'House Report',
    url: '/house-report',
    icon: <HomeOutlined />,
  },
  {
      key: "part-report",
      label: "Unit report",
      url: "/part-report",
    icon: <PeopleAltOutlined />,
  },
  {
    key: 'work-schedule',
    label: 'Work Schedule',
    url: '/work-schedule',
    icon: <ScheduleOutlined />,
  },
  {
    key: 'log-update',
    label: 'Log Update',
    url: '/log-update',
    icon: <ViewTimelineOutlined />,
  },
  {
    key: 'log-cross-zone',
    label: 'Log Cross Zone',
    url: '/log-cross-zone',
    icon: <ListAltOutlined />,
  },
  {
    key: 'zone',
    label: 'Zone',
    url: '/zone',
    icon: <SwapVertOutlined />,
  },
];

const LayoutComp: FC<LayoutCompProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('house-report');
  const [collapsed, setCollapsed] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  useEffect(() => {
    if (location.pathname.includes('/house-report')) {
      setActiveKey('house-report');
    } else if (location.pathname.includes('/part-report')) {
      setActiveKey('part-report');
    } else if (location.pathname.includes('/work-schedule')) {
      setActiveKey('work-schedule');
    } else if (location.pathname.includes('/log-update')) {
      setActiveKey('log-update');
    } else if (location.pathname.includes('/log-cross-zone')) {
      setActiveKey('log-cross-zone');
    } else if (location.pathname.includes('/zone')) {
      setActiveKey('zone');
    } else {
      setActiveKey('house-report');
    }
  }, [location]);

  return (
    <Layout>
      <Sider style={siderStyle} width={220} collapsed={collapsed}>
        {collapsed ? (
          <Box className='py-5 px-8'>
            <Typography className='text-white text-xl font-bold uppercase'>D</Typography>
          </Box>
        ) : (
          <Box className='py-5 px-10'>
            <Typography className='text-white text-xl font-bold uppercase'>Dashboard</Typography>
          </Box>
        )}

        <Box component='ul' className='flex flex-col'>
          {items.map((item) => (
            <Box key={item.key} component='li' onClick={() => navigate(item.url)} className='py-3 px-3'>
              <div
                className={`text-white text-base text-left font-medium py-2 px-4 flex items-center rounded-full cursor-pointer hover:bg-white hover:text-dark-01 ${
                  item.key === activeKey && 'bg-white !text-dark-01'
                }`}
              >
                {collapsed ? (
                  <div className='flex gap-2'>{item.icon}</div>
                ) : (
                  <div className='flex gap-2'>
                    {item.icon} <span>{item.label}</span>
                  </div>
                )}
              </div>
            </Box>
          ))}
        </Box>
      </Sider>
      <Layout>
        <Header className='w-full h-[60px] !px-2 flex items-center justify-between bg-white shadow-2xl'>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 44,
              height: 64,
            }}
          />
          <Button onClick={handleLogout} >Logout</Button>
        </Header>

        <Content style={contentStyle}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComp;

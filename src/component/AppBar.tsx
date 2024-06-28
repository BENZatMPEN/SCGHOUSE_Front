import React, {ReactNode} from 'react';
import {LaptopOutlined, NotificationOutlined, UserOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Layout, Menu, theme} from 'antd';
import {Link} from 'react-router-dom';

interface AppBarProps {
    children: ReactNode;
}

const { Header, Content, Sider } = Layout;

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);
        return {
            key: `sub${key}`,
            icon: React.createElement(icon),
            label: `subnav ${key}`,
        };
    },
);


const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <Link to="/house-report">House Report</Link>
        ),
    },
    {
        key: '2',
        label: (
            <Link to="/part-report">Part Report</Link>
        ),
    },
    {
        key: '3',
        label: (
            <Link to="/work-schedule">Work Schedule</Link>
        ),
    },
    {
        key: '4',
        label: (
            <Link to="/log-update">Log Update</Link>
        ),
    },
]
const AppBar: React.FC<AppBarProps> = (props, context) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onClick: MenuProps['onClick'] = (e) => {
        // console.log('click ', e);
        // setCurrent(e.key);
    };

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <p className='text-white text-lg'>Dashboard</p>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }}>
                    <Menu
                        onClick={onClick}
                        items={items}
                    />
                    {/*<Menu.Item*/}
                    {/*    key="1"*/}

                    {/*></Menu.Item>*/}
                    {/*<Menu.Item key="1">*/}
                    {/*    <Icon type="pie-chart" />*/}
                    {/*    <span>Deshboard</span>*/}
                    {/*    <Link to="/" />*/}
                    {/*</Menu.Item>*/}
                    {/*<Menu.Item key="2">*/}
                    {/*    /!*<Icon type="desktop" />*!/*/}
                    {/*    <span>Meseros</span>*/}
                    {/*    /!*<Link to="/meseros" />*!/*/}
                    {/*</Menu.Item>*/}

                    {/*<Menu*/}
                    {/*    mode="inline"*/}
                    {/*    defaultSelectedKeys={['1']}*/}
                    {/*    defaultOpenKeys={['sub1']}*/}
                    {/*    style={{ height: '100%', borderRight: 0 }}*/}
                    {/*    items={items2}*/}
                    {/*    // onClick={() => handleOnClick(items2)}*/}
                    {/*/>*/}
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                        }}
                    >
                        { props.children }
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AppBar;

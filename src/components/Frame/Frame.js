import {Avatar, Dropdown, Layout, Menu, message, Badge} from 'antd';
import {CaretDownOutlined} from '@ant-design/icons';
import {adminRoutes} from "../../routes";
import {useNavigate} from "react-router-dom";
import {clearToken} from "../../utils/auth";
import {connect} from "react-redux";

import logo from './logo.svg';
import './Frame.css';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

const routes = adminRoutes.filter(e => e.isShow);

function Frame(props) {// props 获取传进来的子组件
    // console.log("store里的数据：");console.log(props);
    let navigate = useNavigate();

    const popMenu = (
        <Menu onClick={e => {
            if (e.key === 'logOut') {
                clearToken();
                document.location.href = '/login';
            } else if (e.key === 'notice') {
                // document.location.href = '/admin/notices'
                navigate('/admin/notices')
            } else {
                message.info(e.key); // pop tip
            }
        }}>
            <Menu.Item key='notice'>通知中心</Menu.Item>
            <Menu.Item key='setting'>设置</Menu.Item>
            <Menu.Item key='logOut'>退出</Menu.Item>
        </Menu>
    )
    return (
        <Layout>
            <Header className="header" style={{backgroundColor: 'rgba(0,234,255,0.38)'}}>
                <div className="logo" style={{width: 90}}>
                    <img src={logo} alt="logo"/>
                </div>
                <Dropdown overlay={popMenu}>
                    <div>
                        <Avatar>dafs</Avatar>
                        <Badge dot={!props.isAllRead}>
                            <span style={{color: 'rgba(183,0,0,0.7)'}}>超级管理员</span>
                        </Badge>
                        <CaretDownOutlined/>
                    </div>
                </Dropdown>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{height: '100%', borderRight: 0}}
                    >
                        {
                            routes.map(route => {
                                return (
                                    <Menu.Item
                                        onClick={() => navigate(route.path)}
                                        key={route.path}>
                                        {route.icon}
                                        {route.title}
                                    </Menu.Item>
                                )
                            })
                        }
                    </Menu>
                </Sider>
                <Layout style={{padding: '2px'}}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        {props.children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
}
// 这个 state=>state.notices 灵魂
export default connect(state=>state.notices)(Frame);


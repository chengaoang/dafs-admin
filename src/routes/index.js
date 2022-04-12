import Login from "../pages/Login";
import List from "../pages/admin/products/List";
import Edit from "../pages/admin/products/Edit";
import PageNotFound from "../pages/PageNotFound";
import Index from "../pages/admin/dashboard/Index";
import {ShopTwoTone, PieChartTwoTone} from '@ant-design/icons';
import Notice from "../pages/admin/notices/Notice";
import CategoryList from "../pages/admin/category/categoryList";
import CategoryEdit from "../pages/admin/category/categoryEdit";
import UserList from "../pages/admin/users/userList";
import UserEdit from "../pages/admin/users/UserEdit";
import Talk from "../pages/admin/talk/Talk";

export const mainRoutes = [
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/404",
        element: <PageNotFound/>
    }
]

export const adminRoutes = [
    {
        path: "/admin/dashboard",
        element: <Index/>,
        isShow: true,
        title: "看板",
        icon: <PieChartTwoTone />,
    }, {
        path: "/admin/notices",
        element: <Notice/>,
        isShow: false
    }, {
        path: "/admin/products",
        element: <List/>,
        isShow: true,
        title: "商品管理",
        icon: <ShopTwoTone />,
    }, {
        //https://segmentfault.com/a/1190000041136562
        // v6 路由参数
        path: "/admin/products/edit/:id",
        element: <Edit/>,
        isShow: false
    }, { // temp
        path: "/admin/products/edit",
        element: <Edit/>,
        isShow: false
    },  { // 产品管理
        path: "/admin/category",
        element: <CategoryList/>,
        isShow: true,
        title: "栏目管理",
        icon: <ShopTwoTone/>
    }, {
        path: "/admin/category/edit/:id",
        element: <CategoryEdit/>,
        isShow: false
    }, { // temp
        path: "/admin/category/edit",
        element: <CategoryEdit/>,
        isShow: false
    }, { // 用户管理
        path: "/admin/user",
        element: <UserList/>,
        isShow: true,
        title: "用户管理",
        icon: <ShopTwoTone/>
    }, {
        path: "/admin/user/edit/:id",
        element: <UserEdit/>,
        isShow: false
    }, {
        path: "/admin/user/edit",
        element: <UserEdit/>,
        isShow: false
    }, {
        path: "/admin/talk",
        element: <Talk/>,
        title: "聊天",
        isShow: true,
        icon: <ShopTwoTone/>
    }
]

import {Button, Card, Table, Popconfirm} from "antd";
import {useNavigate} from "react-router-dom"; // 路由跳转的hook
import {postUser,deleteUser,putUser,getById,getAll} from "../../../services/user";
import {useEffect, useState} from "react";

function UserList() {
    let navigate = useNavigate(); // 路由跳转
    const [dataSource, setDataSource] = useState([]); // 数据源
    let [total, setTotal] = useState(0); // 总页数，用于分页
    const [currentPage,setCurrentPage] = useState(1); // 设置当前页

    /**
     * 组件初始化时获取list
     */
    useEffect(() => {
        getAll().then(res => {
            setDataSource(res.data)
            // setTotal(res.data.count);
        });
    }, []);

    const loadData = (page) => {
        // categoryListApi(page).then(res => {
        //     setDataSource(res.data.category) // 设置数据集合
        //     setTotal(res.data.count); // 设置数据总条数
        //     setCurrentPage(page); // 设置当前页码
        // });
        getAll().then(res => {
            setDataSource(res.data)
            // setTotal(res.data.count);
        });
    }
    const columns = [
        {
            title: '序号',
            key: 'id',
            width: 80,
            align: 'center',
            render: (txt, record, index) => index + 1 // 设置序号递增
        }, {
            title: '用户名',
            dataIndex: 'userName',
        }, {
            title: '邮箱',
            dataIndex: 'email',
        }, {
            title: '状态',
            dataIndex: 'status',
            render: ((txt, record) => record.status==0?'正常':'已关闭'),
        }, {
            title: '操作',
            render: (txt, record, index) => {
                return (
                    <div>
                        {/*1：修改按钮*/}
                        <Button type="primary" size="small" onClick={()=>{
                                // 点击编辑的时候，带id跳转
                                navigate(`/admin/user/edit/${record.id}`)
                            }}>修改</Button>
                        {/*2：删除按钮*/}
                        <Popconfirm title="确定删除这个？"
                            onCancel={() => console.log("取消了")}
                            onConfirm={() =>{
                                console.log(record)
                                // 调用service处理删除
                                deleteUser(record.id).then((res)=>loadData(currentPage))
                            }}><Button style={{marginLeft: 5}} type="danger" size="small">删除</Button></Popconfirm>
                        {/*3：修改状态*/}
                        <Button type="primary" size="small" style={{marginLeft: 5}}
                            onClick={()=>{
                                putUser({...record,status:(record.status==1?0:1)}).then(res=>{
                                    loadData(currentPage);
                                })
                            }}>{record.status==0?"停用":"启用"}</Button>
                    </div>
                )
            }
        }
    ]
    return (
        // 4: 新增按钮
        <Card title="栏目列表" extra={<Button type="primary" size="small" onClick={() => navigate('/admin/user/edit')}>新增</Button>}>
            <Table rowKey='id'
                   rowClassName={record => record.status==0?"":"bg-red"}
                   pagination={{total, defaultPageSize: 4, onChange: loadData}} columns={columns} dataSource={dataSource}/>
        </Card>
    )
}
export default UserList;

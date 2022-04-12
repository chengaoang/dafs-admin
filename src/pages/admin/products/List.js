import {Button, Card, Popconfirm, Table} from "antd";
import {useNavigate} from "react-router-dom";
import {listApi,delOne, modifyOne} from "../../../services/products";
import {useEffect, useState} from "react";
import './List.css';
import BraftEditor from "braft-editor";
// redux
import {connect} from "react-redux";
import {loadProduct} from '../../../store/actions/product'
//~~

function List(props) {
    // console.log("list redux props: ");console.log(props); // redux

    const [dataSource, setDataSource] = useState([]);
    let [total, setTotal] = useState(0); // 分页
    const [currentPage,setCurrentPage] = useState(1); // 设置当前页
    /**
     * 组件初始化时获取list
     */
    useEffect(() => {
        props.dispatch(
            loadProduct({
                page: 2,
                name: "小米"
            })
        )
        listApi().then(res => {
            // console.log(res)
            setDataSource(res.data.products)
            setTotal(res.data.count);
        });
    }, []);

    const loadData = (page) => {
        // console.log(page)
        listApi(page).then(res => {
            setDataSource(res.data.products)
            setTotal(res.data.count);
            setCurrentPage(page); // 设置当前页码
        });
    }

    let navigate = useNavigate();

    const columns = [
        {
            title: '序号',
            key: 'pid',
            width: 80,
            align: 'center',
            render: (txt, record, index) => index + 1
        },
        {
            title: '名字',
            dataIndex: 'name',
        },
        {
            title: '描述',
            dataIndex: 'desc',
            render: (txt, record, index) =>(
                BraftEditor.createEditorState(txt).toText()
            )
        },
        {
            title: '图片',
            dataIndex: 'images',
            render: (txt, record, index) =>
                record.images?(
                    <img src={"http://localhost:8888"+record.images} alt={record.name} style={{width: 120}}/>
                ):("暂无图片")
        },
        {
            title: '是否在售',
            dataIndex: 'status',
            render: ((txt, record) => record.status==0?'在售':'已下架')
        },
        {
            title: '操作',
            render: (txt, record, index) => {
                return (
                    <div>
                        <Button type="primary" size="small" onClick={()=>{
                            // 点击编辑的时候，带id跳转
                            navigate(`/admin/products/edit/${record.pid}`)
                        }}>修改</Button>

                        <Popconfirm title="确定删除这个？"
                                    onCancel={() => console.log("取消了")}
                                    onConfirm={() =>{
                                        console.log("确认删除")
                                        // 处理删除
                                        delOne(record.pid)
                                            .then(res=>{
                                                loadData(currentPage);  // TODO 不能老加载第一页
                                            })
                                    }}
                        >
                            <Button style={{marginLeft: 5}} type="danger" size="small">删除</Button>
                        </Popconfirm>

                        <Button type="primary" size="small" style={{marginLeft: 5}}
                            onClick={()=>{
                                // 修改在售状态
                                modifyOne(
                                    record.pid,
                                    {...record,status: ((record.status==null||record.status===1)?0:1)}
                                ).then(res=>{
                                    loadData(currentPage);
                                })
                            }}
                            >{record.status==0?"下架":"上架"}</Button>
                    </div>
                )
            }
        }
    ]


    return (
        <Card title="商品列表" extra={
            <Button type="primary" size="small"
                    onClick={() => navigate('/admin/products/edit')}
            >
                新增
            </Button>
        }>
            <Table rowKey='pid'
                   rowClassName={record => record.status==0?"":"bg-red"}
                   pagination={{total, defaultPageSize: 4, onChange: loadData}} columns={columns} dataSource={dataSource}/>
        </Card>
    )
}

export default connect(state=>state)(List); // redux

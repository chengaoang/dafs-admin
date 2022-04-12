import {Form, Card, Input, Button, message, Upload, Select, Space} from "antd";
import {postUser,deleteUser,putUser,getById,getAll} from "../../../services/user";
import {LoadingOutlined, PlusOutlined, MinusCircleOutlined} from '@ant-design/icons';
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import {serverUrl} from "../../../utils/config";
import BraftEditor from 'braft-editor'; // 引入编辑器组件
import 'braft-editor/dist/index.css'
import {Option} from "antd/es/mentions";
// 引入编辑器样式


// TODO fix side 100% height bug

function UserEdit() {
    const [loading,setLoading] = useState(false);
    const {id} = useParams(); // router 路由参数, 是个对象
    const [form] = useForm();
    const Option = Select.Option; // `children` should be `Select.Option` or `Select.OptGroup` instead of `Option`.

    useEffect(()=>{// 不effect就无限了
        if (id!==undefined){
            getById(id).then(res=> {
                res.data.password="";
                form.setFieldsValue(res.data)
            });
        }
    },[]);

    // 输入约束
    const priceValidate = (rule, value, callback) => {
        // TODO Warning: `callback` is deprecated. Please return a promise instead.
        if ((value*1)>1 || (value*1)<0){
            callback("1或者0");
        }else {
            callback();
        }
    }

    const onFinish = (values) => {
        if (id!==undefined){ // params 中存的url中的pid，有则是修改，没有则是新增
            // 1: 修改
            putUser({id,...values}) // 对富文本做特殊处理
                .then(res=>{
                    if (res.code === 200){
                        message.success(res.msg);
                        document.location.href='/admin/user';
                    }else {
                        message.error("修改失败！");
                    }
                }).catch(err=>{
                    console.log(err)
                })
        }else {
            // 2: 新增
            postUser(values)
                .then(res=>{
                    if (res.code === 200){
                        message.success("添加成功！");
                        document.location.href='/admin/user';
                    }else {
                        message.error("添加失败");
                    }
                }).catch(err=>{
                    console.log(err)
                })
        }
    };

    return(
        <Card title='栏目编辑'>
            <Form onFinish={onFinish} form={form}>
                {/*1：用户名*/}
                <Form.Item name='userName' label='用户名' rules={[{required: true, message: '请输入用户名'}]}>
                    <Input placeholder='请输入用户名'/>
                </Form.Item>
                {/*2：邮箱*/}
                <Form.Item name='email' label='邮箱' rules={[{required: true, message: '请输入邮箱'}]}>
                    <Input placeholder='请输入邮箱'/>
                </Form.Item>
                {/*/!*3：状态*!/*/}
                {/*<Form.Item name='status' label='状态'*/}
                {/*           rules={[*/}
                {/*               {required: true, message: '请输入用户的状态'},*/}
                {/*               {validator: priceValidate}*/}
                {/*           ]}>*/}
                {/*    <Input placeholder='请输入栏目状态：1启用，0不启用'/>*/}
                {/*</Form.Item>*/}
                {/* 角色 */}
                <Form.Item name='userType' label='角色' rules={[{required: true}]} style={{width: 400}}>
                    <Select>
                        <Option value='1'>管理员</Option>
                        <Option value='2'>普通用户</Option>
                    </Select>
                </Form.Item>
                {/* 改密码 */}
                <Form.Item name='password' label='修改密码' style={{width: 400}}>
                    <Input placeholder='不修改密码则保持空！'/>
                </Form.Item>
                {/*5：保存按钮*/}
                <Form.Item>
                    <Button htmlType='submit' type='primary'>保存</Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
export default UserEdit;

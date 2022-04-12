import {Form, Card, Input, Button, message, Upload} from "antd";
import {categoryCreateApi,selectById,modifyOneById} from "../../../services/category";
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import {serverUrl} from "../../../utils/config";
import BraftEditor from 'braft-editor'; // 引入编辑器组件
import 'braft-editor/dist/index.css'// 引入编辑器样式


// TODO fix side 100% height bug

function CategoryEdit() {
    const [loading,setLoading] = useState(false);
    const [editorState,setEditorState] = useState(BraftEditor.createEditorState(null)); // 富文本: 创建一个空的editorState作为初始值
    const {id} = useParams(); // router 路由参数, 是个对象
    const [form] = useForm();

    useEffect(()=>{// 不effect就无限了
        if (id!==undefined){
            selectById(id).then(res=>
            {
                console.log(res)
                form.setFieldsValue(res.data)
                setEditorState(BraftEditor.createEditorState(res.data.desc))
            });
        }
    },[]);

    // 富文本编辑
    const handleEditorChange = (editorState) => {
        setEditorState(editorState)
    }

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
            modifyOneById(id, {...values, desc: editorState.toHTML()}) // 对富文本做特殊处理
                .then(res=>{
                    if (res.code === 200){
                        message.success(res.msg);
                        document.location.href='/admin/category';
                    }else {
                        message.error("添加失败！");
                    }
                }).catch(err=>{
                    console.log(err)
                })
        }else {
            // 2: 新增
            categoryCreateApi({...values, desc: editorState.toHTML()})
                .then(res=>{
                    if (res.code === 200){
                        message.success("添加成功！");
                        document.location.href='/admin/category';
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
                {/*1：标题*/}
                <Form.Item name='name' label='标题' rules={[{required: true, message: '请输入栏目的标题'}]}>
                    <Input placeholder='请输入栏目的标题'/>
                </Form.Item>
                {/*2：标题*/}
                <Form.Item name='path' label='路由' rules={[{required: true, message: '请输入栏目的路由'}]}>
                    <Input placeholder='请输入栏目的路由'/>
                </Form.Item>
                {/*3：状态*/}
                <Form.Item name='status' label='状态'
                           rules={[
                               {required: true, message: '请输入栏目的状态'},
                               {validator: priceValidate}
                           ]}>
                    <Input placeholder='请输入栏目状态：1正常，0不显示'/>
                </Form.Item>
                {/*4：描述*/}
                <Form.Item  label='描述' >
                    <BraftEditor value={editorState} onChange={handleEditorChange}/>
                </Form.Item>
                {/*5：保存按钮*/}
                <Form.Item>
                    <Button htmlType='submit' type='primary'>保存</Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
export default CategoryEdit;

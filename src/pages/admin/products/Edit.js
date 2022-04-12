import {Form, Card, Input, Button, message, Upload, Select} from "antd";
import {createApi,getOneByID,modifyOne} from "../../../services/products";
import {getAll} from "../../../services/category";
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import {serverUrl} from "../../../utils/config";
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import {Option} from "antd/es/mentions";
import axios from "axios";
// fix side 100% height bug

function Edit() {
    let [category,setCategory] = useState([]);
    const [imageUrl,setImageUrl] = useState('');
    const [loading,setLoading] = useState(false);
    // 创建一个空的editorState作为初始值
    const [editorState,setEditorState] = useState(BraftEditor.createEditorState(null)); // 富文本
    const pid = useParams();
    const Option = Select.Option; // `children` should be `Select.Option` or `Select.OptGroup` instead of `Option`.
    /**
     * params 中存的url中的pid，有则是修改，没有则是新增
     */
    const [form] = useForm();
    useEffect(()=>{
        // 不effect就无限了
        if (pid.id!==undefined){
            getOneByID(pid.id).then(res=>
            {
                setImageUrl(res.data.images);
                form.setFieldsValue(res.data)
                setEditorState(BraftEditor.createEditorState(res.data.desc))
            });
        }
        // 获取栏目列表
        getAll().then(resp=>{
            setCategory(resp.data);
        })
    },[]);
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    // 文件上传
    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // 上传成功
            setLoading(false);
            console.log("图片上传后的地址："+info.file.response.msg)
            setImageUrl(info.file.response.msg);
        }
    };
    // 富文本编辑
    const handleEditorChange = (editorState) => {
        setEditorState(editorState)
    }
    //
    // const priceValidate = (rule, value, callback) => {
    //     // TODO Warning: `callback` is deprecated. Please return a promise instead.
    //     if ((value*1)>1 || (value*1)<0){
    //         callback("1或者0");
    //     }else {
    //         callback();
    //     }
    // }
    const onFinish = (values) => {
        //https://ant.design/components/form/v3-cn
        // v4 good
        // console.log('Received values of form: ', values);
        console.log(values)
        if (pid.id!==undefined){
            console.log("调用修改接口");
            //修改
            modifyOne(pid.id, {...values, images: imageUrl, desc: editorState.toHTML()})
            .then(res=>{
                if (res.code == 200){
                    message.success(res.msg);
                    document.location.href='/admin/products';
                }else {
                    message.error("添加失败");
                }
                console.log(res)
            }).catch(err=>{
                console.log(err)
            })
        }else {
            console.log("调用新增接口")
            // 调用接口post对象
            createApi({...values, images: imageUrl, desc: editorState.toHTML()})
            .then(res=>{
                if (res.code == 200){
                    message.success("添加成功！");
                    document.location.href='/admin/products';
                }else {
                    message.error("添加失败");
                }
                console.log(res)
            }).catch(err=>{
                console.log(err)
            })
        }
    };
    return(
        <Card title='商品编辑'>
            <Form onFinish={onFinish} form={form}>
                <Form.Item name='cid' label='栏目' rules={[{required: true}]} style={{width: 400}}>
                    <Select>
                        {category.map(c=>
                            <Option value={c.id} key={c.id}>{c.name}</Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item name='name' label='名字' rules={[{required: true, message: '请输入商品的名字'}]}>
                    <Input placeholder='请输入商品名字'/>
                </Form.Item>
                {/*<Form.Item name='status' label='状态'*/}
                {/*           rules={[*/}
                {/*               {required: true, message: '请输入商品的状态'},*/}
                {/*               {validator: priceValidate}*/}
                {/*           ]}>*/}
                {/*    <Input placeholder='请输入商品状态'/>*/}
                {/*</Form.Item>*/}
                {/*<Form.Item name='images' label='图片' rules={[{required: true, message: '请输入图片'}]}>*/}
                {/*    <Input placeholder='还没写好接口，瞎写吧'/>*/}
                {/*</Form.Item>*/}
                {/*<Form.Item name='desc'rules={[{required: true, message: '请输入商品的描述'}]}>*/}
                {/*    <Input placeholder='请输入商品描述'/>*/}
                {/*</Form.Item>*/}
                <Form.Item label='主图'>
                    <Upload
                        name="images" // 数据库用image把，，别带s了，记得改 TODO
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={serverUrl+"/public/file/upload"}
                        // beforeUpload={()=>{}}
                        onChange={(info)=>handleChange(info)}
                    >
                        {/* 能上传文件，但是没有写查看文件的接口，所以用一个文件服务器分发一下，python -m http.server */}
                        {/* springBoot 静态文件放行就不用起python服务器了 */}
                        {imageUrl ? <img src={serverUrl+imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item  label='描述' >
                    <BraftEditor
                        value={editorState}
                        onChange={handleEditorChange}
                        // onSave={this.submitContent}
                    />
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit' type='primary'>保存</Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
export default Edit;

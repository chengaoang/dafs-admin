import {Button, Card, Checkbox, Form, Input, message} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {setToken} from "../utils/auth";
import {loginApi} from "../services/auth";
import './login.css';

function Login() {
    const onFinish = (values) => {
        console.log(values)
        /**
         * 登录api
         */
        loginApi({
            userName: values.username,
            password: values.password,
        }).then(res=>{
            console.log(res)
            if (res.code==200){
                message.success('登录成功！');
                setToken(res.data.token)
                document.location.href="/admin/dashboard";
            }else {
                message.info(res.msg);
            }
        }).catch(err=>{
            message.error('用户不存在！')
        })
        // setToken('调用接口');
        // document.location.href='/admin';
        // console.log('Received values of form: ', values);
    };
    return (
    <Card title='dafs Admin Login' className="login-form">
        <Form
            name="normal_login"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
        >
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: '输入用户名！',
                    },
                ]}
            >
                <Input
                    prefix={<UserOutlined className="site-form-item-icon"/>}
                    placeholder="用户名"
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: '输入密码！',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    type="password"
                    placeholder="密码"
                />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住账号密码</Checkbox>
                </Form.Item>
                {/*<a className="login-form-forgot" href="">*/}
                {/*    Forgot password*/}
                {/*</a>*/}
            </Form.Item>

            <Form.Item style={{float: "right"}}>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                {/*Or <a href="">register now!</a>*/}
            </Form.Item>
        </Form>
    </Card>
    )
}

export default Login;

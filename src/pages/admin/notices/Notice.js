import {Button, Card, List, Typography} from 'antd';
import {connect} from "react-redux";

const data = ['第一条消息', '第二条消息', '第三条消息', '第四条消息', '第五条消息',];


function Notice(props) {
    console.log("notice 组件中传入的 store：");
    console.log(props)
    return (
        <Card title="通知中心" extra={<Button type="primary"
                                          onClick={() => props.dispatch({type: 'READ_ALL'})}
        >全部已读</Button>}>
            {/*<Divider orientation="center">通知中心</Divider>*/}
            <List
                // header={<div>通知</div>}
                // footer={<div style={{display: "flex",  justifyContent: "flex-end"}}></div>}
                bordered
                dataSource={data}
                renderItem={item => (<List.Item style={{display: "flex", alignContent: "space-between"}}>
                    <Typography.Text mark>[ITEM]</Typography.Text> {item}
                    <Button type="dashed">已读</Button>
                </List.Item>)}
            />
        </Card>)
}

export default connect(state => state)(Notice);

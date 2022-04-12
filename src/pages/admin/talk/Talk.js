import {useState} from "react";
import {getToken} from "../../../utils/auth";
import {Avatar, Button, Card, List} from "antd";

let websocket = null;
//判断当前浏览器是否支持WebSocket
if ('WebSocket' in window) {
    console.log("webSocket starting....")
    websocket = new WebSocket("ws://localhost:8888/websocket" +
        "?token="+getToken());
} else {
    alert('Not support websocket')
}
//连接发生错误的回调方法
websocket.onerror = function () {
    setMessageInnerHTML("WebSocket连接发生错误");
};
//连接成功建立的回调方法
websocket.onopen = function () {
    setMessageInnerHTML("WebSocket连接成功");
}

//连接关闭的回调方法
websocket.onclose = function () {
    setMessageInnerHTML("WebSocket连接关闭");
}
//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function () {
    closeWebSocket();
}
//将消息显示在网页上
function setMessageInnerHTML(innerHTML) {
    // document.getElementById('message').innerHTML += innerHTML + '<br/>';
}
//关闭WebSocket连接
function closeWebSocket() {
    websocket.close();
}
//发送消息
// function send(id) {
//     let message = document.getElementById('text').value;
//     websocket.send(message);
// }

function Talk() {

    // =================================================================================================================
    // 消息列表状态
    let [message, setMessage] = useState({
        // '2022-3-12 16:30:10': {
        //     form: 'me',
        //     message: 'this is a messagethis is a messagethis is a messagethis is a messagethis is a messagethis is a messagethis is a messagethis is a messagethis is a messagethis is a messagethis is a messagethis is a message'
        // },
        // '2022-3-12 16:40:10': {
        //     form: 'manager',
        //     message: 'this is a manager message'
        // }
    });
    let [online,setOnline] = useState([]);
    let [talkingUserName,setTalkingUserName] = useState('');

    // 接收到消息的回调方法
    websocket.onmessage = function (event) {
        let data = JSON.parse(event.data);
        console.log(data)
        /** 服务端数据结构
         *  {
         *    "2022-03-31 17-32-17": {
         *      "msg": "欢迎：root",
         *      "from": "manager",
         *      "to": "me"
         *     }
         *  }
         */
        if (data.online){
            setOnline(data.online);
        }else {
            for (let i in data){
                let msg = data[i].msg;
                setMessage({...message, [i]: {form: "manager", message: msg}});
            }
        }
    }


    // 更新消息状态
    function sendMessage() {
        // 获取当前时间
        let date = new Date();
        let formatted_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        // 获取输入框数据
        let value = document.querySelector(".message").value;
        if (value.length === 0) return
        // 添加一个消息框，调用hook，设置状态
        setMessage({...message, [formatted_date]: {form: 'me', message: value}});
        // 发送消息
        websocket.send(JSON.stringify({[formatted_date]: {msg:value,from:"manager",to:talkingUserName}}));
        // 重置消息框
        document.querySelector(".message").value = "";
    }

    // 生成聊天页面
    let messageResult = [];
    for (let i in message) {
        let key = i;
        let form = message[key].form;
        let mess = message[key].message;
        if (form === 'me') {
            messageResult.push(<Me time={key} message={mess} key={key}/>)
        } else if (form === 'manager') {
            messageResult.push(<Manager time={key} message={mess} key={key}/>)
        }
    }

    return (
        <div style={style.container}>
            {/* 在线用户 */}
            <OnlineBox style={{width: '20%'}} onlineUser={online} setTalkingUserName={e=>setTalkingUserName(e)}/>
            <div style={{width: '80%'}}>
                {/* 聊天框 */}
                <div style={style.talk}>
                    {/*<Me message={"这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文这里是中文"}/>*/}
                    {/*<Manager message={"this is english,this is english,this is english,this is english,this is english,this is english,this is english,this is english,this is english,this is english,this is english,this is english,"}/>*/}
                    {messageResult.map(e => e)}
                </div>
                {/*底部的input和send*/}
                <div style={style.bottomTool}>
                    <div style={style.message}>
                        <input className='message' type="text" style={style.input}/>
                    </div>
                    <div style={{border: "solid white 1px"}}>
                        <button onClick={() => sendMessage()}>{talkingUserName!==''?`send to ${talkingUserName}`:'select a user to talk!'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
const OnlineBox = ({style,onlineUser,setTalkingUserName})=>{
    const data = [];
    for (let i of onlineUser){
        data.push({name: i});
    }
    return(
        <div style={{...style,marginRight: 20}}>
            <Card title='在线用户'>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                description={<Button onClick={()=>setTalkingUserName(item.name)}>{item.name}</Button>}
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    )
}

// 两个角色的消息框组件
const Me = ({
                time,
                message,
                img = "url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBoRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAExAAIAAAASAAAATgAAAAAAAABgAAAAAQAAAGAAAAABUGFpbnQuTkVUIHYzLjUuMTAA/9sAQwAHBQUGBQQHBgUGCAcHCAoRCwoJCQoVDxAMERgVGhkYFRgXGx4nIRsdJR0XGCIuIiUoKSssKxogLzMvKjInKisq/9sAQwEHCAgKCQoUCwsUKhwYHCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq/8AAEQgAMgAyAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A8wre0/w55qLLqM62ysMrEWAdh+PSl8M6fFLMbu5K7YziNT3b1/CqniRLq98UA2SlhHGobnA55FdbajHmZwxTnLlRtm78NabDGhs/tEwchmVfMGD0znvn0pqahoN3fCH+z0RcHcWiKY4745/KuUVtTtdSFtJCvmxHmN+317Gp5dTthGZXUSXPJJVsh1PUH1rP2rZt7GKOi1LwxHIv2jRg20jPks4b64b+h/OuZZWRyrqVZTggjBBrZ0PWftFwkA8xImTpu7gVJr1kpX7UhzJ0cZ5I9a0umtDJxcWYVFFFBJ1WlKkOmQASYyoYjZnk81aukuLHTP7YFtDeW6zJEFmyu4555H8PQemaz9NmR9PhO45C7T+HFa1rrk9iwSZ3vLJU+WyaVUCsDncMjJI64H41riYRVHmS7E4KbliOWT7nPePtPvbm8j1trWSyF3GpkgkYEbl4BBHTjHBrn49GkfRLnUpn2tBgtFj76k4GD/e749K63xb4gtdTtp4LeRismGVyOmDnpWBq2pXd74ZsdPjG2GCTdHDEnzSN/ebHLH+VeXBuyR7E4wu35EXhKKObVCRnMKMwY+hwAPz5rrJ7bzYXTfu3Ag5yKwfC+nNZvcPPJHvdQDGnJjOehPTPsOlb0zLFA8m/hVJ/SvXo0oundnhV6slU5UcjRRRXPY3Luk3giYwSHCscqfetfULXOlR3TXIhZ2ZYfLILHHDkjsO3PJPSuXqeC5aPzd5ZjIQdxOcEDFa+0fJyEKmvac5myyQWJlRZnkkTHytjoeuPepLaa9vi4ib7LbOMyFG5KjtnrVMabPd30gcrCjMSZGPQf1NbF0i29pHBAUlbABVT8pPqSOwrljDW53c+lrl/RWxvymyDAWPjsPSpdVnVF8iNsk8tz0HpVFLloowEYvJjBkIwB7AdhUGSxJJyT1JrpU2o8py1IwlJS6hRS0VAiKiiikUKKUUUUxC0ooooAKKKKQH/2Q==)"
            }) => {
    return (
        <div style={style.meMessage}>
            <div style={style.meTime}>{time}</div>
            <div style={style.meMessageLeft}>{message}</div>
            <div style={{...style.meMessageRight, backgroundImage: img}}/>
        </div>
    )
}
const Manager = ({
                     time,
                     message,
                     img = "url(data:image/jpeg;base64,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)"
                 }) => {
    return (
        <div style={style.managerMessage}>
            <div style={{...style.managerMessageRight, backgroundImage: img}}/>
            <div style={style.managerMessageLeft}>{message}</div>
            <div style={style.managerTime}>{time}</div>
        </div>
    )
}
export default Talk;

/*~~~~~~~~~~~~ css in js ~~~~~~~~~~*/
let style = {
    input: {
        width: "100%",
    },
    bottomTool: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        marginTop: "-63px",
    },
    container: {
        display: "flex",
        height: "100%",
        flexDirection: "row"
    },
    message: {
        width: "80%"
    },
    messageInput: {
        width: "100%"
    },
    messageSend: {
        border: "solid white 1px"
    },
    talk: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    meMessage: {
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
    },
    meMessageLeft: {
        overflow: "hidden",
        backgroundColor: "#1e3c58",
        padding: "20px",
        borderRadius: "10px",
        marginRight: "10px",
        wordWrap: "break-word", // !
        width: "80%",
        marginTop: "10px"
    },
    meMessageRight: {
        width: "50px",
        height: "50px",
        borderRadius: "50px"
    },
    managerMessage: {
        color: "#0EC879",
        display: "flex",
        justifyContent: "start",
        alignItems: "center"
    },
    managerMessageLeft: {
        backgroundColor: "#1e3c58",
        padding: "20px",
        borderRadius: "10px",
        marginLeft: "10px",
        wordWrap: "break-word", // !
        width: "80%",
        marginTop: "10px"
    },
    managerMessageRight: {
        width: "50px",
        height: "50px",
        borderRadius: "50px",
    },
    meTime: {
        color: "black",
        paddingRight: "15px"
    },
    managerTime: {
        color: "black",
        paddingLeft: "20px"
    },
}



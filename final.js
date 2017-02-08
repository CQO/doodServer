"use strict";
const http = require("http");
const service = require('./Release/nodeService');
const events = require('events');

const client = new service.client();
const info  = {
    version:'1.5.0',
    deviceType: 2,
    deviceInfo: 'pc-windows',
    appName: 'nodeImsdk',
    netType:'wifi',
    mac: '12345',
    local: 'zh_CN'
};

const clientId = client.startup('C:\\Users\\Alexmurder\\Desktop\\sql','C:\\Users\\Alexmurder\\Desktop\\nodejs\\Release\\linkdood.crt',info);

const notify = new events.EventEmitter();
const auth = client.authService();
const contact = client.contactService();
const chat = client.chatService();
let list = "";

chat.regMsgNoticeCb(function(message){
	console.log('接收到新消息:');
	console.log(message);
});	

function landing(postdata,response){
	console.log(`[尝试]登陆`);
	const local = auth.login('008617791430604', '1', 1, 'vrv',function(resp){
		switch(resp.code){
			case 0:{
				console.log('[成功]登录');
				console.log('用户ID' + resp.userId);
				notify.emit('getContactList');	
				//notify.emit('sendMessage');
				const msg={"code":0,"msg":resp.userId};
				response.write(JSON.stringify(msg));
				response.end();
				break;
			}
			case 113:{
				console.log('[失败]已经登陆过了!');
				const msg={"code":113,"msg":"[失败]已经登陆过了!"};
				response.write(JSON.stringify(msg));
				response.end();
				break;
			}
		}
	});	
	//获取好友列表
	notify.on('getContactList', function(data){
		contact.getContactList(function(contacts){
			list = contacts;
		});
	});
}
//发送消息	
/*
function sendMessage(postdata,response){
	const msg = {targetId:4328632689, message:'{"body": "hello"}', msgProperty: '', isBurn:0, messageType: 2};
	notify.on('sendMessage', function(data){
		chat.sendMessage(msg, function(resp){
			if(resp.code ===0){
				console.log('发送成功1');
			}
		});
	});
}
*/
//登出
function logout(postdata,response){
	auth.logout(function(resp){
		console.log("logout");
	})
}
//返回好友列表
function friend(postdata,response){
	contact.getContactList(function(contacts){
		const msg={"code":0,"msg":contacts};
		console.log(msg);
		response.write(JSON.stringify(msg));
		response.end();
		logout(postdata,response);
		console.log("wwe");
	});
	
}	

//收到未知命令
function def(response){
	const msg={"code":999,"msg":"未知命令"};
	response.write(JSON.stringify(msg));
	response.end();
}

let server = function(request,response){  
    response.writeHead(200,{
		"Content-Type":"text/json",
		"Access-Control-Allow-Origin":"*",
		"Access-Control-Allow-Methods":"POST",
		"Access-Control-Allow-Headers":"x-requested-with,content-type"
	});
    if(request.method === "GET"){
        response.write("收到GET请求");
        response.end();
    }else{
        let postdata = "";
        request.addListener("data",function(postchunk){
            postdata += postchunk;
        });
        request.addListener("end",function(){
			console.log(`[收到消息]${postdata}`);
			switch(postdata){
				case "Landing":landing(postdata,response);break;
				case "friendsList":friend(postdata,response);break;
				default:def(response);
			}
        });
    }
};

http.createServer(server).listen(3000);  
console.log("正在监听!");  
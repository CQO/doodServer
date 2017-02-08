"use strict";
const http = require("http");
const service = require('./Release/nodeService');
const events = require('events');

const client = new service.client;
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

const notify = new events.EventEmitter;
const auth = client.authService();
const contact = client.contactService();
const chat = client.chatService();
let Loginstat="empty";let list = "";

	chat.regMsgNoticeCb(function(message){
					console.log('接收到新消息:');
					console.log(message);
				});						
				
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
        })

        request.addListener("end",function(){
			console.log(Loginstat);
			console.log(postdata);
			if(postdata=="Landing"){
				console.log("登："+postdata);
				Loginstat = postdata ;
				const local = auth.login('008617791430604', '1', 1, 'vrv',function(resp){
					if(resp.code == 0){					
						console.log('登录成功!');
						console.log('用户ID' + resp.userId);
						notify.emit('getContactList');	
						notify.emit('sendMessage');
						response.write(""+resp.userId);
						response.end();
					}
				});	
				
				const msg = {targetId:4328632689, message:'{"body": "hello"}', msgProperty: '', isBurn:0, messageType: 2};
				notify.on('sendMessage', function(data){
					chat.sendMessage(msg, function(resp){
						if(resp.code ==0){
							console.log('发送成功1');
						}
					});
				})
				//。。。。。
				notify.on('getContactList', function(data){
						contact.getContactList(function(contacts){
							//console.log(contacts);
							list = contacts;
						});
					})
			}
			else if(Loginstat=="Landing" && postdata=="friendsList"){
				    let x=JSON.stringify(list);
					console.log("列："+postdata);
							console.log("list:"+x);
							response.write(""+x);
							response.end();		
			}
			else{
				response.write("没有登陆");
				response.end();
			}
            
        });
    }
};

http.createServer(server).listen(3000);  
console.log("正在监听!");  
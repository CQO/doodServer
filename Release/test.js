const service = require('./Release/nodeService')

let client = new service.client;
let info  = {
    version:'1.5.0',
    deviceType: 2,
    deviceInfo: 'pc-windows',
    appName: 'nodeImsdk',
    netType:'wifi',
    mac: '12345',
    local: 'zh_CN'
};

let clientId = client.startup('C:\\Users\\Alexmurder\\Desktop\\sql','C:\\Users\\Alexmurder\\Desktop\\nodejs\\Release\\linkdood.crt',info);

let auth = client.authService();
let local = auth.login('008617791430604', '1', 1, 'vrv',function(resp){
	console.log(resp.code)
    if(resp.code == 0)
        console.log('登录成功!');
    console.log('用户ID' + resp.userId);
});

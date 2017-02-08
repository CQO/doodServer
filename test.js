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

const local = auth.login('008617791430604', '1', 1, 'vrv',function(resp){
    if(resp.code == 0){
        console.log('登录成功!');
        console.log('用户ID' + resp.userId);
        notify.emit('getContactList');
    }
});

notify.on('getContactList', function(data){
    contact.getContactList(function(contacts){
        console.log(contacts);
    });
})

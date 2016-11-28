/************使用submail发送短信，请提前在submail申请短信服务，相关配置项Start*********************/
var projectIdPowercut = "11"; //templateId
var projectIdPoweron = "11"; //templateId
var appId = "11";
var appKey = "11";
/************使用submail发送短信，请提前在submail申请短信服务，相关配置项End**********************/

//需要定期ping的服务器，通过ping结果来判断是否已经停电
var serverAddresses = ['172.16.227.1'];

//通知短信接收人
var smsReceiver = ["13172475013","18111689381"];

//每10分钟检测一次
var detectPeriod = 1000 * 60 * 10;
//var detectPeriod = 1000 * 5;

var ping = require('ping');
var request = require('request');

//通过该变量保证每次停电只发送一次短信
var isAliveInlast = true;

function doPing() {
    serverAddresses.forEach(function (host) {
        ping.sys.probe(host, function (isAlive) {
            var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
            console.log(msg);

            if (!isAlive) {
                if (isAliveInlast) {
                    sendPowerCut(msg);
                }
                isAliveInlast = false;
            } else {
                if (!isAliveInlast) {
                    sendPowerOn(msg);
                }
                isAliveInlast = true;
            }

            setTimeout(doPing, detectPeriod)
        });
    });
}

function sendPowerCut(msg) {
    sendSMS(msg,projectIdPowercut);
}

function sendPowerOn(msg) {
    sendSMS(msg,projectIdPoweron);
}

function sendSMS(msg,pjId) {
    console.log("send msg:" + msg);

    var sendSmsOptions = {
        strictSSL:false,
        url: "https://api.submail.cn/message/multixsend",
        method: "post",
        json: true,
        body: {
            appid: appId,
            signature: appKey,
            project: pjId,
            multi: buildMultipleNums(),

        }
    };

    request(sendSmsOptions, function (err, response, body) {
        if (err) {
            console.log("SMS send failuer:" + err);
        } else {
            console.log("Send sms response:" + body);
        }
    });
}

function buildMultipleNums() {
    return smsReceiver.map(x => {
        return {
            "to": x
        };
    });
}


doPing();
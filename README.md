# ServerUPSDetecter
用于检测当前是否已经停电并使用UPS供电，如果停电的话会给指定的几个人员发送短信通知。

代码需要运行在一台有UPS供电的设备上，需要保证在停电时网络仍然可以访问，同时将index.js中的serverAddresses设置为一台为UPS供电的设备IP（例如一台路由器）。

详见：http://blog.datafiddle.net/?p=729425


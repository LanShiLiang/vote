### vote-fe为前端代码，vote-re为后端代码。

### 已经打包完成 在后端(vote-re)用node 执行 `node vote.js` 即可在8081端口查看效果

项目已经上线，预览地址 http://www.douti.top

### 前端(vote-fe) `npm start`即可启动开发者模式在本地 3000端口调试预览
* 遇到node-sass报错请阅读此文档改变node-sass版本：https://www.npmjs.com/package/node-sass
#### 关于本项目:

* 框架：**react**、亮点：**websocket**，两个用户可以实时进行投票通信

* `"proxy":"http://localhost:8081/"` 反向代理引入接口解决了跨域的问题

* 将VoteInfo的所有选项进行遍历再创建一个单元来显示投票结果
* 遇到的经典**阻碍**:使用websocket时发生的陈旧闭包问题、节流设置的前端展示问题、删除功能的缓动效果

* 如果在viewVote投票页面遇到打勾打不上的情况 应该是网络问题（后台没写好😂），刷新即可流畅展示

#### 关于注册用户

* 头像上传功能使用antd的avatar组件通过远程CDN上传，由于没有限制上传头像的大小所以遇到**头像文件过大**的情况会导致加载过久
* 已经添加了默认头像，不上传头像亦可注册

##### 下表是初始用户数据

userName 	: Password

kingHan   | 123456

lily		    | 123456

jim		    | 123456

undefined | undefined

mgb	      | 123456

const express = require('express')
const open = require('open')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const fsp = require('fs').promises
const path = require('path')
const svgCaptcha = require('svg-captcha')
const cors = require('cors')
const WebSocket = require('ws')
const http = require('http')
const _ = require('lodash')




const app = express()
const port = 8081

const server = http.createServer(app) //express返回的app就是用来传给createServer的
const wss = new WebSocket.Server({
  server
})

//投票id到定阅这个投票信息更新的websocker的映射
var voteIdMapWs = {}
wss.on('connection', async (ws, req) => {
  var voteId = req.url.split('/').slice(-1)[0]
  console.log('将会把投票', voteId, '的实时信息发送到客户端')

  var voteInfo = await db.get('SELECT rowid AS id, * FROM votes WHERE id = ?', voteId)
  if (Date.now() > new Date(voteInfo.deadline).getTime()) {
    ws.close()
  }

  if (voteId in voteIdMapWs) {
    voteIdMapWs[voteId].push(ws)
  } else {
    voteIdMapWs[voteId] = [ws]
  }

  ws.on('close', () => {
    voteIdMapWs[voteId] = voteIdMapWs[voteId].filter(it => it !== ws)
  })
})

let db
const dbPromise = require('./vote-db.js')

dbPromise.then(value => {
  db = value
})

app.locals.pretty = true

app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

app.use(cors({
  maxAge: 86400,
  origin: 'true',
  credentials: true,
}))

app.use(express.static(__dirname + '/build'))
app.use(express.static(__dirname + '/static'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(express.json()) //Content-Type: application/json
app.use(express.urlencoded({
  extended: true
})) //Content-Type: application/x-www-form-urlencoded
app.use(cookieParser('lkjweoij2o3i409e'))

var sessionStore = Object.create(null)

app.use(function sessionMW(req, res, next) {

  if (req.cookies.sessionId) {
    req.session = sessionStore[req.cookies.sessionId]
    if (!req.session) {
      req.session = sessionStore[req.cookies.sessionId] = {}
    }
  } else {
    let id = Math.random().toString(16).slice(2)

    req.session = sessionStore[id] = {}

    res.cookie('sessionId', id, {
      maxAge: 86400000,
    })
  }

  next()
})

app.use(async (req, res, next) => {
  console.log(req.cookies, req.signedCookies)

  // 从签名cookie中找出该用户的信息并挂在req对象上以供后续的中间件访问
  // user是一个视图，并不是users表，这个视图自带id
  if (req.signedCookies.user) {
    req.user = await db.get('SELECT * FROM user WHERE name = ?', req.signedCookies.user)
  }

  next()
})

// 创建投票
app.post('/vote', async (req, res, next) => {
  if (req.user) {
    /**
     * {
     *   title,
     *   desc,
     *   options: ['foo', 'bar'],
     *   deadline,
     *   anonymous,
     *   isMultiple
     * }
     */

    var voteInfo = req.body
    console.log(voteInfo)
    await db.run(
      'INSERT INTO votes VALUES (?, ?, ?, ?, ?, ?, ?)',
      [voteInfo.title, voteInfo.desc, req.user.id, voteInfo.deadline,
        voteInfo.anonymous, new Date().toISOString(), voteInfo.isMultiple
      ]
      )
      console.log(voteInfo)

    var vote = await db.get('SELECT rowid AS id, * FROM votes ORDER BY id DESC LIMIT 1')
    console.log(voteInfo.options)
    for (var option of voteInfo.options) {
      await db.run(
        'INSERT INTO options VALUES (?, ?, ?)',
        [vote.id, option, 0]
      )
    }

    res.json({
      voteId: vote.id
    })
  } else {
    res.status(401 /* Unauthorized */ ).json({
      code: -1,
      msg: '未登陆无法创建投票'
    })
  }
})

//获取投票信息
app.get('/vote/:id', async (req, res, next) => {
  var id = req.params.id
  var vote = await db.get('SELECT rowid AS id, * FROM votes WHERE id = ?', id)
  var options = await db.all('SELECT rowid AS id, * FROM options WHERE voteId = ?', id)
  var votings = await db.all('SELECT votings.rowid AS id, * FROM votings JOIN user ON userId = user.id WHERE voteId = ?', id)
  vote.options = options
  vote.votings = votings
  // console.log('options',options)
  // console.log('votings',votings)
  // console.log('vote',vote)
  res.json(vote)
})
// 用户对某个选项发起的投票
app.post('/voteup/:voteId', async (req, res, next) => {
  /**
   * {
   *   optionId: 3,
   *   isVoteDown: true
   * }
   */
  var voteId = req.params.voteId
  var body = req.body
  var vote = await db.get('SELECT rowid AS id, * FROM votes WHERE id = ?', voteId)
  if (Date.now() > new Date(vote.deadline).getTime()) {
    res.status(401).end({
      code: -1,
      msg: '该问题已过截止日期，不能再投票'
    })
    return
  }

  if (!vote.isMultiple) { //单选
    // 删除之前可能投的一票
    await db.run('DELETE FROM votings WHERE userId = ? AND voteId = ?', [req.user.id, voteId])
    // 增加这次的选项
    if (!req.body.isVoteDown) {
    await db.run('INSERT INTO votings VALUES (?, ?, ?)', [voteId, body.optionId, req.user.id])
    }
    res.end()
  } else { //多选
    console.log('多选加票', req.body)
    await db.run('DELETE FROM votings WHERE voteId = ? AND optionId = ? AND userId = ?', [voteId, body.optionId, req.user.id])
    if (!req.body.isVoteDown) {
      await db.run('INSERT INTO votings VALUES (?, ?, ?)', [voteId, body.optionId, req.user.id])
    }
    res.end()
  }
  broadcast(voteId)
})

//删除用户个人投票
app.delete('/vote/:id', async (req, res, next) => {
  var deleteId = req.params.id
  try {
    console.log(req.params)
    await db.run('DELETE from votes WHERE rowid = ?', [deleteId])
    res.end()
  } catch (error) {
    res.end(error)
  }
})
//获取用户个人投票信息
app.get('/myvotes', async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      code: -1,
      msg: '用户未登陆'
    })
    return
  }

  var myVotes = await db.all('SELECT rowid AS id, * FROM votes WHERE userId = ?', req.user.id)
  res.json(myVotes)
})


//节流函数 使websocket信息在另外用户的终端间歇性刷新 x毫秒执行一次
var broadcast = _.throttle(async function broadcast(voteId) {
  var websockets = voteIdMapWs[voteId] || []
  var votings = await db.all('SELECT votings.rowid AS id, * FROM votings JOIN user ON userId = user.id WHERE voteId = ?', voteId)
  for (var ws of websockets) {
    ws.send(JSON.stringify(votings))
  }
}, 40, {
  loading: false
})
//注册 上传头像
const uploader = multer({
  dest: __dirname + '/uploads/'
})
app.route('/register')
  .post(uploader.single('avatar'), async (req, res, next) => {
    var user = req.body
    var file = req.file
    if(file){
      var targetName = file.path + '-' + file.originalname
      //fsp.rename修改文件名称，可更改文件存放路径
      await fsp.rename(file.path, targetName)
      console.log(targetName)
      var avatarOnlineUrl = '/uploads/' + path.basename(targetName)
    }else{
      var avatarOnlineUrl = '/uploads/default-avatar.jpg'
    }
    console.log('收到注册请求',user,file)

    try {
      await db.run(
        `INSERT INTO users VALUES (?, ?, ?, ?)`,
        [user.name, user.password, user.email, avatarOnlineUrl]
      )

      res.json({
        msg: '注册成功',
      })
    } catch (e) {
      res.status(400).json({
        msg: '注册失败: ' + e.toString(),
        code: -1,
      })
    }
  })

// /username-conflict-check?name=lily
// 用户名冲突检测接口
app.get('/username-conflict-check', async (req, res, next) => {
  var user = await db.get('SELECT * FROM users WHERE name = ?', req.query.name)

  if (user) {
    res.json({
      isOK: false,
      msg: '用户名已被占用'
    })
  } else {
    res.json({
      isOK: true,
      msg: '用户名可用'
    })
  }
})

//获取验证码图片
/* app.get('/captcha', function (req, res) {
  var captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;

  res.type('svg');
  res.status(200).send(captcha.data);
}); */

app.route('/login')
  .post(async (req, res, next) => {
    console.log('收到登陆请求', req.body)
    var loginInfo = req.body

    // if (req.body.captcha !== req.session.captcha) {
    //   res.json({
    //     code: -1,
    //     msg: '验证码错误',
    //   })
    //   return
    // }

    var user = await db.get(
      'SELECT * FROM users WHERE name = ? AND password = ?',
      [loginInfo.name, loginInfo.password]
    )

    if (user) {
      res.cookie('user', user.name, {
        maxAge: 86400000,
        signed: true,
      })
      res.json(user)
    } else {
      res.status(401).json({
        code: -1,
        msg: '登陆失败，用户名或密码错误'
      })
    }
  })

app.get('/userinfo', async (req, res, next) => {
  if (req.user) {
    res.json(req.user)
  } else {
    res.status(404).json({
      code: -1,
      msg: '未登陆'
    })
  }
})
// 由更改密码的id映射到对应的用户
var changePasswordMap = {}

app.route('/forgot')
  .get((req, res, next) => {
    res.render('forgot.pug')
  })
  .post(async (req, res, next) => {
    var email = req.body.email
    var user = await db.get('SELECT * FROM users WHERE email = ?', email)
    if (user) {
      var changePasswordId = Math.random().toString(16).slice(2)

      changePasswordMap[changePasswordId] = user
      setTimeout(() => {
        delete changePasswordMap[changePasswordId]
      }, 1000 * 60 * 10)

      var changePasswordLink = 'http://localhost:8081/change-password/' + changePasswordId

      console.log(changePasswordLink)
      res.end('A link has send to you email, open your Inbox and click the link to change password.')
      console.log(changePasswordMap)
      // sendEmail(email, `
      //   请点击些链接以修改密码：
      //   ${changePasswordLink}
      //   如果以上链接不能点击，请复制到浏览器后打开。
      //   该链接10分钟内有效
      // `)
      // sendTextMsg(13888888888, '您的验证码是 [${323423}]  fasldflaksjdfasdflk')
    } else {
      res.end('this email is not a registerd email in this site')
    }
  })

app.route('/change-password/:id')
  .get(async (req, res, next) => {
    var user = changePasswordMap[req.params.id]
    if (user) {
      res.render('change-password.pug', {
        user: user,
      })
    } else {
      res.end('link has expired')
    }
  })
  .post(async (req, res, next) => {
    var user = changePasswordMap[req.params.id]
    await db.run('UPDATE users SET password = ? WHERE name = ?', req.body.password, user.name)
    delete changePasswordMap[req.params.id]
    res.end('password change success!')
  })


app.get('/logout', (req, res, next) => {
  res.clearCookie('user')
  res.end()
})

app.get('/user/:id', async (req, res, next) => {
  var userInfo = await db.get('SELECT * FROM users WHERE rowid = ?', req.params.id)

  if (userInfo) {
    var userPostsPromise = db.all('SELECT rowid as id, * FROM posts WHERE userId = ? ORDER BY createdAt DESC', req.params.id)
    var userCommentsPromise = db.all('SELECT postId, title as postTitle, comments.content, comments.createdAt FROM comments JOIN posts ON postId = posts.rowid WHERE comments.userId = ? ORDER BY comments.createdAt DESC', req.params.id)
    var [userPosts, userComments] = await Promise.all([userPostsPromise, userCommentsPromise])

    res.render('user-profile.pug', {
      user: req.user,

      userInfo,
      userPosts,
      userComments,
    })
  } else {
    res.end('查无此人')
  }
})

server.listen(port, () => {
  console.log('server listening on port', port)
  // open('http://localhost:' + port)
})

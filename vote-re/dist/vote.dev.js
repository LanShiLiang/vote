"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var express = require('express');

var open = require('open');

var cookieParser = require('cookie-parser');

var multer = require('multer');

var fsp = require('fs').promises;

var path = require('path');

var svgCaptcha = require('svg-captcha');

var cors = require('cors');

var WebSocket = require('ws');

var http = require('http');

var _ = require('lodash');

var app = express();
var port = 8081;
var server = http.createServer(app); //express返回的app就是用来传给createServer的

var wss = new WebSocket.Server({
  server: server
}); //投票id到定阅这个投票信息更新的websocker的映射

var voteIdMapWs = {};
wss.on('connection', function _callee(ws, req) {
  var voteId, voteInfo;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          voteId = req.url.split('/').slice(-1)[0];
          console.log('将会把投票', voteId, '的实时信息发送到客户端');
          _context.next = 4;
          return regeneratorRuntime.awrap(db.get('SELECT rowid AS id, * FROM votes WHERE id = ?', voteId));

        case 4:
          voteInfo = _context.sent;

          if (Date.now() > new Date(voteInfo.deadline).getTime()) {
            ws.close();
          }

          if (voteId in voteIdMapWs) {
            voteIdMapWs[voteId].push(ws);
          } else {
            voteIdMapWs[voteId] = [ws];
          }

          ws.on('close', function () {
            voteIdMapWs[voteId] = voteIdMapWs[voteId].filter(function (it) {
              return it !== ws;
            });
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});
var db;

var dbPromise = require('./vote-db.js');

dbPromise.then(function (value) {
  db = value;
});
app.locals.pretty = true;
app.use(function (req, res, next) {
  console.log(req.method, req.url);
  next();
});
app.use(cors({
  maxAge: 86400,
  origin: 'true',
  credentials: true
}));
app.use(express["static"](__dirname + '/build'));
app.use(express["static"](__dirname + '/static'));
app.use('/uploads', express["static"](__dirname + '/uploads'));
app.use(express.json()); //Content-Type: application/json

app.use(express.urlencoded({
  extended: true
})); //Content-Type: application/x-www-form-urlencoded

app.use(cookieParser('lkjweoij2o3i409e'));
var sessionStore = Object.create(null);
app.use(function sessionMW(req, res, next) {
  if (req.cookies.sessionId) {
    req.session = sessionStore[req.cookies.sessionId];

    if (!req.session) {
      req.session = sessionStore[req.cookies.sessionId] = {};
    }
  } else {
    var id = Math.random().toString(16).slice(2);
    req.session = sessionStore[id] = {};
    res.cookie('sessionId', id, {
      maxAge: 86400000
    });
  }

  next();
});
app.use(function _callee2(req, res, next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(req.cookies, req.signedCookies); // 从签名cookie中找出该用户的信息并挂在req对象上以供后续的中间件访问
          // user是一个视图，并不是users表，这个视图自带id

          if (!req.signedCookies.user) {
            _context2.next = 5;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM user WHERE name = ?', req.signedCookies.user));

        case 4:
          req.user = _context2.sent;

        case 5:
          next();

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // 创建投票

app.post('/vote', function _callee3(req, res, next) {
  var voteInfo, vote, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, option;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!req.user) {
            _context3.next = 39;
            break;
          }

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
          voteInfo = req.body;
          console.log(voteInfo);
          _context3.next = 5;
          return regeneratorRuntime.awrap(db.run('INSERT INTO votes VALUES (?, ?, ?, ?, ?, ?, ?)', [voteInfo.title, voteInfo.desc, req.user.id, voteInfo.deadline, voteInfo.anonymous, new Date().toISOString(), voteInfo.isMultiple]));

        case 5:
          console.log(voteInfo);
          _context3.next = 8;
          return regeneratorRuntime.awrap(db.get('SELECT rowid AS id, * FROM votes ORDER BY id DESC LIMIT 1'));

        case 8:
          vote = _context3.sent;
          console.log(voteInfo.options);
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 13;
          _iterator = voteInfo.options[Symbol.iterator]();

        case 15:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 22;
            break;
          }

          option = _step.value;
          _context3.next = 19;
          return regeneratorRuntime.awrap(db.run('INSERT INTO options VALUES (?, ?, ?)', [vote.id, option, 0]));

        case 19:
          _iteratorNormalCompletion = true;
          _context3.next = 15;
          break;

        case 22:
          _context3.next = 28;
          break;

        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3["catch"](13);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 28:
          _context3.prev = 28;
          _context3.prev = 29;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 31:
          _context3.prev = 31;

          if (!_didIteratorError) {
            _context3.next = 34;
            break;
          }

          throw _iteratorError;

        case 34:
          return _context3.finish(31);

        case 35:
          return _context3.finish(28);

        case 36:
          res.json({
            voteId: vote.id
          });
          _context3.next = 40;
          break;

        case 39:
          res.status(401
          /* Unauthorized */
          ).json({
            code: -1,
            msg: '未登陆无法创建投票'
          });

        case 40:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[13, 24, 28, 36], [29,, 31, 35]]);
}); //获取投票信息

app.get('/vote/:id', function _callee4(req, res, next) {
  var id, vote, options, votings;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _context4.next = 3;
          return regeneratorRuntime.awrap(db.get('SELECT rowid AS id, * FROM votes WHERE id = ?', id));

        case 3:
          vote = _context4.sent;
          _context4.next = 6;
          return regeneratorRuntime.awrap(db.all('SELECT rowid AS id, * FROM options WHERE voteId = ?', id));

        case 6:
          options = _context4.sent;
          _context4.next = 9;
          return regeneratorRuntime.awrap(db.all('SELECT votings.rowid AS id, * FROM votings JOIN user ON userId = user.id WHERE voteId = ?', id));

        case 9:
          votings = _context4.sent;
          vote.options = options;
          vote.votings = votings; // console.log('options',options)
          // console.log('votings',votings)
          // console.log('vote',vote)

          res.json(vote);

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // 用户对某个选项发起的投票

app.post('/voteup/:voteId', function _callee5(req, res, next) {
  var voteId, body, vote;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          /**
           * {
           *   optionId: 3,
           *   isVoteDown: true
           * }
           */
          voteId = req.params.voteId;
          body = req.body;
          _context5.next = 4;
          return regeneratorRuntime.awrap(db.get('SELECT rowid AS id, * FROM votes WHERE id = ?', voteId));

        case 4:
          vote = _context5.sent;

          if (!(Date.now() > new Date(vote.deadline).getTime())) {
            _context5.next = 8;
            break;
          }

          res.status(401).end({
            code: -1,
            msg: '该问题已过截止日期，不能再投票'
          });
          return _context5.abrupt("return");

        case 8:
          if (vote.isMultiple) {
            _context5.next = 17;
            break;
          }

          _context5.next = 11;
          return regeneratorRuntime.awrap(db.run('DELETE FROM votings WHERE userId = ? AND voteId = ?', [req.user.id, voteId]));

        case 11:
          if (req.body.isVoteDown) {
            _context5.next = 14;
            break;
          }

          _context5.next = 14;
          return regeneratorRuntime.awrap(db.run('INSERT INTO votings VALUES (?, ?, ?)', [voteId, body.optionId, req.user.id]));

        case 14:
          res.end();
          _context5.next = 24;
          break;

        case 17:
          //多选
          console.log('多选加票', req.body);
          _context5.next = 20;
          return regeneratorRuntime.awrap(db.run('DELETE FROM votings WHERE voteId = ? AND optionId = ? AND userId = ?', [voteId, body.optionId, req.user.id]));

        case 20:
          if (req.body.isVoteDown) {
            _context5.next = 23;
            break;
          }

          _context5.next = 23;
          return regeneratorRuntime.awrap(db.run('INSERT INTO votings VALUES (?, ?, ?)', [voteId, body.optionId, req.user.id]));

        case 23:
          res.end();

        case 24:
          broadcast(voteId);

        case 25:
        case "end":
          return _context5.stop();
      }
    }
  });
}); //删除用户个人投票

app["delete"]('/vote/:id', function _callee6(req, res, next) {
  var deleteId;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          deleteId = req.params.id;
          _context6.prev = 1;
          console.log(req.params);
          _context6.next = 5;
          return regeneratorRuntime.awrap(db.run('DELETE from votes WHERE rowid = ?', [deleteId]));

        case 5:
          res.end();
          _context6.next = 11;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](1);
          res.end(_context6.t0);

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 8]]);
}); //获取用户个人投票信息

app.get('/myvotes', function _callee7(req, res, next) {
  var myVotes;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          if (req.user) {
            _context7.next = 3;
            break;
          }

          res.status(401).json({
            code: -1,
            msg: '用户未登陆'
          });
          return _context7.abrupt("return");

        case 3:
          _context7.next = 5;
          return regeneratorRuntime.awrap(db.all('SELECT rowid AS id, * FROM votes WHERE userId = ?', req.user.id));

        case 5:
          myVotes = _context7.sent;
          res.json(myVotes);

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
}); //节流函数 使websocket信息在另外用户的终端间歇性刷新 x毫秒执行一次

var broadcast = _.throttle(function broadcast(voteId) {
  var websockets, votings, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, ws;

  return regeneratorRuntime.async(function broadcast$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          websockets = voteIdMapWs[voteId] || [];
          _context8.next = 3;
          return regeneratorRuntime.awrap(db.all('SELECT votings.rowid AS id, * FROM votings JOIN user ON userId = user.id WHERE voteId = ?', voteId));

        case 3:
          votings = _context8.sent;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context8.prev = 7;

          for (_iterator2 = websockets[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            ws = _step2.value;
            ws.send(JSON.stringify(votings));
          }

          _context8.next = 15;
          break;

        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](7);
          _didIteratorError2 = true;
          _iteratorError2 = _context8.t0;

        case 15:
          _context8.prev = 15;
          _context8.prev = 16;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 18:
          _context8.prev = 18;

          if (!_didIteratorError2) {
            _context8.next = 21;
            break;
          }

          throw _iteratorError2;

        case 21:
          return _context8.finish(18);

        case 22:
          return _context8.finish(15);

        case 23:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[7, 11, 15, 23], [16,, 18, 22]]);
}, 40, {
  loading: false
}); //注册 上传头像


var uploader = multer({
  dest: __dirname + '/uploads/'
});
app.route('/register').post(uploader.single('avatar'), function _callee8(req, res, next) {
  var user, file, targetName, avatarOnlineUrl;
  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          user = req.body;
          file = req.file;

          if (!file) {
            _context9.next = 10;
            break;
          }

          targetName = file.path + '-' + file.originalname; //fsp.rename修改文件名称，可更改文件存放路径

          _context9.next = 6;
          return regeneratorRuntime.awrap(fsp.rename(file.path, targetName));

        case 6:
          console.log(targetName);
          avatarOnlineUrl = '/uploads/' + path.basename(targetName);
          _context9.next = 11;
          break;

        case 10:
          avatarOnlineUrl = '/uploads/default-avatar.jpg';

        case 11:
          console.log('收到注册请求', user, file);
          _context9.prev = 12;
          _context9.next = 15;
          return regeneratorRuntime.awrap(db.run("INSERT INTO users VALUES (?, ?, ?, ?)", [user.name, user.password, user.email, avatarOnlineUrl]));

        case 15:
          res.json({
            msg: '注册成功'
          });
          _context9.next = 21;
          break;

        case 18:
          _context9.prev = 18;
          _context9.t0 = _context9["catch"](12);
          res.status(400).json({
            msg: '注册失败: ' + _context9.t0.toString(),
            code: -1
          });

        case 21:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[12, 18]]);
}); // /username-conflict-check?name=lily
// 用户名冲突检测接口

app.get('/username-conflict-check', function _callee9(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM users WHERE name = ?', req.query.name));

        case 2:
          user = _context10.sent;

          if (user) {
            res.json({
              isOK: false,
              msg: '用户名已被占用'
            });
          } else {
            res.json({
              isOK: true,
              msg: '用户名可用'
            });
          }

        case 4:
        case "end":
          return _context10.stop();
      }
    }
  });
}); //获取验证码图片

/* app.get('/captcha', function (req, res) {
  var captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;

  res.type('svg');
  res.status(200).send(captcha.data);
}); */

app.route('/login').post(function _callee10(req, res, next) {
  var loginInfo, user;
  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          console.log('收到登陆请求', req.body);
          loginInfo = req.body; // if (req.body.captcha !== req.session.captcha) {
          //   res.json({
          //     code: -1,
          //     msg: '验证码错误',
          //   })
          //   return
          // }

          _context11.next = 4;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM users WHERE name = ? AND password = ?', [loginInfo.name, loginInfo.password]));

        case 4:
          user = _context11.sent;

          if (user) {
            res.cookie('user', user.name, {
              maxAge: 86400000,
              signed: true
            });
            res.json(user);
          } else {
            res.status(401).json({
              code: -1,
              msg: '登陆失败，用户名或密码错误'
            });
          }

        case 6:
        case "end":
          return _context11.stop();
      }
    }
  });
});
app.get('/userinfo', function _callee11(req, res, next) {
  return regeneratorRuntime.async(function _callee11$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          if (req.user) {
            res.json(req.user);
          } else {
            res.status(404).json({
              code: -1,
              msg: '未登陆'
            });
          }

        case 1:
        case "end":
          return _context12.stop();
      }
    }
  });
}); // 由更改密码的id映射到对应的用户

var changePasswordMap = {};
app.route('/forgot').get(function (req, res, next) {
  res.render('forgot.pug');
}).post(function _callee12(req, res, next) {
  var email, user, changePasswordId, changePasswordLink;
  return regeneratorRuntime.async(function _callee12$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          email = req.body.email;
          _context13.next = 3;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM users WHERE email = ?', email));

        case 3:
          user = _context13.sent;

          if (user) {
            changePasswordId = Math.random().toString(16).slice(2);
            changePasswordMap[changePasswordId] = user;
            setTimeout(function () {
              delete changePasswordMap[changePasswordId];
            }, 1000 * 60 * 10);
            changePasswordLink = 'http://localhost:8081/change-password/' + changePasswordId;
            console.log(changePasswordLink);
            res.end('A link has send to you email, open your Inbox and click the link to change password.');
            console.log(changePasswordMap); // sendEmail(email, `
            //   请点击些链接以修改密码：
            //   ${changePasswordLink}
            //   如果以上链接不能点击，请复制到浏览器后打开。
            //   该链接10分钟内有效
            // `)
            // sendTextMsg(13888888888, '您的验证码是 [${323423}]  fasldflaksjdfasdflk')
          } else {
            res.end('this email is not a registerd email in this site');
          }

        case 5:
        case "end":
          return _context13.stop();
      }
    }
  });
});
/* app.route('/change-password/:id')
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
  }) */

app.get('/logout', function (req, res, next) {
  res.clearCookie('user');
  res.end();
});
app.get('/user/:id', function _callee13(req, res, next) {
  var userInfo, userPostsPromise, userCommentsPromise, _ref, _ref2, userPosts, userComments;

  return regeneratorRuntime.async(function _callee13$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM users WHERE rowid = ?', req.params.id));

        case 2:
          userInfo = _context14.sent;

          if (!userInfo) {
            _context14.next = 15;
            break;
          }

          userPostsPromise = db.all('SELECT rowid as id, * FROM posts WHERE userId = ? ORDER BY createdAt DESC', req.params.id);
          userCommentsPromise = db.all('SELECT postId, title as postTitle, comments.content, comments.createdAt FROM comments JOIN posts ON postId = posts.rowid WHERE comments.userId = ? ORDER BY comments.createdAt DESC', req.params.id);
          _context14.next = 8;
          return regeneratorRuntime.awrap(Promise.all([userPostsPromise, userCommentsPromise]));

        case 8:
          _ref = _context14.sent;
          _ref2 = _slicedToArray(_ref, 2);
          userPosts = _ref2[0];
          userComments = _ref2[1];
          res.render('user-profile.pug', {
            user: req.user,
            userInfo: userInfo,
            userPosts: userPosts,
            userComments: userComments
          });
          _context14.next = 16;
          break;

        case 15:
          res.end('查无此人');

        case 16:
        case "end":
          return _context14.stop();
      }
    }
  });
});
server.listen(port, function () {
  console.log('server listening on port', port); // open('http://localhost:' + port)
});
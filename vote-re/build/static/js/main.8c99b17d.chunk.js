(this["webpackJsonpvote-fe"]=this["webpackJsonpvote-fe"]||[]).push([[0],{116:function(e,t,a){},144:function(e,t,a){e.exports=a(227)},149:function(e,t,a){},150:function(e,t,a){},167:function(e,t,a){},173:function(e,t,a){},195:function(e,t,a){},204:function(e,t,a){},208:function(e,t,a){},227:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(19),l=a.n(c),o=(a(149),a(30)),i=(a(150),a(17)),s=a(34),u=a.n(s),m=a(33),d=(a(167),a(238));function f(){return r.a.createElement("div",null,r.a.createElement("div",{className:"img img1"},r.a.createElement(d.a,null),r.a.createElement(m.b,{to:"/create-vote"},r.a.createElement("div",null,"\u521b\u5efa\u5355\u9009"))),r.a.createElement("div",{className:"img img2"},r.a.createElement(d.a,null),r.a.createElement(m.b,{to:"/create-vote?multiple=1"},r.a.createElement("div",null,"\u521b\u5efa\u591a\u9009"))))}a(173);var p=a(239),v=a(55);function E(e){var t=e.setUserInfo,a=Object(i.g)(),c=Object(n.useState)([]),l=Object(o.a)(c,2),s=l[0],d=l[1];Object(n.useEffect)((function(){u.a.get("/myvotes").then((function(e){d(e.data)}))}),[]),Object(n.useEffect)((function(){if(f[0]){var e=f[0].offsetHeight;e*=f.length,E.setAttribute("style","height:".concat(e,"px;"))}}));var f=document.getElementsByClassName("my-votes-li"),E=document.getElementById("votes-ul");return r.a.createElement("div",{className:"my-votes"},r.a.createElement("div",null,"\u6211\u521b\u5efa\u7684\u6295\u7968\u5217\u8868"),r.a.createElement("div",{className:"my-votes-list"},r.a.createElement("div",{id:"votes-ul",style:{height:"0"}},s.map((function(e,t){return r.a.createElement("li",{className:"my-votes-li",key:t},r.a.createElement(m.b,{to:"/vote/".concat(e.id)},r.a.createElement("span",null,e.title)),r.a.createElement("div",{onClick:function(){var a;a=e.id,u.a.delete("/vote/".concat(a)).then(),function(e){d(s.filter((function(t,a){return e!==a})))}(t)}},r.a.createElement(p.a,null),r.a.createElement("div",null,"\u5220\u9664")))}))),r.a.createElement(v.a,{type:"primary",size:"large",onClick:function(){u.a.get("./logout").then((function(){t(null),a.push("/login")}))}},"\u767b\u51fa")))}var h=a(240),g=a(241);function b(e){var t=e.setUserInfo,a=Object(i.j)().url;return r.a.createElement("div",null,r.a.createElement(i.b,{path:"".concat(a,"/"),exact:!0},r.a.createElement(i.a,{to:"".concat(a,"/create")})),r.a.createElement(i.b,{path:"".concat(a,"/create")},r.a.createElement(f,null)),r.a.createElement(i.b,{path:"".concat(a,"/my")},r.a.createElement(E,{setUserInfo:t})),r.a.createElement("div",{className:"foot-bar"},r.a.createElement(m.c,{className:"fb f-create",activeClassName:"active",to:"".concat(a,"/create")},r.a.createElement(h.a,null),"\u65b0\u5efa"),r.a.createElement(m.c,{className:"fb f-my",activeClassName:"active",to:"".concat(a,"/my")},r.a.createElement(g.a,null),"\u6211\u7684")))}var y=a(45),O=a.n(y),j=a(52),w=a(242),N=a(243),k=a(232);a(116);function x(e){var t=e.setUserInfo,a=Object(n.useRef)(),c=Object(n.useRef)(),l=Object(i.g)();function o(){return(o=Object(j.a)(O.a.mark((function e(n){var r;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.preventDefault(),e.prev=1,e.next=4,u.a.post("/login",{name:a.current.state.value,password:c.current.state.value});case 4:r=e.sent,t(r.data),l.push("/"),e.next=13;break;case 9:e.prev=9,e.t0=e.catch(1),console.log(e.t0),alert("\u7528\u6237\u540d\u6216\u5bc6\u7801\u9519\u8bef");case 13:case"end":return e.stop()}}),e,null,[[1,9]])})))).apply(this,arguments)}return r.a.createElement("div",{id:"login-father"},r.a.createElement("form",{id:"login"},r.a.createElement(k.a,{type:"text",ref:a,prefix:r.a.createElement(w.a,{className:"site-form-item-icon"}),placeholder:"\u7528\u6237\u540d"}),r.a.createElement(k.a,{type:"password",ref:c,prefix:r.a.createElement(N.a,{className:"site-form-item-icon"}),placeholder:"\u5bc6\u7801"}),r.a.createElement(v.a,{type:"primary",className:"login-form-button",onClick:function(e){return o.apply(this,arguments)}},"\u767b\u5f55"),r.a.createElement(v.a,{type:"primary",className:"login-form-button",onClick:function(e){e.preventDefault(),l.push("/Register")}},"\u6ce8\u518c")))}var C=a(58),I=a(229),D=a(236),S=a(51),U=a.n(S),B=a(230),R=a(237),L=a(244),M=a(245);a(195);function T(){var e,t=new URLSearchParams(Object(i.h)().search),a=Object(n.useState)(["",""]),c=Object(o.a)(a,2),l=c[0],s=c[1],m=Object(I.a)(),d=Object(I.a)(),f=Object(n.useState)(""),p=Object(o.a)(f,2),E=p[0],h=p[1],g=Object(D.a)(),b=Object(i.g)(),y=Object(D.a)("1"===t.get("multiple")),w=new Date;function N(){return(N=Object(j.a)(O.a.mark((function e(){var t;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=4,u.a.post("/vote",{title:m.value,desc:d.value,options:l,deadline:new Date(E).toISOString(),anonymous:g.value?1:0,isMultiple:y.value?1:0});case 4:t=e.sent,b.push("/vote/"+t.data.voteId),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),alert("\u521b\u5efa\u5931\u8d25"+e.t0.toString());case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}return w=w.setDate(w.getDate()+1),w=new Date(w).toLocaleString(),Object(n.useEffect)((function(){e=Symbol(),setTimeout((function(){var e=document.getElementById("create-ul"),t=document.getElementsByClassName("create-li");if(t[0]){var a=t[0].offsetHeight;a*=t.length,e.setAttribute("style","height:".concat(a,"px;"))}}),100)})),r.a.createElement("div",{className:"create-votes"},r.a.createElement("h3",null,"\u521b\u5efa\u6295\u7968"),r.a.createElement("li",{className:"cv-title"},r.a.createElement(k.a,{type:"text",value:m.value,onChange:m.onChange,placeholder:"\u6295\u7968\u6807\u9898"})),r.a.createElement("li",{className:"cv-desc"},r.a.createElement(k.a,{type:"text",value:d.value,onChange:d.onChange,placeholder:"\u8865\u5145\u63cf\u8ff0\uff08\u9009\u586b\uff09"})),r.a.createElement("div",{id:"create-ul",style:{height:"110px"}},l.map((function(t,a){return r.a.createElement("li",{key:e,className:"create-li"},r.a.createElement("div",{className:"redX",onClick:function(){return function(e){2!==l.length&&s(l.filter((function(t,a){return e!==a})))}(a)}},r.a.createElement(L.a,null)),r.a.createElement(k.a,{type:"text",value:t,placeholder:"\u9009\u9879",onChange:function(e){e.persist(),s([].concat(Object(C.a)(l.slice(0,a)),[e.target.value],Object(C.a)(l.slice(a+1))))}}))}))),r.a.createElement("div",{className:"setOptions",onClick:function(){return s([].concat(Object(C.a)(l),[""]))}},r.a.createElement(M.a,null),"\u70b9\u51fb\u6dfb\u52a0\u9009\u9879"),r.a.createElement("div",{id:"cv-bottom"},r.a.createElement("li",null,r.a.createElement("span",null,"\u622a\u6b62\u65e5\u671f\uff1a"),r.a.createElement(B.a,{placeholder:w,disabledDate:function(e){return e<=U()().add(1,"days").startOf("day")},format:"YYYY-MM-DD HH:mm:ss",onChange:function(e,t){h(t)}})),r.a.createElement("li",null,"\u533f\u540d\u6295\u7968\uff1a",r.a.createElement(R.a,{checkedChildren:"\u5f00\u542f",unCheckedChildren:"\u5173\u95ed",checked:g.valuechecked,onClick:g.toggle})),r.a.createElement("li",{id:"multiple"},"\u591a\u9009\uff1a",r.a.createElement(R.a,{checkedChildren:"\u5f00\u542f",unCheckedChildren:"\u5173\u95ed",checked:y.value,onClick:y.toggle}))),r.a.createElement("li",{className:"create-now"},r.a.createElement(v.a,{type:"primary",className:"login-form-button",onClick:function(){return N.apply(this,arguments)}},"\u521b\u5efa")))}a(204);var A=a(98),Y=a(235);function F(e){var t,a,c,l=e.userInfo,s=Object(i.i)().id,m=Object(n.useState)(!0),d=Object(o.a)(m,2),f=d[0],p=d[1],v=Object(n.useState)(null),E=Object(o.a)(v,2),h=E[0],g=E[1],b=Object(n.useState)(null),y=Object(o.a)(b,2),w=y[0],N=y[1];Object(i.h)();function k(){return(k=Object(j.a)(O.a.mark((function e(t,a,n){var r,o,i;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(Date.now()>new Date(h.deadline).getTime())){e.next=3;break}return alert("\u8be5\u6295\u7968\u5df2\u7ecf\u8fc7\u671f"),e.abrupt("return");case 3:return n?a?(r=w.filter((function(e){return!(e.userId===l.id&&t===e.optionId)})),N(r)):(c={id:-1,optionId:t,voteId:s,userId:l.id,avatar:l.avatar},N([].concat(Object(C.a)(w),[c]))):a?(i=w.filter((function(e){return!(e.userId===l.id&&t===e.optionId)})),N(i)):(c={id:-1,optionId:t,voteId:s,userId:l.id,avatar:l.avatar},o=w.filter((function(e){return!(e.userId===l.id)})),N([].concat(Object(C.a)(o),[c]))),e.next=6,u.a.post("/voteup/".concat(s),{optionId:t,isVoteDown:a}).then((function(e){}));case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return f||(a=Object(A.uniqBy)(h.votings,"userId").length,t=Object(A.groupBy)(w,"optionId")),Object(n.useEffect)((function(){g(null),p(!0),u.a.get("/vote/".concat(s)).then((function(e){g(e.data),N(e.data.votings),p(!1)}))}),[s]),Object(n.useEffect)((function(){if(h&&Date.now()<new Date(h.deadline).getTime()){console.log("ws \u91cd\u65b0\u8fde\u63a5");var e=new WebSocket("ws://".concat(window.location.host,"/vote/").concat(s));return e.onmessage=function(e){N(JSON.parse(e.data))},function(){return e.close()}}}),[s,h]),f?r.a.createElement("div",null,"loading..."):r.a.createElement("div",null,r.a.createElement("h2",{className:"view-title"},h.title),r.a.createElement("p",{className:"view-desc"},h.desc,r.a.createElement("span",null,h.isMultiple?"[\u591a\u9009]":"[\u5355\u9009]")),r.a.createElement("ul",null,h.options.map((function(e){var n=t[e.id]||[];if(l)var c=!!n.find((function(e){return e.userId===l.id}));return r.a.createElement("li",{className:"view-vote-li",key:e.id,onClick:function(){return function(e,t,a){return k.apply(this,arguments)}(e.id,c,h.isMultiple)}},r.a.createElement("div",{className:"bgc-white"},r.a.createElement("div",{className:"view-option"},r.a.createElement("div",null,r.a.createElement(Y.a,{checked:c}),r.a.createElement("span",{className:"option-text"},e.content)),r.a.createElement("strong",null,r.a.createElement("span",null,n.length,"\u7968"),r.a.createElement("span",null,H(n.length,a),"%")),r.a.createElement("div",{className:"option-ratio",style:{width:H(n.length,a)+"%"}}))),r.a.createElement("ul",{className:"avatars"},n.map((function(e){return r.a.createElement("li",{key:e.avatar},r.a.createElement("img",{className:"avatar",src:e.avatar}))}))))}))),r.a.createElement("p",null,"\u6295\u7968\u622a\u81f3\uff1a",new Date(h.deadline).toLocaleString()))}function H(e,t){return 0===t?0:e/t*100>=100?100:(e/t*100).toFixed(2)}var J=a(129),P=a(130),W=a(143),z=a(141),G=a(246),q=a(247),V=a(248),X=a(233),$=a(231),K=(a(208),{});function Q(e,t){var a=new FileReader;a.addEventListener("load",(function(){return t(a.result)})),a.readAsDataURL(e)}function Z(e){var t="image/jpeg"===e.type||"image/png"===e.type;K.file=e,t||X.b.error("You can only upload JPG/PNG file!");var a=e.size/1024/1024<2;return a||X.b.error("Image must smaller than 2MB!"),K.file=e,t&&a}var _=function(e){Object(W.a)(a,e);var t=Object(z.a)(a);function a(){var e;Object(J.a)(this,a);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(e=t.call.apply(t,[this].concat(r))).state={loading:!1},e.handleChange=function(t){"uploading"!==t.file.status?("done"===t.file.status&&Q(t.file.originFileObj,(function(t){return e.setState({imageUrl:t,loading:!1})})),console.log(K)):e.setState({loading:!0})},e}return Object(P.a)(a,[{key:"render",value:function(){var e=this.state,t=e.loading,a=e.imageUrl,n=r.a.createElement("div",null,t?r.a.createElement(G.a,null):r.a.createElement(q.a,null),r.a.createElement("div",{style:{marginTop:8}},"Upload"));return r.a.createElement($.a,{name:"avatar",listType:"picture-card",className:"avatar-uploader",showUploadList:!1,action:"https://www.mocky.io/v2/5cc8019d300000980a055e76",beforeUpload:Z,onChange:this.handleChange},a?r.a.createElement("img",{src:a,alt:"avatar",style:{width:"100%"}}):n)}}]),a}(r.a.Component);function ee(e){e.setUserInfo;var t=Object(n.useRef)(null),a=Object(n.useRef)(null),c=Object(n.useRef)(null),l=Object(i.g)();function o(){return(o=Object(j.a)(O.a.mark((function e(n){var r;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n.preventDefault(),(r=new FormData).append("name",t.current.state.value),r.append("password",a.current.state.value),r.append("email",c.current.state.value),r.append("avatar",K.file),void 0!==t.current.state.value&&void 0!==a.current.state.value&&void 0!==c.current.state.value){e.next=9;break}return alert("\u8bf7\u586b\u5199\u5b8c\u6574\u6ce8\u518c\u4fe1\u606f"),e.abrupt("return");case 9:return e.prev=9,e.next=12,u.a.post("/register",r).then((function(e){console.log(e),alert("\u6ce8\u518c\u6210\u529f\uff0c\u8bf7\u767b\u5f55"),l.push("/Login")}));case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(9),console.log(e.t0);case 17:case"end":return e.stop()}}),e,null,[[9,14]])})))).apply(this,arguments)}return r.a.createElement("div",{id:"register-father"},r.a.createElement("form",{id:"register",method:"post",action:"/register",encType:"formdata/multipart"},r.a.createElement(k.a,{type:"text",ref:t,prefix:r.a.createElement(w.a,{className:"site-form-item-icon"}),placeholder:"\u7528\u6237\u540d"}),r.a.createElement(k.a,{type:"text",ref:c,prefix:r.a.createElement(V.a,{className:"site-form-item-icon"}),placeholder:"\u90ae\u7bb1"}),r.a.createElement(k.a,{type:"password",ref:a,prefix:r.a.createElement(N.a,{className:"site-form-item-icon"}),placeholder:"\u5bc6\u7801"}),r.a.createElement(_,{name:"avatar"}),r.a.createElement(v.a,{type:"primary",className:"login-form-button",onClick:function(e){return o.apply(this,arguments)}},"\u6ce8\u518c")))}var te=function(){var e=Object(i.g)(),t=Object(n.useState)({}),a=Object(o.a)(t,2),c=a[0],l=a[1];return Object(n.useEffect)((function(){u.a.get("/userinfo").then((function(e){l(e.data)})).catch((function(t){e.push("/login")}))}),[]),r.a.createElement("div",{className:"App"},r.a.createElement(i.d,null,r.a.createElement(i.b,{path:"/",exact:!0},r.a.createElement(i.a,{to:"home"})),r.a.createElement(i.b,{path:"/login"},r.a.createElement(x,{setUserInfo:l})),r.a.createElement(i.b,{path:"/register"},r.a.createElement(ee,null)),r.a.createElement(i.b,{path:"/home"},c&&r.a.createElement(b,{userInfo:c,setUserInfo:l})),r.a.createElement(i.b,{path:"/create-vote"},r.a.createElement(T,null)),r.a.createElement(i.b,{path:"/vote/:id"},c&&r.a.createElement(F,{userInfo:c}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(m.a,null,r.a.createElement(te,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[144,1,2]]]);
//# sourceMappingURL=main.8c99b17d.chunk.js.map
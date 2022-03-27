import React,{useRef} from 'react'
import axios from 'axios'
import { useHistory} from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Input,Button} from 'antd'
import './login.less'

export default function Login({setUserInfo}){
  let nameRef = useRef()
  let passwordRef = useRef()
  let history = useHistory()

  async function handleLogin(e){
    e.preventDefault()
    try{
    let res = await axios.post('/login',{
      name:nameRef.current.state.value,
      password:passwordRef.current.state.value
    })
    setUserInfo(res.data)
    history.push('/')
  } catch (e){
    console.log(e)
    alert('用户名或密码错误')
  }
}
 function register(e){
  e.preventDefault()
  history.push('/Register')
}
  return(

    <div id="login-father">
      <form id="login">
        <Input type="text" ref={nameRef}
        prefix={<UserOutlined  className="site-form-item-icon"/>}
        placeholder="用户名"
        />
        <Input type="password" ref={passwordRef}
         prefix={<LockOutlined className="site-form-item-icon" />}
         placeholder="密码"
         />
        <Button type="primary" className="login-form-button" onClick={handleLogin}>登录</Button>
        <Button type="primary" className="login-form-button" onClick={register}>注册</Button>
      </form>
    </div>

  )
}

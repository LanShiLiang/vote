import React,{useRef} from 'react'
import axios from 'axios'
import { HashRouter, useHistory} from 'react-router-dom'

export default function Login({setUserInfo}){
  let nameRef = useRef()
  let passwordRef = useRef()
  let history = useHistory()

  async function handleLogin(e){
    e.preventDefault()
    try{
    let res = await axios.post('/login',{
      name:nameRef.current.value,
      password:passwordRef.current.value
    })
    setUserInfo(res.data)
    history.push('/home')
  } catch (e){
    alert(e.msg.toString())
  }
}
  return(

    <div>
      <form>
        Username: <input type="text" ref={nameRef}/>
        PassWord: <input type="password" ref={passwordRef}/>
        <button onClick={handleLogin}>登录</button>
      </form>
    </div>

  )
}

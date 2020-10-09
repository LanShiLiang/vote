import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {useHistory,Link} from 'react-router-dom'
import './My.scss'
import{
 DeleteTwoTone
} from '@ant-design/icons'
import {Button} from 'antd';

export default function My({setUserInfo}) {
  let history = useHistory()
  let [myVotes,setMyVotes] = useState([])
  function logout() {
    axios.get('./logout').then(() => {
      setUserInfo(null)
      history.push('/login')
    })
  }
  useEffect(() => {
    axios.get('/myvotes').then(res => {
      setMyVotes(res.data)
    })
  }, [])
  useEffect(() => {
    if (elementLi[0]) {
      let h = elementLi[0].offsetHeight
      h = h*elementLi.length
      elementUl.setAttribute('style', `height:${h}px;`);
    }
  })

  let elementLi = document.getElementsByClassName('my-votes-li')
  let elementUl = document.getElementById('votes-ul')

  //删除用户投票
  function deletevote(id){
    axios.delete(`/vote/${id}`).then()
  }
  function handleDeleteOption(idx){
    setMyVotes(myVotes.filter((_, index) => idx !== index))
  }
  return (
    <div className='my-votes'>
      <div>我创建的投票列表</div>
      <div className='my-votes-list'>
      <div id='votes-ul' style={{height:'0'}}>
        {
          myVotes.map((vote,idx) => {
            return (
            <li className='my-votes-li' key={idx}>
              <Link to={`/vote/${vote.id}`}><span>{vote.title}</span></Link>
              <div onClick={()=>{deletevote(vote.id);handleDeleteOption(idx)}}>
              <DeleteTwoTone /><div>删除</div>
              </div>
            </li>
            )
          })
        }
      </div>
      <Button type="primary" size="large" onClick={logout}>登出</Button>
      </div>
    </div>
 )
}

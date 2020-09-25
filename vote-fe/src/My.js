import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {useHistory,Link} from 'react-router-dom'

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

  return (
    <div>
      我创建的投票列表
      <ul>
        {
          myVotes.map(vote => {
            return <li>
              <Link to={`/vote/${vote.id}`}><span>{vote.title}</span></Link>
              <button>删除</button>
            </li>
          })
        }
      </ul>
      <button onClick={logout}>登出</button>
    </div>
  )
}

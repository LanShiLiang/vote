import React,{useState,useEffect} from 'react';
import Axios from 'axios';
import { useHistory, useParams ,useLocation} from 'react-router-dom';
import './ViewVote.css';
import {groupBy,uniqBy} from 'lodash'
//useParams可以获取匹配成功的路径的id

export default function ViewVote({userInfo}){
  let {id} = useParams()  //问题的id
  let [loading, setLoading] = useState(true) //加载中
  let [voteInfo, setVoteInfo] = useState(null)
  let [votings,setVotings] = useState(null)
  // let location = useLocation()
  let history = useHistory()
  //需要group votings
  let groupedVotings
  let uniqueUsersCount

  if(!loading){
    groupedVotings = groupBy(votings, 'optionId')
    uniqueUsersCount = uniqBy(voteInfo.votings,'userId').length
    // console.dir('voteInfo:' + voteInfo)
    console.log('groupedVotings:',groupedVotings)
  }

  useEffect(() => {
    //拿到投票的相关信息
    setVoteInfo(null)
    setLoading(true)
    Axios.get(`/vote/${id}`).then((res) => {
      setVoteInfo(res.data)
      setVotings(res.data.votings)
      setLoading(false)
    })
  }, [id])
  useEffect(() => {
    //用于接收某个vote的新的选票信息
    if(!voteInfo){
      return
    }
    if(Date.now() < new Date(voteInfo.deadline).getTime()){
      console.log('ws 重新连接')
      //eslint-disable-next-line
      let ws = new WebSocket(`ws://${location.host}/vote/${id}`)
      ws.onmessage = e =>{
        setVotings(JSON.parse(e.data))
      }
      return () => ws.close()
    }
  },[id,voteInfo])

  async function voteUp(optionId,hasVoted){
    if(Date.now() > new Date(voteInfo.deadline).getTime()){
      alert('该投票已经过期')//这样做不好，应该换成div渐显 Modal(‘asdasdasd’)
      return
    }

    //区分单选和多选。还要区分是否选过


    if(!hasVoted){
      let thisVoting = {
        id:-1,
        optionId:optionId,
        voteId: id,
        userId: userInfo.id,
        avatar:userInfo.avatar,
      }
      console.log('增加本次投票')
      setVotings([...votings,thisVoting])
    }else{
      let filterVotings = votings.filter(it => {
        return !(it.userId == userInfo.id && optionId == it.optionId)
      })
      setVotings(filterVotings)
    }

    let res = await Axios.post(`/voteup/${id}`,{
      optionId,
      isVoteDown:hasVoted
    })
    console.log('res.data:'+ res.data)
  }

  if (loading) {
    return <div>loading...</div>
  }
  console.log('voteInfo:',voteInfo)

  return (
    <div>
      <h2>{voteInfo.title}</h2>
      <p>{voteInfo.isMultiple ? '[多选]':'[单选]'} {voteInfo.desc}</p>
      <ul>
        {
          //option有告诉我们是谁投的票,拿到数据进行计算
          voteInfo.options.map((option) => {
            let currVotings = groupedVotings[option.id] || [] //当前选项的每一票
            console.log('currVotings', currVotings)
            console.log('userInfo:',userInfo,option)
            //这个选项是哪个用户投的
            let hasCurrUserVoted = !!currVotings.find(it => it.userId == userInfo.id)
            console.log(hasCurrUserVoted)
            return <li key={option.id} onClick={() => voteUp(option.id,hasCurrUserVoted )}>
              <input type="checkbox" checked={hasCurrUserVoted}/>
              {' '}
              <span className="option-text">{option.content}</span>
              {' '}
              <strong>{currVotings.length}票{calcuRatio(currVotings.length , uniqueUsersCount )}%</strong>
              <div className="option-ratio" style={{width:calcuRatio(currVotings.length , uniqueUsersCount ) + '%'}}></div>
              <ul className="avatars">
                {
                  currVotings.map(voting => {
                    return <li><img className="avatar" src={voting.avatar} /></li>
                  })
                }
              </ul>
            </li>
          })
        }
      </ul>
      <p>投票截至：{new Date(voteInfo.deadline).toLocaleString()}</p>
    </div>
  )
}



function calcuRatio(num, base) {
  if (base == 0) {
    return 0
  }
  return (num / base  * 100). toFixed(2)
}

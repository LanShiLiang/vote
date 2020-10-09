import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {useParams,useHistory,useLocation} from 'react-router-dom';
import './ViewVote.scss';
import {groupBy,uniqBy} from 'lodash'
import { Checkbox } from 'antd';

//useParams可以获取匹配成功的路径的id

export default function ViewVote({userInfo}){
  let {id} = useParams()  //问题的id
  let [loading, setLoading] = useState(true) //加载中
  let [voteInfo, setVoteInfo] = useState(null)
  let [votings,setVotings] = useState(null)
  let location = useLocation()
  // let history = useHistory()
  //需要group votings
  let groupedVotings
  let uniqueUsersCount
  let thisVoting
  if(!loading){
    // console.dir('voteInfo:' + voteInfo)
    uniqueUsersCount = uniqBy(voteInfo.votings,'userId').length
    groupedVotings = groupBy(votings, 'optionId')
    // console.log('groupedVotings:',groupedVotings)
  }

  useEffect(() => {
    //拿到投票的相关信息
    setVoteInfo(null)
    setLoading(true)
    axios.get(`/vote/${id}`).then((res) => {
      // console.log('GET bug:', res)
      setVoteInfo(res.data)
      setVotings(res.data.votings)
      setLoading(false)
    })
  }, [id])

  useEffect(() => {
    //用于接收某个vote的新的选票信息
    if(voteInfo) {
      if(Date.now() < new Date(voteInfo.deadline).getTime()){
        console.log('ws 重新连接')
        //eslint-disable-next-line
        let ws = new WebSocket(`ws://${window.location.host}/vote/${id}`)
        ws.onmessage = e =>{
          setVotings(JSON.parse(e.data))
        }
        return () => ws.close()
      }
    }
  },[id,voteInfo])

  async function voteUp(optionId,hasVoted,Multiple){
    if(Date.now() > new Date(voteInfo.deadline).getTime()){
      alert('该投票已经过期')//这样做不好，应该换成div渐显 Modal(‘asdasdasd’)
      return
    }
    // console.log('Multiple:',Multiple)
    // console.log('hasvoted;',hasVoted)
    //区分单选和多选。还要区分是否选过(!hasVoted)
    if(Multiple){
      if(!hasVoted){
        thisVoting = {
          id:-1,
          optionId:optionId,
          voteId: id,
          userId: userInfo.id,
          avatar:userInfo.avatar,
        }
        // console.log('-------------增加本次多选投票--------------')
        setVotings([...votings,thisVoting])
      }else{
        let filterVotings = votings.filter(it => {
          return !(it.userId === userInfo.id && optionId === it.optionId)
        })
        setVotings(filterVotings)
      }
    }else{
      if(!hasVoted){
        thisVoting = {
          id:-1,
          optionId:optionId,
          voteId: id,
          userId: userInfo.id,
          avatar:userInfo.avatar,
        }
        // console.log('-------------增加本次单选投票--------------', thisVoting)
        // console.log('-------------votings--------------', votings)
        let filterVotings = votings.filter(it => {
          return !(it.userId === userInfo.id)
        })
        // console.log('-----------------filter---------',filterVotings)
        setVotings([...filterVotings,thisVoting])
        // setVotings([...votings,thisVoting])
      }else{
        let filterVotings = votings.filter(it => {
          return !(it.userId === userInfo.id && optionId === it.optionId)
        })
        setVotings(filterVotings)
      }
    }

    await axios.post(`/voteup/${id}`,{
      optionId,
      isVoteDown:hasVoted
    }).then(res => {

    })
    // console.log('post --- res.data:'+ res.data)
  }

  if (loading) {
    return <div>loading...</div>
  }
  // console.log('voteInfo:',voteInfo)

  return (
    <div>
      <h2 className="view-title">{voteInfo.title}</h2>
      <p className="view-desc">{voteInfo.desc}
      <span>{voteInfo.isMultiple ? '[多选]':'[单选]'}</span>
      </p>
      <ul>
        {
          //option有告诉我们是谁投的票,拿到数据进行计算
          voteInfo.options.map((option) => {
            let currVotings = groupedVotings[option.id] || [] //当前选项的每一票
            // console.log('groupedVotings:',groupedVotings)
            // console.log('currVotings', currVotings)
            // console.log('userInfo:',userInfo,option)
            let hasCurrUserVoted

              hasCurrUserVoted = !!currVotings.find(it => it.userId === userInfo.id)

            //这个选项是哪个用户投的
            // console.log("hasCurrUserVoted:",hasCurrUserVoted)

            return  (<li className="view-vote-li" key={option.id} onClick={() => voteUp(option.id,hasCurrUserVoted,voteInfo.isMultiple )}>
                    <div className="bgc-white">
                      <div className="view-option">
                        <div>
                          < Checkbox
                          checked = {
                            hasCurrUserVoted
                          }
                          />
                          <span className="option-text">{option.content}</span>
                        </div>
                          <strong>
                          <span>{currVotings.length}票</span><span>{calcuRatio(currVotings.length , uniqueUsersCount)}%</span>
                          </strong>
                        <div className="option-ratio" style={{width:calcuRatio(currVotings.length , uniqueUsersCount) + '%'}}></div>
                      </div>
                      </div>
                      <ul className="avatars">
                        {
                          currVotings.map(voting => {
                            return <li key={voting.avatar}><img className="avatar" src={voting.avatar} /></li>
                          })
                        }
                      </ul>
                    </li>)
          })
        }
      </ul>
      <p>投票截至：{new Date(voteInfo.deadline).toLocaleString()}</p>
    </div>
  )
}



function calcuRatio(num, base) {
  if (base === 0) {
    return 0
  }
  return num / base * 100 >= 100 ? 100.00 : (num / base * 100).toFixed(2)
}

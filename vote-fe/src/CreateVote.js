import React,{useState} from 'react'
import {useInput,useBoolean} from 'react-hanger'
import axios from 'axios'
import {useHistory, useLocation} from 'react-router-dom'

function useQuery(){
  return new URLSearchParams(useLocation().search);
}

export default function CreateSingleVote(){
  let query = useQuery()

  let [options,setOptions] = useState(['',''])
  let title = useInput()
  let desc = useInput()
  let deadline = useInput()
  let anonymous = useBoolean()
  let history = useHistory()
  let isMultiple = useBoolean(query.get('multiple') === '1' ? true : false)
  function handleDeleteOption(idx){
    if(options.length === 2){
      return
    }
    setOptions(options.filter((_,index) => idx !==index))
  }
  console.log(options)
  async function createVote() {
    try {
      debugger
      var res = await axios.post('/vote', {
        title: title.value,
        desc: desc.value,
        options: options,
        deadline: new Date(deadline.value).toISOString(),
        anonymous: anonymous.value ? 1 : 0,
        isMultiple: isMultiple.value ? 1 : 0,
      })
      history.push('/vote/'+res.data.voteId)
    } catch (e) {
      alert('创建失败' + e.toString())
    }
  }

  return (
    <div>
      <h3>创建单选投票</h3>
      <div><input type="text" value={title.value} onChange={title.onChange} placeholder="投票标题" /></div>
      <div><input type="text" value={desc.value} onChange={desc.onChange} placeholder="补充描述（选填）" /></div>
      <ul>
        {//选项列表
          options.map((it,idx) => {
            return <li key={idx}>
              <button onClick={() => handleDeleteOption(idx)}>&times;</button>
              <input type="text" value={it} onChange={(e) => setOptions([...options.slice(0,idx),e.target.value,...options.slice(idx+1)])}/>
            </li>
          })
        }
      </ul>
      <button onClick={() => setOptions([...options,''])}>添加选项</button>
      <div>截止日期：<input type="datetime-local" value={deadline.value} onChange={deadline.onChange}/></div>
      <div>匿名投票：<input type="checkbox" checked={anonymous.valuechecked} onChange={anonymous.toggle}/></div>
      <div >多选:<input type="checkbox" checked={isMultiple.value} onChange={isMultiple.toggle}/></div>
      <div><button onClick={createVote}>创建</button></div>
    </div>
  )
}

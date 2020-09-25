import React from 'react'
import {Link} from 'react-router-dom'

export default function Create(){
  return(
    <div>
      <div><Link to="/create-vote">创建单选</Link></div>
      <div><Link to="/create-vote?multiple=1">创建多选</Link></div>
    </div>
  )
}

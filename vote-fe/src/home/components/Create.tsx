import React from 'react'
import './Create.less'
import {Link} from 'react-router-dom'
import {
  DiffTwoTone
}
from '@ant-design/icons';

export default function Create(){
  return(
    <div>
      <div className='img img1'>
        < DiffTwoTone />
      <Link to="/create-vote"><div>创建单选</div></Link>
      </div>
      <div className='img img2'>
        < DiffTwoTone />
      <Link to="/create-vote?multiple=1"><div>创建多选</div></Link>
      </div>
    </div>
  )
}

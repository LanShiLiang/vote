import React from 'react'
import {Link, useHistory, useRouteMatch,Route,Redirect,NavLink} from 'react-router-dom'
import axios from 'axios'
import Create from './Create'
import My from './My'

export default function Home({userInfo,setUserInfo}){
  let {path,url} = useRouteMatch()
  let history = useHistory()




  return(
    <div>
      <Route path={`${url}/`} exact>
        <Redirect to={`${url}/create`} />
      </Route>
      <Route path={`${url}/create`}>
        <Create />
      </Route>
      <Route path={`${url}/my`}>
        <My setUserInfo={setUserInfo}/>
      </Route>

      <div>
        <NavLink activeClassName="active" to={`${url}/create`}>新建</NavLink>
        |
        <NavLink activeClassName="active" to={`${url}/my`}>我的</NavLink>
      </div>


      {/* <div><Link to="/create-vote">创建单选</Link></div>
      <div><Link to="/create-vote?multiple=1">创建多选</Link></div>
      <button onClick={logout}>登出</button> */}
    </div>
  )
}

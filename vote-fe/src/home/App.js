import React,{useEffect,useState} from 'react';
import './App.less';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
}from 'react-router-dom'
import axios from 'axios'
import Home from './Home'
import Login from '../user/Login'
import CreateVote from '../cv-votes/CreateVote'
import ViewVote from '../cv-votes/ViewVote'
import Register from '../user/Register'

function App() {
  let history = useHistory()
  let [userInfo,setUserInfo] = useState({})
  useEffect(() => {
    //useEffect 传空数组只渲染一次
    axios
      .get("/userinfo")
      .then((res) => {
        // console.log(res.data)
        setUserInfo(res.data);
      })
      .catch((e) => {
        // console.log('未登录,将显示登陆界面')
        history.push("/login");
      });
    // eslint-disable-next-line
  },[])

  return (
      <div className="App">
      <Switch>
        <Route path="/" exact>
          <Redirect to="home"></Redirect>
        </Route>

        <Route path="/login">
          <Login setUserInfo={setUserInfo}/>
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/home">
          {
            userInfo &&
          <Home userInfo={userInfo}  setUserInfo={setUserInfo}/>
          }
        </Route>
        <Route path="/create-vote">
          <CreateVote />
        </Route>
        <Route path="/vote/:id">
          {
            userInfo &&
          <ViewVote userInfo={userInfo}/>
          }
        </Route>
      </Switch>
    </div>
  );
}

export default App;

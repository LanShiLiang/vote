import React from "react";
import "./App.less";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Login from "../user/Login";
import CreateVote from "../cv-votes/CreateVote";
import ViewVote from "../cv-votes/ViewVote";
import Register from "../user/Register";
import { useMainPageInfo } from "./hooks";

const App: React.FC = () => {
  const { userInfo, setUserInfo } = useMainPageInfo();
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <Redirect to="home"></Redirect>
        </Route>
        <Route path="/login">
          <Login setUserInfo={setUserInfo} />
        </Route>
        <Route path="/register">
          <Register setUserInfo={undefined} />
        </Route>
        <Route path="/home">
          {userInfo && <Home setUserInfo={setUserInfo} />}
        </Route>
        <Route path="/create-vote">
          <CreateVote />
        </Route>
        <Route path="/vote/:id">
          {userInfo && <ViewVote userInfo={userInfo} />}
        </Route>
      </Switch>
    </div>
  );
};

export default App;

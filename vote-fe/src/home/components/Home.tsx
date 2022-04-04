import React from "react";
import { useRouteMatch, Route, Redirect, NavLink } from "react-router-dom";
import Create from "./Create";
import My from "../../user/My";
import { FolderAddFilled, IdcardFilled } from "@ant-design/icons";
import { setUserInfo } from "../../types";

export default function Home({
  setUserInfo,
}: {
  setUserInfo: setUserInfo
}) {
  let { url } = useRouteMatch();

  return (
    <div>
      <Route path={`${url}/`} exact>
        <Redirect to={`${url}/create`} />
      </Route>
      <Route path={`${url}/create`}>
        <Create />
      </Route>
      <Route path={`${url}/my`}>
        <My setUserInfo={setUserInfo} />
      </Route>

      <div className="foot-bar">
        <NavLink
          className="fb f-create"
          activeClassName="active"
          to={`${url}/create`}
        >
          <FolderAddFilled />
          新建
        </NavLink>

        <NavLink className="fb f-my" activeClassName="active" to={`${url}/my`}>
          <IdcardFilled />
          我的
        </NavLink>
      </div>
    </div>
  );
}

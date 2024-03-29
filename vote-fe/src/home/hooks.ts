import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import axios from "axios";
import { userInfo } from "../types";

const useMainPageInfo = () => {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState<userInfo | {}>({});
  useEffect(() => {
    axios
      .get("/userinfo")
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch(() => {
        history.push("/login");
      });
    // eslint-disable-next-line
  }, []);

  return { userInfo, setUserInfo };
};

export { useMainPageInfo };

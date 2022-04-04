
import axios from "axios";
import { useState, useEffect } from "react";
import { useInput, useBoolean } from "react-hanger";
import { useParams } from "react-router-dom";
import "./createVote.less";
import { useHistory, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const useCreate = () => {
  const query = useQuery();
  const title = useInput();
  const desc = useInput();
  const anonymous = useBoolean(false);
  const history = useHistory();
  const isMultiple = useBoolean(query.get("multiple") === "1" ? true : false);

  useEffect(() => {
    setTimeout(() => {
      const Ul: HTMLCollectionOf<Element> | any =
        document.getElementById("create-ul");
      const Li: HTMLCollectionOf<Element> | any =
        document.getElementsByClassName("create-li");
      if (Li[0]) {
        let h = Li[0].offsetHeight;
        h = h * Li.length;
        Ul.setAttribute("style", `height:${h}px;`);
      }
    }, 100);
  });

  return { isMultiple, title, desc, anonymous, history };
};

const useView = () => {
  const { id } = useParams<{ id: string }>(); //问题的id
  const [loading, setLoading] = useState(true); //加载中
  const [voteInfo, setVoteInfo] = useState(null);
  const [votings, setVotings] = useState(null);
  useEffect(() => {
    //拿到投票的相关信息
    setVoteInfo(null);
    setLoading(true);
    axios.get(`/vote/${id}`).then((res) => {
      // console.log('GET bug:', res)
      setVoteInfo(res.data);
      setVotings(res.data.votings);
      setLoading(false);
    });
  }, [id]);

  //用于接收某个vote的新的选票信息
  useEffect(() => {
    if (voteInfo) {
      if (Date.now() < new Date(voteInfo.deadline).getTime()) {
        console.log("ws 重新连接");
        //eslint-disable-next-line
        let ws = new WebSocket(`ws://${window.location.host}/vote/${id}`);
        ws.onmessage = (e) => {
          setVotings(JSON.parse(e.data));
        };
        return () => ws.close();
      }
    }
  }, [id, voteInfo]);
  return { id, loading, votings, setVotings, voteInfo };
};

export { useCreate, useView };

import React, { useState, useEffect } from "react";
import { useInput, useBoolean } from "react-hanger";
import axios from "axios";
import moment from "moment";
import { Input, Button, Switch, DatePicker } from "antd";
import { MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import "./createVote.less";
import { useHistory, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CreateSingleVote() {
  let query = useQuery();
  let [options, setOptions] = useState(["", ""]);
  let title = useInput();
  let desc = useInput();
  let [deadline, setDeadline] = useState("");
  let anonymous = useBoolean();
  let history = useHistory();
  let isMultiple = useBoolean(query.get("multiple") === "1" ? true : false);
  let optionKey;
  let dateTime = new Date();
  dateTime = dateTime.setDate(dateTime.getDate() + 1);
  dateTime = new Date(dateTime).toLocaleString();

  function handleDeleteOption(idx) {
    if (options.length === 2) {
      return;
    }
    setOptions(options.filter((_, index) => idx !== index));
  }
  async function createVote() {
    try {
      debugger;
      var res = await axios.post("/vote", {
        title: title.value,
        desc: desc.value,
        options: options,
        deadline: new Date(deadline).toISOString(),
        anonymous: anonymous.value ? 1 : 0,
        isMultiple: isMultiple.value ? 1 : 0,
      });
      history.push("/vote/" + res.data.voteId);
    } catch (e) {
      alert("创建失败" + e.toString());
    }
  }
  function disabledDate(current) {
    return current <= moment().add(1, "days").startOf("day");
  }
  function DateOnChange(date, dateString) {
    // console.log('date+dateString',date,dateString)
    setDeadline(dateString);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    optionKey = Symbol();
    setTimeout(() => {
      let Ul = document.getElementById("create-ul");
      let Li = document.getElementsByClassName("create-li");
      // console.log('ul', Ul)
      // console.log('li', Li)
      if (Li[0]) {
        let h = Li[0].offsetHeight;
        h = h * Li.length;
        Ul.setAttribute("style", `height:${h}px;`);
      }
    }, 100);
  });

  return (
    <div className="create-votes">
      <h3>创建投票</h3>
      <li className="cv-title">
        <Input
          type="text"
          value={title.value}
          onChange={title.onChange}
          placeholder="投票标题"
        />
      </li>
      <li className="cv-desc">
        <Input
          type="text"
          value={desc.value}
          onChange={desc.onChange}
          placeholder="补充描述（选填）"
        />
      </li>
      <div id="create-ul" style={{ height: "110px" }}>
        {
          //选项列表
          options.map((it, idx) => {
            return (
              <li key={optionKey} className="create-li">
                <div className="redX" onClick={() => handleDeleteOption(idx)}>
                  <MinusCircleFilled />
                </div>
                <Input
                  type="text"
                  value={it}
                  placeholder="选项"
                  onChange={(e) => {
                    e.persist();
                    setOptions([
                      ...options.slice(0, idx),
                      e.target.value,
                      ...options.slice(idx + 1),
                    ]);
                  }}
                />
              </li>
            );
          })
        }
      </div>
      <div className="setOptions" onClick={() => setOptions([...options, ""])}>
        <PlusCircleFilled />
        点击添加选项
      </div>

      <div id="cv-bottom">
        <li>
          <span>截止日期：</span>
          <DatePicker
            placeholder={dateTime}
            disabledDate={disabledDate}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={DateOnChange}
          />
        </li>
        <li>
          匿名投票：
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={anonymous.valuechecked}
            onClick={anonymous.toggle}
          />
        </li>
        <li id="multiple">
          多选：
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={isMultiple.value}
            onClick={isMultiple.toggle}
          />
        </li>
      </div>
      <li className="create-now">
        <Button
          type="primary"
          className="login-form-button"
          onClick={createVote}
        >
          创建
        </Button>
      </li>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import { Input, Button, Switch, DatePicker } from "antd";
import { MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import "./createVote.less";
import { useCreate } from "./hooks"


export default function CreateSingleVote() {
  const [options, setOptions] = useState(["", ""]);
  const [deadline, setDeadline] = useState("");
  const { isMultiple, title, desc, anonymous, history } = useCreate();
  // let optionKey: Symbol;
  let dateTime: Date | number | string = new Date();
  dateTime = dateTime.setDate(dateTime.getDate() + 1);
  dateTime = new Date(dateTime).toLocaleString();

  function handleDeleteOption(idx: number): void {
    if (options.length === 2) {
      return;
    }
    setOptions(options.filter((_, index) => idx !== index));
  }
  async function createVote() {
    try {
      debugger;
      const res = await axios.post("/vote", {
        title: title.value,
        desc: desc.value,
        options: options,
        deadline: new Date(deadline).toISOString(),
        anonymous: anonymous.value ? 1 : 0,
        isMultiple: isMultiple.value ? 1 : 0,
      });
      history.push("/vote/" + res.data.voteId);
    } catch (e: any) {
      alert("创建失败" + e.toString());
    }
  }
  function disabledDate(current) {
    return current <= Number(moment().add(1, "days").startOf("day"));
  }
  function DateOnChange(_: any, dateString: React.SetStateAction<string>) {
    setDeadline(dateString);
  }


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
              <li key={idx} className="create-li">
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
            checked={anonymous.value}
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

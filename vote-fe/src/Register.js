import React,{useRef} from 'react'
import axios from 'axios'
import { HashRouter, useHistory} from 'react-router-dom'
import {
  UserOutlined,
  LockOutlined,
  SmileOutlined,
  MailOutlined,
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {Input,Button,Upload,message} from 'antd'
import './login.scss'
import './Register.scss'
import Form from 'antd/lib/form/Form';


let avatar = {}
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  avatar.file = file
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  avatar.file = file
  return isJpgOrPng && isLt2M;
}
    class Avatar extends React.Component {
  state = {
    loading: false,
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
    console.log(avatar)
  };

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
        }


export default function Register({setUserInfo}){
  let nameRef = useRef(null)
  let passwordRef = useRef(null)
  let emailRef = useRef(null)
  let history = useHistory()

  async function handleRegister(e){
    e.preventDefault()
    let formData = new FormData()
    formData.append('name', nameRef.current.state.value)
    formData.append('password', passwordRef.current.state.value)
    formData.append('email', emailRef.current.state.value)
    formData.append('avatar', avatar.file)
    if (nameRef.current.state.value == undefined || passwordRef.current.state.value == undefined
        || emailRef.current.state.value == undefined){
          alert('请填写完整注册信息')
          return
        }
    try{
        await axios.post('/register',formData).then(
          function(response){
            console.log(response)
            alert('注册成功，请登录')
            history.push('/Login')
        })
  } catch (e){
    console.log(e)
  }
}
  return(

    <div id="register-father">
      <form id="register" method="post" action="/register" encType="formdata/multipart" >
        <Input type="text" ref={nameRef}
        prefix={<UserOutlined  className="site-form-item-icon"/>}
        placeholder="用户名"
        />
        <Input type="text" ref={emailRef}
         prefix={<MailOutlined className="site-form-item-icon" />}
         placeholder="邮箱"
         />
        <Input type="password" ref={passwordRef}
         prefix={<LockOutlined className="site-form-item-icon" />}
         placeholder="密码"
         />
        <Avatar name="avatar"/>

        <Button type="primary" className="login-form-button" onClick={handleRegister}>注册</Button>
      </form>
    </div>

  )
}



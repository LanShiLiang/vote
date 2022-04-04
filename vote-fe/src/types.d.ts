interface userInfo {
  avatar: string;
  email: string;
  id: number;
  name: string;
  password: number;
}
type setUserInfo = React.Dispatch<React.SetStateAction<{} | userInfo>>;

export { userInfo, setUserInfo };

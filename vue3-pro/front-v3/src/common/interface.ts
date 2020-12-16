export interface UserInfo {
  _id: string;
  username?: string;
  name?: string;
  location?: string;
  gender?: string;
  regmark?: string;
  pic?: string;
}

export interface LoginInfo{
  username: string;
  password: string;
  code: string;
  sid?: string;
}

// interface 继承(注册)
export interface RegInfo extends LoginInfo{
  name: string;
  repassword?: string;
}

// 重置
export interface ResetInfo {
  key: string;
  password: string;
  code: string;
  sid: string;
}

// w忘记密码
export interface ForgetInfo{
  username: string;
  code: string;
}

// 自定义 api接口返回的 Promise<HttpResponse>
export interface HttpResponse {
  code: number;
  data?: any;
  msg?: string | Record<string, any>; // 定义 字符串，对象类型
  total?: number;
  count?: number;
  favs?: number;
  lastSign?: string;
  isCollect?: boolean;
  token?: string;
  notify?: any;
  userInfo?: any;
}

import { CommonResponse } from "./common"

//회원가입
export type RequestSignupDto = {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  preferTags: number[];
}
export type ResponseSignupDto = CommonResponse<{
  userId: number;
  createdAt: string;
}>

//로그인
export type RequestSigninDto = {
    email: string;
    password: string;
}
export type ResponseSigninDto = CommonResponse<{
  userId: number;
  nickname: string;
  accessToken: string;

}>

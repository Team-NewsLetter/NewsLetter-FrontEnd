import axios from "axios";
import {
  RequestSignupDto,
  ResponseSignupDto,
  RequestSigninDto,
  ResponseSigninDto,
} from "../types/auth";

export const publicAxios = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await publicAxios.post("/users/signup", body);
  return data;
};

export const postLogin = async (
  body: RequestSigninDto
): Promise<ResponseSigninDto> => {
  console.log("보내는 로그인 body:", body); 
  const { data } = await publicAxios.post("/users/login", body);
  return data;
};




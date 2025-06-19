import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../apis/auth";
import { useMutation } from "@tanstack/react-query";

interface FormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const { mutate: login } = useMutation({
    mutationFn: postLogin,
    onSuccess: (res) => {
      localStorage.setItem("accessToken", res.result.accessToken);
      navigate("/");
    },
    onError: () => {
      alert("이메일 또는 비밀번호가 잘못되었습니다.");
    },
  });

  const onSubmit = (data: FormValues) => {
    login(data);
  };

  return (
    <div className="h-[90vh] bg-white text-black flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col gap-5 bg-white p-6 rounded-lg shadow-md"
      >
        {/* 상단 체크 아이콘 + 타이틀 */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-[#2962FF] rounded-full flex items-center justify-center text-white text-xl">
            ✓
          </div>
          <h2 className="text-lg font-semibold">환영합니다</h2>
          <p className="text-sm text-gray-500">계정에 로그인하세요</p>
        </div>

        {/* 이메일 입력 */}
        <input
          type="email"
          placeholder="user@example.com"
          className="border border-gray-300 rounded px-3 py-2 placeholder-gray-400"
          {...register("email", {
            required: "이메일을 입력해주세요",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "올바른 이메일 형식이 아닙니다",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        {/* 비밀번호 입력 */}
        <input
          type="password"
          placeholder="비밀번호"
          className="border border-gray-300 rounded px-3 py-2 placeholder-gray-400"
          {...register("password", {
            required: "비밀번호를 입력해주세요",
            minLength: {
              value: 6,
              message: "비밀번호는 최소 6자 이상이어야 합니다",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="bg-[#2962FF] text-white py-2 rounded hover:brightness-110 font-semibold"
        >
          로그인
        </button>

        {/* 구분선 */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="flex-1 h-px bg-gray-300" />
          <span>또는</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* 하단 링크 */}
        <div className="text-sm text-center text-gray-600 mb-2">
          계정이 없으신가요?{" "}
          <span
            className="text-[#2962FF] font-semibold cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </span>
          <br />
          <span
            className="text-[#2962FF] underline cursor-pointer text-sm"
            onClick={() => alert("비밀번호 변경 구현 예정")}
          >
            비밀번호를 잊으셨나요?
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

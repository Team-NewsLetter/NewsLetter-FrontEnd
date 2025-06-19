import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postSignup } from "../apis/auth";
import { RequestSignupDto } from "../types/auth";
enum UserTag {
  animal = "동물",
  plant = "식물",
  food = "식품",
  policy = "정책",
  science = "과학",
  life = "생활",
}
const TAG_MAP: Record<UserTag, number> = {
  [UserTag.animal]: 1,
  [UserTag.plant]: 2,
  [UserTag.food]: 3,
  [UserTag.policy]: 4,
  [UserTag.science]: 5,
  [UserTag.life]: 6,
};

type FormValues = {
  nickname: string;
  email: string;
  password: string;
  passwordCheck: string;
  tag: UserTag[];
};

const SignUpPage = () => {
  const navigate = useNavigate();

  const [selectedTags, setSelectedTags] = useState<UserTag[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      tag: [],
    },
  });

  const toggleTag = (tag: UserTag): void => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const mutation = useMutation({
    mutationFn: postSignup,
    onSuccess: () => {
      alert("회원가입 완료!");
      navigate("/login");
    },
    onError: () => {
      alert("회원가입에 실패했습니다.");
    },
  });

  const onSubmit = (data: FormValues): void => {
    if (data.password !== data.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }

    if (selectedTags.length === 0) {
      alert("관심 태그를 하나 이상 선택해주세요!");
      return;
    }

    const finalData: RequestSignupDto = {
      email: data.email,
      password: data.password,
      confirmPassword: data.passwordCheck,
      nickname: data.nickname,
      preferTags: selectedTags.map((tag) => TAG_MAP[tag]),
    };

    mutation.mutate(finalData);
  };

  return (
    <div className="h-[90vh] bg-white text-black flex items-center justify-center px-4 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold text-center mb-4">회원가입</h1>

        {/* 입력 필드 */}
        <input
          type="text"
          placeholder="닉네임"
          {...register("nickname", { required: "닉네임을 입력해주세요" })}
          className="border border-gray-300 rounded p-2"
        />
        {errors.nickname && (
          <p className="text-sm text-red-500">{errors.nickname.message}</p>
        )}

        <input
          type="email"
          placeholder="이메일"
          {...register("email", { required: "이메일을 입력해주세요" })}
          className="border border-gray-300 rounded p-2"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="비밀번호"
          {...register("password", { required: "비밀번호를 입력해주세요" })}
          className="border border-gray-300 rounded p-2"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}

        <input
          type="password"
          placeholder="비밀번호 확인"
          {...register("passwordCheck", {
            required: "비밀번호 확인을 입력해주세요",
          })}
          className="border border-gray-300 rounded p-2"
        />
        {errors.passwordCheck && (
          <p className="text-sm text-red-500">{errors.passwordCheck.message}</p>
        )}

        {/* 관심 태그 선택 */}
        <div>
          <p className="text-sm font-medium mb-2">관심 태그 선택</p>
          <div className="grid grid-cols-3 gap-2 justify-center">
            {Object.entries(UserTag)
              .slice(0, 6)
              .map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleTag(value)}
                  className={`px-2 py-1 rounded-full border text-sm text-center ${
                    selectedTags.includes(value)
                      ? "bg-[#2962FF] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  #{value}
                </button>
              ))}
          </div>
        </div>

        {/* 약관 동의 (form 외부 필수 체크) */}
        <label className="flex items-center text-sm mt-2">
          <input type="checkbox" required className="mr-2" />
          이용약관 및 개인정보 처리방침에 동의합니다
        </label>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="bg-[#2962FF] text-white py-2 rounded hover:bg-purple-700"
        >
          가입하기
        </button>

        <p className="text-sm text-center text-gray-500">
          이미 계정이 있으신가요?{" "}
          <span
            className="text-[#2962FF] font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            로그인
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;

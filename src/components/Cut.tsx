import React, { useState } from "react";
import { motion } from "framer-motion";
import { axiosInstance } from "../apis/axios";

export type CutProps = {
  src: string;
  text: string;
  cardNewsId: number;
  type: "cut" | "feedback";
  newsType?: string;
  index?: number;
  total?: number;
};

export const Cut: React.FC<CutProps> = (props) => {
  const [reaction, setReaction] = useState<
    "LIKE" | "DISLIKE" | "PRACTICE" | "NOT_PRACTICE" | "NONE"
  >("NONE");

  const handleComplete = async () => {
    try {
      await axiosInstance.post("/api/card-news/reading", {
        cardNewsId: props.cardNewsId,
        read: true,
      });

      if (reaction === "LIKE" || reaction === "DISLIKE") {
        await axiosInstance.post("/api/card-news/reaction", {
          cardNewsId: props.cardNewsId,
          reaction,
        });
      }
      if (reaction === "PRACTICE" || reaction === "NOT_PRACTICE") {
        await axiosInstance.post("/api/card-news/practice", {
          cardNewsId: props.cardNewsId,
          practiceType: reaction,
        });
      }
    } catch (error) {
      console.error("처리 실패:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto px-4 py-6"
    >
      {/* 전체 카드 */}
      <div className="rounded-[30px] bg-white/30 backdrop-blur-lg shadow-xl overflow-hidden flex flex-col">
        {/* 이미지 */}
        <div className="h-[360px] flex items-center justify-center bg-white/10">
          <img
            src={props.src}
            alt="컷 이미지"
            className="object-contain h-full w-full rounded-[30px]"
          />
        </div>

        {/* 내용 박스 */}
        <div className="bg-white/70 text-gray-800 p-6 rounded-t-[30px] -mt-12 relative z-10">
          {props.type === "cut" && (
            <p className="text-base leading-relaxed text-center whitespace-pre-line">
              {props.text}
            </p>
          )}

          {props.type === "feedback" && (
            <div className="flex flex-col items-center text-base space-y-2">
              <p className="text-lg font-semibold text-center mb-2">
                {props.newsType === "실천"
                  ? props.text
                  : "이 카드 뉴스를 추천하십니까?"}
              </p>

              <div className="grid gap-2">
                {props.newsType === "실천" ? (
                  <>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="feedback"
                        value="PRACTICE"
                        onChange={() => setReaction("PRACTICE")}
                      />
                      <span>네</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="feedback"
                        value="NOT_PRACTICE"
                        onChange={() => setReaction("NOT_PRACTICE")}
                      />
                      <span>다음에 하겠습니다</span>
                    </label>
                  </>
                ) : (
                  <>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="feedback"
                        value="LIKE"
                        onChange={() => setReaction("LIKE")}
                      />
                      <span>추천합니다</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="feedback"
                        value="DISLIKE"
                        onChange={() => setReaction("DISLIKE")}
                      />
                      <span>추천하지 않습니다</span>
                    </label>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  handleComplete();
                  window.history.back();
                }}
                disabled={reaction === "NONE"}
                className={`mt-6 px-6 py-2 rounded-lg text-white transition ${
                  reaction === "NONE"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:brightness-110"
                }`}
              >
                완료
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

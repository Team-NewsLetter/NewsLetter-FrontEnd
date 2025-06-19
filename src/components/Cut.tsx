import React, { useState } from "react";
import { motion } from "framer-motion";
import { axiosInstance } from "../apis/axios";

export type CutProps = {
  src: string;
  text: string;
  cardNewsId: number;
  type: "cut" | "feedback";
  newsType?: string;
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
      className="p-4 h-[100vh] flex flex-col items-center justify-between text-white"
    >
      <div className="flex flex-col items-center space-y-4 flex-1 w-full">
        <div className="h-[50vh] w-full max-w-[360px] mx-auto flex items-center justify-center">
          <img
            src={props.src}
            alt="컷 이미지"
            className="max-h-full max-w-full object-contain rounded-xl shadow"
          />
        </div>

        {props.type === "cut" && (
          <div className="w-[70vw] overflow-y-auto px-4">
            <p className="text-lg text-center break-words whitespace-pre-line">
              {props.text}
            </p>
          </div>
        )}

        {props.type === "feedback" && (
          <div className="flex flex-col space-y-2 text-lg items-center w-full">
            {props.newsType === "실천" ? (
              <>
                <p className="text-xl font-semibold text-center mb-4">
                  {props.text}
                </p>
                <div className="grid gap-2">
                  <label className="grid grid-cols-[1.5rem_auto] items-center gap-2">
                    <input
                      type="radio"
                      name="feedback"
                      value="PRACTICE"
                      onChange={() => setReaction("PRACTICE")}
                    />
                    <span>네</span>
                  </label>
                  <label className="grid grid-cols-[1.5rem_auto] items-center gap-2">
                    <input
                      type="radio"
                      name="feedback"
                      value="NOT_PRACTICE"
                      onChange={() => setReaction("NOT_PRACTICE")}
                    />
                    <span>다음에 하겠습니다</span>
                  </label>
                </div>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold text-center mb-4">
                  이 카드 뉴스를 추천하십니까?
                </p>
                <div className="grid gap-2">
                  <label className="grid grid-cols-[1.5rem_auto] items-center gap-2">
                    <input
                      type="radio"
                      name="feedback"
                      value="LIKE"
                      onChange={() => setReaction("LIKE")}
                    />
                    <span>추천합니다</span>
                  </label>
                  <label className="grid grid-cols-[1.5rem_auto] items-center gap-2">
                    <input
                      type="radio"
                      name="feedback"
                      value="DISLIKE"
                      onChange={() => setReaction("DISLIKE")}
                    />
                    <span>추천하지 않습니다</span>
                  </label>
                </div>
              </>
            )}

            <button
              onClick={() => {
                handleComplete();
                window.history.back();
              }}
              disabled={reaction === "NONE"}
              className={`my-10 px-6 py-3 rounded-xl text-white text-lg shadow-lg transition items-center ${
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
    </motion.div>
  );
};

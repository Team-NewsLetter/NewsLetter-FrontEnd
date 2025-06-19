import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiInfo } from "react-icons/fi";
import { FaEnvelope, FaEnvelopeOpen } from "react-icons/fa";
import { useCertifications } from "../hooks/useCertification";
import { axiosInstance } from "../apis/axios";

const TOTAL_MAIL_SLOTS = 15;

const CollectionPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useCertifications();
  const [openedId, setOpenedId] = useState<number | null>(null);
  const [certMap, setCertMap] = useState<Record<number, string>>({});
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

  const certifications = data?.certifications ?? [];
  const totalCount = data?.totalCount ?? 0;

  const unlockedMails = certifications.map((cert) => ({
    sequence: cert.sequence,
    unlocked: true,
  }));

  const remaining = TOTAL_MAIL_SLOTS - unlockedMails.length;
  const lockedMails = Array.from({ length: remaining }, (_, idx) => ({
    sequence: -1 * (idx + 1),
    unlocked: false,
  }));

  const mails = [...unlockedMails, ...lockedMails];

  useEffect(() => {
    const fetchAllImages = async () => {
      const map: Record<number, string> = {};
      const loading: Record<number, boolean> = {};

      await Promise.all(
        certifications.map(async (cert) => {
          loading[cert.sequence] = true;
          try {
            const res = await axiosInstance.get(
              `/api/certifications/${cert.sequence}`
            );
            const url = `http://51.20.65.235:8080${res.data.result.imageUrl}`;
            map[cert.sequence] = url;

            // 미리 로딩
            const img = new Image();
            img.src = url;
          } catch (e) {
            console.error(`감사장 ${cert.sequence} 불러오기 실패`, e);
            map[cert.sequence] = "ERROR";
          } finally {
            loading[cert.sequence] = false;
          }
        })
      );

      setCertMap(map);
      setLoadingMap(loading);
    };

    if (certifications.length > 0) {
      fetchAllImages();
    }
  }, [certifications]);

  const handleMailClick = (sequence: number, unlocked: boolean) => {
    if (!unlocked) return;
    setOpenedId(openedId === sequence ? null : sequence);
  };

  if (isLoading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">불러오기 실패</div>;

  return (
    <div className="pt-15 pb-20">
      {/* Topbar */}
      <div className="flex justify-between items-center mb-4">
        <div
          className="flex items-center gap-2 text-blue-600 font-semibold cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          <span font-bold>감사장 모음</span>
        </div>
        <FiInfo className="text-blue-600" />
      </div>

      {/* 요약 카드 */}
      <div className="bg-gray-50 rounded-xl p-4 shadow-sm mb-6 flex justify-between items-center text-sm">
        <p className="text-black font-semibold">🥇 총 감사장</p>
        <p className="text-black font-bold">{totalCount}개</p>
      </div>

      <div className="relative">
        {/* 편지 목록 */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {mails.map((mail) => (
            <button
              key={mail.sequence}
              onClick={() => handleMailClick(mail.sequence, mail.unlocked)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border shadow-sm h-28 transition-all duration-300 focus:outline-none ${
                mail.unlocked
                  ? "bg-yellow-50 border-yellow-300"
                  : "bg-gray-100 border-gray-200 opacity-50 cursor-default"
              }`}
            >
              {mail.unlocked ? (
                <FaEnvelopeOpen className="text-yellow-500 text-3xl mb-2" />
              ) : (
                <FaEnvelope className="text-gray-400 text-3xl mb-2" />
              )}
              <p className="text-sm font-medium text-gray-700 font-[Cafe24SsurroundAir]">
                {mail.unlocked ? (
                  <>
                    {mail.sequence}번째 <br /> 편지
                  </>
                ) : (
                  "???"
                )}
              </p>
            </button>
          ))}
        </div>

        {/* 펼쳐진 편지 */}
        {openedId && (
          <div className="absolute top-0 left-0 w-full flex justify-center px-4 z-50">
            {loadingMap[openedId] ? (
              <div className="w-[90%] max-w-sm h-64 bg-gray-200 rounded-xl animate-pulse shadow-xl" />
            ) : certMap[openedId] === "ERROR" ? (
              <div className="w-[90%] max-w-sm h-64 bg-red-100 text-red-500 rounded-xl flex items-center justify-center shadow-xl">
                이미지 로드 실패
              </div>
            ) : (
              <div
                onClick={() => setOpenedId(null)}
                className="w-[90%] max-w-sm h-[400px] rounded-xl border shadow-xl cursor-pointer bg-no-repeat bg-contain bg-center"
                style={{
                  backgroundImage: `url(${certMap[openedId]})`,
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;

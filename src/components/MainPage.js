import React from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="
      w-screen h-screen
      flex flex-col items-center justify-center
      bg-[#0f0f11] text-gray-200
      px-4
    ">
      
      {/* 로고 or 서비스 타이틀 */}
      <h1 className="text-4xl font-extrabold mb-4 tracking-wide">
        Data Explorer
      </h1>

      <p className="text-gray-400 mb-10 text-sm">
        Please log in to access the service
      </p>

      {/* 로그인 카드 */}
      <div className="
        bg-[#18181b]
        border border-gray-700/60
        rounded-2xl 
        p-8
        max-w-md w-full
        shadow-xl
      ">
        
        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="
            w-full py-3 
            bg-blue-600 hover:bg-blue-700 
            text-white font-semibold
            rounded-xl 
            transition-colors
          "
        >
          Log in
        </button>

        {/* 아래쪽 작은 문구 */}
        <p className="text-gray-500 mt-6 text-center text-xs">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default MainPage;


import React from "react";
import RegisterForm from "../components/RegisterForm";

const Register = () => {
  return (
    <main
      className="w-full h-screen flex flex-col bg-black-800 text-white-300 bg-cover bg-center"
      style={{ backgroundImage: 'url("/asset/background/bg.jpg")' }}
    >
      <div className="max-w-xl mx-auto p-5 md:px-10 xl:px-0 w-[90%] flex flex-col  bg-black-700  items-center rounded-lg shadow-sm mt-28">
        <div>
          <img
            src="/asset/logo/logo-no-background.png"
            alt="logo"
            width={150}
            height={150}
          />
        </div>
        <div className="w-full flex items-center justify-center">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
};

export default Register;

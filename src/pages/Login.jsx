import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { ShopContext } from '../context/ShopContext';
import { CreateAccountApi, LoginApi } from '../axios/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ReCAPTCHA from 'react-google-recaptcha';


const Login = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, handleAuthentication } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState('Login');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    rePassword: '',
    phoneNumber: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  
    if (currentState === 'Sign Up') {
        try {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                alert('Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ cái viết thường, viết hoa và số. ');
                return;
            }

            if (formData.password !== formData.rePassword) {
                alert('Mật khẩu không khớp. Vui lòng nhập lại.');
                return;
            }

            const response = await CreateAccountApi(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password,
                formData.phoneNumber
            );
            console.log(response);
            if (response === "Verify you email") {
                alert('Tạo tài khoản thành công. Vui lòng xác minh email của bạn.');
                setCurrentState('Login'); // Chuyển sang trạng thái đăng nhập
                navigate("/login");
            } else {
                throw new Error('Tạo tài khoản thất bại');
            }
        } catch (error) {
            // alert('Failed to create account. Please try again.');
            console.error(error);
        }
    } else {
        if (!formData.email || !formData.password) {
            alert("Vui lòng nhập email và mật khẩu.");
            return;
        }

        if (!showCaptcha) {
            setShowCaptcha(true);
            return;
        }

        if (!captchaToken) {
            alert("Vui lòng xác thực captcha trước khi đăng nhập.");
            return;
        }

        try {
            const response = await LoginApi(formData.email, formData.password, captchaToken);
            if (response.requiresOtp) {
                localStorage.setItem("pendingEmail", formData.email);
                navigate("/verify-otp");
            } else if (response && response.token) {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userName', response.name);
                localStorage.setItem('userId', response.userId);
                localStorage.setItem('userEmail', response.email);
                localStorage.setItem('userName', response.name);
                localStorage.setItem('userRole', response.role);
                localStorage.setItem('defaultCartId', response.defaultCartId);
                localStorage.setItem('role', response.role);
                handleAuthentication(true); // Cập nhật trạng thái đăng nhập
                if(response.role == "USER") {
                  navigate("/"); // Chuyển hướng về trang chủ
                } else if (response.role == "ADMIN") {
                  navigate("/admin")
                }
            } else {
                alert('Đăng nhập thật bại. Vui lòng xác thực tài khoản.');
            }
        } catch (error) {
            alert('Đăng nhập thật bại. Vui lòng thử lại.');
            console.error(error);
        }
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
      <p className="prata-regular text-3xl">
        {currentState === "Sign Up" ? "Đăng ký" : "Đăng nhập"}
      </p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === 'Sign Up' && (
        <>
          <input
            type="text"
            name="firstName"
            className="font-sans w-full px-3 py-2 border border-gray-800"
            placeholder="Họ"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="lastName"
            className="font-sans w-full px-3 py-2 border border-gray-800"
            placeholder="Tên"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            className="font-sans w-full px-3 py-2 border border-gray-800"
            placeholder="Số điện thoại"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            className="font-sans w-full px-3 py-2 border border-gray-800"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="font-sans w-full px-3 py-2 border border-gray-800"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          </div>
          <div className="relative w-full">
            <input
              type={showRePassword ? "text" : "password"}
              name="rePassword"
              className="font-sans w-full px-3 py-2 border border-gray-800"
              placeholder="Nhập lại mật khẩu"
              value={formData.rePassword}
              onChange={handleInputChange}
              required
            />
            <FontAwesomeIcon
              icon={showRePassword ? faEye : faEyeSlash}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={toggleRePasswordVisibility}
            />
          </div>
        </>
      )}
      {currentState === 'Login' && (
        <>
          <input
            type="email"
            name="email"
            className="font-sans w-full px-3 py-2 border border-gray-800"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            className="font-sans w-full px-3 py-2 border border-gray-800"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </>
      )}
      
      <div className="w-full flex justify-between text-sm mt-[-8px]">
          {currentState === 'Login' && (
              <p
                  onClick={() => navigate("/forgot-password")}
                  className="cursor-pointer"
              >
                  Quên mật khẩu?
              </p>
          )}
          <p
              onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
              className="cursor-pointer"
          >
              {currentState === 'Login' ? 'Tạo tài khoản' : 'Đăng nhập'}
          </p>
      </div>
        {showCaptcha && currentState === 'Login' && (
            <ReCAPTCHA
                sitekey="6LfflS0rAAAAAFh3OpJ4ZQL8FyrSIWehh_jAgMtu"
                onChange={(token) => setCaptchaToken(token)}
                className="mt-2"
            />
        )}
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === 'Login' ? 'Đăng nhập' : 'Đăng ký'}
      </button>
    </form>
  );
};

export default Login;
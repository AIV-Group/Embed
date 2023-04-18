import { useGoogleLogin } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import ReactLoading from 'react-loading';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';
import InputController from '../../../components/inputController';
import { setCookie } from '../../../components/utils/cookie';
import useStore from '../../../hooks/useStore';
import { setUser } from '../../../store/actions/index';
const Login = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const router = useNavigate();

    const [isChecked, setIsChecked] = useState(false);
    const [isShowPass, setIsShowPass] = useState(false);
    const [resGoogle, setResGoogle] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [isErrorPass, setIsErrorPass] = useState('Đây là trường bắt buộc');
    const [, dispatch] = useStore();
    const onSubmit = async (data) => {
        setIsLoading(true);
        const dataResponse = await axiosClient.post('auth/login/', {
            username: data.username,
            password: data.password,
        });

        if (dataResponse?.non_field_errors) {
            setIsErrorPass('Sai mật khẩu');
            setError('password');
        }
        if (dataResponse?.data?.access_token) {
            dispatch(
                setUser({
                    access_token: dataResponse.data.access_token,
                    refresh_token: dataResponse.data.refresh_token,
                    username: data.username,
                    user_id: dataResponse.data.user.pk,
                }),
            );

            setCookie('username', data.username);
            setCookie('access_token', dataResponse.data.access_token);
            setCookie('refresh_token', dataResponse.data.refresh_token);
            setCookie('user_id', dataResponse.data.user.pk);
            setIsLoading(false);
            router('/dashboard');
        }
    };

    const loginWGoogle = useGoogleLogin({
        onSuccess: (res) => setResGoogle(res),
        onError: (error) => console.log('Login Failed:', error),
    });

    const handleLoginWGoogle = async () => {
        const dataResponse = await axiosClient.post('auth/google-login/', {
            access_token: resGoogle?.access_token,
        });

        if (dataResponse?.data?.access_token) {
            dispatch(
                setUser({
                    access_token: dataResponse.data.access_token,
                    refresh_token: dataResponse.data.refresh_token,
                    user_id: dataResponse.data.user.pk,
                    username: dataResponse.data.user.username,
                }),
            );

            setCookie('access_token', dataResponse.data.access_token);
            setCookie('refresh_token', dataResponse.data.refresh_token);
            setCookie('user_id', dataResponse.data.user.pk);
            setCookie('username', dataResponse.data.user.username);

            router('/dashboard');
        }
    };

    useEffect(() => {
        if (resGoogle) {
            handleLoginWGoogle();
        }
    }, [resGoogle]);

    return (
        <div className="w-[576px] sm:w-full sm:px-8 mx-auto pt-[50px]">
            <div className="text-4xl font-bold text-center">Đăng nhập</div>
            <div className="mt-10">
                <div
                    onClick={() => loginWGoogle()}
                    className="flex items-center justify-center gap-2 px-2 border border-[#a0aec0] h-10 rounded-md font-bold hover:bg-[#edf2f7] cursor-pointer transition-all ease-in-out duration-300"
                >
                    <FcGoogle />
                    <span>Đăng nhập bằng Goolge</span>
                </div>
                <div className="flex items-center my-10">
                    <hr aria-orientation="horizontal" className="w-full " />
                    <p className="text-[#718096] px-2">Hoặc</p>
                    <hr aria-orientation="horizontal" className="w-full" />
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div>Tên đăng nhập</div>
                        <InputController
                            control={control}
                            type="text"
                            required={true}
                            errors={errors}
                            autoComplete="username"
                            name="username"
                        />
                        {errors?.username && <p className="text-sm text-red-600"> Đây là trường bắt buộc</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>Mật khẩu</div>
                        <div className="relative">
                            <InputController
                                control={control}
                                type={isShowPass ? 'text' : 'password'}
                                required={true}
                                errors={errors}
                                autoComplete="password"
                                name="password"
                            />
                            <div
                                onClick={() => setIsShowPass(!isShowPass)}
                                className="absolute top-[50%] translate-y-[-50%] flex items-center  right-[10px] h-7 px-3 bg-[#edf2f7] hover:bg-[#e2e8f0] cursor-pointer rounded-md font-semibold"
                            >
                                {isShowPass ? 'Hiện' : 'Ẩn'}
                            </div>
                        </div>
                        {errors?.password && <p className="text-sm text-red-600">{isErrorPass}</p>}
                    </div>
                    <div className="flex justify-between">
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => setIsChecked(!isChecked)}
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => setIsChecked(!isChecked)}
                                className="w-4 h-4"
                            />
                            <span className="text-base cur">Ghi nhớ</span>
                        </div>
                        {/* <Link to="/" className="text-[#3182ce]">
                            Quên mật khẩu
                        </Link> */}
                    </div>
                    <button type="submit">
                        <div className="flex items-center justify-center h-10 my-3 text-base font-bold text-white bg-[#212121] rounded-md cursor-pointer ">
                            {!isLoading ? (
                                'Đăng nhập'
                            ) : (
                                <ReactLoading type="spin" width={24} height={24} color="white" />
                            )}
                        </div>
                    </button>
                    <Link to="/register" className="text-[#3182ce] text-center">
                        Chưa có tài khoản? Đăng ký ngay!
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Login;

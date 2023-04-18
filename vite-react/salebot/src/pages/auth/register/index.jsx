import { useGoogleLogin } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router';
import axiosClient from '../../../api/axiosClient';
import InputController from '../../../components/inputController';
import { Notification } from '../../../components/notification';
import { setCookie } from '../../../components/utils/cookie';
import useStore from '../../../hooks/useStore';
import { setUser } from '../../../store/actions';
const Register = () => {
    const [isShowPass, setIsShowPass] = useState(false);
    const [isShowConfirmPass, setIsShowConfirmPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorPass, setErrorPass] = useState('Đây là trường bắt buộc');
    const [errorName, setErrorName] = useState('Đây là trường bắt buộc');
    const [resGoogle, setResGoogle] = useState(null);

    const [state, dispatch] = useStore();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            confirmPass: '',
        },
    });

    const history = useNavigate();

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPass) {
            setError('confirmPass');
            return;
        }

        if (data.password.length < 6) {
            setError('password');
            setErrorPass('Mật khẩu tối thiểu 6 ký tự');
            return;
        }
        setIsLoading(true);
        const dataResponse = await axiosClient.post('auth/registration/', {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            password1: data.password,
            password2: data.password,
        });

        if (dataResponse.username) {
            setError('username');
            setErrorName('Tên tài khoản đã tồn tại');
            return;
        }

        if (dataResponse?.data?.access_token) {
            Notification('Thành công', 'Đăng ký tài khoản thành công', 'success');

            dispatch(
                setUser({
                    access_token: dataResponse?.data?.access_token,
                    refresh_token: dataResponse?.data?.refresh_token,
                    username: data.username,
                    user_id: dataResponse?.data?.user.pk,
                }),
            );

            setCookie('username', data.username);
            setCookie('access_token', dataResponse?.data?.access_token);
            setCookie('refresh_token', dataResponse?.data?.refresh_token);
            setCookie('user_id', dataResponse?.data?.user.pk);
            setIsLoading(false);
            history('/dashboard');
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

            history('/dashboard');
        }
    };

    useEffect(() => {
        if (resGoogle) {
            handleLoginWGoogle();
        }
    }, [resGoogle]);

    return (
        <div className="w-[576px] sm:w-full sm:px-6 mx-auto pt-[50px] pb-20">
            <div className="text-4xl font-bold text-center">Đăng ký tài khoản</div>
            <div className="mt-10">
                <div className="p-5 sm:px-1 rounded-md border border-[#a0aec0]">
                    <div className="p-5 text-2xl font-bold">Thông tin tài khoản</div>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-5 sm:px-3">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col col-span-1 gap-2">
                                <div>Tên</div>
                                <InputController control={control} errors={errors} name="firstName" />
                                {errors?.firstName && <p className="text-sm text-red-600">Đây là trường bắt buộc</p>}
                            </div>
                            <div className="flex flex-col col-span-1 gap-2">
                                <div>Họ</div>
                                <InputController control={control} errors={errors} name="lastName" />
                                {errors?.lastName && <p className="text-sm text-red-600">Đây là trường bắt buộc</p>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div>
                                Tên đăng nhập <span className="text-red-600">*</span>
                            </div>
                            <InputController control={control} required={true} errors={errors} name="username" />
                            {errors?.username && <p className="text-sm text-red-600"> {errorName}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <div>
                                Mật khẩu <span className="text-red-600">*</span>
                            </div>
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
                                    {isShowPass ? 'Ẩn' : 'Hiện'}
                                </div>
                            </div>
                            {errors?.password && <p className="text-sm text-red-600">{errorPass}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <div>
                                Nhập lại mật khẩu <span className="text-red-600">*</span>
                            </div>
                            <div className="relative">
                                <InputController
                                    control={control}
                                    type={isShowConfirmPass ? 'text' : 'password'}
                                    required={true}
                                    errors={errors}
                                    autoComplete="cPassword"
                                    name="confirmPass"
                                />
                                <div
                                    onClick={() => setIsShowConfirmPass(!isShowConfirmPass)}
                                    className="absolute top-[50%] translate-y-[-50%] flex items-center  right-[10px] h-7 px-3 bg-[#edf2f7] hover:bg-[#e2e8f0] cursor-pointer rounded-md font-semibold"
                                >
                                    {isShowConfirmPass ? 'Ẩn' : 'Hiện'}
                                </div>
                            </div>
                            {errors?.confirmPass && <p className="text-sm text-red-600">Mật khẩu không trùng khớp</p>}
                        </div>

                        <button type="submit" className="flex justify-end w-full my-5">
                            <div className="flex items-center justify-center w-[95px]  h-10 px-4 text-base font-bold text-white bg-[#212121] rounded-md cursor-pointer ">
                                {!isLoading ? (
                                    'Đăng ký'
                                ) : (
                                    <ReactLoading type="spin" width={24} height={24} color="white" />
                                )}
                            </div>
                        </button>
                    </form>
                </div>
                <div className="flex items-center my-10">
                    <hr aria-orientation="horizontal" className="w-full " />
                    <p className="text-[#718096] px-2">Hoặc</p>
                    <hr aria-orientation="horizontal" className="w-full" />
                </div>
                <div
                    onClick={() => loginWGoogle()}
                    className="flex items-center justify-center gap-2 px-2 border border-[#a0aec0] h-10 rounded-md font-bold hover:bg-[#edf2f7] cursor-pointer transition-all ease-in-out duration-300"
                >
                    <FcGoogle />
                    <span>Đăng nhập bằng Google</span>
                </div>
            </div>
        </div>
    );
};

export default Register;

// import React from 'react';
import { AiFillDollarCircle, AiOutlineLogout } from "react-icons/ai";
import { MdTableRows } from "react-icons/md";
import { Link } from "react-router-dom";

const ButtonRouter = ({ isLogin, handleLogout }) => {
  return (
    <div className="flex">
      <div className="flex item-center">
        <Link to="/price">
          <button className="block h-10 px-4 mr-3 font-semibold text-black bg-white border border-black border-solid rounded-md sm:hidden">
            Bảng giá
          </button>
          <button className="hidden h-10 px-4 mr-3 font-semibold bg-white border border-black border-solid rounded-md sm:block">
            <AiFillDollarCircle color="black" />
          </button>
        </Link>
      </div>
      {!isLogin ? (
        <div className="flex item-center">
          <Link to="/login">
            <button className="h-10 px-4 mr-3 font-semibold text-black bg-white border border-black border-solid rounded-md">
              Đăng nhập
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex item-center">
          <Link to="/dashboard">
            <button className="block h-10 px-4 mr-3 font-semibold text-black bg-white border border-black border-solid rounded-md sm:hidden">
              Bảng điều khiển
            </button>
            <button className="hidden h-10 px-4 mr-3 font-semibold text-black bg-white border border-black border-solid rounded-md sm:block">
              <MdTableRows />
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="block h-10 px-4 font-semibold text-white bg-red-400 border border-solid rounded-md sm:hidden border-red"
          >
            Đăng xuất
          </button>
          <button
            onClick={handleLogout}
            className="hidden h-10 px-4 font-semibold text-white bg-red-400 border border-solid rounded-md sm:block border-red"
          >
            <AiOutlineLogout />
          </button>
        </div>
      )}
    </div>
  );
};

export default ButtonRouter;

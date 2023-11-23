import { BsFacebook } from "react-icons/bs";
import { BsCamera } from "react-icons/bs";
import { HiOutlinePhone } from "react-icons/hi";
import AquaticLogo from "../../../assets/ImageAquaticLand.png";

const Footer = () => {
  return (
    <>
      <div className="container mb-5">
        <div className="w-full mt-[100px] px-3">
          <div className="md:grid md:grid-cols-12">
            <div className="md:col-span-3">
              <h1 className="text-[20px] font-semibold mb-[15px]">
                Đường dẫn nhanh
              </h1>
              <ul className="flex flex-col gap-2">
                <li className="">
                  <a href="" className="">
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Tài khoản
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Chính sách hoàn trả
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Chính sách cookie
                  </a>
                </li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <h1 className="text-[20px] font-semibold mb-[15px] mt-[35px] md:mt-0">
                Điều hướng
              </h1>
              <ul className="flex flex-col gap-2">
                <li className="">
                  <a href="" className="">
                    Bể cá
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Cây thủy sinh
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Phân bón
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Lọc
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Vật liệu lọc
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Đá trang trí
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Quà tặng
                  </a>
                </li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <h1 className="text-[20px] font-semibold mb-[15px] mt-[35px] md:mt-0">
                Nhãn hiệu
              </h1>
              <ul className="flex flex-col gap-2 text-text_gray">
                <li className="">
                  <a href="" className="">
                    ADA
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Gex xanh, đỏ
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Scape
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    Oase
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    EpicAquatics
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    DOOA
                  </a>
                </li>
                <li>
                  <a href="" className="">
                    CO2art
                  </a>
                </li>
              </ul>
            </div>
            <div className="md:flex md:flex-col md:col-span-3">
              <div className="w-[100%] h-[80] mt-[35px] md:mt-0">
                <img src={AquaticLogo} height="100%" alt="" />
              </div>
              <div className="mt-[20px] text-text_gray">
                <p className="text-center">
                  Aquatic Land là nhà cung cấp thiết bị thủy sinh cao cấp, giá
                  cả phải chăng và tiện lợi nhất với người sử dụng.
                </p>
              </div>
              <div className="flex justify-center gap-4 my-[35px] text-[20px] cursor-pointer">
                <BsFacebook className="opacity-[0.4] hover:opacity-[1]" />
                <BsCamera className="opacity-[0.4] hover:opacity-[1]" />
                <HiOutlinePhone className="opacity-[0.4] hover:opacity-[1]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-2 w-full lg:mb-0 mb-[80px]">
        <p className="my-[15px] text-center">COPYRIGHT AQUATICLAND 2023 </p>
      </div>
    </>
  );
};
export default Footer;

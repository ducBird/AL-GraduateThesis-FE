import { AiOutlineHeart } from "react-icons/ai";
import { IoIosGitCompare } from "react-icons/io";
import { RxPerson } from "react-icons/rx";

export const PageMenuData = [
  {
    value: "Trang chủ",
    linkTo: "/",
    icon: null,
  },
  {
    value: "Cửa hàng",
    linkTo: "/shop",
    icon: null,
  },
  {
    value: "Dịch vụ",
    linkTo: "/services",
    icon: null,
  },
  {
    value: "Bài viết",
    linkTo: "/blog",
    icon: null,
  },
  {
    value: "Liên hệ",
    linkTo: "/contact-us",
    icon: null,
  },
  {
    value: "Yêu thích",
    linkTo: "/wishlist",
    icon: AiOutlineHeart,
  },
  {
    value: "compare",
    linkTo: "/compare",
    icon: IoIosGitCompare,
  },
  {
    value: "Đăng nhập / Đăng ký",
    linkTo: "/login",
    icon: RxPerson,
  },
];

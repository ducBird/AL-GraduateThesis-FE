import React from "react";
import Quality from "../../../assets/quality-assurance.png";
import Delivery from "../../../assets/delivery-time.png";
import SecurePayments from "../../../assets/secure-payment.png";

function Work() {
  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 h-[400px] lg:h-[250px]">
      <div className="flex flex-1 items-center justify-center ml-10">
        <img src={Quality} alt="image" className="w-[60px] h-[60px]" />
        <div className="ml-4">
          <p className="text-xl font-semibold mb-2">Chất lượng</p>
          <p className="text-gray-500">
            Chúng tôi chỉ cung cấp các nhãn hiệu và sản phẩm thủy sinh tốt nhất.
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center ml-10">
        <img src={Delivery} alt="image" className="w-[60px] h-[60px]" />
        <div className="ml-4">
          <p className="text-xl font-semibold mb-2">Vận chuyển</p>
          <p className="text-gray-500">
            Chúng tôi sử dụng phương thức vận chuyển nhanh nhất có thể để sản
            phẩm được đến tay khách hàng nhanh chóng.
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center mx-10">
        <img src={SecurePayments} alt="image" className="w-[60px] h-[60px]" />
        <div className="ml-4">
          <p className="text-xl font-semibold mb-2">Thanh toán an toàn</p>
          <p className="text-gray-500">
            Chúng tôi cung cấp các tùy chọn thanh toán an toàn như vnpay,
            paypal.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Work;

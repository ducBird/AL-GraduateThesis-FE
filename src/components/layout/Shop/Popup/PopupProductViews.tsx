import ReactModal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import { useEffect, useState } from "react";
import { Button, Rate, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { axiosClient } from "../../../../libraries/axiosClient";

// Thiết lập các style cho modal
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "52%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    maxWidth: "700px",
    width: "100%",
    height: "650px",
    padding: "20px",
  },
};
interface IModalProps {
  showPopup: boolean;
  closePopupProductView: () => void;
  selectedOrder: any;
  productReviews: any;
}
const PopupProductViews: React.FC<IModalProps> = ({
  closePopupProductView,
  showPopup,
  selectedOrder,
  productReviews,
}) => {
  const desc = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];
  // Biến state để lưu giữ số sao đánh giá cho từng sản phẩm
  const [ratings, setRatings] = useState<number[]>([]);

  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  // File
  const [file, setFile] = useState<any>();
  // post đánh giá vòa cơ sở dữ liệu
  const existingReview = productReviews?.find(
    (review) => review?.order_id === selectedOrder?._id
  );
  const handleCompleteReview = async () => {
    try {
      // Tạo mảng đánh giá từ state ratings
      if (existingReview === undefined) {
        // Nếu không có đánh giá, thực hiện POST
        const today = new Date(); // Tạo đối tượng Date cho ngày hôm nay
        const formattedDate = today.toISOString(); // Chuyển đổi thành định dạng chuỗi
        const reviews = selectedOrder.order_details.map((order, index) => ({
          product_id: order.product._id,
          rating: ratings[index],
          comment: inputValues[index] || "",
          date: formattedDate,
        }));

        const reviewData = {
          customer_id: selectedOrder.customer_id,
          order_id: selectedOrder._id,
          reviews: reviews,
          reviewCount: 1,
        };

        await axiosClient.post("/product-review", reviewData);
        window.alert("Đánh giá thành công");
      } else {
        // Nếu đã có đánh giá, thực hiện PATCH
        const updateDate = new Date(); // Tạo đối tượng Date cho ngày hôm nay
        const formattedUpdateDate = updateDate.toISOString(); // Chuyển đổi thành định dạng chuỗi
        const reviews = selectedOrder.order_details.map((order, index) => ({
          product_id: order.product._id,
          rating: ratings[index],
          comment: inputValues[index] || "",
          date: formattedUpdateDate,
        }));

        const reviewData = {
          customer_id: selectedOrder.customer_id,
          order_id: selectedOrder._id,
          reviews: reviews,
          reviewCount: existingReview?.reviewCount + 1,
        };

        await axiosClient.patch(
          `/product-review/${existingReview._id}`,
          reviewData
        );
        window.alert("Cập nhật đánh giá thành công");
      }
      // Đóng popup sau khi hoàn thành đánh giá
      closePopupProductView();
      window.location.reload();
    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi gửi đánh giá:", error);
      window.alert("Đánh giá thất bại");
    }
  };
  useEffect(() => {
    if (existingReview) {
      // setExistingReview(existingReview);
      // Cập nhật state từ thông tin đánh giá ban đầu
      setRatings(existingReview.reviews.map((review) => review.rating));
      const initialValues = {};
      existingReview.reviews.forEach((review, index) => {
        initialValues[index] = review.comment || "";
      });
      setInputValues(initialValues);
    }
  }, [selectedOrder, productReviews, existingReview]);

  useEffect(() => {
    // Thêm hoặc xóa thanh scoll khi showModal thay đổi
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showPopup]);
  return (
    <div>
      <ReactModal
        isOpen={showPopup}
        onRequestClose={closePopupProductView}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <button
            onClick={closePopupProductView}
            className="absolute text-3xl top-12 lg:top-4 right-4 text-red-500"
          >
            <MdOutlineClose />
          </button>
        </div>
        <div className="mt-10 mb-20 lg:mt-0 lg:mb-0">
          <h3 className="text-center text-2xl font-bold">Đánh giá sản phẩm</h3>
          {showPopup &&
            selectedOrder !== undefined &&
            selectedOrder.order_details.map((order, index) => {
              const currentRating = ratings[index];
              return (
                <div key={index} className="border my-3 h-auto p-5 mt-10">
                  {/* sản phẩm */}
                  <div className="flex gap-7">
                    <div>
                      <img
                        src={order.product?.product_image}
                        alt="image"
                        className="w-[100px] h-[100px] object-contain"
                      />
                    </div>
                    <div className="">
                      <p className="">{order.product?.name}</p>
                      <span>Số lượng: {order.quantity}</span>
                    </div>
                  </div>
                  {/* đánh giá sao */}
                  <div className="mt-5 flex">
                    <p className="flex items-center justify-center mr-3">
                      Chất lượng sản phẩm
                    </p>
                    <div className="text-black">
                      <Rate
                        tooltips={desc}
                        onChange={(value) => {
                          const newRatings = [...ratings];
                          newRatings[index] = value;
                          setRatings(newRatings);
                        }}
                        value={currentRating}
                      />
                      {currentRating ? (
                        <span className="ant-rate-text">
                          {desc[currentRating - 1]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {/* Input nhập đán giá */}
                  <div className="mt-5 border">
                    <input
                      type="text"
                      className="p-8 w-full text-center focus:outline-none"
                      placeholder="Đánh giá sản phẩm"
                      value={inputValues[index] || ""}
                      onChange={(e) => {
                        const newInputValues = { ...inputValues };
                        newInputValues[index] = e.target.value;
                        setInputValues(newInputValues);
                      }}
                    />
                  </div>
                  {/* Hình ảnh đánh giá */}
                  <div className="flex items-center justify-center mt-5">
                    <Upload
                      showUploadList={true}
                      beforeUpload={(file) => {
                        setFile(file);
                        return false;
                      }}
                    >
                      <Button icon={<UploadOutlined />}>
                        Tải lên hình ảnh
                      </Button>
                    </Upload>
                  </div>
                </div>
              );
            })}
          {/* Các nút thực hiện đánh giá */}
          <div className="text-right mb-5">
            <button
              className="border py-2 px-5 mr-5 rounded-lg bg-blue-500 text-white"
              onClick={closePopupProductView}
            >
              Trở lại
            </button>
            <button
              className="border py-2 px-5 rounded-lg bg-primary_green text-white"
              onClick={() => {
                handleCompleteReview();
              }}
            >
              Hoàn thành
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default PopupProductViews;

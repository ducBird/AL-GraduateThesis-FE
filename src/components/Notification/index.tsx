import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { axiosClient } from "../../libraries/axiosClient";
import { useNotification } from "../../hooks/useNotification";

function Notification() {
  const { users } = useUser((state) => state) as any;
  const { updateUnreadCount } = useNotification((state) => state) as any;
  const [notificationData, setNotificationData] = useState<any>(null);
  const customerId = users.user?._id;

  const handleMarkAllAsRead = () => {
    // Thay đổi trạng thái của tất cả các thông báo trong notificationData
    const updatedNotificationData = notificationData.map((item) => ({
      ...item,
      isRead: true,
    }));

    setNotificationData(updatedNotificationData);
    const dataUpdate = {
      isRead: true,
    };
    // Gọi API hoặc hàm xử lý trên server để cập nhật trạng thái đã đọc
    axiosClient
      .patch("/notifications", dataUpdate)
      .then((response) => {
        console.log("Đánh dấu đã đọc thành công trên server");
        updateUnreadCount(); // Cập nhật số lượng chưa đọc thông báo
      })
      .catch((error) => {
        console.log("Đánh dấu đã đọc thất bại trên server");
      });
  };
  useEffect(() => {
    if (customerId) {
      const eventSource = new EventSource(
        `http://127.0.0.1:9000/sse/customer-sse/${customerId}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        const notificationData = {
          customer_id: data.customer_id,
          order_id: data._id,
          message: "Đơn hàng của bạn đã được xác nhận",
          status: data.status,
          order_details: data.order_details,
          isRead: false,
        };

        axiosClient
          .post("/notifications", notificationData)
          .then((response) => {
            console.log("thành công");
          })
          .catch((error) => {
            console.log("Thất bại");
          });
      };

      return () => {
        eventSource.close();
      };
    }
  }, [customerId]);
  useEffect(() => {
    axiosClient.get("/notifications").then((response) => {
      // Lọc dữ liệu để chỉ giữ lại các thông báo của customerId
      const filteredNotifications = response.data.filter(
        (notification) => notification.customer_id === customerId
      );

      setNotificationData(filteredNotifications);
    });
  }, []);

  return (
    <div>
      <div className="bg-primary_green lg:h-[75px] lg:p-10 h-auto p-5 text-center lg:mb-0 mb-3">
        <h3 className="h-full w-full flex items-center justify-center text-3xl lg:text-4xl text-white font-bold">
          THÔNG BÁO
        </h3>
      </div>
      <div className="my-5 text-right mr-[300px]">
        <button
          disabled={notificationData?.length === 0}
          onClick={handleMarkAllAsRead}
        >
          Đánh dấu Đã đọc tất cả
        </button>
      </div>
      <div className="my-5 mx-[300px] ">
        {notificationData && notificationData.length ? (
          notificationData.map((item, index) => {
            const dataUpdate = {
              isRead: true,
            };
            const handleNotificationClick = () => {
              // Thay đổi trạng thái của notificationData trước khi gọi axiosClient.patch
              const updatedNotificationData = [...notificationData];
              updatedNotificationData[index].isRead = true;
              setNotificationData(updatedNotificationData);

              // Gọi axiosClient.patch để cập nhật trạng thái trên server
              axiosClient
                .patch("/notifications/" + item?.id, dataUpdate)
                .then((response) => {
                  console.log("Cập nhật thành công trên server");
                  updateUnreadCount(); // Cập nhật số lượng chưa đọc thông báo
                })
                .catch((error) => {
                  console.log("Cập nhật thất bại trên server");
                });
            };
            return (
              <div
                key={index}
                className={`border ${
                  item.isRead === false ? "bg-gray-100" : ""
                }`}
                onClick={handleNotificationClick}
              >
                <div className="p-10 flex gap-3 cursor-pointer hover:bg-gray-100">
                  <div className="w-[100px] h-[100px] object-contain">
                    <img
                      className=""
                      src={
                        item?.order_details &&
                        item?.order_details[0]?.product?.product_image
                      }
                      alt="image"
                    />
                  </div>
                  {item.status === "WAITING FOR PICKUP" && (
                    <div>
                      <p className="font-bold">Đơn hàng đã được xác nhận</p>
                      <p>
                        Đơn hàng với mã{" "}
                        <span className="font-bold">{item?.order_id}</span> của
                        bạn đã được người bán xác nhận và đang chuẩn bị hàng
                      </p>
                    </div>
                  )}
                  {item.status === "DELIVERED" && (
                    <div>
                      <p className="font-bold">
                        Đơn hàng đã được giao thành công
                      </p>
                      <p>
                        Đơn hàng với mã{" "}
                        <span className="font-bold">{item?.order_id}</span> của
                        bạn đã được giao thành công. Chúc bạn có một ngày mua
                        hàng vui vẻ.
                      </p>
                    </div>
                  )}
                  {item.status === "CANCELLED" && (
                    <div>
                      <p className="font-bold">Đơn hàng của bạn đã bị hủy</p>
                      <p>
                        Đơn hàng với mã{" "}
                        <span className="font-bold">{item?.order_id}</span> của
                        bạn đã bị hủy. Xin lỗi bạn về sự bất tiện này.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center">
            {/* <p className="text-xl font-bold">Không có thông báo nào</p> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;

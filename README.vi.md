# Cloud Dash — Đường đua trên mây

[English](README.md) | **Tiếng Việt**

Được tạo bằng **GPT 6-Astra** với mức suy luận **medium**.

## Báo cáo phát triển

Xem [báo cáo chi tiết: prompt, quá trình thực hiện, thời gian, chi phí và kiểm thử](REPORT.vi.md). Báo cáo phân biệt số liệu đã xác nhận với các thông tin chưa đo hoặc chưa có hóa đơn.

## Khởi chạy trong 1 bước

**Nhấp đúp `index.html` để chơi trong Chrome, Edge hoặc Firefox.** Không cần cài đặt, npm, máy chủ hay kết nối Internet. Nếu nhận file ZIP, giải nén trước khi mở.

## Điều khiển

- **WASD / phím mũi tên:** di chuyển; W / ↑ tiến về đích.
- **Space:** nhảy qua khoảng trống hoặc thanh xoay.
- **Esc / nút Ⅱ:** tạm dừng hoặc tiếp tục.
- **♪:** bật/tắt âm thanh tổng hợp.
- Trên thiết bị cảm ứng có cụm phím và nút nhảy.

Chọn map tại sảnh rồi về đích trong thời gian quy định, cạnh tranh với 11 bot chạy trên cùng đường đua. Né cổng trượt, nhảy qua thanh xoay và các khe hở. Rơi khỏi đường đua sẽ hồi sinh ở điểm lưu gần nhất. Các vạch xanh mở điểm lưu. Kỷ lục được lưu cục bộ nếu trình duyệt cho phép localStorage.

## Mã nguồn

- `index.html`: toàn bộ giao diện tiếng Việt.
- `style.css`: CSS thuần responsive, không cần công cụ build.
- `game.js`: cảnh 3D, AI, vật lý, điều khiển, trạng thái trò chơi và âm thanh.
- `obstacles.js`: các cơ chế chướng ngại vật bổ sung, chuyển động và va chạm.
- `verify.cjs`: kiểm thử logic bằng Node.js.
- `README.md` / `README.vi.md`: hướng dẫn tiếng Anh / tiếng Việt.
- `REPORT.md` / `REPORT.vi.md`: báo cáo tiếng Anh / tiếng Việt về quá trình phát triển, prompt, thời gian và chi phí.
- `vendor/three.min.js`: Three.js r160 lưu kèm, giấy phép MIT tại `vendor/LICENSE.txt`.

Game dùng hình học dựng bằng mã, không dùng ảnh hay tài nguyên tải từ dịch vụ bên ngoài. Đây là trò chơi nguyên bản lấy cảm hứng từ thể loại đua vượt chướng ngại vật; không dùng tài sản Fall Guys. Chơi solo với bot, không phải multiplayer trực tuyến.

Vật lý bước cố định 120 Hz, hiển thị requestAnimationFrame theo tần số màn hình, giới hạn pixel ratio 1.6 và dùng chung vật liệu. Mục tiêu 60fps trên máy có WebGL và tăng tốc đồ họa; tốc độ thực tế phụ thuộc thiết bị. Có tự tạm dừng khi chuyển tab. Không cần Tailwind vì giao diện được triển khai bằng CSS thuần.

Nếu cần phục vụ qua HTTP để phát triển: chạy `python -m http.server 8080` trong thư mục này rồi mở http://localhost:8080.

## Ba đường đua

| Map | Chiều dài | Thời gian | Đảo | Cổng / thanh xoay |
| --- | ---: | ---: | ---: | ---: |
| Skyline Circuit | 132 m | 120 giây | 4 | 2 / 1 |
| Sunset Marathon | 300 m | 210 giây | 6 | 2 / 2 |
| Aurora Expedition | 480 m | 300 giây | 10 | 1 / 5 |

Chọn đường đua bằng danh sách **CHỌN ĐƯỜNG ĐUA** ở sảnh. Mỗi map có màu sắc, bố trí thử thách và kỷ lục riêng. Sau mỗi khe hở có điểm hồi sinh. Đua lại giữ nguyên map đang chọn; về sảnh để đổi map.

Kiểm tra logic bằng `node verify.cjs`: điều khiển, nhảy qua tất cả khe hở, hồi sinh, về đích, hết giờ và bot hoàn thành cả ba map.

## Chướng ngại vật đa dạng (bản v2)

- **Búa màu cam:** đầu búa đung đưa và đánh bật tay đua khi chạm; né sang mép hoặc canh lúc búa nâng lên.
- **Khối đẩy đỏ:** co giãn theo nhịp từ mép sân, đẩy ngang hoặc chặn phía trước; đổi làn hoặc nhảy qua.
- **Băng chuyền xanh lam:** vạch chuyển động thể hiện hướng kéo tiến/lùi. Nhảy để thoát lực kéo.
- **Đệm bật xanh ngọc có dấu cộng:** chạm khi đang đứng trên sàn để tự bật cao; vẫn điều khiển hướng khi bay.
- **Cổng trượt và thanh xoay:** được giữ lại, phối hợp với bốn cơ chế mới khác nhau trên mỗi map.

`obstacles.js` chứa hình học, chuyển động, va chạm và hỗ trợ né tránh cho bot. Cả người chơi và bot chịu cùng tác động vật lý. Kỷ lục v2 lưu riêng; dữ liệu kỷ lục cũ được giữ nguyên nhưng không dùng để so sánh với đường đua đã đổi.

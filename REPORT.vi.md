# Báo cáo phát triển Cloud Dash bằng AI

[English](REPORT.md) | **Tiếng Việt**

[← Quay về README chính](README.vi.md)

**Ngày lập báo cáo:** 14/10/2026. Mốc giờ trong báo cáo sử dụng múi giờ Việt Nam, UTC+7 (Asia/Saigon).

**Phạm vi:** tổng hợp yêu cầu người dùng, các lần triển khai trong cuộc trò chuyện này, sản phẩm bàn giao, kiểm thử, thời gian và thông tin chi phí có thể xác nhận. Đây là báo cáo dự án, không phải hóa đơn hoặc báo cáo đo hiệu năng.

## 1. Mục tiêu và kết quả

Người dùng yêu cầu xây dựng một sản phẩm tương tác hoàn chỉnh, có giao diện, chuyển động, điều khiển và va chạm, kèm toàn bộ mã nguồn chạy được ngay. Prompt ban đầu cho phép lựa chọn giữa game 3D thể loại Fall Guys và dashboard tài chính. Phương án đã triển khai là **Cloud Dash**, game đua vượt chướng ngại vật 3D nguyên bản, chơi solo với 11 bot.

Sau hai lần mở rộng gameplay, game có ba map dài 132–480 mét và sáu loại cơ chế: cổng trượt, thanh xoay, búa đung đưa, khối đẩy ngang, băng chuyền và đệm bật. Người chơi có thể chọn map, chọn màu, tạm dừng, đua lại, về sảnh và lưu kỷ lục riêng theo map.

## 2. Các prompt người dùng đã đưa

Các đoạn dưới đây giữ nguyên nội dung yêu cầu; thứ tự thể hiện quá trình phát triển. Không có timestamp chính xác của từng tin nhắn trong dữ liệu dùng để lập báo cáo.

### Prompt 1 — Tạo sản phẩm ban đầu

```text
Hãy xây dựng một [trò chơi thể loại Fall Guys 3D / hoặc một trang dashboard tài chính tương tác] hoàn chỉnh bằng HTML/TailwindCSS/JS thuần (hoặc Three.js chạy mượt 60fps).
Yêu cầu bắt buộc:
- Có giao diện người dùng hoàn chỉnh, trực quan, không được dùng placeholder
- Tự tích hợp sẵn logic điều khiển, hiệu ứng chuyển động và xử lý va chạm.
- Xuất toàn bộ mã nguồn ra dưới dạng file có thể chạy ngay được kèm hướng dẫn setup trong 1 bước.
```

**Cách triển khai:** chọn game 3D; dùng HTML, CSS thuần, JavaScript và Three.js. Dựng sảnh, đường đua, nhân vật, bot, vật lý và giao diện kết quả. Tải Three.js kèm giấy phép vào thư mục `vendor` để sản phẩm chạy offline. Không triển khai dashboard tài chính.

### Prompt 2 — Mở rộng map

```text
Thêm các map khác dài ra
```

**Cách triển khai:** giữ Skyline Circuit, thêm Sunset Marathon và Aurora Expedition; tạo bộ chọn map ở sảnh. Thông tin HUD, tiến độ, thời gian, điểm hồi sinh, điều kiện về đích và kỷ lục được điều chỉnh theo map. Khi đổi map, giải phóng hình học của map cũ để tránh tích lũy đối tượng trong cảnh.

### Prompt 3 — Đa dạng hóa chướng ngại vật

```text
thay đổi các chướng ngại vật khác nhau làm cho game đa dạng
```

**Cách triển khai:** thêm bốn cơ chế mới và thay thế một phần chướng ngại vật cũ tại các vị trí được chọn, thay vì chỉ tăng số lượng. Bổ sung phản ứng va chạm, lực đẩy, lực kéo và bật nhảy; điều chỉnh bot để né đầu búa và chọn làn tránh khối đẩy. Dùng khóa lưu kỷ lục v2 để không so sánh trực tiếp thành tích trên hai bố trí đường đua khác nhau. Dữ liệu kỷ lục cũ không bị xóa.

### Prompt 4 — Lập báo cáo

```text
Ghi thêm Readme nói về prompt tôi đưa bạn , chi phí , thời gian , tạo thành report chi tiết vào trong ghi me , và readme chính có link trỏ về readme này
```

**Cách triển khai:** tạo báo cáo Markdown này, liên kết từ README chính và đưa tài liệu vào gói mã nguồn ZIP cập nhật.

### Cập nhật ngôn ngữ tài liệu

Theo yêu cầu tiếp theo, `README.md` và `REPORT.md` dùng tiếng Anh làm bản chính; `README.vi.md` và `REPORT.vi.md` giữ nội dung tiếng Việt. Mỗi tài liệu có liên kết chuyển ngôn ngữ. Các prompt trong bản tiếng Anh được ghi rõ là bản dịch; bản tiếng Việt giữ nguyên lời yêu cầu. Giao diện trò chơi vẫn bằng tiếng Việt.

## 3. Sản phẩm đã bàn giao

### Giao diện và luồng chơi

- Sảnh tiếng Việt có tên map, thông số đường đua, chọn màu nhân vật và nút bắt đầu.
- Đếm ngược xuất phát; HUD hiển thị vị trí, đảo hiện tại, tiến độ và thời gian còn lại.
- Điều khiển bằng WASD/phím mũi tên, Space để nhảy, Esc để tạm dừng; có nút cảm ứng.
- Camera theo nhân vật, chuyển động chân/tay và phản ứng khi bị va chạm.
- Hồi sinh tại điểm lưu khi rơi; màn hình kết quả, đua lại và về sảnh.
- Âm thanh tổng hợp có bật/tắt; tự tạm dừng khi mất focus hoặc chuyển tab.
- Kỷ lục lưu bằng localStorage nếu trình duyệt cho phép; không có tài khoản hoặc đồng bộ đám mây.

### Map ở phiên bản hiện tại

| Map | Chiều dài | Giới hạn | Đảo / khe nhảy | Cổng | Thanh xoay | Búa | Khối đẩy | Băng chuyền | Đệm bật |
| --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Skyline Circuit | 132 m | 120 giây | 4 / 3 | 2 | 1 | 1 | 1 | 1 | 1 |
| Sunset Marathon | 300 m | 210 giây | 6 / 5 | 2 | 2 | 3 | 3 | 2 | 2 |
| Aurora Expedition | 480 m | 300 giây | 10 / 9 | 1 | 5 | 5 | 5 | 4 | 3 |

Các con số mô tả cấu hình mã nguồn hiện tại. Mỗi khe nhảy có một điểm lưu ở đảo tiếp theo.

### Tác động của từng cơ chế

| Cơ chế | Hành vi | Cách vượt qua |
| --- | --- | --- |
| Cổng trượt | Di chuyển ngang và chặn người chơi | Đổi làn, canh khoảng trống |
| Thanh xoay | Quét ngang ở độ cao thấp, hất người chạm vào | Nhảy hoặc canh nhịp |
| Búa đung đưa | Đầu búa màu cam đánh bật nhân vật | Né sang bên hoặc chờ búa nâng lên |
| Khối đẩy | Thò ra, thu vào từ mép sân | Tránh phía khối đẩy hoặc nhảy qua |
| Băng chuyền | Kéo người đang đứng trên sàn tiến/lùi | Điều chỉnh hướng hoặc nhảy thoát |
| Đệm bật | Tự bật cao khi nhân vật chạm trên mặt sàn | Điều khiển hướng khi đang bay |

## 4. Công nghệ và cấu trúc mã nguồn

| Tệp | Vai trò |
| --- | --- |
| `index.html` | Cấu trúc giao diện, bộ chọn map, HUD, hộp thoại |
| `style.css` | Bố cục responsive và phong cách hình ảnh bằng CSS thuần |
| `game.js` | Cảnh Three.js, map, nhân vật, bot, vật lý, vòng lặp và trạng thái game |
| `obstacles.js` | Bố trí, hình học, hoạt ảnh, va chạm và hỗ trợ AI cho cơ chế mới |
| `verify.cjs` | Kiểm thử logic headless bằng Node.js và Three.js đi kèm |
| `vendor/three.min.js` | Three.js r160 lưu tại máy, không phụ thuộc CDN lúc chơi |
| `vendor/LICENSE.txt` | Giấy phép MIT của Three.js |
| `preview.png` | Ảnh chụp giao diện ở lần cập nhật gameplay gần nhất |
| `README.md` / `README.vi.md` | Hướng dẫn chạy và chơi |
| `REPORT.md` / `REPORT.vi.md` | Báo cáo tiếng Anh / tiếng Việt |

Vật lý chạy bước cố định 1/120 giây. Khung hình dùng requestAnimationFrame; pixel ratio giới hạn ở 1.6. Đồ họa được dựng bằng hình học và màu sắc trong mã, không dùng bộ ảnh hoặc model Fall Guys. Game không cần backend, cơ sở dữ liệu, npm hay công đoạn build để chơi. Node.js chỉ cần khi muốn chạy bộ kiểm thử; Python là tùy chọn để mở máy chủ HTTP khi phát triển.

## 5. Thời gian thực hiện

### Các mốc có bằng chứng

| Mốc ngày 14/10/2026, UTC+7 | Công việc / bằng chứng |
| --- | --- |
| 23:01:19 | Thời điểm tạo `index.html` theo metadata tệp |
| 23:03:58 | Thời điểm tạo `game.js` theo metadata tệp |
| Khoảng 23:06 | Kiểm thử và đóng gói bản đầu; log công cụ ghi nhận ZIP đã tạo |
| Khoảng 23:12 | Kiểm tra giao diện chọn map và Aurora 480 m trên trình duyệt; log HTTP ghi nhận tải trang lúc 23:12:52 |
| 23:17:07–23:17:16 | Tạo `obstacles.js` và cập nhật các tệp game/kiểm thử |
| Khoảng 23:18 | Kiểm tra giao diện có búa và các cơ chế mới; hoàn thành kiểm thử logic |
| 23:19:03 | Mốc ZIP gameplay trước khi bổ sung báo cáo, theo metadata tệp được đọc lúc lập báo cáo |
| Khoảng 23:22 trở đi | Bắt đầu tổng hợp tài liệu báo cáo theo prompt 4 |

**Khoảng thời gian quan sát được từ lúc tạo HTML đến gói gameplay gần nhất: 17 phút 44 giây** (23:01:19 → 23:19:03).

Đây là khoảng thời gian lịch, có thể gồm lúc chạy công cụ, kiểm thử, chờ và trao đổi giữa các yêu cầu. Nó **không phải** số giờ lao động thuần, thời gian suy luận của mô hình hoặc tổng thời gian tính từ lúc nhận prompt đầu tiên. Công việc khảo sát trước khi tạo HTML không nằm trong khoảng này. Việc viết báo cáo diễn ra sau đó và cũng không nằm trong 17 phút 44 giây.

Không có dữ liệu đủ để phân tách chính xác thời gian cho từng prompt hoặc tính năng. Các mốc “khoảng” được tổng hợp từ log trong cuộc trò chuyện; metadata tệp có thể thay đổi khi sao chép, giải nén hoặc ghi lại. Mốc ZIP trong bảng là ảnh chụp lịch sử trước lần đóng gói tài liệu, không phải cam kết về timestamp của ZIP hiện tại.

## 6. Chi phí và giới hạn số liệu

### Những gì có thể xác nhận

| Hạng mục | Trạng thái trong dự án này |
| --- | --- |
| Thư viện Three.js | Bản MIT lưu kèm; không có giao dịch mua thư viện trong quá trình thực hiện |
| Ảnh, model 3D, âm thanh thương mại | Không mua; hình ảnh dựng bằng mã, âm thanh tổng hợp |
| Hosting, tên miền, backend | Không triển khai hoặc mua; sản phẩm bàn giao chạy cục bộ |
| API được game gọi khi người dùng chơi | Không tích hợp API trả phí; game chạy offline |
| Codex/AI dùng để tạo mã và tài liệu | Chưa có số liệu hóa đơn, gói sử dụng, token hay đơn giá thực tế của phiên này |
| Máy tính, điện, Internet, thời gian người dùng | Chưa đo và chưa quy đổi thành tiền |

**Không xác định được tổng chi phí phát triển bằng VNĐ hoặc USD từ dữ liệu hiện có.** Không nên diễn giải việc không mua hosting/tài nguyên thành “toàn bộ dự án miễn phí”. Chi phí thuê bao hoặc sử dụng AI có thể thuộc tài khoản của người dùng, nhưng cuộc trò chuyện không cung cấp cách phân bổ chi phí đó cho dự án này.

Không phát sinh thao tác mua hàng hay đặt dịch vụ có phí do trợ lý thực hiện trong quá trình làm game. Nhận định này chỉ nói về những thao tác đã thực hiện, không xác nhận hệ thống AI hoặc các công cụ không tính phí ở cấp tài khoản.

### Cách bổ sung chi phí thực tế sau này

Nếu tài khoản tính tiền theo API, cần lấy số token đầu vào, token có cache, token đầu ra, mức giá áp dụng và phí công cụ từ báo cáo sử dụng/hóa đơn. Khi đơn giá được tính theo một triệu token, công thức là:

```text
Chi phí AI = (token đầu vào không cache × đơn giá đầu vào
            + token cache × đơn giá cache
            + token đầu ra × đơn giá đầu ra) / 1.000.000
            + phí công cụ thực tế
```

Nếu dùng thuê bao, cần thống nhất cách phân bổ phần thuê bao cho dự án; không tự coi đó là hóa đơn API. Tổng chi phí dự án có thể cộng thêm tài nguyên, hosting và nhân công thực tế nếu có. Báo cáo này không áp dụng đơn giá giả định, không tra giá thị trường và không lấy phần trăm hạn mức tài khoản làm đại diện cho số tiền.

## 7. Kiểm thử và bằng chứng

### Kiểm tra tự động

Chạy trong thư mục game:

```bash
node verify.cjs
```

Bộ kiểm thử dùng thư viện Three.js thật cho hình học và toán học, nhưng thay renderer và DOM bằng đối tượng giả lập. Vì vậy, kết quả xác nhận logic; không xác nhận chất lượng render GPU, FPS hoặc khả năng thao tác trên mọi trình duyệt.

Các kiểm tra đã chạy thành công ở lần cập nhật gameplay gần nhất:

- Khởi động lượt đua, đếm ngược, tạm dừng và tiếp tục.
- Hướng điều khiển phù hợp với camera.
- Nhảy qua tất cả các khe hở trên cả ba map.
- Hồi sinh, về đích và hết giờ theo thời lượng của map.
- Đổi map không làm tăng số đối tượng cảnh khi dựng lại cùng map.
- Bot có thể hoàn thành cả ba map; các tọa độ vẫn hữu hạn trong mô phỏng.
- Đệm bật tạo vận tốc nhảy; búa gây hất tung; khối đẩy giải quyết vị trí chồng lấn.
- Băng chuyền tác động lên người đứng trên sàn và không kéo người đang bay.

Log kết quả lần chạy cuối trước khi lập báo cáo:

```text
PASS map: Skyline Circuit length: 132 AI finishers: 6
PASS map: Sunset Marathon length: 300 AI finishers: 6
PASS map: Aurora Expedition length: 480 AI finishers: 6
PASS: new obstacle collision, boost and conveyor behavior
PASS: race start, pause/resume, controls, gap jump, respawn, finish, timeout, AI simulation.
```

Số 6 là số bot đã về đích trong cửa sổ mô phỏng của bài kiểm thử đó, không phải cam kết mọi bot luôn về đích ở mọi lượt. Kiểm tra cú pháp `node --check` cũng đã hoàn tất cho các tệp gameplay được sửa.

### Kiểm tra trình duyệt

Đã mở bản xem trước, quan sát cảnh 3D và bố cục, kiểm tra bắt đầu/tạm dừng, đổi sang Aurora và xác nhận HUD hiển thị 10 đảo cùng 05:00. Sau khi thêm cơ chế, đã kiểm tra sảnh và chụp ảnh có búa trên đường đua.

Ban đầu kết nối localhost bị môi trường hạn chế; sau khi chạy máy chủ xem trước với quyền phù hợp, trình duyệt đã tải trang thành công. Máy chủ phục vụ kiểm tra đã được dừng sau khi xong; game offline không phụ thuộc vào máy chủ này.

## 8. Những gì chưa được xác nhận hoặc chưa triển khai

- **Chưa đo 60fps:** đây là mục tiêu thiết kế từ prompt, chưa có benchmark để xác nhận đã đạt trên một cấu hình cụ thể.
- Chưa kiểm tra đầy đủ mọi thiết bị di động, tỷ lệ màn hình và trình duyệt; có giao diện responsive và điều khiển cảm ứng nhưng chưa chứng nhận tương thích toàn diện.
- Va chạm dùng mô hình đơn giản phục vụ gameplay, không phải mô phỏng vật lý chính xác của mọi chi tiết hình học.
- Chưa có kiểm thử độ bền nhiều giờ hoặc đánh giá cân bằng độ khó với nhiều người chơi thật.
- Không có multiplayer qua mạng, tài khoản, bảng xếp hạng trực tuyến hay lưu đám mây.
- Chưa có số liệu token, hóa đơn AI hoặc tổng chi phí dự án; chưa xác định được thời gian lao động thuần.

## 9. Cách nhận và chạy sản phẩm

Giải nén gói mã nguồn nếu nhận ZIP, sau đó **nhấp đúp `index.html`** để mở trong trình duyệt hỗ trợ WebGL. Không cần cài dependency để chơi. Mở [README chính](README.vi.md) để xem điều khiển và hướng dẫn chi tiết.

![Giao diện gameplay phiên bản chướng ngại vật đa dạng](preview.png)

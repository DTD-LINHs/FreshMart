















LỜI MỞ ĐẦU
Trong bối cảnh công nghệ thông tin ngày càng phát triển mạnh mẽ, việc ứng dụng cơ sở dữ liệu vào quản lý đã trở thành một yếu tố không thể thiếu trong hầu hết các lĩnh vực của đời sống, đặc biệt là trong hoạt động kinh doanh bán lẻ. Đối với các siêu thị – nơi diễn ra hàng loạt giao dịch mua bán mỗi ngày – việc quản lý thông tin sản phẩm, khách hàng, hóa đơn, nhân viên và các chương trình khuyến mãi một cách chính xác và hiệu quả là vô cùng quan trọng. Nếu vẫn sử dụng các phương pháp quản lý thủ công, doanh nghiệp sẽ dễ gặp phải những vấn đề như sai sót dữ liệu, khó kiểm soát, mất nhiều thời gian và chi phí vận hành cao.
Xuất phát từ thực tế đó, việc xây dựng một hệ thống cơ sở dữ liệu nhằm hỗ trợ quản lý toàn bộ hoạt động của siêu thị là cần thiết. Hệ thống không chỉ giúp lưu trữ dữ liệu một cách khoa học, mà còn hỗ trợ truy xuất thông tin nhanh chóng, đảm bảo tính nhất quán và toàn vẹn của dữ liệu, từ đó nâng cao hiệu quả quản lý và chất lượng phục vụ khách hàng.
Trong khuôn khổ học phần Cơ sở dữ liệu, nhóm thực hiện đề tài “Xây dựng hệ thống quản lý sản phẩm và thanh toán cho siêu thị” với mục tiêu thiết kế và triển khai một cơ sở dữ liệu quan hệ phục vụ cho các nghiệp vụ cơ bản của một siêu thị. Hệ thống được xây dựng bao gồm các thành phần chính như quản lý sản phẩm, nhóm hàng, khách hàng, nhân viên, hóa đơn, chi tiết hóa đơn, nhà cung cấp, phiếu nhập và các chương trình khuyến mãi. Các bảng dữ liệu được liên kết với nhau thông qua khóa chính và khóa ngoại, đảm bảo mô hình dữ liệu phản ánh đúng thực tế và hỗ trợ tốt cho việc truy vấn.
Thông qua đề tài này, nhóm không chỉ vận dụng các kiến thức đã học về thiết kế cơ sở dữ liệu, xây dựng lược đồ quan hệ và viết các câu lệnh SQL (INSERT, UPDATE, DELETE, SELECT), mà còn hiểu rõ hơn về cách tổ chức dữ liệu trong một hệ thống thực tế. Đồng thời, việc xây dựng một giao diện đơn giản để thao tác với cơ sở dữ liệu cũng giúp nâng cao khả năng ứng dụng và tính trực quan của hệ thống.
Báo cáo được trình bày với các nội dung chính bao gồm: phân tích yêu cầu hệ thống, thiết kế cơ sở dữ liệu, xây dựng các bảng và mối quan hệ, nhập dữ liệu mẫu, thực hiện các truy vấn SQL và xây dựng giao diện người dùng cơ bản. Qua đó, nhóm mong muốn thể hiện được khả năng áp dụng lý thuyết vào thực tiễn cũng như hoàn thiện kỹ năng làm việc với cơ sở dữ liệu.





GIỚI THIỆU ĐỀ TÀI, LÝ DO CHỌN ĐỀ TÀI
Đề tài “Xây dựng hệ thống quản lý sản phẩm và thanh toán cho siêu thị” tập trung vào việc thiết kế và triển khai một hệ thống cơ sở dữ liệu phục vụ cho hoạt động quản lý trong môi trường bán lẻ. Trong một siêu thị, mỗi ngày có hàng trăm đến hàng nghìn giao dịch phát sinh liên quan đến việc nhập hàng, bán hàng, quản lý tồn kho, chăm sóc khách hàng và áp dụng các chương trình khuyến mãi. Do đó, việc xây dựng một hệ thống cơ sở dữ liệu có cấu trúc rõ ràng, logic và dễ mở rộng là yêu cầu cần thiết.
Hệ thống được thiết kế theo mô hình cơ sở dữ liệu quan hệ, trong đó các đối tượng như sản phẩm, nhóm hàng, khách hàng, nhân viên, hóa đơn, chi tiết hóa đơn, nhà cung cấp và phiếu nhập được tổ chức thành các bảng dữ liệu riêng biệt nhưng có mối liên kết chặt chẽ với nhau thông qua các khóa chính và khóa ngoại. Điều này giúp đảm bảo tính toàn vẹn dữ liệu, hạn chế trùng lặp và hỗ trợ truy vấn hiệu quả.
Bên cạnh đó, hệ thống còn tích hợp các chức năng quản lý khuyến mãi và lịch sử tích điểm cho khách hàng, góp phần phản ánh sát hơn hoạt động thực tế của một siêu thị hiện đại. Thông qua việc xây dựng và vận hành hệ thống, người dùng có thể dễ dàng thực hiện các thao tác như thêm mới, cập nhật, xóa dữ liệu và truy xuất thông tin phục vụ cho việc quản lý và ra quyết định.
Trong thực tế, hoạt động quản lý tại các siêu thị đòi hỏi phải xử lý một khối lượng lớn thông tin liên quan đến nhiều đối tượng khác nhau như hàng hóa, khách hàng, nhân viên và các giao dịch mua bán. Nếu không có một hệ thống quản lý hiệu quả, việc lưu trữ và xử lý dữ liệu sẽ trở nên phức tạp, dễ xảy ra sai sót và khó kiểm soát. Đặc biệt, trong bối cảnh cạnh tranh ngày càng cao, việc tối ưu hóa quy trình quản lý là yếu tố quan trọng giúp nâng cao hiệu quả kinh doanh và chất lượng dịch vụ.
Việc lựa chọn đề tài này xuất phát từ mong muốn áp dụng các kiến thức đã học trong môn Cơ sở dữ liệu vào một bài toán thực tế, gần gũi với đời sống. Thông qua quá trình thực hiện đề tài, người thực hiện có cơ hội hiểu rõ hơn về cách phân tích yêu cầu hệ thống, thiết kế mô hình dữ liệu, xây dựng các bảng và mối quan hệ, cũng như thực hiện các truy vấn SQL để xử lý dữ liệu.
Ngoài ra, đề tài còn giúp rèn luyện tư duy logic, kỹ năng tổ chức dữ liệu và khả năng giải quyết vấn đề trong môi trường công nghệ thông tin. Việc xây dựng thêm một giao diện đơn giản để tương tác với cơ sở dữ liệu cũng góp phần nâng cao tính ứng dụng của hệ thống, giúp người dùng cuối có thể thao tác dễ dàng mà không cần hiểu sâu về ngôn ngữ SQL.
Từ những lý do trên, đề tài không chỉ mang ý nghĩa học tập mà còn có giá trị thực tiễn cao, phù hợp với mục tiêu đào tạo và định hướng ứng dụng của môn học.
CHƯƠNG 1: YÊU CẦU NGHIỆP VỤ CỦA HỆ THỐNG
1. Mô tả bài toán
1.1. Mục đích
Mục đích của việc thiết kế cơ sở dữ liệu cho hệ thống quản lý bán hàng là xây dựng một hệ thống hỗ trợ quản lý toàn diện các hoạt động kinh doanh trong cửa hàng, bao gồm quản lý sản phẩm, nhà cung cấp, khách hàng, nhân viên, hóa đơn, nhập hàng và các chương trình khuyến mãi.
Hệ thống giúp:
Tối ưu hóa quy trình nhập và bán hàng
Quản lý tồn kho chính xác
Theo dõi doanh thu và lịch sử giao dịch
Hỗ trợ chăm sóc khách hàng thông qua tích điểm
Giảm thiểu sai sót trong quá trình quản lý thủ công
Từ đó giúp nâng cao hiệu quả hoạt động kinh doanh và hỗ trợ nhà quản lý đưa ra quyết định chính xác dựa trên dữ liệu.
1.2. Yêu cầu nghiệp vụ
1.2.1. Nghiệp vụ Quản lý Đối tác và Nhân sự
Nghiệp vụ Quản lý Nhà cung cấp (NCC)
Mục tiêu: Thiết lập mạng lưới đối tác cung ứng hàng hóa bền vững và tin cậy.
Dữ liệu quản lý: Mã NCC (duy nhất), tên công ty/đối tác, địa chỉ văn phòng, số điện thoại liên lạc, email giao dịch.
Quy trình vận hành:
Cập nhật thông tin khi có đối tác mới hoặc thay đổi thông tin liên lạc.
Hệ thống tự động liên kết Mã NCC với các Phiếu nhập hàng để theo dõi lịch sử cung ứng.
Quy tắc: Chỉ được xóa nhà cung cấp khi chưa phát sinh bất kỳ giao dịch nhập hàng nào trong hệ thống để đảm bảo tính toàn vẹn dữ liệu.
Nghiệp vụ Quản lý Nhân viên (NV)
Mục tiêu: Kiểm soát nhân sự và phân quyền trách nhiệm trong các giao dịch hệ thống.
Dữ liệu quản lý: Mã nhân viên, họ tên, chức vụ (Quản lý/Bán hàng/Kho), số điện thoại, ngày vào làm.
Quy trình vận hành:
Mỗi nhân viên được cấp một mã định danh để thực hiện đăng nhập.
Hệ thống ghi nhận Mã NV trên mỗi hóa đơn bán hàng hoặc phiếu nhập hàng do nhân viên đó lập để phục vụ công tác đối soát và tính hiệu suất.
Chức năng: Thêm mới khi có nhân viên thử việc, chỉnh sửa chức vụ/lương, và lưu trữ hồ sơ nhân viên đã nghỉ.
1.2.2. Nghiệp vụ Quản lý Kho và Sản phẩm
Nghiệp vụ Quản lý Sản phẩm & Nhóm hàng
Mục tiêu: Quản lý vòng đời sản phẩm và phân loại hàng hóa khoa học.
Dữ liệu quản lý:
Sản phẩm: Mã sản phẩm (Barcode), tên gọi, đơn vị tính (cái, kg, thùng), giá bán niêm yết, số lượng tồn kho hiện tại, hạn sử dụng.
Nhóm hàng: Mã nhóm, tên nhóm (ví dụ: Thực phẩm tươi sống, Hóa mỹ phẩm), ghi chú mô tả.
Quy tắc phân loại: Mỗi sản phẩm bắt buộc phải thuộc về một nhóm hàng duy nhất để dễ dàng lập báo cáo doanh thu theo ngành hàng.
Nghiệp vụ Quản lý Nhập hàng
Mục tiêu: Đảm bảo nguồn cung và cập nhật giá vốn hàng hóa.
Quy trình chi tiết:
Lập phiếu: Nhân viên chọn Nhà cung cấp và nhập các mặt hàng về kho.
Ghi nhận chi tiết: Với mỗi sản phẩm nhập, hệ thống lưu trữ: Số lượng nhập, giá nhập tại thời điểm đó (để tính lợi nhuận sau này).
Xử lý số liệu: Hệ thống tự động tính Tổng giá trị phiếu nhập = Σ (Số lượng * Giá nhập).
Cập nhật kho: Sau khi hoàn tất, số lượng tồn kho của sản phẩm sẽ được cộng thêm tương ứng.
1.2.3. Nghiệp vụ Bán hàng và Khách hàng
Nghiệp vụ Quản lý Hóa đơn bán hàng
Mục tiêu: Thực hiện giao dịch bán lẻ và xuất hóa đơn điện tử cho khách hàng.
Quy trình chi tiết:
Khởi tạo: Nhân viên chọn thông tin khách hàng (nếu có) và lập hóa đơn mới.
Quét hàng: Thêm danh sách sản phẩm khách mua. Hệ thống tự lấy đơn giá hiện hành.
Áp dụng chiết khấu: Tự động kiểm tra các chương trình khuyến mãi đang hiệu lực để giảm trừ trực tiếp trên hóa đơn.
Thanh toán: Tính tổng tiền cuối cùng, chọn phương thức thanh toán và in hóa đơn.
Nghiệp vụ Quản lý Khách hàng & Tích điểm
Mục tiêu: Xây dựng lòng trung thành của khách hàng thông qua ưu đãi hội viên.
Cơ chế tích điểm:
Sau mỗi hóa đơn thành công, hệ thống tính toán số điểm cộng thêm dựa trên giá trị thanh toán (ví dụ: 100.000đ = 1 điểm).
Lịch sử biến động: Lưu trữ chi tiết: Ngày giao dịch, số điểm thay đổi (cộng khi mua hàng, trừ khi đổi quà).
Phân hạng: Tự động nâng hạng (Đồng, Bạc, Vàng, Kim cương) khi điểm tích lũy đạt ngưỡng quy định, giúp khách hàng hưởng mức giảm giá cao hơn.
1.2.4. Nghiệp vụ Hỗ trợ Giao dịch
Nghiệp vụ Quản lý Khuyến mãi
Mục tiêu: Kích cầu mua sắm vào các dịp đặc biệt.
Dữ liệu quản lý: Mã chương trình, tên sự kiện, thời gian bắt đầu và kết thúc.
Cơ chế áp dụng: Thiết lập mức giảm giá (% hoặc số tiền cụ thể) cho từng sản phẩm hoặc toàn bộ danh mục hàng hóa. Hệ thống chỉ cho phép áp dụng nếu ngày lập hóa đơn nằm trong khoảng thời gian khuyến mãi.
Nghiệp vụ Quản lý Thanh toán
Mục tiêu: Đa dạng hóa hình thức thanh toán và quản lý dòng tiền.
Các hình thức: Tiền mặt, Chuyển khoản ngân hàng, Ví điện tử (Momo, VNPay), Quẹt thẻ.
Liên kết: Mỗi hóa đơn phải được xác nhận thanh toán thành công qua ít nhất một phương thức mới được coi là hoàn tất giao dịch.
1.3. Dữ liệu cần lưu trữ
Hệ thống cần lưu trữ các dữ liệu chính sau:
Nhà cung cấp: MaNCC, TenNCC, DiaChi, SDT, Email
Nhân viên: MaNV, HoTen, ChucVu, SDT, NgayVaoLam
Sản phẩm: MaSP, TenSP, DonViTinh, GiaBan, SoLuongTon, HSD
Nhóm hàng: MaNhom, TenNhom, GhiChu
Phiếu nhập: MaPN, NgayNhap, TongGiaTri
Hóa đơn: MaHD, NgayLap, TongTien
Khách hàng: MaKH, HoTen, SDT, DiemTichLuy
Khuyến mãi: MaKM, TenKM, NgayBatDau, NgayKetThuc
Phương thức thanh toán: MaPT, TenPT, MoTa
CHƯƠNG 2: THIẾT KẾ CƠ SỞ DỮ LIỆU
1. Thiết kế mô hình liên kết thực thể (ER)
Mô hình liên kết thực thể (Entity – Relationship Model) được sử dụng để mô tả cấu trúc dữ liệu của hệ thống quản lý siêu thị ở mức khái niệm. Mô hình này thể hiện các thực thể, thuộc tính và mối quan hệ giữa chúng.
1.1. Xác định các thực thể và thuộc tính
Nhân viên (NHANVIEN): MaNV, HoTen, ChucVu, SDT, NgayVaoLam 
Nhà cung cấp (NHACUNGCAP): MaNCC, TenNCC, DiaChi, SDT, Email 
Nhóm hàng (NHOMHANG): MaNhom, TenNhom, GhiChu 
Sản phẩm (SANPHAM): MaSP, TenSP, DonViTinh, GiaBan, SoLuongTon, HSD 
Khách hàng (KHACHHANG): MaSP, TenSP, DonViTinh, GiaBan, SoLuongTon, HSD 
Phương thức thanh toán (PHUONGTHUCTT): MaPT, TenPT, MoTa 
Khuyến mãi (KHUYENMAI): MaKM, TenKM, NgayBatDau, NgayKetThuc 
Phiếu nhập (PHIEUNHAP): MaPN, NgayNhap, TongGiaTri 
Hóa đơn (HOADON): MaHD, NgayLap, TongTien 
Lịch sử điểm (LICHSUDIEM): MaGD, NgayGD, SoDiemThayDoi 
1.2. Mối quan hệ giữa các thực thể
Nhà cung cấp – Phiếu nhập:
 Một nhà cung cấp có thể cung cấp nhiều phiếu nhập, mỗi phiếu nhập thuộc một nhà cung cấp.
Nhân viên – Phiếu nhập:
 Một nhân viên có thể lập nhiều phiếu nhập.
Phiếu nhập – Sản phẩm:
 Quan hệ N-N thông qua bảng chi tiết phiếu nhập.
Sản phẩm – Nhóm hàng:
 Mỗi sản phẩm thuộc một nhóm, một nhóm có nhiều sản phẩm.
Nhân viên – Hóa đơn:
 Một nhân viên có thể lập nhiều hóa đơn.
Khách hàng – Hóa đơn:
 Một khách hàng có thể có nhiều hóa đơn.
Hóa đơn – Sản phẩm:
 Quan hệ N-N thông qua bảng chi tiết hóa đơn.
Hóa đơn – Phương thức thanh toán:
 Mỗi hóa đơn sử dụng một phương thức thanh toán.
Sản phẩm – Khuyến mãi:
 Quan hệ N-N thông qua bảng áp dụng khuyến mãi.
Khách hàng – Lịch sử điểm:
 Một khách hàng có nhiều bản ghi tích điểm.

1.2.  Sơ đồ thực thể liên kết ER 






















CHƯƠNG 3: CHUYỂN MÔ HÌNH ER SANG MÔ HÌNH QUAN HỆ
1. Quy trình 7 bước chuyển đổi từ mô hình ER sang mô hình quan hệ
Để đảm bảo tính toàn vẹn dữ liệu và tối ưu hóa cấu trúc bảng, quy trình chuyển đổi được thực hiện theo các bước lý thuyết chuẩn sau:
Bước 1: Ánh xạ các tập thực thể mạnh (Strong Entities): Mỗi tập thực thể mạnh trong sơ đồ ER được chuyển thành một quan hệ (bảng). Khóa chính của thực thể trở thành khóa chính của bảng.
Bước 2: Ánh xạ các tập thực thể yếu (Weak Entities): Chuyển thực thể yếu thành một bảng. Khóa chính của bảng này bao gồm khóa chính của thực thể chủ kết hợp với khóa bộ phận của thực thể yếu.
Bước 3: Ánh xạ các mối quan hệ 1:1: Chọn một trong hai bảng làm phía chứa khóa ngoại (thường là phía có sự tham gia toàn bộ) để liên kết với bảng còn lại.
Bước 4: Ánh xạ các mối quan hệ 1:N: Lấy khóa chính của thực thể ở nhánh "1" đưa vào làm khóa ngoại ở thực thể nhánh "N".
Bước 5: Ánh xạ các mối quan hệ M:N: Tạo một bảng trung gian mới. Khóa chính của bảng này là sự kết hợp của các khóa chính từ các thực thể tham gia quan hệ.
Bước 6: Ánh xạ các thuộc tính đa trị: Tạo một bảng riêng biệt để lưu trữ thuộc tính đa trị nhằm tránh lặp dữ liệu và đảm bảo dạng chuẩn.
Bước 7: Ánh xạ các mối quan hệ n-ngôi (n > 2): Tạo một bảng mới chứa các khóa chính của tất cả các thực thể tham gia làm khóa ngoại.
2. Kết quả xây dựng lược đồ quan hệ chi tiết 
Dưới đây là chi tiết các bảng sau khi thực hiện chuyển đổi cho hệ thống, bao gồm kiểu dữ liệu, các ràng buộc khóa và diễn giải chức năng. 
2.1. Bảng NHANVIEN (Nhân viên)
Mô tả:
 Lưu trữ thông tin nhân viên làm việc tại cửa hàng, phục vụ cho việc lập hóa đơn và phiếu nhập.
Cấu trúc:
MaNV (PK):
 Mã nhân viên, kiểu VARCHAR(10), định danh duy nhất.
HoTen:
 Họ và tên nhân viên, kiểu VARCHAR(100), NOT NULL.
ChucVu:
 Chức vụ, kiểu VARCHAR(50).
SDT:
 Số điện thoại, kiểu VARCHAR(15), UNIQUE.
NgayVaoLam:
 Ngày bắt đầu làm việc, kiểu DATE, NOT NULL.
Ghi chú:
 Bảng được tạo từ thực thể NHANVIEN trong mô hình ER và tham gia vào các nghiệp vụ lập hóa đơn và phiếu nhập.
2.2 Bảng KHACHHANG (Khách hàng)
Mô tả:
 Lưu trữ thông tin khách hàng mua hàng tại cửa hàng.
Cấu trúc:
MaKH (PK):
 Mã khách hàng, kiểu VARCHAR(10), định danh duy nhất.
HoTen:
 Họ tên khách hàng, kiểu VARCHAR(100), NOT NULL.
SDT:
 Số điện thoại, kiểu VARCHAR(15), UNIQUE.
DiemTichLuy:
 Điểm tích lũy, kiểu INT, DEFAULT 0.
HangThanhVien:
 Hạng thành viên, kiểu VARCHAR(50).
Ghi chú:
 Bảng được tạo từ thực thể KHACHHANG, phục vụ nghiệp vụ bán hàng và tích điểm.
2.3. Bảng SANPHAM (Sản phẩm)
Mô tả:
 Lưu trữ thông tin các sản phẩm được kinh doanh trong cửa hàng.
Cấu trúc:
MaSP (PK):
 Mã sản phẩm, kiểu VARCHAR(10), định danh duy nhất.
TenSP:
 Tên sản phẩm, kiểu VARCHAR(100), NOT NULL.
DonViTinh:
 Đơn vị tính, kiểu VARCHAR(20).
GiaBan:
 Giá bán sản phẩm, kiểu FLOAT, CHECK (GiaBan >= 0).
SoLuongTon:
 Số lượng tồn kho, kiểu INT, CHECK (SoLuongTon >= 0).
HSD:
 Hạn sử dụng, kiểu DATE.
MaNhom (FK):
 Tham chiếu đến NHOMHANG(MaNhom), kiểu VARCHAR(10), NOT NULL.
Ghi chú:
 Bảng được tạo từ thực thể SANPHAM, có quan hệ 1-N với NHOMHANG.
2.4. Bảng HOADON (Hóa đơn)
Mô tả:
 Lưu trữ thông tin các hóa đơn bán hàng.
Cấu trúc:
MaHD (PK):
 Mã hóa đơn, kiểu VARCHAR(10), định danh duy nhất.
NgayLap:
 Ngày lập hóa đơn, kiểu DATE, NOT NULL.
TongTien:
 Tổng tiền hóa đơn, kiểu FLOAT, CHECK (TongTien >= 0).
MaNV (FK):
 Tham chiếu đến NHANVIEN(MaNV), kiểu VARCHAR(10), NOT NULL.
MaKH (FK):
 Tham chiếu đến KHACHHANG(MaKH), kiểu VARCHAR(10), NOT NULL.
MaPT (FK):
 Tham chiếu đến PHUONGTHUCTT(MaPT), kiểu VARCHAR(10), NOT NULL.
Ghi chú:
 Bảng được tạo từ thực thể HOADON, liên kết với nhân viên, khách hàng và phương thức thanh toán.
2.5. Bảng CHITIETHOADON (Chi tiết hóa đơn)
Mô tả:
 Lưu trữ thông tin chi tiết các sản phẩm trong từng hóa đơn.
Cấu trúc:
MaHD (PK, FK):
 Tham chiếu đến HOADON(MaHD), kiểu VARCHAR(10).
MaSP (PK, FK):
 Tham chiếu đến SANPHAM(MaSP), kiểu VARCHAR(10).
SoLuong:
 Số lượng sản phẩm, kiểu INT, CHECK (SoLuong > 0).
DonGia:
 Giá bán tại thời điểm mua, kiểu FLOAT, CHECK (DonGia >= 0).
Ghi chú:
 Bảng được tạo từ mối quan hệ N-N giữa HOADON và SANPHAM.
2.6. Bảng LICHSUDIEM (Lịch sử điểm)
Mô tả:
 Lưu trữ lịch sử thay đổi điểm tích lũy của khách hàng.
Cấu trúc:
MaGD (PK):
 Mã giao dịch điểm, kiểu INT, định danh duy nhất.
MaKH (FK):
 Tham chiếu đến KHACHHANG(MaKH), kiểu VARCHAR(10), NOT NULL.
NgayGD:
 Ngày giao dịch, kiểu DATE, NOT NULL.
SoDiemThayDoi:
 Số điểm thay đổi, kiểu INT.
Ghi chú:
 Bảng có quan hệ 1-N với KHACHHANG.
2.7. Bảng AP_DUNG_KM (Áp dụng khuyến mãi)
Mô tả:
 Lưu trữ thông tin áp dụng khuyến mãi cho từng sản phẩm.
Cấu trúc:
MaKM (PK, FK):
 Tham chiếu đến KHUYENMAI(MaKM), kiểu VARCHAR(10).
MaSP (PK, FK):
 Tham chiếu đến SANPHAM(MaSP), kiểu VARCHAR(10).
MucGiam:
 Mức giảm giá, kiểu FLOAT, CHECK (MucGiam >= 0).
Ghi chú:
 Bảng được tạo từ mối quan hệ N-N giữa KHUYENMAI và SANPHAM.
2.8. Bảng PHIEUNHAP (Phiếu nhập hàng)
Mô tả:
 Lưu trữ thông tin các phiếu nhập hàng từ nhà cung cấp.
Cấu trúc:
MaPN (PK):
 Mã phiếu nhập, kiểu VARCHAR(10), định danh duy nhất.
NgayNhap:
 Ngày nhập hàng, kiểu DATE, NOT NULL.
TongGiaTri:
 Tổng giá trị phiếu nhập, kiểu FLOAT, CHECK (TongGiaTri >= 0).
MaNCC (FK):
 Tham chiếu đến NHACUNGCAP(MaNCC), kiểu VARCHAR(10), NOT NULL.
MaNV (FK):
 Tham chiếu đến NHANVIEN(MaNV), kiểu VARCHAR(10), NOT NULL.
Ghi chú:
 Bảng được tạo từ thực thể PHIEUNHAP, liên kết với nhà cung cấp và nhân viên.
2.9. Bảng CHITIETPHIEUNHAP (Chi tiết phiếu nhập)
Mô tả:
 Lưu trữ thông tin chi tiết các sản phẩm trong từng phiếu nhập.
Cấu trúc:
MaPN (PK, FK):
 Tham chiếu đến PHIEUNHAP(MaPN), kiểu VARCHAR(10).
MaSP (PK, FK):
 Tham chiếu đến SANPHAM(MaSP), kiểu VARCHAR(10).
SoLuongNhap:
 Số lượng nhập, kiểu INT, CHECK (SoLuongNhap > 0).
DonGiaNhap:
 Giá nhập, kiểu FLOAT, CHECK (DonGiaNhap >= 0).
GhiChu:
 Ghi chú, kiểu VARCHAR(200).
Ghi chú:
 Bảng được tạo từ mối quan hệ N-N giữa PHIEUNHAP và SANPHAM.
2.10. Bảng NHOMHANG (Nhóm hàng)
Mô tả:
 Lưu trữ thông tin các nhóm hàng để phân loại sản phẩm.
Cấu trúc:
MaNhom (PK):
 Mã nhóm hàng, kiểu VARCHAR(10), định danh duy nhất.
TenNhom:
 Tên nhóm hàng, kiểu VARCHAR(100), NOT NULL.
GhiChu:
 Thông tin mô tả thêm, kiểu VARCHAR(200).
Ghi chú:
 Bảng được tạo từ thực thể NHOMHANG và có quan hệ 1-N với bảng SANPHAM.
2.11. Bảng NHACUNGCAP (Nhà cung cấp)
Mô tả:
 Lưu trữ thông tin các nhà cung cấp sản phẩm cho cửa hàng, phục vụ cho nghiệp vụ nhập hàng.
Cấu trúc:
MaNCC (PK):
 Mã nhà cung cấp, kiểu dữ liệu VARCHAR(10), định danh duy nhất.
TenNCC:
 Tên nhà cung cấp, kiểu VARCHAR(100), NOT NULL.
DiaChi:
 Địa chỉ, kiểu VARCHAR(200).
SDT:
 Số điện thoại, kiểu VARCHAR(15), UNIQUE.
Email:
 Email liên hệ, kiểu VARCHAR(100), UNIQUE.
Ghi chú:
 Bảng được tạo từ thực thể NHACUNGCAP trong mô hình ER và được sử dụng trong quản lý phiếu nhập.
2.12. Bảng PHUONGTHUCTT (Phương thức thanh toán)
Mô tả:
 Lưu trữ thông tin các phương thức thanh toán.
Cấu trúc:
MaPT (PK):
 Mã phương thức, kiểu VARCHAR(10), định danh duy nhất.
TenPT:
 Tên phương thức thanh toán, kiểu VARCHAR(50), NOT NULL.
MoTa:
 Mô tả, kiểu VARCHAR(200).
Ghi chú:
 Bảng được sử dụng trong quản lý thanh toán của hóa đơn.
2.13. Bảng KHUYENMAI (Chương trình khuyến mãi)
Mô tả:
 Lưu trữ thông tin các chương trình khuyến mãi.
Cấu trúc:
MaKM (PK):
 Mã khuyến mãi, kiểu VARCHAR(10), định danh duy nhất.
TenKM:
 Tên chương trình, kiểu VARCHAR(100), NOT NULL.
NgayBatDau:
 Ngày bắt đầu, kiểu DATE, NOT NULL.
NgayKetThuc:
 Ngày kết thúc, kiểu DATE, NOT NULL, CHECK (NgayKetThuc >= NgayBatDau).
Ghi chú:
 Bảng được tạo từ thực thể KHUYENMAI.

3. Lược đồ quan hệ






















CHƯƠNG 4: THIẾT KẾ CÁC BẢNG DỮ LIỆU MỨC VẬT LÝ


2.1. Bảng NHANVIEN (Nhân viên)
Lưu trữ thông tin hồ sơ nhân viên trong hệ thống.
Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaNV
VARCHAR
10
PRIMARY KEY
HoTen
VARCHAR
100
NOT NULL
ChucVu
VARCHAR
50


SDT
VARCHAR
15
UNIQUE
NgayVaoLam
DATE


NOT NULL


2.2 Bảng KHACHHANG (Khách hàng)
Quản lý thông tin khách hàng và điểm thưởng tích lũy.

Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaKH
VARCHAR
10
PRIMARY KEY
HoTen
VARCHAR
100
NOT NULL
SDT
VARCHAR
15
UNIQUE
DiemTichLuy
INT


DEFAULT 0
HangThanhVien
VARCHAR
50




2.3. Bảng SANPHAM (Sản phẩm)
Thông tin chi tiết về các mặt hàng bày bán tại siêu thị.


Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaSP
VARCHAR
10
PRIMARY KEY
TenSP
VARCHAR
100
NOT NULL
DonViTinh
VARCHAR
20


GiaBan
FLOAT


CHECK (GiaBan >= 0)
SoLuongTon
INT


CHECK (SoLuongTon >= 0)
HSD
DATE




MaNhom
VARCHAR
10
FOREIGN KEY


Ghi chú: MaNhom tham chiếu NHOMHANG(MaNhom) 
2.4. Bảng HOADON (Hóa đơn)
Lưu trữ các giao dịch bán lẻ.

Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaHD
VARCHAR
10
PRIMARY KEY
NgayLap
DATE


NOT NULL
TongTien
FLOAT


CHECK (TongTien >= 0)
MaNV
VARCHAR
10
FOREIGN KEY
MaKH
VARCHAR
10
FOREIGN KEY
MaPT
VARCHAR
10
FOREIGN KEY

Ghi chú:
MaNV → NHANVIEN
MaKH → KHACHHANG
MaPT → PHUONGTHUCTT
2.5. Bảng CHITIETHOADON (Chi tiết hóa đơn)
Bảng trung gian giải quyết quan hệ M:N giữa Hóa đơn và Sản phẩm.

Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaHD
VARCHAR
10
PRIMARY KEY, FOREIGN KEY
MaSP
VARCHAR
10
PRIMARY KEY, FOREIGN KEY
SoLuong
INT


CHECK (SoLuong > 0)
DonGia
FLOAT


CHECK (DonGia >= 0)

Ghi chú:
MaHD → HOADON
MaSP → SANPHAM
2.6. Bảng LICHSUDIEM (Lịch sử điểm)
Thực thể yếu theo dõi biến động điểm của khách hàng.

Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaGD
INT


PRIMARY KEY
MaKH
VARCHAR
10
FOREIGN KEY
NgayGD
DATE


NOT NULL
SoDiemThayDoi
INT






Ghi chú: MaKH → KHACHHANG 
2.7. Bảng AP_DUNG_KM (Áp dụng khuyến mãi)
Quản lý việc áp dụng các chương trình ưu đãi cho từng loại sản phẩm.

Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaKM
VARCHAR
10
PRIMARY KEY, FOREIGN KEY
MaSP
VARCHAR
10
PRIMARY KEY, FOREIGN KEY
MucGiam
FLOAT


CHECK (MucGiam >= 0)

Ghi chú:
MaKM → KHUYENMAI
MaSP → SANPHAM
2.8. Bảng PHIEUNHAP (Phiếu nhập hàng)
Lưu trữ thông tin tổng quát của các đợt nhập hàng.

Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaPN
VARCHAR
10
PRIMARY KEY
NgayNhap
DATE


NOT NULL
TongGiaTri
FLOAT


CHECK (TongGiaTri >= 0)
MaNCC
VARCHAR
10
FOREIGN KEY
MaNV
VARCHAR
10
FOREIGN KEY

Ghi chú:
MaNCC → NHACUNGCAP
MaNV → NHANVIEN
2.9. Bảng CHITIETPHIEUNHAP (Chi tiết phiếu nhập)
Bảng trung gian giữa Phiếu nhập và Sản phẩm.

Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaPN
VARCHAR
10
PRIMARY KEY, FOREIGN KEY
MaSP
VARCHAR
10
PRIMARY KEY, FOREIGN KEY
SoLuongNhap
INT


CHECK (SoLuongNhap > 0)
DonGiaNhap
FLOAT


CHECK (DonGiaNhap >= 0)
GhiChu
VARCHAR
200



Ghi chú:
MaPN → PHIEUNHAP
MaSP → SANPHAM
2.10. Bảng NHOMHANG (Nhóm hàng)
Phân loại sản phẩm để quản lý theo danh mục.

Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaNhom
VARCHAR
10
PRIMARY KEY
TenNhom
VARCHAR
100
NOT NULL
GhiChu
VARCHAR
200




2.11. Bảng NHACUNGCAP (Nhà cung cấp) 

Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaNCC
VARCHAR
10
PRIMARY KEY
TenNCC
VARCHAR
100
NOT NULL
DiaChi
VARCHAR
200


SDT
VARCHAR
15
UNIQUE
Email
VARCHAR
100
UNIQUE


2.12. Bảng PHUONGTHUCTT (Phương thức thanh toán) 

Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaPT
VARCHAR
10
PRIMARY KEY
TenPT
VARCHAR
50
NOT NULL
MoTa
VARCHAR
200




2.13. Bảng KHUYENMAI (Chương trình khuyến mãi) 

Thuộc tính
Kiểu dữ liệu
Kích thước
Ràng buộc
MaKM
VARCHAR
10
PRIMARY KEY
TenKM
VARCHAR
100
NOT NULL
NgayBatDau
DATE


NOT NULL
NgayKetThuc
DATE


CHECK (NgayKetThuc >= NgayBatDau)



2. Triển khai cơ sở dữ liệu đã thiết kế vào hệ thống vật lý
Cơ sở dữ liệu đã được triển khai thành công trên hệ quản trị MySQL với đầy đủ các bảng, khóa chính, khóa ngoại và ràng buộc toàn vẹn dữ liệu. 

2.1. Tạo database
CREATE DATABASE QuanLyBanHang;
USE QuanLyBanHang;

2.2. Tạo các bảng
-- NHACUNGCAP 
CREATE TABLE NHACUNGCAP (
    MaNCC VARCHAR(10) PRIMARY KEY,
    TenNCC VARCHAR(100) NOT NULL,
    DiaChi VARCHAR(200),
    SDT VARCHAR(15) UNIQUE,
    Email VARCHAR(100) UNIQUE
);

-- NHANVIEN 
CREATE TABLE NHANVIEN (
    MaNV VARCHAR(10) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    ChucVu VARCHAR(50),
    SDT VARCHAR(15) UNIQUE,
    NgayVaoLam DATE NOT NULL
);

-- NHOMHANG
CREATE TABLE NHOMHANG (
    MaNhom VARCHAR(10) PRIMARY KEY,
    TenNhom VARCHAR(100) NOT NULL,
    GhiChu VARCHAR(200)
);

-- KHACHHANG 
CREATE TABLE KHACHHANG (
    MaKH VARCHAR(10) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SDT VARCHAR(15) UNIQUE,
    DiemTichLuy INT DEFAULT 0,
    HangThanhVien VARCHAR(50)
);

-- PHUONGTHUCTT 
CREATE TABLE PHUONGTHUCTT (
    MaPT VARCHAR(10) PRIMARY KEY,
    TenPT VARCHAR(50) NOT NULL,
    MoTa VARCHAR(200)
);

-- SANPHAM 
CREATE TABLE SANPHAM (
    MaSP VARCHAR(10) PRIMARY KEY,
    TenSP VARCHAR(100) NOT NULL,
    DonViTinh VARCHAR(20),
    GiaBan FLOAT CHECK (GiaBan >= 0),
    SoLuongTon INT CHECK (SoLuongTon >= 0),
    HSD DATE,
    MaNhom VARCHAR(10) NOT NULL,
    FOREIGN KEY (MaNhom) REFERENCES NHOMHANG(MaNhom)
);

-- PHIEUNHAP 
CREATE TABLE PHIEUNHAP (
    MaPN VARCHAR(10) PRIMARY KEY,
    NgayNhap DATE NOT NULL,
    TongGiaTri FLOAT CHECK (TongGiaTri >= 0),
    MaNCC VARCHAR(10) NOT NULL,
    MaNV VARCHAR(10) NOT NULL,
    FOREIGN KEY (MaNCC) REFERENCES NHACUNGCAP(MaNCC),
    FOREIGN KEY (MaNV) REFERENCES NHANVIEN(MaNV)
);

-- CHITIETPHIEUNHAP 
CREATE TABLE CHITIETPHIEUNHAP (
    MaPN VARCHAR(10),
    MaSP VARCHAR(10),
    SoLuongNhap INT CHECK (SoLuongNhap > 0),
    DonGiaNhap FLOAT CHECK (DonGiaNhap >= 0),
    GhiChu VARCHAR(200),
    PRIMARY KEY (MaPN, MaSP),
    FOREIGN KEY (MaPN) REFERENCES PHIEUNHAP(MaPN),
    FOREIGN KEY (MaSP) REFERENCES SANPHAM(MaSP)
);

-- KHUYENMAI 
CREATE TABLE KHUYENMAI (
    MaKM VARCHAR(10) PRIMARY KEY,
    TenKM VARCHAR(100) NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    CHECK (NgayKetThuc >= NgayBatDau)
);

-- HOADON 
CREATE TABLE HOADON (
    MaHD VARCHAR(10) PRIMARY KEY,
    NgayLap DATE NOT NULL,
    TongTien FLOAT CHECK (TongTien >= 0),
    MaNV VARCHAR(10) NOT NULL,
    MaKH VARCHAR(10) NOT NULL,
    MaPT VARCHAR(10) NOT NULL,
    FOREIGN KEY (MaNV) REFERENCES NHANVIEN(MaNV),
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH),
    FOREIGN KEY (MaPT) REFERENCES PHUONGTHUCTT(MaPT)
);

-- CHITIETHOADON 
CREATE TABLE CHITIETHOADON (
    MaHD VARCHAR(10),
    MaSP VARCHAR(10),
    SoLuong INT CHECK (SoLuong > 0),
    DonGia FLOAT CHECK (DonGia >= 0),
    PRIMARY KEY (MaHD, MaSP),
    FOREIGN KEY (MaHD) REFERENCES HOADON(MaHD),
    FOREIGN KEY (MaSP) REFERENCES SANPHAM(MaSP)
);

-- AP_DUNG_KM 
CREATE TABLE AP_DUNG_KM (
    MaKM VARCHAR(10),
    MaSP VARCHAR(10),
    MucGiam FLOAT CHECK (MucGiam >= 0),
    PRIMARY KEY (MaKM, MaSP),
    FOREIGN KEY (MaKM) REFERENCES KHUYENMAI(MaKM),
    FOREIGN KEY (MaSP) REFERENCES SANPHAM(MaSP)
);

-- LICHSUDIEM 
CREATE TABLE LICHSUDIEM (
    MaGD INT PRIMARY KEY,
    MaKH VARCHAR(10) NOT NULL,
    NgayGD DATE NOT NULL,
    SoDiemThayDoi INT,
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH)
);

3. Nhập dữ liệu mẫu
-- Bảng NHOMHANG: Bảng thể hiện các nhóm hàng trong siêu thị.


-- Bảng SANPHAM: Bảng lưu thông tin sản phẩm gồm tên, giá bán, số lượng tồn kho,... 

-- Bảng KHACHHANG: 


-- Bảng NHANVIEN:


-- Bảng HOADON:


-- Bảng PHIEUNHAP:

Các bảng còn lại như CHITIETHOADON, CHITIETPHIEUNHAP, KHUYENMAI, AP_DUNG_KM, LICHSUDIEM,.. cũng đã được nhập đầy đủ dữ liệu và đảm bảo ràng buộc toàn vẹn. 

4. Thực hiện các truy vấn sử dụng các câu lệnh đã học
4.1. INSERT
INSERT INTO NHOMHANG VALUES ('NH16','Đồ gia dụng','');
INSERT INTO KHACHHANG VALUES ('KH16','Long','090200016',50,'Member');
INSERT INTO NHANVIEN VALUES ('NV16','Tuấn','Thu ngân','0901111126','2023-04-01');
INSERT INTO SANPHAM VALUES ('SP16','Nước cam','Chai',12000,50,'2026-12-01','NH08');
INSERT INTO PHUONGTHUCTT VALUES ('PT16','ShopeePay','');





Các câu lệnh trên dùng để thêm mới dữ liệu vào các bảng trong hệ thống như nhóm hàng, khách hàng, nhân viên, sản phẩm và phương thức thanh toán. 
4.2. UPDATE
UPDATE SANPHAM SET GiaBan = 11000 WHERE MaSP = 'SP01';
UPDATE KHACHHANG SET LoaiKH = 'VIP' WHERE DiemTichLuy > 300;
UPDATE NHANVIEN SET ChucVu = 'Quản lý' WHERE MaNV = 'NV01';
UPDATE SANPHAM SET SoLuongTon = SoLuongTon - 10 WHERE MaSP = 'SP02';
UPDATE HOADON SET TongTien = TongTien + 10000 WHERE MaHD = 'HD01';



Các câu lệnh trên dùng để cập nhật thông tin trong hệ thống như giá sản phẩm, loại khách hàng, chức vụ nhân viên và tổng tiền hóa đơn.
4.3. DELETE
DELETE FROM NHOMHANG WHERE MaNhom = 'NH16';
DELETE FROM KHACHHANG WHERE MaKH = 'KH16';
DELETE FROM NHANVIEN WHERE MaNV = 'NV16';
DELETE FROM SANPHAM WHERE MaSP = 'SP16';
DELETE FROM PHUONGTHUCTT WHERE MaPT = 'PT16';




Các câu lệnh trên dùng để xóa dữ liệu khỏi các bảng trong hệ thống. 

4.4. SELECT
Truy vấn 1: Lấy dữ liệu từ 1 bảng
SELECT TenSP, GiaBan
FROM SANPHAM
WHERE GiaBan > 10000;

Truy vấn hiển thị các sản phẩm có giá bán lớn hơn 10,000. 

Truy vấn 2: Lấy dữ liệu từ 2 bảng (JOIN) 
SELECT HD.MaHD, KH.HoTen, HD.TongTien
FROM HOADON HD
JOIN KHACHHANG KH ON HD.MaKH = KH.MaKH;

Truy vấn hiển thị thông tin hóa đơn và khách hàng tương ứng.

Truy vấn 3: Lấy dữ liệu từ 3 bảng trở lên
SELECT HD.MaHD, KH.HoTen, SP.TenSP
FROM CHITIETHOADON CT
JOIN HOADON HD ON CT.MaHD = HD.MaHD
JOIN KHACHHANG KH ON HD.MaKH = KH.MaKH
JOIN SANPHAM SP ON CT.MaSP = SP.MaSP;


Truy vấn hiển thị thông tin hóa đơn, khách hàng và sản phẩm liên quan. 

Truy vấn 4: Sử dụng GROUP BY 
SELECT MaKH, SUM(TongTien) AS TongChiTieu
FROM HOADON
GROUP BY MaKH;

Truy vấn tính tổng số tiền mà mỗi khách hàng đã chi tiêu. 

Truy vấn 5: Sử dụng GROUP BY và HAVING 
SELECT MaKH, SUM(TongTien) AS TongChiTieu
FROM HOADON
GROUP BY MaKH
HAVING SUM(TongTien) > 100000;


Truy vấn hiển thị các khách hàng có tổng chi tiêu lớn hơn 100,000. 











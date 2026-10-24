import type { BlogPost } from '../types'

// Editorial content stays local. Introduce a blog service when a CMS contract exists.
export const posts: BlogPost[] = [
  {
    id: 'cam-nang-tim-tro',
    title: 'Lần đầu tìm trọ? Bắt đầu từ những điều nhỏ nhất',
    category: 'Cẩm nang tìm trọ',
    excerpt:
      'Từ chọn khu vực đến xem phòng, một vài gợi ý để hành trình tự lập của bạn nhẹ nhàng hơn.',
    imageUrl: '/images/room-5.jpg',
    date: '2026-10-20',
    readTime: 5,
    sections: [
      {
        title: 'Chọn vị trí theo nhịp sống của bạn',
        content:
          'Trước khi mở hàng chục tin đăng, hãy viết ra ba điều bạn thực sự cần ở một căn phòng. Đó có thể là đi học thuận tiện, có chỗ nấu ăn và đủ yên tĩnh để ngủ. Tách nhu cầu bắt buộc khỏi những điểm chỉ muốn có thêm. Bạn cũng có thể lưu vài địa chỉ trong cùng khu vực để đi xem trong một buổi. Sắp xếp trước lịch hẹn và ghi số liên hệ sẽ giúp chuyến đi gọn hơn, nhất là khi bạn chưa quen đường hoặc phải tranh thủ giữa các buổi học. Cách này giúp bạn bớt phân vân khi một căn phòng rất đẹp nhưng không phù hợp với sinh hoạt hằng ngày.\n\nĐừng chỉ nhìn khoảng cách trên bản đồ. Hãy thử đi từ khu trọ đến trường vào khung giờ bạn thường học, quan sát đường đông, điểm đón xe buýt và chỗ gửi xe. Một địa chỉ xa hơn một chút nhưng có tuyến xe thuận tiện đôi khi lại dễ sống hơn. Bạn cũng nên để ý chợ, cửa hàng thực phẩm và nơi giặt đồ gần đó.',
      },
      {
        title: 'Đặt ngân sách trước khi đi xem',
        content:
          'Giá thuê là điểm bắt đầu, chưa phải toàn bộ số tiền phải trả. Hãy ghi riêng tiền phòng, điện, nước, mạng, gửi xe và các phí dùng chung được thông báo. Với khoản chưa rõ, đánh dấu để hỏi lại thay vì tự đoán. Khi so sánh hai phòng, dùng cùng một danh sách chi phí và cùng mức sinh hoạt dự kiến để tránh bị hấp dẫn bởi giá thuê ban đầu thấp.\n\nTháng chuyển vào thường còn có tiền cọc, vận chuyển và những món đồ thiếu sẵn trong phòng. Hãy tính khoản này riêng với ngân sách hằng tháng. Nếu số tiền ban đầu khiến bạn phải dùng hết phần dự phòng, có thể cân nhắc phòng có sẵn nội thất hoặc lùi thời điểm mua những món chưa cần thiết.',
      },
      {
        title: 'Đi xem phòng với một danh sách ngắn',
        content:
          'Khi đến nơi, hãy kiểm tra đúng căn phòng được giới thiệu, quan sát cửa sổ, dấu ẩm trên tường và mùi trong nhà vệ sinh. Xin phép thử vòi nước, bật đèn và kiểm tra khóa cửa. Nhìn cả hành lang, lối đi và khu để xe vì đây là những nơi bạn sẽ sử dụng mỗi ngày. Nếu đi cùng bạn bè, một người có thể ghi chú trong lúc người còn lại hỏi thông tin.\n\nHỏi rõ giờ giấc, việc đón khách, nấu ăn, nuôi thú cưng và cách báo sửa thiết bị. Những quy định tưởng nhỏ có thể ảnh hưởng nhiều đến lịch học hoặc việc làm thêm. Sau buổi xem, ghi ngay điểm thích, điểm chưa ổn và câu hỏi còn thiếu. Đừng dựa hoàn toàn vào trí nhớ sau khi đã xem nhiều phòng liên tiếp.',
      },
      {
        title: 'So sánh rồi mới chốt lựa chọn',
        content:
          'Bạn có thể làm một bảng đơn giản gồm giá dự kiến mỗi tháng, thời gian di chuyển, độ thoáng và mức phù hợp với thói quen. Chấm theo ưu tiên của bản thân thay vì cố tìm căn phòng hoàn hảo ở mọi mặt. Nếu ở ghép, hãy cùng người ở chung đi xem và trao đổi về lịch ngủ, vệ sinh, đồ dùng chung trước khi quyết định.\n\nKhi đã có lựa chọn, dành thời gian đọc lại các khoản thanh toán và hỏi những điều còn mơ hồ. Giữ bản ghi trao đổi, thông tin liên hệ và hình ảnh hiện trạng được phép chụp. Nhờ một người có kinh nghiệm xem cùng sẽ giúp bạn phát hiện câu hỏi bị bỏ sót. Một quyết định vừa sức, rõ thông tin và phù hợp lịch sống sẽ giúp những tuần đầu tự lập nhẹ nhàng hơn.',
      },
      {
        title: 'Chuẩn bị tuần đầu ở nơi mới',
        content:
          'Sau khi chọn phòng, hãy lên một lịch chuyển đồ phù hợp với giờ học và thời gian nhận phòng. Đóng riêng một túi đồ dùng trong ngày đầu, gồm quần áo, đồ vệ sinh cá nhân, sạc điện thoại và giấy tờ cần thiết. Đánh dấu từng thùng theo khu vực sử dụng để khi đến nơi bạn không phải mở tất cả chỉ để tìm một chiếc khăn.\n\nTrong tuần đầu, thử đi chợ, tìm nơi giặt đồ và làm quen với đường về vào buổi tối. Ghi lại những điểm chưa thuận tiện để điều chỉnh cách sắp xếp phòng hoặc lịch sinh hoạt. Bạn có thể hỏi người ở cùng khu về các tiện ích họ thường dùng rồi tự trải nghiệm trước khi chọn nơi quen thuộc. Những việc nhỏ này giúp căn phòng mới dần trở thành một chỗ ở phù hợp với bạn.',
      },
    ],
  },
  {
    id: 'goc-hoc-tap',
    title: 'Checklist đồ dùng cho phòng trọ: mua đủ, sống gọn',
    category: 'Không gian sống',
    excerpt:
      'Từ chỗ ngủ đến góc học tập, chuẩn bị đồ dùng theo từng đợt để phòng mới gọn gàng và vừa ngân sách.',
    imageUrl: '/images/room-4.jpg',
    date: '2026-10-18',
    readTime: 4,
    sections: [
      {
        title: 'Đo phòng và kiểm kê đồ có sẵn',
        content:
          'Trước khi mua đồ cho phòng mới, hãy đo chiều rộng chỗ đặt giường, bàn học và lối đi. Ghi lại vị trí cửa sổ, ổ cắm và hướng mở cửa để tránh mua món vừa kích thước nhưng bất tiện khi sử dụng. Chụp một ảnh tổng thể làm tài liệu đối chiếu lúc chọn đồ.\n\nKiểm kê những gì phòng đã có, tình trạng sử dụng và món nào thuộc về chủ nhà. Danh sách này giúp bạn tránh mua trùng quạt, bàn hoặc kệ. Nếu ở ghép, trao đổi trước về đồ dùng chung, người mua và cách chia chi phí.',
      },
      {
        title: 'Chuẩn bị đồ cho những ngày đầu',
        content:
          'Ưu tiên chỗ ngủ và vệ sinh cá nhân trước đồ trang trí. Bạn có thể bắt đầu với nệm phù hợp, ga, gối, chăn, khăn tắm, dép đi trong phòng và các vật dụng cá nhân đang dùng. Mang theo vài bộ quần áo dễ lấy để không phải mở hết thùng ngay tối đầu tiên.\n\nMột bộ vệ sinh cơ bản gồm chổi, dụng cụ lau, túi rác và khăn lau sẽ hữu ích khi nhận phòng. Chọn số lượng vừa đủ với diện tích. Đừng mua nhiều chai lọ chỉ vì có khuyến mãi nếu phòng chưa có nơi cất gọn.',
      },
      {
        title: 'Mua đồ học tập và bếp theo nhu cầu',
        content:
          'Với góc học tập, hãy ưu tiên bàn chắc, ghế phù hợp và đèn đủ dùng. Thử vị trí ngồi vào ban ngày trước khi quyết định mua thêm đèn hoặc rèm. Một chiếc hộp đựng dây sạc và khay tài liệu nhỏ thường đủ để bàn bớt bừa bộn.\n\nNếu được phép nấu ăn, bắt đầu bằng bát, đũa, thìa, một nồi và dụng cụ rửa. Kiểm tra chỗ đặt thiết bị và quy định của nhà trọ trước khi mua bếp. Nếu thường ăn ở trường, bạn có thể chưa cần một bộ dụng cụ đầy đủ. Mua theo bữa ăn thực tế sẽ dễ kiểm soát chi phí hơn.',
      },
      {
        title: 'Chia danh sách mua thành hai đợt',
        content:
          'Đợt đầu chỉ mua những món cần để ngủ, tắm, học và dọn phòng. Sau một hoặc hai tuần, ghi lại bất tiện xuất hiện thường xuyên rồi mới bổ sung kệ, hộp đựng hoặc đồ trang trí. Giữ lối đi thoáng và chọn món dễ di chuyển nếu bạn còn có thể đổi chỗ ở.\n\nTrước mỗi lần thanh toán, kiểm tra lại kích thước, tổng tiền gồm vận chuyển và điều kiện đổi trả. Đồ cũ có thể là lựa chọn tiết kiệm nếu bạn xem được tình trạng thực tế. Một căn phòng dễ sống bắt đầu từ những món được dùng mỗi ngày, không cần lấp đầy ngay trong lần mua đầu.',
      },
      {
        title: 'Kiểm tra lần cuối trước khi đặt mua',
        content:
          'Hãy gom danh sách vào một ghi chú có ba cột: tên món đồ, số lượng và mức tiền dự kiến. Đánh dấu món đã có ở nhà hoặc có thể mang theo. Trước khi mua thêm hộp đựng, thử xếp đồ vào tủ sẵn có để biết mình thực sự thiếu không gian ở đâu.\n\nNếu mua cùng bạn ở ghép, chọn một người tổng hợp đơn hàng để tránh đặt trùng. Khi nhận đồ, kiểm tra kích thước và phụ kiện trước khi bỏ bao bì. Cất hướng dẫn lắp ráp, hóa đơn và thông tin bảo hành vào cùng một chỗ. Sau vài ngày sử dụng, đổi vị trí những món hay dùng cho dễ lấy, rồi mới quyết định có cần mua thêm hay không.',
      },
    ],
  },
  {
    id: 'ngan-sach-sinh-vien',
    title: 'Một tháng ở trọ: lên ngân sách sao cho vừa đủ?',
    category: 'Đời sống sinh viên',
    excerpt:
      'Một cách đơn giản để theo dõi tiền phòng, sinh hoạt phí và dành lại một khoản cho bản thân.',
    imageUrl: '/images/room-2.jpg',
    date: '2026-10-15',
    readTime: 6,
    sections: [
      {
        title: 'Tính đủ tiền ở trước khi chia khoản chi',
        content:
          'Để lập ngân sách ở trọ, hãy bắt đầu bằng số tiền bạn thực sự có thể dùng mỗi tháng. Tách khoản gia đình hỗ trợ đều đặn khỏi thu nhập làm thêm thay đổi theo lịch học. Với phần thu nhập chưa chắc chắn, đừng vội dùng làm cơ sở cho một khoản thuê cố định quá cao. Bạn cần một mức chi có thể duy trì cả trong tháng ít ca làm.\n\nTiếp theo, liệt kê tiền phòng, mạng, gửi xe và các khoản phí cố định đã được thông báo. Điện nước nên dự kiến theo cách tính của nơi ở và mức sử dụng thực tế. Nếu chưa có dữ liệu, hỏi thêm thông tin rồi cập nhật sau tháng đầu. Ghi ngày đến hạn bên cạnh từng khoản để tránh quên khi lịch học dày.',
      },
      {
        title: 'Dành riêng ngân sách chuyển vào',
        content:
          'Tiền cọc và chi phí chuyển đồ nên được ghi ở một nhóm riêng, bởi chúng không phản ánh mức sinh hoạt của những tháng bình thường. Liệt kê cả đồ dùng còn thiếu như nệm, chăn, dụng cụ vệ sinh hoặc bàn học. Kiểm tra phòng đã có gì trước khi mua để tránh một món đồ xuất hiện hai lần trong ngân sách.\n\nBạn có thể chia danh sách thành cần ngay, có thể chờ và chỉ mua nếu còn dư. Cách chia này giúp buổi mua sắm đầu tiên bớt quá tay. Với đồ dùng chung, trao đổi trước về người thanh toán và quyền sử dụng khi một người chuyển đi. Những khoản được thống nhất sớm sẽ dễ theo dõi hơn vào cuối tháng.',
      },
      {
        title: 'Theo dõi một tuần sinh hoạt thật',
        content:
          'Thay vì đặt giới hạn cho mọi khoản ngay lập tức, hãy ghi lại một tuần chi tiêu thông thường. Tiền ăn, nước uống, đi lại, giặt đồ và giao hàng đều nên có mặt trong danh sách. Bạn chỉ cần một ghi chú trên điện thoại hoặc bảng tính với ngày, nội dung và số tiền. Chọn cách đủ đơn giản để có thể cập nhật mỗi tối.\n\nCuối tuần, xem khoản nào lặp lại nhiều và khoản nào chỉ phát sinh một lần. Đừng lấy một tuần có chuyến đi chơi làm đại diện cho cả tháng. Sau vài tuần, bạn sẽ có cơ sở thực tế hơn để điều chỉnh. Mục tiêu là hiểu tiền đi đâu, từ đó chọn điều đáng giữ và điều có thể giảm.',
      },
      {
        title: 'Tiết kiệm từ thói quen dễ duy trì',
        content:
          'Nếu chi ăn uống cao, thử chuẩn bị một vài bữa phù hợp lịch học thay vì ép mình nấu tất cả các ngày. Lên danh sách trước khi đi chợ và mua lượng thực phẩm có thể dùng hết. Khi phòng không có điều kiện bảo quản phù hợp, mua nhiều chưa chắc tiết kiệm vì bạn có thể phải bỏ đi phần chưa sử dụng.\n\nVới di chuyển, so sánh tổng tiền theo lịch đi học thực tế. Với mua sắm, dành một khoảng chờ trước khi đặt những món ngoài danh sách. Tắt thiết bị khi không dùng và trao đổi với người ở cùng về thói quen sử dụng đồ chung. Chọn một hoặc hai thay đổi dễ làm trước, rồi theo dõi xem chúng có giúp giảm chi mà vẫn thoải mái hay không.',
      },
      {
        title: 'Chốt sổ cùng người ở ghép mỗi tháng',
        content:
          'Nếu ở chung, hãy có một nơi ghi các khoản chung và thống nhất ngày đối chiếu. Lưu hóa đơn khi có thể, đánh dấu người đã ứng tiền và cách chia được cả nhóm đồng ý. Những khoản phục vụ riêng một người nên được trao đổi rõ trước khi đưa vào quỹ chung.\n\nCuối tháng, so số tiền thực chi với dự kiến và dành một phần phù hợp cho phát sinh. Nếu tháng này vượt ngân sách, tìm nguyên nhân cụ thể rồi sửa một thói quen trong tháng sau. Một kế hoạch vừa sức và được cập nhật đều sẽ hữu ích hơn con số đẹp nhưng khó duy trì.',
      },
      {
        title: 'Dành một buổi ngắn để lên kế hoạch tuần tới',
        content:
          'Chọn một thời điểm cố định cuối tuần để xem số tiền còn lại và những khoản sắp phải trả. Nhìn trước lịch học, lịch làm thêm và các cuộc hẹn giúp bạn dự kiến bữa ăn, chuyến đi hoặc khoản mua sắm cần thiết. Bạn có thể đặt riêng tiền sinh hoạt cho tuần tiếp theo để dễ quan sát mức chi.\n\nNếu còn dư, cân nhắc giữ lại cho tuần có nhiều việc thay vì lập tức mua thêm đồ. Nếu thiếu, điều chỉnh một khoản linh hoạt và ghi rõ lý do. Lặp lại thói quen này giúp bạn nhận ra thay đổi sớm, tránh dồn việc tính toán vào ngày cuối tháng.',
      },
    ],
  },
  {
    id: 'huong-dan-thue-tro-lan-dau',
    title: 'Hướng dẫn thuê trọ lần đầu: từ tìm phòng đến nhận chìa khóa',
    category: 'Hướng dẫn thuê trọ',
    excerpt:
      'Sáu bước để chuẩn bị ngân sách, xem phòng, làm rõ thỏa thuận và nhận bàn giao trước khi bắt đầu cuộc sống ở trọ.',
    imageUrl: '/images/room-1.jpg',
    date: '2026-10-25',
    readTime: 6,
    sections: [
      {
        title: 'Bước 1: Chốt nhu cầu và khoản tiền có thể dành cho chỗ ở',
        content:
          'Trước khi tìm phòng, hãy viết một danh sách ngắn về lịch học, thời gian đi lại chấp nhận được và những tiện nghi bạn cần mỗi ngày. Nếu học buổi tối hoặc thường làm thêm về muộn, giờ mở cửa và đường về là những thông tin nên hỏi ngay từ đầu. Nếu dự định nấu ăn, kiểm tra khu bếp thay vì chỉ chú ý chiếc giường trong ảnh.\n\nTiếp theo, xác định ngân sách cho cả tháng đầu và những tháng sau. Tháng đầu có thể gồm tiền phòng, tiền cọc, vận chuyển và đồ dùng còn thiếu. Những tháng sau cần tính thêm điện, nước, mạng, gửi xe và các phí dùng chung. Ghi khoản chưa biết thành câu hỏi cụ thể. Một bảng dự tính đủ các mục sẽ giúp bạn so sánh phòng bằng tổng chi phí, thay vì chỉ nhìn giá quảng cáo.',
      },
      {
        title: 'Bước 2: Sàng lọc tin đăng trước khi đặt lịch',
        content:
          'Khi thấy một tin phù hợp, hãy lưu lại đường dẫn, ảnh, mức giá và thông tin liên hệ để đối chiếu lúc đi xem. Hỏi rõ địa chỉ, loại phòng, diện tích được giới thiệu, nội thất có sẵn và thời điểm có thể chuyển vào. Xác nhận căn phòng hẹn xem có đúng là căn trong ảnh hay chỉ là một phòng tương tự.\n\nNếu câu trả lời liên tục thay đổi, bạn có thể tạm dừng và tìm lựa chọn khác. Những lời thúc giục chuyển tiền ngay để giữ giá không thay thế được việc xem phòng và làm rõ thông tin. Đặt lịch vào thời gian bạn đủ thong thả để quan sát, ưu tiên rủ một người quen đi cùng. Sắp xếp vài địa chỉ gần nhau trong cùng buổi sẽ giúp tiết kiệm công di chuyển mà vẫn có cơ sở so sánh.',
      },
      {
        title: 'Bước 3: Xem cả căn phòng và không gian sử dụng chung',
        content:
          'Đến nơi, hãy quan sát đường vào, khu để xe, hành lang và lối ra trước khi tập trung vào nội thất. Kiểm tra xem những khu vực đó có thuận tiện với sinh hoạt của mình không. Trong phòng, chú ý ánh sáng, khả năng mở cửa sổ, mùi ẩm và dấu thấm trên tường hoặc trần. Xin phép thử đèn, vòi nước, khóa cửa và các thiết bị được bàn giao.\n\nĐừng bỏ qua những chi tiết khó nhìn trong ảnh như tiếng ồn, độ riêng tư của cửa sổ hoặc vị trí phơi quần áo. Hỏi nơi đổ rác, giờ thu gom và cách sử dụng máy giặt chung nếu có. Khi phát hiện một điểm hỏng, ghi lại và hỏi thời gian xử lý dự kiến. Phân biệt rõ phần đã được sửa với phần mới chỉ được hứa sửa để tránh tự hiểu rằng mọi thứ sẽ sẵn sàng trước ngày chuyển vào.',
      },
      {
        title: 'Bước 4: Hỏi đủ các khoản phí và quy định sinh hoạt',
        content:
          'Chuẩn bị một danh sách câu hỏi cố định cho mọi nơi bạn xem: tiền thuê, cách tính điện nước, phí mạng, phí xe, phí vệ sinh và ngày thanh toán. Hỏi cách ghi chỉ số, cách nhận thông báo và người liên hệ khi có chênh lệch. Nếu có khoản thu theo người hoặc theo phòng, ghi đúng đơn vị để tránh tính nhầm tổng tiền.\n\nVề sinh hoạt, làm rõ giờ ra vào, khách đến chơi, nấu ăn, nuôi thú cưng và số người ở. Nếu ở ghép, trao đổi cả việc chia đồ dùng, giữ vệ sinh và lịch nghỉ ngơi với người sẽ sống cùng. Đừng ngại hỏi lại điều chưa hiểu. Một căn phòng phù hợp cần đáp ứng nhịp sống thực tế của bạn, và những quy định rõ từ đầu sẽ giúp việc trao đổi sau này dễ dàng hơn.',
      },
      {
        title: 'Bước 5: Làm rõ thỏa thuận trước khi thanh toán',
        content:
          'Trước khi trả tiền, dành thời gian đọc bản thỏa thuận được đưa cho bạn. Đối chiếu địa chỉ phòng, thông tin các bên, số tiền, thời gian thuê, ngày nhận phòng và những khoản phí đã trao đổi. Đặc biệt, hỏi rõ điều kiện liên quan đến tiền cọc, việc kết thúc thuê sớm và cách báo trước khi chuyển đi. Nếu nội dung khác lời giới thiệu, đề nghị làm rõ bằng văn bản trước khi quyết định.\n\nXác nhận người đang nhận tiền có vai trò gì đối với phòng và đối chiếu thông tin người nhận với nội dung đã thống nhất. Khi thanh toán, ghi rõ mục đích, căn phòng và khoản tiền tương ứng; lưu xác nhận hoặc biên nhận. Nếu có thông tin chưa khớp, bạn có thể dừng để kiểm tra thêm. Không cần quyết định chỉ vì đã dành nhiều thời gian đi xem hoặc vì người khác đang chờ câu trả lời.',
      },
      {
        title: 'Bước 6: Nhận phòng có ghi nhận hiện trạng',
        content:
          'Ngày nhận phòng, đi một vòng cùng người bàn giao để kiểm kê chìa khóa, đồ nội thất và thiết bị. Ghi tình trạng từng món, chụp ảnh khi được đồng ý và lưu chỉ số điện nước tại thời điểm nhận. Với phần còn chờ sửa, ghi rõ đầu việc, người liên hệ và thời gian dự kiến thay vì chỉ nhớ cuộc trao đổi.\n\nCuối cùng, tập hợp thông tin phòng, bản thỏa thuận và xác nhận thanh toán vào một thư mục dễ tìm. Chia sẻ địa chỉ mới với người thân hoặc người bạn tin tưởng. Những bước chuẩn bị này giúp bạn bắt đầu cuộc sống ở trọ chủ động hơn, đồng thời có thông tin rõ ràng để đối chiếu khi cần trao đổi về sau.',
      },
    ],
  },
]

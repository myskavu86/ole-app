// Bộ nội dung thử nghiệm cho sản phẩm A (tiếng Anh công sở).
// Bản nháp do AI soạn, cần người giỏi tiếng Anh duyệt trước khi phát hành.
// type "qa": tình huống hỏi đáp. type "odd": câu nào nghe kỳ. type "story": chuỗi truyện.
window.CONTENT = {
  packs: [
    { id: 'chung', name: 'Chung' },
    { id: 'xnk', name: 'Xuất nhập khẩu' },
    { id: 'it', name: 'IT' },
    { id: 'bank', name: 'Ngân hàng' },
    { id: 'dulich', name: 'Du lịch' }
  ],
  items: [
    // ---------- Gói chung ----------
    { type: 'qa', pack: 'chung', group: 'Xin lùi hạn', from: 'Sếp nhắn qua email', quote: 'Can you get this done by Friday?', answers: [
      { tag: 'Đồng ý', en: 'Sure, I’ll have it ready by Friday.', note: '“have it ready” nghe chắc chắn hơn “finish it”.' },
      { tag: 'Xin lùi hạn', en: 'Would Monday morning work instead? I want to double-check the figures.', note: 'Đưa ra hạn mới kèm lý do, không chỉ nói “I can’t”.' },
      { tag: 'Từ chối khéo', en: 'I’m afraid that’s tight with my current workload. Could we reprioritise?', note: '“I’m afraid” làm mềm lời từ chối.' } ] },
    { type: 'qa', pack: 'chung', group: 'Họp', from: 'Đồng nghiệp hỏi trong cuộc họp', quote: 'Any thoughts on this proposal?', answers: [
      { tag: 'Đồng tình', en: 'I think it’s a solid plan, especially the timeline.', note: 'Nêu cụ thể điểm mình thích.' },
      { tag: 'Góp ý nhẹ', en: 'It looks good overall. One thing I’d reconsider is the budget.', note: 'Khen trước, góp ý sau.' },
      { tag: 'Xin thêm thời gian', en: 'Could I get back to you after I’ve looked at the numbers?', note: '“get back to you” nghĩa là trả lời sau.' } ] },
    { type: 'qa', pack: 'chung', group: 'Xin lỗi', from: 'Khách trả lời email của bạn', quote: 'I don’t see the attachment.', answers: [
      { tag: 'Ngắn gọn', en: 'Apologies, here it is.', note: 'Đủ dùng với người đã quen.' },
      { tag: 'Trang trọng', en: 'Sorry about that. Please find the file attached.', note: '“Please find … attached” là mẫu chuẩn trong email.' },
      { tag: 'Thân thiện', en: 'My mistake! I’ve attached it to this email.', note: '“My mistake” nhận lỗi nhẹ nhàng.' } ] },
    { type: 'qa', pack: 'chung', group: 'Nhận lỗi', from: 'Sếp hỏi trực tiếp', quote: 'Why wasn’t I told about this earlier?', answers: [
      { tag: 'Nhận lỗi', en: 'You’re right, I should have flagged it sooner.', note: '“flag” nghĩa là báo trước một vấn đề.' },
      { tag: 'Giải thích', en: 'I wanted to confirm the facts first, but I should have given you a heads-up.', note: '“heads-up” là lời báo trước.' },
      { tag: 'Hướng tới giải pháp', en: 'I apologise. Here’s where we stand and what I suggest next.', note: 'Chuyển nhanh sang việc cần làm.' } ] },
    { type: 'qa', pack: 'chung', group: 'Nhờ việc', from: 'Đồng nghiệp nước ngoài nhắn', quote: 'Could you cover for me tomorrow? I have a doctor’s appointment.', answers: [
      { tag: 'Đồng ý', en: 'Of course. Just send me what needs to be done.', note: '“cover for” nghĩa là làm thay.' },
      { tag: 'Đồng ý một phần', en: 'I can cover the morning, but I have a meeting at 2.', note: 'Nói rõ phần mình giúp được.' },
      { tag: 'Từ chối khéo', en: 'I wish I could, but I’m fully booked tomorrow. Have you asked Minh?', note: 'Từ chối kèm gợi ý người khác.' } ] },
    { type: 'qa', pack: 'chung', group: 'Họp', from: 'Họp online, tiếng bị rè đúng lúc quan trọng', quote: '…so we’ll move the deadline to, uh…', answers: [
      { tag: 'Xin nhắc lại', en: 'Sorry, you broke up for a second. Could you repeat the last part?', note: '“you broke up” nghĩa là tiếng bị ngắt quãng.' },
      { tag: 'Xác nhận lại', en: 'Just to confirm, did you say the deadline is moving?', note: 'Nhắc lại điều mình nghe được để kiểm tra.' },
      { tag: 'Nhờ viết ra', en: 'Could you put that in the chat, please?', note: 'Hữu ích khi đường truyền kém.' } ] },

    // ---------- Xuất nhập khẩu ----------
    { type: 'qa', pack: 'xnk', group: 'Hàng trễ', from: 'Khách hàng hỏi qua chat', quote: 'Why is the shipment delayed again?', answers: [
      { tag: 'Xin lỗi và giải thích', en: 'I’m sorry for the delay. The vessel was held at port for inspection.', note: 'Xin lỗi trước, lý do sau, câu ngắn.' },
      { tag: 'Đưa mốc thời gian', en: 'The new ETA is 20 November. I’ll confirm once it clears customs.', note: 'ETA là ngày dự kiến đến.' },
      { tag: 'Đề xuất đền bù', en: 'To make up for this, we can waive the handling fee on this order.', note: '“make up for” nghĩa là bù đắp.' } ] },
    { type: 'qa', pack: 'xnk', group: 'Báo giá', from: 'Khách hàng mới gửi email', quote: 'Could you send us your best price for 5,000 units?', answers: [
      { tag: 'Báo giá ngay', en: 'Thank you for your enquiry. Our best price is USD 4.20 per unit, FOB Hai Phong.', note: 'FOB: giá giao hàng lên tàu tại cảng đi.' },
      { tag: 'Hỏi thêm', en: 'Happy to quote. Could you confirm the delivery terms and destination port?', note: 'Hỏi điều kiện giao hàng trước khi báo giá.' },
      { tag: 'Hẹn gửi sau', en: 'We’ll send you a formal quotation by tomorrow.', note: '“quotation” là bảng báo giá chính thức.' } ] },
    { type: 'qa', pack: 'xnk', group: 'Chứng từ', from: 'Khách hàng gửi email', quote: 'The invoice doesn’t match the packing list.', answers: [
      { tag: 'Nhận và sửa', en: 'Thank you for pointing that out. We’ll send a corrected invoice today.', note: 'Cảm ơn trước, cam kết thời điểm sửa.' },
      { tag: 'Xin chi tiết', en: 'Could you tell us which line items differ?', note: '“line items” là từng dòng hàng trên hóa đơn.' },
      { tag: 'Giải thích', en: 'The difference is due to two cartons shipped separately. I’ll resend both documents.', note: '“due to” dùng để nêu nguyên nhân.' } ] },
    { type: 'qa', pack: 'xnk', group: 'Thương lượng giá', from: 'Khách hàng nói trong cuộc gọi', quote: 'Can you lower the price by 10%?', answers: [
      { tag: 'Từ chối khéo', en: 'I’m afraid 10% is beyond what we can offer at this volume.', note: '“beyond what we can offer”: vượt mức có thể.' },
      { tag: 'Đổi điều kiện', en: 'We could offer 5% if you increase the order to 8,000 units.', note: 'Giảm giá đổi lấy số lượng.' },
      { tag: 'Xin thời gian', en: 'Let me discuss this with my manager and get back to you by Thursday.', note: 'Nêu rõ ngày sẽ trả lời.' } ] },
    { type: 'qa', pack: 'xnk', group: 'Đặt tàu', from: 'Forwarder báo tin', quote: 'The vessel is fully booked. The next sailing is on the 28th.', answers: [
      { tag: 'Hỏi phương án khác', en: 'Are there any other carriers sailing this week?', note: '“carrier” là hãng vận chuyển.' },
      { tag: 'Chấp nhận', en: 'Understood. Please book us on the 28th and send the booking confirmation.', note: '“Understood” gọn hơn “I understand”.' },
      { tag: 'Thúc nhẹ', en: 'That’s too late for our customer. Could you check for space on an earlier vessel?', note: 'Nêu lý do rồi mới đề nghị.' } ] },

    // ---------- IT ----------
    { type: 'qa', pack: 'it', group: 'Ước lượng', from: 'Quản lý dự án hỏi', quote: 'When can you finish this feature?', answers: [
      { tag: 'Ước lượng', en: 'I estimate three days, assuming the API is ready.', note: '“assuming” nêu điều kiện đi kèm.' },
      { tag: 'Chưa chắc', en: 'I need to look into it first. Can I give you an estimate by end of day?', note: 'Không đoán bừa, hẹn giờ trả lời.' },
      { tag: 'Cảnh báo rủi ro', en: 'About a week. The main risk is the payment integration.', note: 'Nêu rủi ro lớn nhất ngay từ đầu.' } ] },
    { type: 'qa', pack: 'it', group: 'Làm rõ yêu cầu', from: 'Khách hàng xem bản demo', quote: 'This isn’t what we asked for.', answers: [
      { tag: 'Hỏi cụ thể', en: 'I’m sorry to hear that. Could you show me which part differs from what you expected?', note: 'Hỏi cụ thể trước khi giải thích.' },
      { tag: 'Đối chiếu', en: 'Let’s go through the requirements together to see where the gap is.', note: '“gap” là chỗ chênh lệch.' },
      { tag: 'Đề xuất', en: 'Understood. I’ll list the differences and propose a fix by tomorrow.', note: 'Cam kết việc và thời hạn.' } ] },
    { type: 'qa', pack: 'it', group: 'Đổi phạm vi', from: 'Khách hàng nhắn giữa sprint', quote: 'Can you also add an export-to-Excel button? It should be quick.', answers: [
      { tag: 'Giữ phạm vi', en: 'That’s outside the current scope. We can add it as a change request.', note: '“change request” là yêu cầu thay đổi chính thức.' },
      { tag: 'Đồng ý kèm đánh đổi', en: 'We can, but it would push the release back by two days.', note: '“push back” nghĩa là lùi lịch.' },
      { tag: 'Hẹn đánh giá', en: 'Let me check the effort and get back to you.', note: '“effort” là công sức cần bỏ ra.' } ] },
    { type: 'qa', pack: 'it', group: 'Báo lỗi', from: 'Tester nhắn gấp', quote: 'The login page is broken on production!', answers: [
      { tag: 'Xác nhận', en: 'Thanks for flagging it. I’m looking into it now.', note: 'Cho người báo biết bạn đã nhận.' },
      { tag: 'Xin thông tin', en: 'Could you share the steps to reproduce and a screenshot?', note: '“steps to reproduce”: các bước tái hiện lỗi.' },
      { tag: 'Cập nhật', en: 'We’ve found the cause and are rolling back the last release.', note: '“roll back” nghĩa là quay về bản trước.' } ] },
    { type: 'qa', pack: 'it', group: 'Báo tiến độ', from: 'Họp đầu ngày', quote: 'What did you work on yesterday?', answers: [
      { tag: 'Đúng tiến độ', en: 'Yesterday I finished the search API. Today I’ll start on the tests.', note: 'Hôm qua xong gì, hôm nay làm gì.' },
      { tag: 'Bị vướng', en: 'I’m blocked on the staging database. I need access from DevOps.', note: '“blocked on” nghĩa là bị kẹt vì.' },
      { tag: 'Còn dang dở', en: 'I’m still working on the report page. It should be done by tomorrow.', note: '“should be done by” ước lượng hạn xong.' } ] },

    // ---------- Ngân hàng ----------
    { type: 'qa', pack: 'bank', group: 'Phí', from: 'Khách nước ngoài tại quầy', quote: 'Why was I charged this fee?', answers: [
      { tag: 'Kiểm tra', en: 'Let me check that for you. This is the monthly account maintenance fee.', note: '“Let me check that for you” lịch sự và chủ động.' },
      { tag: 'Đồng cảm', en: 'I understand your concern. May I see your statement?', note: '“statement” là sao kê.' },
      { tag: 'Giải thích', en: 'The fee applies when the balance falls below the minimum. I can show you how to avoid it.', note: '“falls below” nghĩa là xuống dưới mức.' } ] },
    { type: 'qa', pack: 'bank', group: 'Chuyển tiền', from: 'Khách hàng gọi điện', quote: 'My transfer hasn’t arrived yet.', answers: [
      { tag: 'Xin mã giao dịch', en: 'I’m sorry for the inconvenience. Could you give me the transaction reference number?', note: '“reference number” là mã tham chiếu.' },
      { tag: 'Nêu thời gian', en: 'International transfers usually take two to three business days.', note: '“business days” là ngày làm việc.' },
      { tag: 'Cam kết', en: 'I’ll trace the payment and update you by tomorrow.', note: '“trace” nghĩa là tra soát.' } ] },
    { type: 'qa', pack: 'bank', group: 'Giải trình', from: 'Kiểm toán viên hỏi', quote: 'Can you explain this variance in the March figures?', answers: [
      { tag: 'Giải thích', en: 'The variance is mainly due to a one-off provision booked in March.', note: '“one-off provision”: khoản dự phòng một lần.' },
      { tag: 'Xin thời gian', en: 'Let me verify the figures and come back to you this afternoon.', note: 'Kiểm tra trước khi trả lời về số liệu.' },
      { tag: 'Gửi chứng từ', en: 'I’ll send you the supporting documents.', note: '“supporting documents” là chứng từ kèm theo.' } ] },
    { type: 'qa', pack: 'bank', group: 'Tín dụng', from: 'Khách hàng doanh nghiệp', quote: 'We’d like to apply for a credit line.', answers: [
      { tag: 'Xin hồ sơ', en: 'Certainly. Could you provide your financial statements for the last two years?', note: '“financial statements” là báo cáo tài chính.' },
      { tag: 'Hỏi mục đích', en: 'I’d be glad to help. May I ask what the facility will be used for?', note: '“facility” là hạn mức tín dụng.' },
      { tag: 'Hẹn gửi', en: 'I’ll send you the list of required documents today.', note: 'Nêu rõ việc sẽ làm trong ngày.' } ] },
    { type: 'qa', pack: 'bank', group: 'Báo cáo', from: 'Hội sở nước ngoài nhắn', quote: 'We need the report by end of day. Is that feasible?', answers: [
      { tag: 'Đồng ý', en: 'Yes, you’ll have it by 5 p.m.', note: 'Nêu giờ cụ thể thay cho “end of day”.' },
      { tag: 'Đưa một phần', en: 'The full report isn’t feasible today, but I can send the key figures by 5.', note: 'Đề xuất phần có thể làm được.' },
      { tag: 'Xin lùi hạn', en: 'Could we have until tomorrow noon? We’re still reconciling two accounts.', note: '“reconcile” nghĩa là đối chiếu.' } ] },

    // ---------- Du lịch ----------
    { type: 'qa', pack: 'dulich', group: 'Phàn nàn', from: 'Khách tại quầy lễ tân', quote: 'Our room isn’t ready yet. We’ve been waiting for an hour.', answers: [
      { tag: 'Xin lỗi', en: 'I do apologise for the wait. Let me check with housekeeping right away.', note: '“I do apologise” nhấn mạnh lời xin lỗi.' },
      { tag: 'Mời chờ', en: 'May I offer you a drink in the lounge while we prepare your room?', note: 'Đề nghị một điều dễ chịu trong lúc chờ.' },
      { tag: 'Cam kết', en: 'Your room will be ready in 15 minutes. We’ll bring your luggage up for you.', note: 'Nêu thời gian cụ thể.' } ] },
    { type: 'qa', pack: 'dulich', group: 'Đổi lịch', from: 'Khách gửi email', quote: 'Can we change our booking to next week?', answers: [
      { tag: 'Đồng ý', en: 'Certainly. Let me check availability for those dates.', note: '“availability” là tình trạng còn phòng.' },
      { tag: 'Có phụ phí', en: 'We can change it, but there’s a rate difference of 20 dollars per night.', note: '“rate difference” là chênh lệch giá.' },
      { tag: 'Hết phòng', en: 'I’m afraid we’re fully booked next week. Would the week after work for you?', note: 'Từ chối kèm phương án khác.' } ] },
    { type: 'qa', pack: 'dulich', group: 'Tư vấn', from: 'Khách hỏi lễ tân', quote: 'What do you recommend we do tomorrow?', answers: [
      { tag: 'Gợi ý', en: 'If you like nature, I’d recommend the boat trip in Ninh Binh.', note: '“I’d recommend” nhẹ nhàng hơn “You should”.' },
      { tag: 'Hỏi sở thích', en: 'What are you interested in: food, history or nature?', note: 'Hỏi trước khi gợi ý.' },
      { tag: 'Đề nghị đặt giúp', en: 'I can arrange a half-day city tour with an English-speaking guide.', note: '“arrange” nghĩa là thu xếp.' } ] },
    { type: 'qa', pack: 'dulich', group: 'Sự cố', from: 'Khách gọi xuống lễ tân', quote: 'The air conditioner in my room isn’t working.', answers: [
      { tag: 'Xử lý ngay', en: 'I’m sorry about that. I’ll send a technician right away.', note: '“right away” nghĩa là ngay lập tức.' },
      { tag: 'Đổi phòng', en: 'Would you like to move to another room?', note: 'Đưa ra lựa chọn cho khách.' },
      { tag: 'Hẹn giờ', en: 'It should be fixed within 30 minutes. I’ll call you once it’s done.', note: '“once it’s done”: ngay khi xong.' } ] },
    { type: 'qa', pack: 'dulich', group: 'Tạm biệt', from: 'Khách lúc trả phòng', quote: 'We had a wonderful stay.', answers: [
      { tag: 'Cảm ơn', en: 'We’re so glad to hear that. Thank you for staying with us.', note: 'Câu đáp chuẩn khi được khen.' },
      { tag: 'Hẹn gặp lại', en: 'It was our pleasure. We hope to welcome you back soon.', note: '“welcome you back” là đón khách quay lại.' },
      { tag: 'Xin đánh giá', en: 'Thank you! If you have a moment, we’d really appreciate a review online.', note: '“If you have a moment” làm lời nhờ nhẹ đi.' } ] },

    // ---------- Câu nào nghe kỳ ----------
    { type: 'odd', pack: 'chung', context: 'Bạn muốn nhờ đồng nghiệp gửi lại file.', odd: 1, texts: ['Could you send me the file again?', 'Please kindly send me the file again.', 'Would you mind resending the file?'], why: '“Please kindly” bị thừa: chỉ cần một trong hai từ. Viết cả hai nghe cứng và giống ra lệnh.' },
    { type: 'odd', pack: 'chung', context: 'Bạn muốn nói mình rất thích đề xuất này.', odd: 0, texts: ['I very like this proposal.', 'I really like this proposal.', 'This proposal looks great to me.'], why: '“very” không đứng trước động từ. Dùng “really like” hoặc “like … very much”.' },
    { type: 'odd', pack: 'chung', context: 'Bạn hẹn sẽ trả lời khách hàng sau.', odd: 2, texts: ['I’ll get back to you by tomorrow.', 'Let me check and reply by tomorrow.', 'I will revert back to you tomorrow.'], why: '“revert” nghĩa là quay về trạng thái cũ, không phải trả lời. Dùng “get back to you”.' },
    { type: 'odd', pack: 'chung', context: 'Bạn muốn rủ cả nhóm bàn về kế hoạch.', odd: 0, texts: ['Let’s discuss about the plan.', 'Let’s discuss the plan.', 'Let’s talk about the plan.'], why: '“discuss” không đi với “about”. Nói “discuss the plan” hoặc “talk about the plan”.' },
    { type: 'odd', pack: 'chung', context: 'Bạn báo đã gửi kèm báo cáo.', odd: 2, texts: ['Please find the report attached.', 'I’ve attached the report.', 'I enclosed the report in attached file.'], why: 'Thiếu mạo từ “the” trước “attached file”, và “enclosed” thường dùng cho thư giấy.' },
    { type: 'odd', pack: 'chung', context: 'Bạn hẹn sẽ trả lời sớm.', odd: 0, texts: ['I’ll reply you soon.', 'I’ll reply to you soon.', 'I’ll get back to you soon.'], why: '“reply” cần giới từ “to”: reply to you.' },
    { type: 'odd', pack: 'chung', context: 'Bạn muốn nói mình đồng ý.', odd: 1, texts: ['I agree with you.', 'I’m agree with you.', 'I think you’re right.'], why: '“agree” là động từ, không dùng với “am”. Nói “I agree”.' },
    { type: 'odd', pack: 'chung', context: 'Bạn kết thư, mong nhận phản hồi.', odd: 1, texts: ['I look forward to hearing from you.', 'I look forward to hear from you.', 'I hope to hear from you soon.'], why: 'Sau “look forward to” là động từ thêm -ing: hearing.' },

    // ---------- Chuỗi truyện ----------
    { type: 'story', pack: 'xnk', title: 'Lô hàng kẹt ở cảng', episodes: [
      { day: 'Thứ Hai', recap: 'Đơn hàng lớn nhất quý vừa lên tàu thì có tin xấu.', from: 'Forwarder báo', quote: 'Your container has been held at the port for inspection.', answers: [
        { tag: 'Hỏi thời gian', en: 'How long is the inspection expected to take?', note: '“is expected to” hỏi về dự kiến.' },
        { tag: 'Hỏi lý do', en: 'Could you tell us the reason for the inspection?', note: 'Câu hỏi gián tiếp lịch sự hơn “Why?”.' },
        { tag: 'Yêu cầu cập nhật', en: 'Please keep us updated daily. Our customer is waiting.', note: '“keep us updated” nghĩa là cập nhật thường xuyên.' } ] },
      { day: 'Thứ Ba', recap: 'Container bị giữ để kiểm tra, chưa rõ bao lâu.', from: 'Khách hàng Daniel viết', quote: 'Why is the shipment delayed again?', answers: [
        { tag: 'Xin lỗi và giải thích', en: 'I’m sorry for the delay. The container was held at port for inspection.', note: 'Xin lỗi trước, lý do sau.' },
        { tag: 'Đưa mốc thời gian', en: 'We expect it to be released within a week. I’ll confirm the new ETA.', note: '“released” nghĩa là được thông quan, thả hàng.' },
        { tag: 'Trấn an', en: 'I’m following this closely and will update you every day.', note: '“following closely” là theo sát.' } ] },
      { day: 'Thứ Tư', recap: 'Hàng trễ một tuần. Sếp dặn: bằng mọi giá phải giữ được khách này.', from: 'Khách hàng Daniel viết', quote: 'We need compensation, or we’ll have to look at other suppliers.', answers: [
        { tag: 'Xoa dịu', en: 'I completely understand your frustration, and I want to make this right.', note: '“make this right” nghĩa là khắc phục cho thỏa đáng.' },
        { tag: 'Đề xuất', en: 'We’d like to offer a 3% discount on this order as compensation.', note: '“as compensation” nghĩa là để đền bù.' },
        { tag: 'Xin thời gian', en: 'Please give me until tomorrow to come back with a concrete proposal.', note: '“concrete proposal” là đề xuất cụ thể.' } ] },
      { day: 'Thứ Năm', recap: 'Bạn đã hứa với khách sẽ có đề xuất đền bù.', from: 'Sếp người nước ngoài nói', quote: 'Three percent is too much. Find another way.', answers: [
        { tag: 'Đề xuất khác', en: 'What if we cover the freight cost on their next order instead?', note: '“What if …?” mở đầu một đề xuất.' },
        { tag: 'Bảo vệ ý kiến', en: 'I understand, but losing this customer would cost us far more.', note: 'Đồng cảm trước, phản biện sau.' },
        { tag: 'Xin định hướng', en: 'What would you be comfortable offering?', note: '“comfortable offering”: mức có thể chấp nhận.' } ] },
      { day: 'Thứ Sáu', recap: 'Sếp đồng ý miễn cước vận chuyển cho đơn sau.', from: 'Khách hàng Daniel viết', quote: 'Free freight on the next order works for us. When will the goods arrive?', answers: [
        { tag: 'Chốt thông tin', en: 'The container was released this morning. The new ETA is 24 November.', note: 'Tin tốt trước, mốc thời gian sau.' },
        { tag: 'Cảm ơn', en: 'Thank you for your patience. We truly value your business.', note: 'Câu chuẩn để giữ quan hệ sau sự cố.' },
        { tag: 'Cam kết', en: 'I’ll personally track this shipment and update you every two days.', note: '“personally” cho thấy bạn trực tiếp chịu trách nhiệm.' } ] }
    ] }
  ]
};

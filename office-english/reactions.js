// Câu đáp lại của người đối diện sau khi người dùng chọn câu trả lời.
// qa: theo ĐÚNG THỨ TỰ các mục type "qa" trong content.js, mỗi mục 3 câu ứng với 3 answers.
// story: theo thứ tự các tập của chuỗi truyện đầu tiên.
// Bản nháp do AI soạn, cần người duyệt.
window.REACTIONS = {
  qa: [
    // Chung
    ['Great, thanks. I’ll let the client know.', 'Monday morning is fine. Thanks for checking the figures.', 'Fair point. Let’s look at your priorities together.'],
    ['Good to hear. I’ll keep the timeline as it is.', 'Good catch. Let’s review the budget on Thursday.', 'Sure, take your time.'],
    ['Got it, thanks!', 'Received. Thank you.', 'No worries, I have it now.'],
    ['Thank you for owning it. What’s the status now?', 'I see. Next time, tell me early, even if it’s not confirmed.', 'OK. Walk me through it.'],
    ['You’re a lifesaver. I’ll send the list tonight.', 'The morning would be a huge help. Thank you!', 'No problem, I’ll ask Minh. Thanks anyway.'],
    ['Sure. We’re moving the deadline to the 30th.', 'Yes, that’s right. It’s now the 30th.', 'Of course. Typing it now.'],
    // Xuất nhập khẩu
    ['I see. Please keep me posted.', 'OK, the 20th. Please make sure it doesn’t slip again.', 'We appreciate that. Thank you.'],
    ['Thanks. Is that price valid for 30 days?', 'FOB, shipped to Hamburg.', 'Great, we’ll wait for it.'],
    ['Thank you. We need it for customs clearance.', 'Lines 3 and 7. The quantities are different.', 'That explains it. Thanks for clarifying.'],
    ['I understand. What can you offer, then?', '8,000 units… let me check with my team.', 'Thursday works. We look forward to your answer.'],
    ['Let me check. One carrier has space on the 22nd.', 'Done. I’ll send the confirmation shortly.', 'I’ll ask, but I can’t promise anything.'],
    // IT
    ['Three days works. I’ll tell the client.', 'Sure. End of day is fine.', 'Good to know. Let’s plan for that risk.'],
    ['The dashboard. We expected filters by region.', 'Good idea. Do you have time now?', 'Thank you. Tomorrow is fine.'],
    ['OK, please send us the change request.', 'Hmm. Let’s keep the release date, then.', 'Thanks. Let me know by tomorrow.'],
    ['Thanks! Users are already complaining.', 'Sending them now.', 'Great. Let me know when it’s back.'],
    ['Nice work. Anything blocking you?', 'I’ll ping DevOps right after this call.', 'OK. Shout if you need help.'],
    // Ngân hàng
    ['Oh, I didn’t know there was a monthly fee.', 'Sure, here it is.', 'That would be helpful, thank you.'],
    ['Yes, it’s FT2311-0458.', 'It’s been four days already.', 'Thank you. Please call me when you know.'],
    ['Understood. Can I see the provision calculation?', 'This afternoon is fine.', 'Thank you. That will speed things up.'],
    ['Of course. I’ll email them today.', 'Mainly for working capital.', 'Perfect. We’ll prepare them this week.'],
    ['Perfect, thank you.', 'The key figures will do for now.', 'Noon tomorrow is the latest we can accept.'],
    // Du lịch
    ['Thank you. We’re very tired after the flight.', 'That would be nice, thank you.', 'All right. Fifteen minutes is fine.'],
    ['Thank you! The 20th to the 23rd, please.', 'That’s fine. Please go ahead.', 'Hmm, let me talk to my wife first.'],
    ['A boat trip sounds lovely! How do we book?', 'We love food. Any street food tours?', 'Half a day is perfect. What time does it start?'],
    ['Thank you. It’s really hot in here.', 'Yes, please. That would be easier.', 'OK, I’ll wait. Thank you.'],
    ['Thank you. The staff were lovely.', 'We’d love to come back next year.', 'Sure, I’ll write one tonight.']
  ],
  story: [
    ['Usually three to five working days.', 'It’s a random customs check. Nothing to worry about yet.', 'Will do. I’ll email you every morning.'],
    ['Inspection again? This is the second time this year.', 'A week is a long time for us.', 'Please do. Our warehouse is waiting.'],
    ['I appreciate that. But we need something concrete.', 'Three percent… I’ll take it to my manager.', 'Fine. Tomorrow, then.'],
    ['Hmm. That could work. Put it in writing.', 'That’s a fair point. Give me a cheaper option, though.', 'Something that doesn’t hurt our margin on this order.'],
    ['The 24th. Good. Thanks for sorting this out.', 'Likewise. Let’s make the next one smoother.', 'That would be great. Thank you.']
  ]
};

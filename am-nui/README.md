# Am Núi

Trò chơi luyện tự suy nghĩ: mỗi ngày lên một ngọn núi 3D, gõ chuông, vào am và tự trả lời một công án (tình huống đời thường). Sư thầy không đưa đáp án, chỉ hỏi ngược lại.

Đây là bản thử chạy hoàn toàn trên trình duyệt, không có máy chủ. Câu trả lời chỉ lưu trong trình duyệt của người chơi.

## Chạy thử

Chỉ phần giao diện (thầy dùng câu hỏi soạn sẵn):

```bash
python3 -m http.server 8000
```

Đầy đủ, có thầy AI và thống kê lựa chọn:

```bash
python3 -m venv .venv && .venv/bin/pip install -r server/requirements.txt
```

```bash
ANTHROPIC_API_KEY=... .venv/bin/python server/server.py --static . --port 8000
```

Sau đó mở http://localhost:8000.

## Các tệp

- `index.html`, `style.css`: khung trang và giao diện.
- `world.js`: cảnh 3D (núi, đường bậc đá, lầu chuông, đèn đá, am, sư thầy).
- `game.js`: luật chơi, lưu tiến trình, thẻ chia sẻ, gọi máy chủ.
- `koans.js`: nội dung 10 công án.
- `three.module.min.js`: thư viện three.js r160 (giấy phép MIT, xem `three.LICENSE`).
- `server/server.py`: máy chủ nhỏ. `/api/master` cho sư thầy (Claude) hỏi vặn theo đúng lời người chơi, `/api/choice` đếm số người chọn mỗi đường.
- `server/DEPLOY.md`: cách cài máy chủ lên VPS.

## Máy chủ

Không có máy chủ thì game vẫn chạy: thầy dùng câu hỏi soạn sẵn và không có thống kê. Khi có máy chủ và khóa API:

- Thầy đọc câu trả lời của người chơi và hỏi vặn lại hai lượt. Thầy chỉ hỏi, không đưa lời khuyên.
- Người chơi có thể mang chuyện thật của mình lên: thầy hỏi ba lượt, người chơi tự viết quyết định.
- Sau khi chọn đường, hiện tỉ lệ người chơi khác cùng chọn.

Máy chủ không lưu nội dung người chơi viết; chỉ lưu đường đã chọn kèm một mã ngẫu nhiên của trình duyệt. Biến môi trường: `ANTHROPIC_API_KEY` (bắt buộc để có thầy AI), `AMNUI_MODEL` (mặc định `claude-opus-5-5`), `AMNUI_PER_IP_DAILY` (mặc định 40 lượt hỏi mỗi IP mỗi ngày), `AMNUI_GLOBAL_DAILY` (mặc định 3000 lượt cả trang mỗi ngày).

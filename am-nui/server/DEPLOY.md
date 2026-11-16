# Cài máy chủ Am Núi lên VPS (Ubuntu + Nginx)

Giả định game đã nằm ở `/var/www/amnui` và Nginx đã phục vụ tên miền. Chạy bằng `root`.

1. Lấy code mới:

   ```bash
   git -C /var/www/amnui pull
   ```

2. Tạo môi trường Python và cài thư viện:

   ```bash
   apt install -y python3-venv
   ```

   ```bash
   python3 -m venv /opt/amnui-venv && /opt/amnui-venv/bin/pip install -r /var/www/amnui/server/requirements.txt
   ```

3. Tạo thư mục lưu thống kê:

   ```bash
   mkdir -p /var/lib/amnui && chown www-data:www-data /var/lib/amnui
   ```

4. Đặt khóa API vào một tệp chỉ root đọc được (thay `sk-ant-...` bằng khóa thật):

   ```bash
   install -m 600 /dev/null /etc/amnui.env && nano /etc/amnui.env
   ```

   Nội dung tệp:

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

5. Cài và bật dịch vụ:

   ```bash
   cp /var/www/amnui/server/amnui-api.service /etc/systemd/system/ && systemctl daemon-reload && systemctl enable --now amnui-api
   ```

   ```bash
   systemctl status amnui-api --no-pager
   ```

6. Mở `/etc/nginx/sites-available/amnui` và dán hai khối `location` trong `server/nginx-api.conf` vào trong khối `server { ... }` có `listen 443`, phía trên `location / {`. Rồi:

   ```bash
   nginx -t && systemctl reload nginx
   ```

7. Kiểm tra (phải in ra `{"ok": true, "ai": true}`):

   ```bash
   curl https://amnui.myska.blog/api/health
   ```

Xem nhật ký khi có lỗi: `journalctl -u amnui-api -n 50 --no-pager`. Sau mỗi lần `git pull` có thay đổi trong `server/`, chạy `systemctl restart amnui-api`.

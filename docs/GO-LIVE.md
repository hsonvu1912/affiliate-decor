# Lên LIVE — kết nối Google Sheet thật cho Tổ Ấm

Hướng dẫn từng bước đưa website từ chế độ demo (dữ liệu mẫu) sang chạy thật bằng
**Google Sheet (nội dung) + Google Drive (ảnh)**. Toàn bộ code pipeline đã có sẵn —
việc còn lại chủ yếu là **tạo tài nguyên bên Google + điền cấu hình**.

> **Demo và Live là hai thứ tách biệt, cùng tồn tại:**
> - **Demo tĩnh** ở GitHub Pages (`https://hsonvu1912.github.io/affiliate-decor/`) luôn chạy
>   dữ liệu mẫu, không cần Google. CI tự build, không đụng tới bản live.
> - **Bản Live** chạy trên server (Vercel) — mới có `/go` (tracking click), `/api/revalidate`
>   (đồng bộ realtime) và `/img` (proxy ảnh Drive). GitHub Pages tĩnh KHÔNG chạy được các thứ này.

---

## Sơ đồ pipeline

```
Google Sheet (Products/Collections/.../Clicks)  ─┐
Google Drive (ảnh sản phẩm)                       ├─►  Website (server)  ─►  Người xem
        ▲ service account đọc/ghi                 │         │
        │                                          │         ├─ /go/[id]  → ghi click về tab Clicks
   sửa Sheet → onEdit.gs → POST /api/revalidate ──┘         └─ /img/[id] → tải ảnh Drive
                         (làm mới site sau vài giây)
```

---

## B1 — Google Cloud project
1. Vào https://console.cloud.google.com → tạo project mới (vd `to-am`).
2. **APIs & Services → Library** → bật **Google Sheets API** và **Google Drive API**.

## B2 — Service account + key JSON
1. **APIs & Services → Credentials → Create credentials → Service account**. Đặt tên (vd `svc-decor`).
2. Vào service account vừa tạo → tab **Keys → Add key → Create new key → JSON** → tải file `.json`.
3. Mở file JSON, lấy 2 giá trị:
   - `client_email` → là `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → là `GOOGLE_PRIVATE_KEY` (chuỗi dài có nhiều `\n`)

## B3 — Tạo Sheet trống
1. Tạo một Google Sheet mới (trống cũng được — script sẽ tự tạo các tab).
2. Copy **ID** từ URL: `https://docs.google.com/spreadsheets/d/<ĐÂY_LÀ_ID>/edit` → là `GOOGLE_SHEET_ID`.

## B4 — Điền `.env.local`
```bash
cp .env.example .env.local
```
Mở `.env.local`, điền:
```
USE_MOCK_DATA=false
GOOGLE_SERVICE_ACCOUNT_EMAIL=svc-decor@<project>.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=<id ở B3>
REVALIDATE_SECRET=<chuỗi ngẫu nhiên dài, tự đặt>
```
> `GOOGLE_PRIVATE_KEY`: dán **nguyên khối trên một dòng**, giữ các `\n` escaped, bọc trong dấu
> nháy kép. Code tự đổi `\n` thành xuống dòng thật (`requireGoogleEnv`).

## B5 — Share Sheet cho service account (quyền **Editor**)
Trong Google Sheet → **Share** → dán `client_email` (B2) → chọn **Editor** → Send.
> Cần **Editor** (không phải Viewer) vì website ghi log click vào tab Clicks.

## B6 — Bơm dữ liệu mẫu vào Sheet
```bash
npm run seed
```
Script tạo 6 tab (Products, Collections, Categories, Styles, Settings, Clicks) + bơm dữ liệu mẫu.
- Chạy lại lần 2 → báo "đã có dữ liệu, bỏ qua" (an toàn, không ghi đè).
- `npm run seed -- --force` để ghi đè; `npm run seed -- --only=Products` để chỉ 1 tab;
  `npm run seed -- --skip-images` để bỏ trống cột ảnh.
> ⚠ Dữ liệu mẫu dùng ảnh `picsum.photos`. Sang B7 thay bằng ảnh Drive thật.

## B7 — Ảnh sản phẩm trên Drive
1. Tạo 1 folder trên Google Drive, tải ảnh sản phẩm lên.
2. **Share folder** đó cho `client_email` quyền **Viewer**.
3. Mỗi ảnh → chuột phải → lấy **file ID** (trong link `.../d/<FILE_ID>/view`).
4. Trong Sheet, thay cột `imageIds` (tab Products, nhiều ID cách nhau dấu phẩy, ID đầu = ảnh bìa)
   và `heroImageId` (Collections/Categories) bằng các Drive file ID này.
5. (Tùy chọn) điền `GOOGLE_DRIVE_FOLDER_ID` vào `.env.local`.

## B8 — Kiểm tra kết nối
```bash
npm run verify
```
Kiểm: đăng nhập OK, đủ tab + đúng header, map dữ liệu sạch, header Clicks khớp logger, tải được 1 ảnh Drive.
- Mọi mục phải **✓**. Nếu báo thiếu cột → kiểm lại header; nếu báo Drive lỗi → kiểm quyền share folder.
- `npm run verify -- --write-test-click` để ghi thử 1 dòng `__verify__` vào Clicks (xoá tay sau).

## B9 — Chạy thử ở local trước khi deploy
```bash
npm run dev   # USE_MOCK_DATA=false → đọc Sheet thật
```
Mở http://localhost:3000 và kiểm:
- Trang chủ / danh mục render từ dữ liệu Sheet thật, ảnh `/img/[id]` hiện.
- Bấm **Mua ngay** → chuyển qua `/go/[id]` → redirect đúng link affiliate.
> Webhook revalidate **chưa test đầy đủ** ở local (Apps Script cần URL công khai). Test tay:
> ```bash
> curl -X POST http://localhost:3000/api/revalidate \
>   -H 'content-type: application/json' \
>   -d '{"secret":"<REVALIDATE_SECRET>","sheet":"Products"}'
> ```

## B10 — Chọn host: **Vercel** (khuyến nghị)
- Khớp code: hỗ trợ `after()` (ghi click sau response), ISR/`revalidateTag`, và header
  `x-vercel-ip-country` mà `/go` dùng cho cột `country`.
- Import repo vào Vercel (https://vercel.com/new).
> Nếu sau này đổi host khác (Railway/Cloudflare): cột `country` sẽ rỗng vì header
> `x-vercel-ip-country` chỉ có ở Vercel — khi đó cần sửa `src/app/go/[productId]/route.ts:29`
> đọc header tương ứng (Cloudflare: `cf-ipcountry`).

## B11 — Khai báo biến môi trường trên Vercel
**Project Settings → Environment Variables**, thêm:
```
USE_MOCK_DATA=false
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...        # dán nguyên khối, giữ \n
GOOGLE_SHEET_ID=...
REVALIDATE_SECRET=...         # giống .env.local
NEXT_PUBLIC_SITE_URL=https://<domain-production>
```
> **KHÔNG** đặt `NEXT_PUBLIC_STATIC_EXPORT` (cờ đó chỉ dành cho demo tĩnh — nếu đặt, nút Mua ngay
> sẽ bỏ qua `/go` và mất tracking).

## B12 — Bật đồng bộ realtime (Apps Script)
1. Trong Google Sheet → **Extensions → Apps Script**, dán nội dung `apps-script/onEdit.gs`.
2. **Project Settings → Script Properties**:
   - `WEBHOOK_URL = https://<domain>/api/revalidate`
   - `REVALIDATE_SECRET = <giống Vercel>`
3. Chạy hàm `installTrigger()` một lần (cấp quyền khi được hỏi).

## B13 — Kiểm tra end-to-end trên production
- Sửa một ô trong Sheet (vd tên sản phẩm) → site cập nhật sau vài giây.
- Bấm **Mua ngay** trên domain thật → mở tab **Clicks** thấy dòng mới (timestamp, retailer, device…).
- Thử menu **Tổ Ấm → Revalidate ngay** trong Sheet để ép làm mới.

---

## Bảng lỗi thường gặp
| Triệu chứng | Nguyên nhân | Xử lý |
|---|---|---|
| `seed`/`verify` báo "Thiếu cấu hình Google" | `.env.local` thiếu email/key/sheetId | Điền lại B4 |
| `seed` lỗi 403 | Sheet chưa share Editor cho service account | Làm lại B5 |
| `verify` báo thiếu cột | Header bị sửa/xoá | Chạy `npm run seed -- --force` (cẩn thận: ghi đè) |
| Ảnh không hiện trên site | Drive folder chưa share Viewer, hoặc `imageIds` vẫn là picsum | Làm lại B7 |
| Click không ghi vào Clicks | Token thiếu quyền ghi / Sheet share Viewer | Đổi sang Editor (B5) |
| Site không tự cập nhật khi sửa Sheet | `WEBHOOK_URL`/secret sai, chưa `installTrigger()` | Làm lại B12 |

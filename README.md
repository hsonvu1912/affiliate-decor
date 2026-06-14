# Tổ Ấm — Nền tảng affiliate đồ decor (editorial)

Website "tạp chí decor" cho thị trường Việt Nam. Chủ site tự **curate** đồ trang trí nhà cửa; mỗi sản phẩm gắn link affiliate ra Shopee / Lazada / TikTok Shop để ăn hoa hồng. Toàn bộ nội dung được quản lý bằng **Google Sheets + Google Drive** và đồng bộ **gần realtime** lên web.

- **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · deploy trên Vercel
- **CMS:** Google Sheets (dữ liệu) + Google Drive (ảnh), đọc qua service account
- **Realtime:** Apps Script `onEdit` → webhook `/api/revalidate` → `revalidateTag` (cập nhật trong vài giây)
- **Tracking:** mọi nút "Mua ngay" đi qua `/go/[id]` → ghi log click về tab `Clicks`

## Bắt đầu nhanh (chế độ demo, không cần Google)

```bash
npm install
npm run dev        # mở http://localhost:3000
```

Mặc định `.env.local` đặt `USE_MOCK_DATA=true`, site chạy bằng dữ liệu mẫu trong `src/fixtures/`. Ảnh demo lấy từ picsum.photos.

## Scripts

| Lệnh | Tác dụng |
|------|----------|
| `npm run dev` | Chạy dev server |
| `npm run build` | Build production |
| `npm run start` | Chạy bản build |
| `npm test` | Unit test (Vitest) |
| `npm run typecheck` | Kiểm tra kiểu TypeScript |
| `npm run lint` | ESLint |
| `npm run seed` | Bơm dữ liệu mẫu vào Google Sheet thật (xem [docs/GO-LIVE.md](docs/GO-LIVE.md)) |
| `npm run verify` | Kiểm tra kết nối Google Sheet/Drive trước khi deploy |

## Kết nối Google Sheets thật

> 📘 Hướng dẫn lên LIVE từng bước (cho người không code) ở **[docs/GO-LIVE.md](docs/GO-LIVE.md)** —
> gồm `npm run seed` (tự tạo tab + bơm dữ liệu mẫu) và `npm run verify` (kiểm tra kết nối).


1. **Google Cloud:** tạo project → bật **Google Sheets API** và **Google Drive API**.
2. **Service account:** tạo service account, tạo key JSON. Lấy `client_email` và `private_key`.
3. **Spreadsheet:** tạo Google Sheet với các tab `Products`, `Collections`, `Categories`, `Styles`, `Settings`, `Clicks` (cấu trúc cột xem bên dưới). Chia sẻ Sheet cho `client_email` với quyền **Editor** (để ghi log click).
4. **Drive:** tải ảnh sản phẩm lên một folder Drive, chia sẻ folder cho `client_email` (quyền Viewer). Dùng **file ID** của ảnh trong cột `imageIds`.
5. **Biến môi trường:** copy `.env.example` → `.env.local`, điền credential và đặt `USE_MOCK_DATA=false`.

```bash
cp .env.example .env.local
# điền GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID, USE_MOCK_DATA=false
```

### Cấu trúc các tab (đọc theo TÊN cột — có thể đổi thứ tự cột tùy ý)

- **Products:** `id` (mã ổn định, không tái dùng), `name`, `slug`, `category`, `style`, `price` (số VND thuần), `priceDisplay`, `retailer`, `affiliateUrl`, `imageIds` (Drive ID, cách nhau dấu phẩy, đầu tiên = ảnh bìa), `shortDesc`, `description` (Markdown), `collections`, `tags`, `featured` (TRUE/FALSE), `order`, `status` (`published`/`draft`/`archived`), `updatedAt`
- **Collections:** `id`, `title`, `subtitle`, `heroImageId`, `editorialBody` (Markdown), `productIds`, `featured`, `order`, `status`
- **Categories:** `id`, `name`, `description`, `heroImageId`, `order`, `status`
- **Styles:** `id`, `name`, `order`
- **Settings:** hai cột `key`, `value` (vd: `siteTitle`, `heroHeadline`, `footerText`…)
- **Clicks:** website tự ghi — `timestamp`, `productId`, `productName`, `retailer`, `affiliateUrl`, `referrer`, `country`, `device`, `userAgent`

> Mẹo: bật **Data validation** (dropdown) cho các cột `category`, `style`, `retailer`, `status` và **freeze** dòng tiêu đề để dễ nhập.

Tham khảo `src/fixtures/*.json` để thấy dữ liệu mẫu đầy đủ tương ứng với từng tab.

## Đồng bộ gần realtime (webhook revalidate)

1. Mở Spreadsheet → **Extensions → Apps Script**, dán nội dung `apps-script/onEdit.gs`.
2. **Project Settings → Script Properties** thêm:
   - `WEBHOOK_URL` = `https://<domain>/api/revalidate`
   - `REVALIDATE_SECRET` = giống hệt `REVALIDATE_SECRET` trong env của web
3. Chạy hàm `installTrigger()` một lần (cấp quyền). Từ giờ mỗi lần sửa Sheet, web tự làm mới.
4. Có sẵn menu **Tổ Ấm → Revalidate ngay** để ép làm mới thủ công.

Cache dùng `unstable_cache` với tag + fallback `revalidate` 600s (phòng khi webhook lỡ).

## Ảnh

Ảnh Drive được phục vụ qua proxy same-origin `/img/[fileId]` (cache vĩnh viễn, tối ưu bằng `next/image`). Không cần cấu hình `remotePatterns` cho Drive. picsum.photos chỉ dùng cho dữ liệu demo.

## Deploy lên Vercel

1. Import repo vào Vercel.
2. Khai báo toàn bộ biến trong `.env.example` ở **Project Settings → Environment Variables** (dán `GOOGLE_PRIVATE_KEY` nguyên khối, giữ `\n`).
3. Sau khi có domain production, cập nhật `WEBHOOK_URL` trong Apps Script và `NEXT_PUBLIC_SITE_URL`.

## Cấu trúc thư mục

```
src/
  app/                 # routes (home, danh-muc, bo-suu-tap, san-pham, tim-kiem, api/revalidate, go, img)
  components/          # layout · editorial · product · search · ui
  lib/
    google/            # auth · sheets · drive
    data/              # source (mock/live) · cache (tags) · getters · clicks
    search.ts · format.ts · image.ts · markdown.ts · env.ts
  fixtures/            # dữ liệu demo (USE_MOCK_DATA=true)
apps-script/onEdit.gs  # trigger đồng bộ realtime
```

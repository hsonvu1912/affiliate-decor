# Redesign spec — phong cách JW Anderson

Mục tiêu: đưa giao diện **Tổ Ấm** sang ngôn ngữ thiết kế của [jwanderson.com](https://jwanderson.com/en-vn) — tối giản cực độ, editorial thời trang cao cấp, "image-forward" — **giữ nguyên toàn bộ tính năng** hiện có (Google Sheets CMS, /go tracking, /img proxy, realtime revalidate, tìm kiếm client-side). Phạm vi đã chốt: **đổi giao diện + bổ sung tương tác**.

> ⚠️ Làm việc này ở **local** (sandbox cloud chặn jwanderson.com và không có trình duyệt). Local có trình duyệt thật + vào được site tham chiếu.

## 0. Chuẩn bị ở local

```bash
git clone <repo-url> && cd affiliate-decor
git checkout claude/decor-affiliate-platform-vn-6a6l5m
npm install
cp .env.example .env.local   # đã mặc định USE_MOCK_DATA=true để chạy demo
npm run dev                  # http://localhost:3000

# Chụp ảnh tham chiếu jwanderson.com (xem từng trang để làm bám sát)
npm run capture:install      # tải Chromium (một lần)
# Mở jwanderson.com, copy URL các trang thật (shop, product, about...) vào
# mảng PAGES trong scripts/capture-reference.mjs, rồi:
npm run capture              # ảnh lưu vào reference/jwanderson/
```

Sau đó mở repo bằng Claude Code ở local và yêu cầu: *"Redesign theo REDESIGN.md, dùng ảnh trong reference/jwanderson/ để đối chiếu."*

## 1. Tinh thần thiết kế (JW Anderson)

- **Tối giản, nhiều khoảng trắng**, không bo góc (border-radius = 0), đường kẻ mảnh 1px.
- **Bảng màu mono**: nền trắng tinh / off-white, chữ đen, không màu nhấn lòe loẹt (tối đa 1 accent rất kín đáo). Ảnh tự mang màu cho trang.
- **Typography**: sans-serif grotesque, **chữ nhỏ**, **IN HOA** ở nav/label với letter-spacing rộng; tên sản phẩm chữ thường cỡ nhỏ. Tương phản đến từ cỡ ảnh, không từ cỡ chữ.
- **Ảnh là chủ thể**: hero full-bleed (ảnh/video campaign), tỉ lệ dọc cho sản phẩm, hover đổi ảnh thứ hai.
- **UI chrome cực mỏng**: header trong suốt đè lên hero, không đổ bóng; footer dạng nhiều cột link + đăng ký newsletter.

## 2. Design tokens — thay trong `src/app/globals.css` (`@theme`)

Thay bảng màu ấm hiện tại bằng mono:

```css
@theme {
  --color-paper: #ffffff;     /* nền chính */
  --color-bone:  #f4f3f1;     /* nền phụ rất nhạt */
  --color-ink:   #111111;     /* chữ/đường kẻ */
  --color-mute:  #6b6b6b;     /* chữ phụ */
  --color-line:  #e6e4e1;     /* hairline 1px */
  --color-accent:#111111;     /* JW gần như không dùng accent; để = ink */

  --font-display: var(--font-grotesque); /* xem mục 3 */
  --font-body:    var(--font-grotesque);
}
```

- Bỏ `border-radius` ở mọi component (dùng `rounded-none`).
- Khoảng cách rộng: section `py-20`→`py-28`, grid gap nhỏ (ảnh sát nhau kiểu lookbook: `gap-x-2 gap-y-10`).
- Bỏ `.dropcap`, palette terracotta/sage cũ.

## 3. Typography — `src/app/layout.tsx`

JW Anderson dùng grotesque tùy biến. Phương án free gần nhất (qua `next/font/google`), vẫn hỗ trợ tiếng Việt:
- **Be Vietnam Pro** (đã có) nhưng dùng ở cỡ nhỏ, weight 400/500, tracking rộng cho nav — chấp nhận được và chuẩn dấu.
- Hoặc thử **Archivo** / **Space Grotesk** cho heading (lưu ý kiểm tra subset `vietnamese`; nếu thiếu dấu thì giữ Be Vietnam Pro cho phần có tiếng Việt).

Đề xuất: một font grotesque duy nhất cho toàn site (JW không pha serif). Đổi cả `--font-display` và `--font-body` về cùng một font; bỏ Playfair Display.

Quy ước chữ:
- Nav, eyebrow, nhãn, nút: `uppercase tracking-[0.15em] text-xs`.
- Heading hero: vẫn lớn nhưng **không serif**, weight vừa (500–600), tracking hơi âm.
- Tên sản phẩm: `text-sm` thường; giá `text-sm text-mute`.

## 4. Redesign theo trang (ánh xạ file)

| Khu vực | File | Việc cần làm |
|---|---|---|
| Header | `src/components/layout/Header.tsx` | Logo canh giữa hoặc trái, nav IN HOA, icon search + (giỏ/lưu). **Trong suốt** khi đè hero, chuyển nền trắng khi cuộn. Thêm **mega-menu** xổ khi hover danh mục. |
| Hero | `src/components/editorial/Hero.tsx` | Full-bleed 100vh, ảnh/video campaign, chữ tối thiểu (tên collection + 1 link "Khám phá"), không card. |
| Lưới SP | `src/components/product/ProductCard.tsx`, `ProductGrid.tsx` | Ảnh tỉ lệ dọc 3:4, **hover đổi ảnh thứ hai** (dùng `imageIds[1]`), text dưới ảnh tối giản (tên thường + giá), bỏ badge màu. Grid 2/3/4 cột, gap nhỏ. |
| Feature/Collection | `editorial/FeatureBlock.tsx`, `CollectionRail.tsx` | Bố cục lookbook bất đối xứng, chữ đè/cạnh ảnh, không nền màu. |
| PDP | `src/components/product/ProductDetail.tsx`, `Gallery.tsx` | Gallery ảnh lớn dạng cột dọc cuộn (stacked) hoặc sticky thumbnail; thông tin bên phải cực gọn; CTA "Mua ngay" dạng nút chữ nhật viền/đen tràn chiều rộng; accordion cho mô tả/chi tiết. |
| Footer | `src/components/layout/Footer.tsx` | Nhiều cột link IN HOA + **đăng ký newsletter** + dòng social, hairline phân cách, rất nhiều khoảng trắng. |
| Search | `src/components/search/SearchExplorer.tsx` | Filter dạng thanh ngang tối giản hoặc drawer trượt; kết quả lưới giống lookbook. |
| UI | `src/components/ui/*` | `Badge`/`Section` bỏ bo góc & màu; nút dùng kiểu chữ nhật đen/viền. |

## 5. Tương tác cần thêm (scope: giao diện + tương tác)

1. **Hover đổi ảnh thứ hai** trên `ProductCard` (CSS/state, ưu tiên `imageIds[1]`).
2. **Header trong suốt → đặc khi cuộn** (client component nhỏ nghe `scroll`, hoặc IntersectionObserver trên hero).
3. **Mega-menu** danh mục khi hover (desktop) / drawer (mobile).
4. **Hero campaign** full-viewport; nếu có video thì autoplay muted loop.
5. **Quick add / quick view** (tùy chọn): overlay nút "Mua ngay" hiện khi hover card.
6. **Marquee/announcement bar** mảnh trên cùng (tin khuyến mãi) — rất hợp phong cách.
7. **Chuyển trang mượt**: fade ảnh, `loading` skeleton tối giản.

Giữ mọi tương tác **không phá SEO/SSR**: component động để `"use client"` ở lá, trang vẫn Server Component.

## 6. Giữ nguyên (đừng phá)

- Lớp dữ liệu `src/lib/**`, route `/go`, `/img`, `/api/revalidate`, `generateStaticParams`, cache tag.
- Cờ `NEXT_PUBLIC_STATIC_EXPORT` (BuyButton), `STATIC_EXPORT` (next.config) để bản GitHub Pages vẫn build.
- Dữ liệu mock trong `src/fixtures/` (có thể bổ sung `imageIds` thứ hai cho sản phẩm để test hover).

## 7. Kiểm thử

```bash
npm run lint && npm run typecheck && npm test && npm run build
```
- So sánh trực quan từng trang với `reference/jwanderson/*.png`.
- Kiểm tra responsive (390 / 768 / 1440), `<html lang="vi">`, dấu tiếng Việt không vỡ.
- Lighthouse trang chủ + PDP (giữ điểm SEO/Performance).
- Bản static export vẫn chạy: `STATIC_EXPORT=true NEXT_PUBLIC_STATIC_EXPORT=true USE_MOCK_DATA=true PAGES_BASE_PATH=/affiliate-decor npx next build` (nhớ xóa tạm route handler như CI làm).

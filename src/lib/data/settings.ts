import { getSettingsCached } from "@/lib/data/cache";
import type { SiteSettings } from "@/types";

const DEFAULTS: SiteSettings = {
  siteTitle: "Tổ Ấm",
  siteTagline: "Tạp chí đồ trang trí nhà cửa",
  heroEyebrow: "Tuyển tập mùa này",
  heroHeadline: "Ngôi nhà là chương truyện đẹp nhất bạn tự viết",
  heroSubhead:
    "Chúng tôi tuyển chọn từng món đồ decor có gu và dẫn bạn đến nơi mua tốt nhất.",
  footerText:
    "Một số liên kết là liên kết tiếp thị (affiliate); chúng tôi có thể nhận hoa hồng khi bạn mua hàng.",
};

export async function getSettings(): Promise<SiteSettings> {
  const fromSource = await getSettingsCached();
  return { ...DEFAULTS, ...fromSource };
}

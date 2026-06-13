export function AffiliateDisclosure({ text }: { text?: string }) {
  return (
    <p className="text-xs leading-relaxed text-mute">
      {text ??
        "Tiết lộ: Một số liên kết trên trang là liên kết tiếp thị (affiliate). Chúng tôi có thể nhận hoa hồng khi bạn mua hàng qua các liên kết này — điều đó không làm tăng giá bạn phải trả."}
    </p>
  );
}

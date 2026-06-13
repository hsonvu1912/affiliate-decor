import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container width="narrow" className="py-32 text-center">
      <p className="eyebrow mb-4">Lỗi 404</p>
      <h1 className="font-display text-5xl font-semibold text-ink">Không tìm thấy trang</h1>
      <p className="mt-4 text-lg text-charcoal/80">
        Trang bạn tìm có thể đã được dời đi hoặc không còn tồn tại.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-base font-medium text-bone hover:bg-terracotta-dark"
      >
        ← Về trang chủ
      </Link>
    </Container>
  );
}

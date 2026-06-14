import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container width="narrow" className="py-40 text-center">
      <p className="eyebrow mb-4 text-mute">Lỗi 404</p>
      <h1 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        Không tìm thấy trang
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-mute">
        Trang bạn tìm có thể đã được dời đi hoặc không còn tồn tại.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-3 border-b border-ink pb-1 text-xs font-medium uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-60"
      >
        <span aria-hidden>←</span>
        Về trang chủ
      </Link>
    </Container>
  );
}

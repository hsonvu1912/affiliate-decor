import type { Metadata } from "next";
import { getPublishedCollections } from "@/lib/data/collections";
import { CollectionRail } from "@/components/editorial/CollectionRail";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Bộ sưu tập",
  description: "Những tuyển tập decor theo chủ đề, tuyển chọn thủ công.",
};

export default async function CollectionsIndexPage() {
  const collections = await getPublishedCollections();
  return (
    <Container width="wide" className="py-16 sm:py-20">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Bộ sưu tập" }]} />
      <h1 className="mt-5 font-display text-5xl font-semibold text-ink sm:text-6xl">
        Bộ sưu tập
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-charcoal/85">
        Mỗi bộ sưu tập là một câu chuyện không gian — tập hợp những món đồ chia sẻ chung
        một tinh thần thẩm mỹ.
      </p>
      <div className="mt-12">
        <CollectionRail collections={collections} />
      </div>
    </Container>
  );
}

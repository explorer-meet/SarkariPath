import Link from "next/link";
import { Icon } from "@/components/icon";
import { StudyResourceList } from "@/components/study-resource-list";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StudyPage() {
  const materials = await prisma.studyMaterial.findMany({
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      title: true,
      subject: true,
      detail: true,
      content: true,
      type: true,
      duration: true,
      premium: true,
      isDemo: true,
    },
  });

  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">YOUR STUDY ROOM</p>
        <h1>Learn at your own pace.</h1>
        <p>Clear notes, focused practice and small revision moments — all in one place.</p>
      </section>
      <div className="study-banner">
        <span className="study-banner-icon"><Icon name="book" size={22} /></span>
        <div><strong>A steady routine beats a perfect plan.</strong><p>Choose one topic to focus on today. You can always pick up another tomorrow.</p></div>
        <Link className="button button-green" href="/quiz">Try a quick quiz <Icon name="arrow" size={16} /></Link>
      </div>
      <div className="section-heading study-heading"><div><p className="eyebrow">EXPLORE THE LIBRARY</p><h2>Study resources</h2></div><span className="resource-count">{materials.length} starter resources</span></div>
      <StudyResourceList materials={materials} />
      <div className="offline-callout"><Icon name="download" size={19} /><div><strong>Offline learning is on the roadmap.</strong><p>PDF downloads and offline access will be connected once content storage and licensing are configured.</p></div><span className="soft-tag">COMING SOON</span></div>
    </>
  );
}

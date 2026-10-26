import { Icon } from "@/components/icon";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [exams, materials] = await Promise.all([
    prisma.exam.findMany({
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: { id: true, name: true, organization: true, verified: true },
    }),
    prisma.studyMaterial.findMany({
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: { id: true, title: true, subject: true },
    }),
  ]);
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return (
    <>
      <div className="admin-topbar"><div><span className="eyebrow">CONTENT OPERATIONS</span><h1>Good morning, editor.</h1><p>Here&apos;s a snapshot of your content workspace.</p></div><span className="admin-date">{today}</span></div>
      <div className="admin-warning"><Icon name="shield" size={17} /><span><strong>Preview only.</strong> This workspace has no staff authentication or durable data storage and must not be used for real administration.</span></div>
      <section className="admin-stats">
        <article><span className="stat-icon green"><Icon name="calendar" size={19} /></span><p>Exam listings</p><strong>{exams.length}</strong><span>Demo records</span></article>
        <article><span className="stat-icon peach"><Icon name="file" size={19} /></span><p>Study resources</p><strong>{materials.length}</strong><span>Starter content</span></article>
        <article><span className="stat-icon lilac"><Icon name="clock" size={19} /></span><p>Needs verification</p><strong>{exams.filter((exam) => !exam.verified).length}</strong><span>Before publication</span></article>
      </section>
      <section className="admin-panel" id="content">
        <div className="section-heading"><div><p className="eyebrow">EDITORIAL CHECKLIST</p><h2>Review before publishing</h2></div><span className="soft-tag">DEMO CONTENT</span></div>
        <div className="review-table">
          <div className="review-head"><span>CONTENT</span><span>TYPE</span><span>STATUS</span><span>OWNER</span></div>
          {exams.map((exam) => (
            <div className="review-row" key={exam.id}>
              <div><strong>{exam.name}</strong><span>{exam.organization}</span></div>
              <span>Exam notice</span>
              <span className="review-status"><i /> Needs source check</span>
              <span className="owner-chip"><span>ED</span> Editorial</span>
            </div>
          ))}
          {materials.slice(0, 2).map((material) => (
            <div className="review-row" key={material.id}>
              <div><strong>{material.title}</strong><span>{material.subject}</span></div>
              <span>Study material</span>
              <span className="review-status ready"><i /> Draft</span>
              <span className="owner-chip"><span>ED</span> Editorial</span>
            </div>
          ))}
        </div>
        <div className="admin-table-note"><Icon name="shield" size={15} /> Published examination information should include an official source and a verification date.</div>
      </section>
      <section className="admin-next-step"><div className="admin-next-icon"><Icon name="settings" size={20} /></div><div><strong>Next: connect a protected content service</strong><p>Wire this review surface to authenticated APIs, a database, role-based permissions and an audit trail before enabling edits or publishing.</p></div><span className="soft-tag">FOUNDATION</span></section>
    </>
  );
}

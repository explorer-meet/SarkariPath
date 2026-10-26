import { ExamExplorer } from "@/components/exam-explorer";
import { demoNotice, type Exam } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ExamsPage() {
  const exams = await prisma.exam.findMany({
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      organization: true,
      category: true,
      status: true,
      dateLabel: true,
      dateDetail: true,
      verified: true,
      sourceLabel: true,
      sourceUrl: true,
      isDemo: true,
    },
  }) as Exam[];

  return (
    <>
      <section className="page-intro">
        <p className="eyebrow">PLAN WITH CLARITY</p>
        <h1>Exams &amp; opportunities</h1>
        <p>Keep track of the exams on your radar. Always confirm dates and eligibility with the official notice.</p>
      </section>
      <div className="demo-notice"><span className="online-dot" /><span>{demoNotice}. Entries are illustrative, not live recruitment advice.</span></div>
      <ExamExplorer exams={exams} />
    </>
  );
}

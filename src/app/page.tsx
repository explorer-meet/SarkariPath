import Link from "next/link";
import { Icon } from "@/components/icon";
import { demoNotice } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { StudyResourceList } from "@/components/study-resource-list";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [exams, materials] = await Promise.all([
    prisma.exam.findMany({
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
    }),
    prisma.studyMaterial.findMany({
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
    }),
  ]);
  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Kolkata",
  }).format(new Date()).toUpperCase();

  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">{today}</p>
          <h1>A good day to make <span>progress.</span></h1>
          <p className="welcome-subtitle">Your preparation, one clear step at a time.</p>
        </div>
        <Link className="button button-outline today-button" href="/study">
          <Icon name="calendar" size={17} /> Today&apos;s plan
        </Link>
      </section>

      <div className="demo-notice"><Icon name="shield" size={16} /><span>{demoNotice}. Dates and listings shown here are illustrative.</span></div>

      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-kicker"><Icon name="spark" size={15} /> YOUR DAILY MOMENTUM</span>
          <h2>Keep showing up.<br />You&apos;re closer than you think.</h2>
          <p>Pick up where you left off, or try a quick practice session to get into the flow.</p>
          <Link className="button button-light" href="/quiz">Take today&apos;s quiz <Icon name="arrow" size={17} /></Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun-orbit orbit-one" /><div className="sun-orbit orbit-two" />
          <div className="sun-shape" />
          <div className="hero-book"><div /><div /><div /></div>
          <span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✦</span>
        </div>
        <div className="hero-bottom"><span><span className="online-dot" /> Your study space is ready</span><span>Take it at your pace</span></div>
      </section>

      <section className="stats-grid" aria-label="Study overview">
        <article className="stat-card">
          <span className="stat-icon green"><Icon name="calendar" size={19} /></span>
          <div><p>Exam listings</p><strong>{exams.length} <small>examples</small></strong></div>
          <span className="stat-foot">Across {new Set(exams.map((exam) => exam.category)).size} categories</span>
        </article>
        <article className="stat-card">
          <span className="stat-icon peach"><Icon name="clock" size={19} /></span>
          <div><p>Study time this week</p><strong>— <small>hours</small></strong></div>
          <span className="stat-foot">Progress tracking not connected</span>
        </article>
        <article className="stat-card">
          <span className="stat-icon lilac"><Icon name="chart" size={19} /></span>
          <div><p>Practice history</p><strong>— <small>sessions</small></strong></div>
          <span className="stat-foot">Quiz attempts are not saved</span>
        </article>
      </section>

      <div className="dashboard-grid">
        <section className="panel exam-panel">
          <div className="section-heading">
            <div><p className="eyebrow">STAY IN THE KNOW</p><h2>Exam updates</h2></div>
            <Link className="text-link" href="/exams">View all <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="exam-list">
            {exams.slice(0, 2).map((exam) => (
              <article className="exam-row" key={exam.id}>
                <div className="exam-monogram">{exam.category.slice(0, 2)}</div>
                <div className="exam-info">
                  <div className="exam-title-line"><h3>{exam.name}</h3><span className="status-badge">{exam.status}</span></div>
                  <p>{exam.organization}</p>
                  <span className="exam-date"><Icon name="clock" size={14} /> {exam.dateLabel}</span>
                </div>
                <Link aria-label={`Explore ${exam.name}`} className="round-arrow" href="/exams"><Icon name="arrow" size={17} /></Link>
              </article>
            ))}
          </div>
          <div className="official-note"><Icon name="shield" size={15} /> Always verify important dates with the official recruiting body.</div>
        </section>

        <section className="quiz-teaser">
          <div className="quiz-top"><span className="quiz-icon"><Icon name="spark" size={18} /></span><span className="soft-tag">A QUICK RESET</span></div>
          <p className="eyebrow">DAILY PRACTICE</p>
          <h2>Three questions.<br />A little more clarity.</h2>
          <p className="quiz-description">Try a short Polity quiz and see how you do. No pressure, just practice.</p>
          <div className="quiz-meta"><span><Icon name="clock" size={15} /> About 3 min</span><span>3 questions</span></div>
          <Link className="button button-green" href="/quiz">Start the quiz <Icon name="arrow" size={16} /></Link>
          <span className="quiz-decoration" aria-hidden="true">?</span>
        </section>
      </div>

      <section className="panel materials-panel">
        <div className="section-heading">
          <div><p className="eyebrow">A GOOD PLACE TO BEGIN</p><h2>Picked for your study room</h2></div>
          <Link className="text-link" href="/study">Explore resources <Icon name="arrow" size={16} /></Link>
        </div>
        <StudyResourceList materials={materials.slice(0, 3)} />
      </section>
      <footer className="page-footer">Made for the long game <span>·</span> <Link href="/admin">Content team</Link></footer>
    </>
  );
}

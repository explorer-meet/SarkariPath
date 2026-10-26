"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import type { Exam } from "@/lib/data";

export function ExamExplorer({ exams }: { exams: Exam[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(exams.map((exam) => exam.category)))];
  const filtered = useMemo(
    () =>
      exams.filter((exam) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          `${exam.name} ${exam.organization} ${exam.category}`.toLowerCase().includes(query);
        return matchesSearch && (category === "All" || exam.category === category);
      }),
    [category, exams, search],
  );

  return (
    <>
      <div className="explore-toolbar">
        <label className="search-field">
          <Icon name="search" size={19} />
          <input
            aria-label="Search exams"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search exams or organizations"
            value={search}
          />
        </label>
        <label className="filter-select"><Icon name="filter" size={17} />
          <select aria-label="Filter by category" onChange={(event) => setCategory(event.target.value)} value={category}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="category-chips">
        {categories.map((item) => (
          <button className={category === item ? "selected" : ""} key={item} onClick={() => setCategory(item)} type="button">{item}</button>
        ))}
      </div>
      <div className="explore-count">Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? "listing" : "listings"}</div>
      <div className="exam-cards">
        {filtered.map((exam) => (
          <article className="exam-card" key={exam.id}>
            <div className="exam-card-top"><span className="exam-monogram">{exam.category.slice(0, 2)}</span><span className="status-badge">{exam.status}</span></div>
            <p className="exam-category">{exam.category} <span>·</span> {exam.organization}</p>
            <h2>{exam.name}</h2>
            <div className="exam-date-box"><Icon name="calendar" size={17} /><div><strong>{exam.dateLabel}</strong><span>{exam.dateDetail}</span></div></div>
            <div className="source-row"><Icon name="shield" size={15} /><span>Source: {exam.sourceLabel}</span><span className="unverified">Needs verification</span></div>
            <Link className="text-link exam-detail-link" href={exam.sourceUrl} rel="noreferrer" target="_blank">
              Visit official source <Icon name="external" size={15} />
            </Link>
          </article>
        ))}
        {filtered.length === 0 && <div className="empty-state"><Icon name="search" size={24} /><h2>No exams found</h2><p>Try another search or choose a different category.</p></div>}
      </div>
    </>
  );
}

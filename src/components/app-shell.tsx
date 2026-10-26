"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";

const links = [
  { href: "/", label: "Overview", icon: "home" as const },
  { href: "/exams", label: "Exams", icon: "calendar" as const },
  { href: "/study", label: "Study room", icon: "book" as const },
  { href: "/quiz", label: "Daily quiz", icon: "chart" as const },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="admin-frame">
        <aside className="admin-sidebar">
          <Link className="brand" href="/">
            <span className="brand-mark">s.</span>
            <span>Sarkari<span className="brand-light">Path</span></span>
          </Link>
          <p className="admin-label">WORKSPACE</p>
          <Link className="admin-link active" href="/admin">
            <Icon name="chart" size={18} /> Overview
          </Link>
          <Link className="admin-link" href="/admin#content">
            <Icon name="file" size={18} /> Content review
          </Link>
          <Link className="admin-link" href="/exams">
            <Icon name="calendar" size={18} /> Exam listings
          </Link>
          <div className="admin-sidebar-bottom">
            <span className="avatar avatar-small">SP</span>
            <div><strong>Demo workspace</strong><span>Admin portal preview</span></div>
          </div>
        </aside>
        <div className="admin-content">{children}</div>
      </div>
    );
  }

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">s.</span>
          <span>Sarkari<span className="brand-light">Path</span></span>
        </Link>
        <div className="sidebar-section">
          <p className="sidebar-label">YOUR SPACE</p>
          <nav aria-label="Main navigation" className="side-nav">
            {links.map(({ href, label, icon }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link className={`nav-link${active ? " active" : ""}`} href={href} key={href}>
                  <Icon name={icon} size={19} />
                  <span>{label}</span>
                  {label === "Daily quiz" && <span className="nav-dot" />}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="sidebar-note">
          <div className="note-icon"><Icon name="spark" size={18} /></div>
          <strong>Small steps add up.</strong>
          <p>Your weekly study rhythm will take shape as you use the app.</p>
          <div className="week-dots" aria-label="Weekly study activity">
            {[false, false, false, false, false, false, false].map((done, index) => (
              <span className={done ? "done" : ""} key={index} />
            ))}
          </div>
          <span className="week-caption">Activity tracking is a demo</span>
        </div>
        <div className="sidebar-bottom">
          <Link className="nav-link" href="/admin">
            <Icon name="settings" size={19} /> <span>Admin preview</span>
          </Link>
          <div className="sidebar-user">
            <span className="avatar">A</span>
            <div><strong>Aspirant</strong><span>Free plan</span></div>
            <button aria-label="Notifications" className="icon-button" type="button">
              <Icon name="bell" size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand">
            <Link className="brand" href="/">
              <span className="brand-mark">s.</span><span>Sarkari<span className="brand-light">Path</span></span>
            </Link>
          </div>
          <div className="breadcrumb"><span>My learning</span><Icon name="chevron" size={15} /><strong>{links.find((item) => item.href === pathname)?.label ?? "Explore"}</strong></div>
          <div className="topbar-actions">
            <span className="demo-pill"><span /> Demo workspace</span>
            <button aria-label="Search" className="icon-button top-search" type="button"><Icon name="search" size={19} /></button>
            <span className="avatar">A</span>
          </div>
        </header>
        <div className="page-content">{children}</div>
      </main>

      <nav aria-label="Mobile navigation" className="mobile-nav">
        {links.map(({ href, label, icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link className={active ? "active" : ""} href={href} key={href}>
              <Icon name={icon} size={20} /><span>{label === "Overview" ? "Home" : label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

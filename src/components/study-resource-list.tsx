"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import type { StudyMaterial } from "@/lib/data";

export function StudyResourceList({ materials }: { materials: StudyMaterial[] }) {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  function toggleBookmark(id: string) {
    setBookmarks((current) =>
      current.includes(id) ? current.filter((bookmark) => bookmark !== id) : [...current, id],
    );
  }

  return (
    <div className="resource-list">
      {materials.map((item, index) => {
        const bookmarked = bookmarks.includes(item.id);
        return (
          <article className="resource-row" key={item.id}>
            <span className={`resource-icon resource-icon-${index % 4}`}>
              <Icon name={item.type === "Practice" ? "chart" : item.type === "Current affairs" ? "spark" : "file"} size={20} />
            </span>
            <div className="resource-copy">
              <span className="resource-subject">{item.subject} <span>·</span> {item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              {item.content ? (
                <details className="resource-reader">
                  <summary>Read resource: {item.title}</summary>
                  <p className="resource-demo-label">Sample learning content. PRO is a demo label, not a payment restriction.</p>
                  {item.content.split("\n\n").map((section, sectionIndex) => (
                    <p className="resource-content" key={sectionIndex}>{section}</p>
                  ))}
                </details>
              ) : (
                <p>Content has not been added to this resource yet.</p>
              )}
            </div>
            <span className="resource-duration"><Icon name="clock" size={15} /> {item.duration}</span>
            {item.premium && <span className="premium-mark">PRO</span>}
            {!item.premium && (
              <button
                aria-label={`${bookmarked ? "Remove bookmark from" : "Bookmark"} ${item.title}`}
                aria-pressed={bookmarked}
                className={`icon-button bookmark-button${bookmarked ? " is-bookmarked" : ""}`}
                onClick={() => toggleBookmark(item.id)}
                type="button"
              >
                {bookmarked ? "★" : "☆"}
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}

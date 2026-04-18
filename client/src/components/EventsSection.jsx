import React, { useState, useMemo } from "react";
import { eventsData, filterOptions } from "../data/eventsData";
import { FaHome } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { RiPushpinFill } from "react-icons/ri";
import { IoSearchSharp } from "react-icons/io5";
// ─── tiny helpers ─────────────────────────────────────────────────────────────

const TYPE_COLORS = {
  hackathon:      { bg: "#fff3e0", text: "#e65100", border: "#ffcc80" },
  workshop:       { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  placement:      { bg: "#e3f2fd", text: "#1565c0", border: "#90caf9" },
  speaker:        { bg: "#fce4ec", text: "#b71c1c", border: "#f48fb1" },
  guest_lecture:  { bg: "#f3e5f5", text: "#6a1b9a", border: "#ce93d8" },
  competition:    { bg: "#fffde7", text: "#f57f17", border: "#fff176" },
  coding_contest: { bg: "#e0f2f1", text: "#00695c", border: "#80cbc4" },
};

const TYPE_LABELS = {
  hackathon:      "Hackathon",
  workshop:       "Workshop",
  placement:      "Placement Drive",
  speaker:        "Speaker Session",
  guest_lecture:  "Guest Lecture",
  competition:    "Competition",
  coding_contest: "Coding Contest",
};

const MODE_ICONS = {
  Offline: "📍",
  Online:  "🌐",
  Hybrid:  "🔀",
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysLeft(deadlineStr) {
  if (!deadlineStr) return null;
  const diff = Math.ceil(
    (new Date(deadlineStr) - new Date()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

// ─── EventCard ─────────────────────────────────────────────────────────────────

function EventCard({ event }) {
  const colors = TYPE_COLORS[event.type] || TYPE_COLORS.hackathon;
  const deadline = daysLeft(event.deadline);

  return (
    <div className="event-card">
      {/* Header image */}
      <div className="event-card-img-wrap">
        <img
          src={event.image}
          alt={event.title}
          className="event-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400";
          }}
        />
        {/* Type badge */}
        <span
          className="event-type-badge"
          style={{
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
          }}
        >
          {filterOptions.find((f) => f.key === event.type)?.icon}{" "}
          {TYPE_LABELS[event.type]}
        </span>

        {/* Mode pill */}
        <span className="event-mode-pill">
          {MODE_ICONS[event.mode]} {event.mode}
        </span>
      </div>

      {/* Body */}
      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-organizer flex gap-1 items-center">
          <span className="event-icon flex"></span> <FaHome /> {event.organizer}
        </p>

        <div className="event-meta-row">
          <span className="event-meta-item items-center">
            <span className="event-icon"></span> <FaCalendarAlt /> {formatDate(event.date)}
          </span>
          <span className="event-meta-item">
            <span className="event-icon"></span> <FaRegClock /> {event.duration}
          </span>
        </div>

        {event.venue && (
          <p className="event-venue flex items-center">
            <span className="event-icon"></span> 
            <span><RiPushpinFill /> </span>
            {event.venue}
          </p>
        )}

        <p className="event-description">{event.description}</p>

        {/* Tags */}
        <div className="event-tags">
          {event.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="event-tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Prize / CTC */}
        {event.prize && (
          <div className="event-prize">
            <span className="event-icon">🏆</span>
            <strong>{event.prize}</strong>
          </div>
        )}

        {/* Footer */}
        <div className="event-card-footer">
          {event.deadline && (
            <span
              className={`event-deadline ${
                deadline !== null && deadline <= 5
                  ? "deadline-urgent"
                  : deadline !== null && deadline <= 14
                  ? "deadline-soon"
                  : ""
              }`}
            >
              {deadline !== null && deadline < 0
                ? "⛔ Deadline passed"
                : deadline === 0
                ? "⚠️ Due today!"
                : deadline !== null
                ? `⏳ ${deadline}d left`
                : ""}
            </span>
          )}
          <a
            href={event.registrationLink}
            className="event-register-btn"
            target="_blank"
            rel="noreferrer"
          >
            Register Now →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ───────────────────────────────────────────────────────────────

export default function EventsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  const filtered = useMemo(() => {
    let result = eventsData;
    if (activeFilter !== "all") {
      result = result.filter((e) => e.type === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          e.description.toLowerCase().includes(q)
      );
    }
    // Sort: upcoming first
    return [...result].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [activeFilter, searchQuery]);

  const visible = filtered.slice(0, visibleCount);

  const counts = useMemo(() => {
    const map = {};
    filterOptions.forEach((f) => {
      map[f.key] =
        f.key === "all"
          ? eventsData.length
          : eventsData.filter((e) => e.type === f.key).length;
    });
    return map;
  }, []);

  return (
    <section className="events-section" id="events">
      {/* ── Section Header ─────────────────────────────── */}
      <div className="events-header">
        <div className="events-header-text">
          <span className="events-section-tag">Upcoming Events</span>
          <h2 className="events-section-title">
            Events &amp; <span className="events-title-accent">Opportunities</span>
          </h2>
          <p className="events-section-subtitle">
            Stay ahead of the curve — explore hackathons, workshops, placement
            drives, and more tailored for students like you.
          </p>
        </div>
        {/* Search */}
        <div className="events-search-wrap">
            <IoSearchSharp />
          <span className="events-search-icon"></span>
          <input
            type="text"
            className="events-search-input"
            placeholder="Search events, topics, organizers…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(9);
            }}
          />
          {searchQuery && (
            <button
              className="events-search-clear"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Pills ──────────────────────────────── */}
      <div className="events-filters">
        {filterOptions.map((f) => (
          <button
            key={f.key}
            className={`events-filter-btn ${
              activeFilter === f.key ? "active" : ""
            }`}
            onClick={() => {
              setActiveFilter(f.key);
              setVisibleCount(9);
            }}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
            <span className="filter-count">{counts[f.key]}</span>
          </button>
        ))}
      </div>

      {/* ── Result count ──────────────────────────────── */}
      <div className="events-result-meta">
        <span>
          Showing{" "}
          <strong>
            {Math.min(visibleCount, filtered.length)}
          </strong>{" "}
          of <strong>{filtered.length}</strong> events
          {activeFilter !== "all"
            ? ` in ${
                filterOptions.find((f) => f.key === activeFilter)?.label
              }`
            : ""}
          {searchQuery ? ` matching "${searchQuery}"` : ""}
        </span>
      </div>

      {/* ── Cards Grid ────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="events-empty">
          <span className="events-empty-icon">🔎</span>
          <p>No events found. Try a different filter or search term.</p>
          <button
            className="events-filter-btn active"
            onClick={() => {
              setActiveFilter("all");
              setSearchQuery("");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {visible.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* ── Load More ─────────────────────────────────── */}
      {visibleCount < filtered.length && (
        <div className="events-load-more-wrap">
          <button
            className="events-load-more-btn"
            onClick={() => setVisibleCount((c) => c + 9)}
          >
            Load More Events ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* ──  Inline CSS (scoped) ─────────────────────── */}
      <style>{`
        /* ─ Container ─ */
        .events-section {
          padding: 60px 20px 80px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: inherit;
        }

        /* ─ Header ─ */
        .events-header {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 36px;
        }
        .events-header-text { flex: 1; min-width: 260px; }
        .events-section-tag {
          display: inline-block;
          background: #ebf5fb;
          color: #f39c12;
          border: 1px solid #aed6f1;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.8px;
          padding: 4px 14px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .events-section-title {
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 12px;
          line-height: 1.2;
        }
        .events-title-accent { color: #f39c12; }
        .events-section-subtitle {
          font-size: 15px;
          color: #555;
          max-width: 520px;
          line-height: 1.6;
          margin: 0;
        }

        /* ─ Search ─ */
        .events-search-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          border: 1.5px solid #dde1e7;
          border-radius: 10px;
          padding: 10px 16px;
          min-width: 280px;
          max-width: 360px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .events-search-icon { font-size: 16px; }
        .events-search-input {
          border: none;
          outline: none;
          font-size: 14px;
          flex: 1;
          background: transparent;
          color: #333;
        }
        .events-search-clear {
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
          font-size: 13px;
          padding: 0 2px;
        }

        /* ─ Filter Pills ─ */
        .events-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        .events-filter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f5f7fa;
          border: 1.5px solid #dde1e7;
          border-radius: 24px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          color: #444;
          transition: all 0.2s ease;
        }
        .events-filter-btn:hover {
          border-color: #f39c12;
          color: #f39c12;
          background: #ebf5fb;
        }
        .events-filter-btn.active {
          background: #f39c12;
          border-color: #f39c12;
          color: #fff;
          box-shadow: 0 4px 12px rgba(243,156,18,0.3);
        }
        .filter-count {
          background: rgba(255,255,255,0.3);
          border-radius: 10px;
          padding: 1px 7px;
          font-size: 11px;
          font-weight: 700;
        }
        .events-filter-btn:not(.active) .filter-count {
          background: #e0e4ea;
          color: #666;
        }

        /* ─ Result meta ─ */
        .events-result-meta {
          font-size: 13px;
          color: #777;
          margin-bottom: 24px;
        }
        .events-result-meta strong { color: #333; }

        /* ─ Grid ─ */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        /* ─ Card ─ */
        .event-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8ecf0;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.12);
        }

        /* ─ Card image ─ */
        .event-card-img-wrap {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        .event-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .event-card:hover .event-card-img { transform: scale(1.04); }

        .event-type-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 20px;
          padding: 4px 10px;
          letter-spacing: 0.3px;
        }
        .event-mode-pill {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          font-size: 11px;
          border-radius: 20px;
          padding: 3px 10px;
          backdrop-filter: blur(4px);
        }

        /* ─ Card Body ─ */
        .event-card-body {
          padding: 18px 20px 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .event-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
          line-height: 1.35;
        }
        .event-card-organizer {
          font-size: 13px;
          color: #666;
          margin: 0;
        }
        .event-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .event-meta-item {
          font-size: 13px;
          color: #444;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .event-icon { font-size: 13px; }
        .event-venue {
          font-size: 12px;
          color: #888;
          margin: 0;
          display: flex;
          align-items: flex-start;
          gap: 4px;
        }
        .event-description {
          font-size: 13px;
          color: #555;
          line-height: 1.55;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ─ Tags ─ */
        .event-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 2px;
        }
        .event-tag {
          background: #f0f4f8;
          border: 1px solid #dde1e7;
          color: #555;
          font-size: 11px;
          font-weight: 500;
          border-radius: 12px;
          padding: 2px 9px;
        }

        /* ─ Prize ─ */
        .event-prize {
          font-size: 13px;
          color: #e65100;
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fff3e0;
          border-radius: 8px;
          padding: 6px 10px;
          border: 1px solid #ffcc80;
        }

        /* ─ Footer ─ */
        .event-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
          gap: 10px;
        }
        .event-deadline {
          font-size: 12px;
          color: #555;
          font-weight: 500;
        }
        .deadline-urgent { color: #c0392b !important; font-weight: 700; }
        .deadline-soon   { color: #e67e22 !important; font-weight: 600; }

        .event-register-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f39c12;
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          border-radius: 8px;
          padding: 8px 16px;
          transition: background 0.2s ease, transform 0.15s ease;
          white-space: nowrap;
          border: none;
          cursor: pointer;
        }
        .event-register-btn:hover {
          background: #e67e22;
          transform: translateX(2px);
        }

        /* ─ Empty State ─ */
        .events-empty {
          text-align: center;
          padding: 60px 20px;
          color: #888;
        }
        .events-empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }
        .events-empty p { font-size: 15px; margin-bottom: 20px; }

        /* ─ Load More ─ */
        .events-load-more-wrap {
          text-align: center;
          margin-top: 40px;
        }
        .events-load-more-btn {
          background: transparent;
          border: 2px solid #f39c12;
          color: #f39c12;
          font-size: 14px;
          font-weight: 600;
          border-radius: 10px;
          padding: 12px 32px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .events-load-more-btn:hover {
          background: #f39c12;
          color: #fff;
          box-shadow: 0 4px 16px rgba(243,156,18,0.3);
        }

        /* ─ Responsive ─ */
        @media (max-width: 640px) {
          .events-section { padding: 40px 14px 60px; }
          .events-grid { grid-template-columns: 1fr; }
          .events-search-wrap { min-width: unset; max-width: 100%; }
          .events-header { flex-direction: column; }
        }
      `}</style>
    </section>
  );
}
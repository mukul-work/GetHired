import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { eventsData, filterOptions } from "../data/eventsData";
import { useAuth } from "../context/AuthContext";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../services/api";
import { FaCalendarAlt, FaTrophy, FaMapMarkerAlt, FaGlobe, FaBriefcase, FaMicrophone, FaUserTie, FaCode, FaChalkboardTeacher, FaLaptopCode, FaBuilding } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { RiPushpinFill, RiShuffleLine } from "react-icons/ri";
import { IoSearchSharp } from "react-icons/io5";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSearch, FiArrowRight, FiSlash } from "react-icons/fi";
import { MdWarning, MdAccessTime } from "react-icons/md";

// ─── constants ────────────────────────────────────────────────────────────────

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
  Offline: <FaMapMarkerAlt size={11} />,
  Online:  <FaGlobe size={11} />,
  Hybrid:  <RiShuffleLine size={12} />,
};

const TYPE_ICONS = {
  hackathon:      <FaCode size={11} />,
  workshop:       <FaChalkboardTeacher size={11} />,
  placement:      <FaBriefcase size={11} />,
  speaker:        <FaMicrophone size={11} />,
  guest_lecture:  <FaUserTie size={11} />,
  competition:    <FaTrophy size={11} />,
  coding_contest: <FaLaptopCode size={11} />,
};

const EMPTY_FORM = {
  type: "hackathon", title: "", organizer: "", date: "", time: "",
  duration: "", mode: "Offline", venue: "", prize: "", tags: "",
  description: "", registrationLink: "#", deadline: "", image: "",
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function daysLeft(deadlineStr) {
  if (!deadlineStr) return null;
  return Math.ceil((new Date(deadlineStr) - new Date()) / (1000 * 60 * 60 * 24));
}

// ─── EventFormModal ────────────────────────────────────────────────────────────

function EventFormModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(
    initial
      ? { ...initial, tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : initial.tags }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
      if (initial?._id) {
        await updateEvent(initial._id, payload);
      } else {
        await createEvent(payload);
      }
      onSaved();
    } catch (ex) {
      setErr(ex.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 outline-none focus:border-yellow-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-gray-800 dark:text-white text-lg">
            {initial ? "Edit Event" : "Add New Event"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><FiX size={20} /></button>
        </div>

        <form onSubmit={submit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {err && <p className="col-span-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{err}</p>}

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Title *</label>
            <input required className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Event title" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Type *</label>
            <select required className={inputCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
              {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Mode</label>
            <select className={inputCls} value={form.mode} onChange={(e) => set("mode", e.target.value)}>
              {["Offline", "Online", "Hybrid"].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Organizer *</label>
            <input required className={inputCls} value={form.organizer} onChange={(e) => set("organizer", e.target.value)} placeholder="Organizer name" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Date *</label>
            <input required type="date" className={inputCls} value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Time</label>
            <input className={inputCls} value={form.time} onChange={(e) => set("time", e.target.value)} placeholder="9:00 AM" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Duration</label>
            <input className={inputCls} value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="36 hours" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Deadline</label>
            <input type="date" className={inputCls} value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Venue</label>
            <input className={inputCls} value={form.venue} onChange={(e) => set("venue", e.target.value)} placeholder="Main Auditorium" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Prize</label>
            <input className={inputCls} value={form.prize} onChange={(e) => set("prize", e.target.value)} placeholder="₹1,00,000" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Registration Link</label>
            <input className={inputCls} value={form.registrationLink} onChange={(e) => set("registrationLink", e.target.value)} placeholder="https://..." />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Image URL</label>
            <input className={inputCls} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://images.unsplash.com/..." />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Tags <span className="font-normal">(comma separated)</span></label>
            <input className={inputCls} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="AI/ML, Web Dev, Open Source" />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Description</label>
            <textarea rows={3} className={inputCls + " resize-none"} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Brief description..." />
          </div>

          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-semibold text-sm disabled:opacity-60">
              {saving ? "Saving…" : initial ? "Save Changes" : "Add Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── DeleteConfirm ─────────────────────────────────────────────────────────────

function DeleteConfirm({ event, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const handle = async () => {
    setDeleting(true);
    try { await deleteEvent(event._id); onDeleted(event._id); }
    catch { setDeleting(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2">Delete Event?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete <strong className="text-gray-700 dark:text-gray-200">"{event.title}"</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={handle} disabled={deleting} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm disabled:opacity-60">
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EventCard ─────────────────────────────────────────────────────────────────

function EventCard({ event, isAdmin, onEdit, onDelete }) {
  const colors = TYPE_COLORS[event.type] || TYPE_COLORS.hackathon;
  const deadline = daysLeft(event.deadline);

  return (
    <div className="event-card group">
      <div className="event-card-img-wrap">
        <img src={event.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400"}
          alt={event.title} className="event-card-img" loading="lazy"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400"; }} />
        <span className="event-type-badge" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, display: "inline-flex", alignItems: "center", gap: 5 }}>
          {TYPE_ICONS[event.type]} {TYPE_LABELS[event.type]}
        </span>
        <span className="event-mode-pill" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{MODE_ICONS[event.mode]} {event.mode}</span>

        {isAdmin && (
          <div className="event-admin-actions">
            <button className="event-admin-btn edit" title="Edit" onClick={(e) => { e.stopPropagation(); onEdit(event); }}><FiEdit2 size={13} /></button>
            <button className="event-admin-btn delete" title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(event); }}><FiTrash2 size={13} /></button>
          </div>
        )}
      </div>

      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-organizer" style={{ display: "flex", alignItems: "center", gap: 5 }}><FaBuilding size={12} />{event.organizer}</p>
        <div className="event-meta-row">
          <span className="event-meta-item"><FaCalendarAlt style={{ display: "inline", marginRight: 4 }} />{formatDate(event.date)}</span>
          <span className="event-meta-item"><FaRegClock style={{ display: "inline", marginRight: 4 }} />{event.duration}</span>
        </div>
        {event.venue && (
          <p className="event-venue"><RiPushpinFill style={{ display: "inline", marginRight: 4 }} />{event.venue}</p>
        )}
        <p className="event-description">{event.description}</p>
        <div className="event-tags">
          {(event.tags || []).slice(0, 3).map((tag) => <span key={tag} className="event-tag">{tag}</span>)}
        </div>
        {event.prize && (
          <div className="event-prize"><FaTrophy size={13} /><strong>{event.prize}</strong></div>
        )}
        <div className="event-card-footer">
          {event.deadline && (
            <span className={`event-deadline ${deadline !== null && deadline <= 5 ? "deadline-urgent" : deadline !== null && deadline <= 14 ? "deadline-soon" : ""}`}>
              {deadline !== null && deadline < 0 ? <span style={{display:"inline-flex",alignItems:"center",gap:4}}><FiSlash size={12}/> Deadline passed</span> : deadline === 0 ? <span style={{display:"inline-flex",alignItems:"center",gap:4}}><MdWarning size={13}/> Due today!</span> : deadline !== null ? <span style={{display:"inline-flex",alignItems:"center",gap:4}}><MdAccessTime size={13}/> {deadline}d left</span> : ""}
            </span>
          )}
          <a href={event.registrationLink} className="event-register-btn" target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6}}>Register Now <FiArrowRight size={13}/></a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ───────────────────────────────────────────────────────────────

export default function EventsSection({ previewMode = false }) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(previewMode ? 3 : 9);
  const [editEvent, setEditEvent] = useState(null);     // null = closed, event = editing
  const [addOpen, setAddOpen] = useState(false);
  const [deleteEvent_, setDeleteEvent_] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await getEvents();
      setEvents(data.length ? data : eventsData);
    } catch {
      setEvents(eventsData); // fallback to static data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const filtered = useMemo(() => {
    let result = events;
    if (activeFilter !== "all") result = result.filter((e) => e.type === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q) ||
        (e.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        e.description.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, activeFilter, searchQuery]);

  const visible = filtered.slice(0, visibleCount);

  const counts = useMemo(() => {
    const map = {};
    filterOptions.forEach((f) => {
      map[f.key] = f.key === "all" ? events.length : events.filter((e) => e.type === f.key).length;
    });
    return map;
  }, [events]);

  const handleSaved = () => { setEditEvent(null); setAddOpen(false); fetchEvents(); };
  const handleDeleted = (id) => { setEvents((prev) => prev.filter((e) => (e._id || e.id) !== id)); setDeleteEvent_(null); };

  return (
    <div className="events-page-bg">
    <section className="events-section" id="events">

      {/* ── Section Header ─────────────────────────────── */}
      <div className="events-header">
        <div className="events-header-text">
          <span className="events-section-tag">Upcoming Events</span>
          <h2 className="events-section-title">
            Events &amp; <span className="events-title-accent">Opportunities</span>
          </h2>
          <p className="events-section-subtitle">
            Stay ahead of the curve — explore hackathons, workshops, placement drives, and more tailored for students like you.
          </p>
        </div>
        {!previewMode && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
            {isAdmin && (
              <button className="event-add-btn" onClick={() => setAddOpen(true)}>
                <FiPlus size={15} /> Add Event
              </button>
            )}
            <div className="events-search-wrap">
              <IoSearchSharp />
              <input type="text" className="events-search-input" placeholder="Search events, topics, organizers…"
                value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(9); }} />
              {searchQuery && <button className="events-search-clear" onClick={() => setSearchQuery("")}><FiX size={13}/></button>}
            </div>
          </div>
        )}
      </div>

      {/* ── Filter Pills ──────────────────────────────── */}
      {!previewMode && (
        <div className="events-filters">
          {filterOptions.map((f) => (
            <button key={f.key} className={`events-filter-btn ${activeFilter === f.key ? "active" : ""}`}
              onClick={() => { setActiveFilter(f.key); setVisibleCount(9); }}>
              {TYPE_ICONS[f.key] && <span className="filter-icon">{TYPE_ICONS[f.key]}</span>}<span>{f.label}</span><span className="filter-count">{counts[f.key]}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Result meta ──────────────────────────────── */}
      {!previewMode && (
        <div className="events-result-meta">
          <span>Showing <strong>{Math.min(visibleCount, filtered.length)}</strong> of <strong>{filtered.length}</strong> events
            {activeFilter !== "all" ? ` in ${filterOptions.find((f) => f.key === activeFilter)?.label}` : ""}
            {searchQuery ? ` matching "${searchQuery}"` : ""}
          </span>
        </div>
      )}

      {/* ── Cards Grid ────────────────────────────────── */}
      {loading ? (
        <div className="events-loading">Loading events…</div>
      ) : filtered.length === 0 ? (
        <div className="events-empty">
          <FiSearch className="events-empty-icon" size={52} />
          <p>No events found. Try a different filter or search term.</p>
          <button className="events-filter-btn active" onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}>Clear Filters</button>
        </div>
      ) : (
        <div className="events-grid">
          {visible.map((event) => (
            <EventCard key={event._id || event.id} event={event} isAdmin={isAdmin}
              onEdit={setEditEvent} onDelete={setDeleteEvent_} />
          ))}
        </div>
      )}

      {/* ── Load More ─────────────────────────────────── */}
      {previewMode ? (
        <div className="events-load-more-wrap">
          <button className="events-load-more-btn" onClick={() => navigate("/events")}>
            View All Events
          </button>
        </div>
      ) : visibleCount < filtered.length && (
        <div className="events-load-more-wrap">
          <button className="events-load-more-btn" onClick={() => setVisibleCount((c) => c + 9)}>
            Load More Events ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* ── Modals ────────────────────────────────────── */}
      {addOpen && <EventFormModal onClose={() => setAddOpen(false)} onSaved={handleSaved} />}
      {editEvent && <EventFormModal initial={editEvent} onClose={() => setEditEvent(null)} onSaved={handleSaved} />}
      {deleteEvent_ && <DeleteConfirm event={deleteEvent_} onClose={() => setDeleteEvent_(null)} onDeleted={handleDeleted} />}

      {/* ── Inline CSS (scoped + dark mode) ──────────── */}
      <style>{`
        /* Page-level dark background */
        .events-page-bg {
          min-height: 100vh;
          background: #f8fafc;
          transition: background 0.3s ease;
        }
        .dark .events-page-bg {
          background: #0f172a;
        }
        .events-section {
          padding: 60px 20px 80px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: "Inter", system-ui, sans-serif;
        }
        .events-header {
          display: flex; flex-wrap: wrap; gap: 24px;
          align-items: flex-start; justify-content: space-between; margin-bottom: 36px;
        }
        .events-header-text { flex: 1; min-width: 260px; }
        .events-section-tag {
          display: inline-block; background: #ebf5fb; color: #f39c12;
          border: 1px solid #aed6f1; border-radius: 20px; font-size: 12px;
          font-weight: 600; letter-spacing: 0.8px; padding: 4px 14px;
          text-transform: uppercase; margin-bottom: 12px;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .dark .events-section-tag { background: #1e2a3a; border-color: #2d4a6a; }
        .events-section-title {
          font-size: clamp(26px, 4vw, 38px); font-weight: 800;
          color: #1a1a2e; margin: 0 0 12px; line-height: 1.2;
          transition: color 0.3s ease;
        }
        .dark .events-section-title { color: #f1f5f9; }
        .events-title-accent { color: #f39c12; }
        .events-section-subtitle { font-size: 15px; color: #555; max-width: 520px; line-height: 1.6; margin: 0; transition: color 0.3s ease; }
        .dark .events-section-subtitle { color: #94a3b8; }

        /* Search */
        .events-search-wrap {
          display: flex; align-items: center; gap: 10px;
          background: #fff; border: 1.5px solid #dde1e7; border-radius: 10px;
          padding: 10px 16px; min-width: 280px; max-width: 360px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .dark .events-search-wrap { background: #1e293b; border-color: #334155; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
        .events-search-input {
          border: none; outline: none; font-size: 14px;
          font-family: "Inter", system-ui, sans-serif;
          flex: 1; background: transparent; color: #111;
          transition: color 0.3s ease;
        }
        .dark .events-search-input { color: #e2e8f0; }
        .events-search-clear { background: none; border: none; cursor: pointer; color: #888; font-size: 13px; padding: 0 2px; }
        .dark .events-search-clear { color: #64748b; }

        /* Add Event button */
        .event-add-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f39c12; color: #fff; border: none; border-radius: 10px;
          padding: 10px 18px; font-size: 13px; font-weight: 600;
          font-family: "Inter", system-ui, sans-serif;
          cursor: pointer; transition: background 0.2s;
        }
        .event-add-btn:hover { background: #e67e22; }

        /* Filter Pills */
        .events-filters { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
        .events-filter-btn {
          display: flex; align-items: center; gap: 6px;
          background: #f5f7fa; border: 1.5px solid #dde1e7; border-radius: 24px;
          padding: 8px 16px; font-size: 13px; font-weight: 500;
          font-family: "Inter", system-ui, sans-serif; cursor: pointer; color: #444;
          transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
        }
        .dark .events-filter-btn { background: #1e293b; border-color: #334155; color: #94a3b8; }
        .events-filter-btn:hover { border-color: #f39c12; color: #f39c12; background: #fffbeb; }
        .dark .events-filter-btn:hover { background: #1a2535; border-color: #f39c12; }
        .events-filter-btn.active { background: #f39c12; border-color: #f39c12; color: #fff; box-shadow: 0 4px 12px rgba(243,156,18,0.3); }
        .filter-icon { display: flex; align-items: center; }
        .filter-count { background: rgba(255,255,255,0.3); border-radius: 10px; padding: 1px 7px; font-size: 11px; font-weight: 700; }
        .events-filter-btn:not(.active) .filter-count { background: #e0e4ea; color: #666; transition: background 0.25s ease, color 0.25s ease; }
        .dark .events-filter-btn:not(.active) .filter-count { background: #334155; color: #94a3b8; }

        /* Result meta */
        .events-result-meta { font-size: 13px; color: #777; margin-bottom: 24px; transition: color 0.3s ease; }
        .dark .events-result-meta { color: #64748b; }
        .events-result-meta strong { color: #333; transition: color 0.3s ease; }
        .dark .events-result-meta strong { color: #cbd5e1; }

        /* Grid */
        .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }

        /* Loading */
        .events-loading { text-align: center; padding: 60px 20px; color: #888; font-size: 15px; }
        .dark .events-loading { color: #64748b; }

        /* Card */
        .event-card {
          background: #fff; border-radius: 14px; border: 1px solid #e8ecf0;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden;
          display: flex; flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.3s ease, border-color 0.3s ease;
          position: relative;
        }
        .dark .event-card { background: #1e293b; border-color: #334155; box-shadow: 0 2px 12px rgba(0,0,0,0.3); }
        .event-card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(0,0,0,0.12); }
        .dark .event-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.5); }

        /* Card image */
        .event-card-img-wrap { position: relative; height: 180px; overflow: hidden; }
        .event-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .event-card:hover .event-card-img { transform: scale(1.04); }
        .event-type-badge {
          position: absolute; top: 12px; left: 12px; font-size: 11px;
          font-weight: 700; border-radius: 20px; padding: 4px 10px; letter-spacing: 0.3px;
        }
        .event-mode-pill {
          position: absolute; bottom: 12px; right: 12px;
          background: rgba(0,0,0,0.6); color: #fff; font-size: 11px;
          border-radius: 20px; padding: 3px 10px; backdrop-filter: blur(4px);
        }

        /* Admin action buttons on card */
        .event-admin-actions {
          position: absolute; top: 10px; right: 10px;
          display: flex; gap: 6px;
          opacity: 0; transition: opacity 0.2s;
        }
        .event-card:hover .event-admin-actions { opacity: 1; }
        .event-admin-btn {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 7px; border: none; cursor: pointer;
          backdrop-filter: blur(4px); transition: transform 0.15s;
        }
        .event-admin-btn:hover { transform: scale(1.1); }
        .event-admin-btn.edit { background: rgba(251,191,36,0.9); color: #78350f; }
        .event-admin-btn.delete { background: rgba(239,68,68,0.9); color: #fff; }

        /* Card body */
        .event-card-body { padding: 18px 20px 16px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .event-card-title { font-size: 16px; font-weight: 700; color: #1a1a2e; margin: 0; line-height: 1.35; transition: color 0.3s ease; }
        .dark .event-card-title { color: #f1f5f9; }
        .event-card-organizer { font-size: 13px; color: #666; margin: 0; transition: color 0.3s ease; }
        .dark .event-card-organizer { color: #94a3b8; }
        .event-meta-row { display: flex; flex-wrap: wrap; gap: 12px; }
        .event-meta-item { font-size: 13px; color: #444; display: flex; align-items: center; gap: 4px; transition: color 0.3s ease; }
        .dark .event-meta-item { color: #94a3b8; }
        .event-venue { font-size: 12px; color: #888; margin: 0; display: flex; align-items: flex-start; gap: 4px; transition: color 0.3s ease; }
        .dark .event-venue { color: #64748b; }
        .event-description {
          font-size: 13px; color: #555; line-height: 1.55; margin: 0;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
          transition: color 0.3s ease;
        }
        .dark .event-description { color: #94a3b8; }

        /* Tags */
        .event-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
        .event-tag { background: #f0f4f8; border: 1px solid #dde1e7; color: #555; font-size: 11px; font-weight: 500; border-radius: 12px; padding: 2px 9px; transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease; }
        .dark .event-tag { background: #0f172a; border-color: #334155; color: #94a3b8; }

        /* Prize */
        .event-prize { font-size: 13px; color: #e65100; display: flex; align-items: center; gap: 6px; background: #fff3e0; border-radius: 8px; padding: 6px 10px; border: 1px solid #ffcc80; }
        .dark .event-prize { background: #1c1408; border-color: #78350f; color: #fb923c; }

        /* Footer */
        .event-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 12px; border-top: 1px solid #f0f0f0; gap: 10px; transition: border-color 0.3s ease; }
        .dark .event-card-footer { border-top-color: #334155; }
        .event-deadline { font-size: 12px; color: #555; font-weight: 500; transition: color 0.3s ease; }
        .dark .event-deadline { color: #94a3b8; }
        .deadline-urgent { color: #c0392b !important; font-weight: 700; }
        .deadline-soon   { color: #e67e22 !important; font-weight: 600; }
        .event-register-btn {
          display: inline-flex; align-items: center; gap: 4px;
          background: #f39c12; color: #fff; text-decoration: none;
          font-size: 13px; font-weight: 600; border-radius: 8px; padding: 8px 16px;
          transition: background 0.2s ease, transform 0.15s ease; white-space: nowrap; border: none; cursor: pointer;
        }
        .event-register-btn:hover { background: #e67e22; transform: translateX(2px); }

        /* Empty state */
        .events-empty { text-align: center; padding: 60px 20px; color: #888; }
        .dark .events-empty { color: #64748b; }
        .events-empty-icon { display: block; margin: 0 auto 16px; opacity: 0.4; }
        .events-empty p { font-size: 15px; margin-bottom: 20px; }

        /* Load more */
        .events-load-more-wrap { text-align: center; margin-top: 40px; }
        .events-load-more-btn {
          background: transparent; border: 2px solid #f39c12; color: #f39c12;
          font-size: 14px; font-weight: 600; font-family: "Inter", system-ui, sans-serif;
          border-radius: 10px; padding: 12px 32px; cursor: pointer; transition: all 0.2s ease;
        }
        .events-load-more-btn:hover { background: #f39c12; color: #fff; box-shadow: 0 4px 16px rgba(243,156,18,0.3); }

        /* Responsive */
        @media (max-width: 640px) {
          .events-section { padding: 40px 14px 60px; }
          .events-grid { grid-template-columns: 1fr; }
          .events-search-wrap { min-width: unset; max-width: 100%; }
          .events-header { flex-direction: column; }
        }
      `}</style>
    </section>
    </div>
  );
}

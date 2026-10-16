"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Download,
  Globe2,
} from "lucide-react";
import { profile } from "@/content/portfolio";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import {
  dateInZone,
  getMeetingSlots,
  MANILA_TIME_ZONE,
  meetingBrief,
  meetingCalendar,
  meetingDateTime,
  meetingTime,
} from "@/lib/meetings";

const timeZones = [
  "UTC",
  "Pacific/Honolulu",
  "America/Anchorage",
  "America/Los_Angeles",
  "America/Vancouver",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Toronto",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Amsterdam",
  "Africa/Lagos",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Kathmandu",
  "Asia/Bangkok",
  "Asia/Jakarta",
  "Asia/Singapore",
  "Asia/Manila",
  "Asia/Hong_Kong",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Perth",
  "Australia/Adelaide",
  "Australia/Sydney",
  "Pacific/Auckland",
];
const windows = [
  { id: "daytime", label: "Daytime · 9 AM–6 PM", from: 9, to: 18 },
  { id: "morning", label: "Morning · 6 AM–12 PM", from: 6, to: 12 },
  { id: "afternoon", label: "Afternoon · 12 PM–6 PM", from: 12, to: 18 },
  { id: "evening", label: "Evening · 6 PM–12 AM", from: 18, to: 24 },
  { id: "anytime", label: "Any time · 24 hours", from: 0, to: 24 },
];

function subscribeClock(callback: () => void) {
  const interval = setInterval(callback, 30_000);
  return () => clearInterval(interval);
}
const currentMinute = () => Math.floor(Date.now() / 60_000) * 60_000;
const serverClock = () => 0;
const subscribeTimeZone = () => () => {};
const browserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const serverTimeZone = () => "UTC";
const zoneLabel = (zone: string) => zone.replaceAll("_", " ").replaceAll("/", " / ");

export function MeetingPlanner() {
  const now = useSyncExternalStore(subscribeClock, currentMinute, serverClock);
  const detected = useSyncExternalStore(subscribeTimeZone, browserTimeZone, serverTimeZone);
  const [chosenZone, setChosenZone] = useState("");
  const [chosenDate, setChosenDate] = useState("");
  const [windowId, setWindowId] = useState("anytime");
  const [duration, setDuration] = useState(30);
  const [selection, setSelection] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [status, setStatus] = useState("");
  const timeZone = chosenZone || detected;
  const today = now ? dateInZone(now, timeZone) : "";
  const date = chosenDate || today;
  const hours = windows.find((item) => item.id === windowId)!;
  const slots = useMemo(
    () =>
      now
        ? getMeetingSlots({
            date,
            timeZone,
            fromHour: hours.from,
            toHour: hours.to,
            durationMinutes: duration,
            now,
          })
        : [],
    [date, timeZone, hours.from, hours.to, duration, now],
  );
  const selected = slots.find((slot) => slot.start === selection) || slots[0];
  const visible =
    showAll || slots.length <= 6
      ? slots
      : Array.from(
          { length: 6 },
          (_, index) => slots[Math.round((index * (slots.length - 1)) / 5)],
        );
  const zones = timeZones.includes(detected) ? timeZones : [detected, ...timeZones];

  function changed() {
    setSelection(null);
    setShowAll(false);
    setStatus("");
  }
  function stillFuture() {
    if (!selected || selected.start <= Date.now()) {
      setStatus("That time has passed. Choose another time before continuing.");
      return false;
    }
    return true;
  }
  async function copy() {
    if (!stillFuture()) return;
    try {
      await navigator.clipboard.writeText(meetingBrief(selected, timeZone));
      setStatus("Meeting details copied. The time still needs to be confirmed by email.");
    } catch {
      setStatus(
        "Copy is unavailable here. Use ‘Request this time’ to add the details to the contact form.",
      );
    }
  }
  function download() {
    if (!stillFuture()) return;
    const url = URL.createObjectURL(
      new Blob([meetingCalendar(selected, timeZone, profile.name)], {
        type: "text/calendar;charset=utf-8",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "proposed-meeting-with-prince.ics";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(
      "Tentative calendar reminder downloaded. Send the request below to confirm the meeting.",
    );
  }

  return (
    <section
      id="meeting-planner"
      className="section section-anchor meeting-section"
      aria-labelledby="meeting-title"
    >
      <div className="container">
        <Reveal className="meeting-heading">
          <div>
            <p className="eyebrow">
              <Globe2 size={16} aria-hidden="true" />
              Across time zones
            </p>
            <h2 id="meeting-title">
              A good time.
              <br />
              In both places<span className="accent">.</span>
            </h2>
          </div>
          <div>
            <span className="meeting-availability">
              <span className="status-dot" />
              Meeting requests welcome 24/7
            </span>
            <p>
              Choose a time that works for you. See it in Manila, then send a request so we can
              confirm the details.
            </p>
          </div>
        </Reveal>
        <Reveal className="meeting-panel">
          <div className="meeting-controls">
            <p className="eyebrow">Make it convenient</p>
            <div className="form-field">
              <label htmlFor="meeting-zone">Your timezone</label>
              <select
                id="meeting-zone"
                value={timeZone}
                onChange={(event) => {
                  setChosenZone(event.target.value);
                  changed();
                }}
              >
                {zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zoneLabel(zone)}
                  </option>
                ))}
              </select>
              <span className="form-help">Detected from your browser. You can change it.</span>
            </div>
            <div className="form-field">
              <label htmlFor="meeting-date">Your meeting date</label>
              <input
                id="meeting-date"
                type="date"
                value={date}
                min={today}
                disabled={!now}
                onChange={(event) => {
                  setChosenDate(event.target.value);
                  changed();
                }}
              />
            </div>
            <div className="form-field">
              <label htmlFor="meeting-window">Your preferred hours</label>
              <select
                id="meeting-window"
                value={windowId}
                onChange={(event) => {
                  setWindowId(event.target.value);
                  changed();
                }}
              >
                {windows.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="meeting-duration">Meeting length</label>
              <select
                id="meeting-duration"
                value={duration}
                onChange={(event) => {
                  setDuration(Number(event.target.value));
                  changed();
                }}
              >
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            <p className="meeting-planning-note">
              <CalendarDays size={16} aria-hidden="true" />
              Times are proposals. A slot is confirmed after we agree by email.
            </p>
          </div>
          <div className="meeting-output">
            <div className="meeting-clocks">
              <div>
                <p className="mono">YOUR TIME NOW</p>
                <strong>{now ? meetingTime(now, timeZone) : "—"}</strong>
                <span>{zoneLabel(timeZone)}</span>
              </div>
              <ArrowRight size={18} aria-hidden="true" />
              <div>
                <p className="mono">MANILA NOW</p>
                <strong>{now ? meetingTime(now, MANILA_TIME_ZONE) : "—"}</strong>
                <span>Philippines · UTC+8</span>
              </div>
            </div>
            <div className="meeting-slots-heading">
              <h3>Find a shared moment.</h3>
              <span className="mono">{slots.length} time options</span>
            </div>
            <p className="meeting-slot-help">
              Each option shows your local time and the matching time in Manila.
            </p>
            {visible.length ? (
              <div className="meeting-slots" role="group" aria-label="Suggested meeting times">
                {visible.map((slot) => (
                  <button
                    type="button"
                    key={slot.start}
                    className="meeting-slot"
                    data-start={slot.start}
                    aria-label={`Select ${meetingDateTime(slot.start, timeZone)}; Manila ${meetingDateTime(slot.start, MANILA_TIME_ZONE)}`}
                    aria-pressed={selected?.start === slot.start}
                    onClick={() => {
                      setSelection(slot.start);
                      setStatus("");
                    }}
                  >
                    <span>
                      {meetingTime(slot.start, timeZone, true)}
                      {selected?.start === slot.start && <Check size={13} aria-hidden="true" />}
                    </span>
                    <small>Manila {meetingTime(slot.start, MANILA_TIME_ZONE)}</small>
                    <small>
                      {new Intl.DateTimeFormat("en-US", {
                        timeZone: MANILA_TIME_ZONE,
                        month: "short",
                        day: "numeric",
                      }).format(slot.start)}
                    </small>
                  </button>
                ))}
              </div>
            ) : (
              <div className="meeting-empty">
                <Clock3 size={22} aria-hidden="true" />
                <p>
                  {!now
                    ? "Finding your local time…"
                    : "No future times fit this date and window. Try later hours or another date."}
                </p>
              </div>
            )}
            {slots.length > 6 && (
              <button
                type="button"
                className="meeting-show-all text-link"
                aria-expanded={showAll}
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show suggested times" : `Show all ${slots.length} times`}
              </button>
            )}
            {selected && (
              <div className="meeting-selection">
                <span className="eyebrow">Your proposed meeting</span>
                <p>{meetingDateTime(selected.start, timeZone)}</p>
                <span>
                  Manila: {meetingDateTime(selected.start, MANILA_TIME_ZONE)} · {duration} minutes
                </span>
              </div>
            )}
            <div className="meeting-actions">
              {selected ? (
                <Button asChild>
                  <a
                    href="#contact"
                    onClick={(event) => {
                      if (!stillFuture()) {
                        event.preventDefault();
                        return;
                      }
                      const detail = {
                        source: "meeting",
                        message: meetingBrief(selected, timeZone),
                        accepted: false,
                      };
                      window.dispatchEvent(new CustomEvent("portfolio:brief", { detail }));
                      if (!detail.accepted) {
                        event.preventDefault();
                        setStatus(
                          "The contact form couldn't add this request. Shorten your existing contact message and try again.",
                        );
                      }
                    }}
                  >
                    Request this time
                    <ArrowUpRight size={16} />
                  </a>
                </Button>
              ) : (
                <Button disabled>
                  Request this time
                  <ArrowUpRight size={16} />
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copy}
                disabled={!selected}
                aria-label="Copy meeting details"
                title="Copy meeting details"
              >
                <Copy size={16} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={download}
                disabled={!selected}
                aria-label="Download tentative calendar reminder"
                title="Download tentative calendar reminder"
              >
                <Download size={16} />
              </Button>
            </div>
            <p className="meeting-status" role="status" aria-live="polite">
              {status ||
                "Choose a time, then add it to your message. Nothing is sent automatically."}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

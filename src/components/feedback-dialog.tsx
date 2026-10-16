"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { feedbackBrief } from "@/lib/contact-drafts";

export function FeedbackDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({ project: "", role: "", quote: "", publish: false });
  const prepared = useRef(false);

  function prepare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const project = String(data.get("project") || "").trim();
    const role = String(data.get("role") || "").trim();
    const quote = String(data.get("quote") || "").trim();
    if (project.length < 2 || quote.length < 20) {
      setError("Please add a project name and at least 20 characters of feedback.");
      form
        .querySelector<HTMLElement>(project.length < 2 ? '[name="project"]' : '[name="quote"]')
        ?.focus();
      return;
    }
    const detail = {
      source: "feedback",
      message: feedbackBrief({ project, role, quote, publish: data.get("publish") === "on" }),
      accepted: false,
    };
    window.dispatchEvent(new CustomEvent("portfolio:brief", { detail }));
    if (!detail.accepted) {
      setError(
        "Your contact message is too long to add feedback. Your feedback is kept here; shorten the contact message, then return and try again.",
      );
      return;
    }
    prepared.current = true;
    setOpen(false);
    window.location.hash = "contact";
    requestAnimationFrame(() =>
      document.getElementById("contact-name")?.focus({ preventScroll: true }),
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        prepared.current = false;
        setError("");
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <MessageSquarePlus size={16} />
          Share feedback
        </Button>
      </DialogTrigger>
      <DialogContent
        className="feedback-dialog"
        onCloseAutoFocus={(event) => {
          if (prepared.current) event.preventDefault();
        }}
      >
        <p className="eyebrow">A note about working together</p>
        <DialogTitle className="feedback-dialog-title">
          Your side of the story<span className="accent">.</span>
        </DialogTitle>
        <DialogDescription className="feedback-dialog-description">
          Tell me about our project and your experience. You&apos;ll review the message and add your
          contact details before sending it.
        </DialogDescription>
        <form className="feedback-form" onSubmit={prepare}>
          <div className="form-field">
            <label htmlFor="feedback-project">Project we worked on</label>
            <input
              id="feedback-project"
              name="project"
              value={draft.project}
              onChange={(event) => setDraft({ ...draft, project: event.target.value })}
              required
              minLength={2}
              maxLength={120}
              placeholder="Your project name"
            />
          </div>
          <div className="form-field">
            <label htmlFor="feedback-role">
              Your role / company <span className="feedback-optional">(optional)</span>
            </label>
            <input
              id="feedback-role"
              name="role"
              value={draft.role}
              onChange={(event) => setDraft({ ...draft, role: event.target.value })}
              maxLength={160}
              placeholder="Founder, designer, project lead…"
            />
          </div>
          <div className="form-field">
            <label htmlFor="feedback-quote">Your feedback</label>
            <textarea
              id="feedback-quote"
              name="quote"
              value={draft.quote}
              onChange={(event) => setDraft({ ...draft, quote: event.target.value })}
              required
              minLength={20}
              maxLength={1500}
              rows={5}
              placeholder="What did we build together? What was the collaboration like?"
              aria-describedby="feedback-quote-help"
            />
            <span id="feedback-quote-help" className="form-help">
              20–1,500 characters. Share only details you&apos;re comfortable sending.
            </span>
          </div>
          <label className="feedback-permission">
            <input
              type="checkbox"
              name="publish"
              checked={draft.publish}
              onChange={(event) => setDraft({ ...draft, publish: event.target.checked })}
            />
            <span>
              Prince may publish this feedback with my name, role/company, and project details after
              review.
            </span>
          </label>
          <p className="feedback-review-note">
            Leave the box unchecked to send private feedback. Nothing is published automatically.
          </p>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit">
            Prepare feedback
            <ArrowUpRight size={16} />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

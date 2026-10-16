"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { profile } from "@/content/portfolio";
import { Button } from "@/components/ui/button";
import { hasControlCharacters } from "@/lib/text";
import { addContactDraft } from "@/lib/contact-drafts";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const additions = useRef<Partial<Record<"meeting" | "feedback", string>>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{
    kind: "idle" | "sending" | "success" | "error";
    message: string;
  }>({ kind: "idle", message: "" });

  useEffect(() => {
    function fillBrief(event: Event) {
      if (
        !(event instanceof CustomEvent) ||
        typeof event.detail?.message !== "string" ||
        !messageRef.current
      )
        return;
      const source =
        event.detail.source === "meeting"
          ? "meeting"
          : event.detail.source === "feedback"
            ? "feedback"
            : undefined;
      if (source === "meeting" || source === "feedback") {
        const next = addContactDraft(
          messageRef.current.value,
          event.detail.message,
          additions.current[source],
        );
        if (next === null) {
          setStatus({
            kind: "error",
            message:
              "Your current draft is too long to add this request. Shorten your message and try again.",
          });
          return;
        }
        messageRef.current.value = next;
        additions.current[source] = event.detail.message.trim();
      } else {
        messageRef.current.value = event.detail.message.slice(0, 5000);
        additions.current = {};
      }
      event.detail.accepted = true;
      setErrors({});
      setStatus({
        kind: "idle",
        message:
          source === "meeting"
            ? "Your meeting request is added below. Add your details, then send it for confirmation."
            : source === "feedback"
              ? "Your feedback is ready below. Add your name and email, then send it for review."
              : "Your project blueprint is ready below. Add a little about your idea, then send it over.",
      });
    }
    window.addEventListener("portfolio:brief", fillBrief);
    return () => window.removeEventListener("portfolio:brief", fillBrief);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;
    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
    const nextErrors: FieldErrors = {};
    if (values.name.length < 2 || values.name.length > 80 || hasControlCharacters(values.name))
      nextErrors.name = "Please enter a name between 2 and 80 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254)
      nextErrors.email = "Please enter a valid email address.";
    if (values.message.length < 20 || values.message.length > 5000)
      nextErrors.message = "Please write between 20 and 5,000 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus({ kind: "error", message: "Please check the highlighted fields." });
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)
        ?.focus();
      return;
    }
    if (String(data.get("website") || "")) return;
    setStatus({ kind: "sending", message: "Sending your message…" });
    try {
      const result = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: "", submissionId: crypto.randomUUID() }),
        signal: AbortSignal.timeout(20000),
      });
      const json = await result.json();
      if (!result.ok) {
        if (json.errors)
          setErrors(
            Object.fromEntries(
              Object.entries(json.errors).map(([key, messages]) => [
                key,
                (messages as string[])[0],
              ]),
            ),
          );
        throw new Error(json.message || "Your message could not be sent. Please try again.");
      }
      setStatus({ kind: "success", message: json.message });
      formRef.current?.reset();
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error && error.name !== "TimeoutError"
            ? error.message
            : "That took a little too long. Please try again or email me directly.",
      });
    }
  }

  return (
    <form
      ref={formRef}
      className="contact-form"
      action="/api/contact"
      method="post"
      onSubmit={submit}
      noValidate
      aria-label="Contact Prince"
    >
      <div className="form-heading">
        <h3>Tell me what you have in mind.</h3>
        <span className="mono">SAY HELLO ↗</span>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="contact-name">
            Your name<span>*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder="Alex Santos"
            required
            minLength={2}
            maxLength={80}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <span id="name-error" className="field-error">
              {errors.name}
            </span>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="contact-email">
            Email address<span>*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="alex@company.com"
            required
            maxLength={254}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className="field-error">
              {errors.email}
            </span>
          )}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">
          Your message<span>*</span>
        </label>
        <textarea
          ref={messageRef}
          id="contact-message"
          name="message"
          rows={6}
          placeholder="A project, an opportunity, or just a good conversation…"
          required
          minLength={20}
          maxLength={5000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : "message-help"}
        />
        {errors.message ? (
          <span id="message-error" className="field-error">
            {errors.message}
          </span>
        ) : (
          <span id="message-help" className="form-help">
            A little context goes a long way. At least 20 characters.
          </span>
        )}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-bottom">
        <p>
          Sent through{" "}
          <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer">
            EmailJS
          </a>{" "}
          to my inbox.
        </p>
        <Button type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? (
            <>
              <LoaderCircle size={17} className="spin" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <ArrowUpRight size={17} />
            </>
          )}
        </Button>
      </div>
      <div className={`form-status ${status.kind}`} role="status" aria-live="polite">
        {status.message && (
          <>
            {status.kind === "success" && <Check size={16} />}
            <span>{status.message}</span>
          </>
        )}
      </div>
      <a
        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-gmail-link"
      >
        Prefer Gmail? Compose an email
        <ArrowUpRight size={13} />
      </a>
    </form>
  );
}

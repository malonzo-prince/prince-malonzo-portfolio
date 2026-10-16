"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CircleDashed,
  Database,
  FlaskConical,
  Globe,
  LoaderCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

const layers = [
  { id: "browser", label: "Browser", icon: Globe, description: "Put an idea into a request." },
  { id: "api", label: "API & validation", icon: ShieldCheck, description: "Check what comes in." },
  { id: "data", label: "Data layer", icon: Database, description: "Store the right information." },
  {
    id: "response",
    label: "Response",
    icon: ArrowDownLeft,
    description: "Tell the interface what happened.",
  },
] as const;

type Layer = (typeof layers)[number]["id"];
type TraceStep = { layer: Layer; detail: string; failed?: boolean };
type Scenario = {
  id: string;
  label: string;
  description: string;
  payload: { name: string };
  code: string;
  body: Record<string, unknown>;
  lesson: string;
  summary: string;
  trace: TraceStep[];
};

const scenarios: Scenario[] = [
  {
    id: "success",
    label: "Successful request",
    description: "Follow the full journey.",
    payload: { name: "My next project" },
    code: "201 Created",
    body: { id: "demo_001", name: "My next project", saved: true },
    lesson:
      "A successful request is a conversation between layers. Each one has a clear job, and the interface gets an explicit confirmation.",
    summary: "201 Created. The demo project was saved and the browser received a confirmation.",
    trace: [
      { layer: "browser", detail: "Package the project name as JSON." },
      { layer: "api", detail: "The required name is present. Accept the request." },
      { layer: "data", detail: "Save the sample project in simulated storage." },
      { layer: "response", detail: "Return the created project so the interface can confirm it." },
    ],
  },
  {
    id: "validation",
    label: "Missing a field",
    description: "Catch a problem early.",
    payload: { name: "" },
    code: "400 Bad Request",
    body: {
      error: "VALIDATION_ERROR",
      fields: { name: "A project name is required." },
      saved: false,
    },
    lesson:
      "Validation belongs at the API boundary too. Reject incomplete input before it reaches storage, then tell the visitor exactly what to fix.",
    summary: "400 Bad Request. The missing name was caught before any storage operation.",
    trace: [
      { layer: "browser", detail: "Send the same request with an empty project name." },
      {
        layer: "api",
        detail: "The name is empty. Stop the write and identify the field.",
        failed: true,
      },
      { layer: "response", detail: "Return a field error. No project was saved." },
    ],
  },
  {
    id: "offline",
    label: "Data service offline",
    description: "Handle an unexpected failure.",
    payload: { name: "My next project" },
    code: "503 Service Unavailable",
    body: { error: "DATA_UNAVAILABLE", message: "Please try again shortly.", saved: false },
    lesson:
      "A service failure should never look like success. Return a useful error and keep the visitor's input so they can try again.",
    summary:
      "503 Service Unavailable. Storage failed, so the response reports an error instead of a successful save.",
    trace: [
      { layer: "browser", detail: "Package a valid project name as JSON." },
      { layer: "api", detail: "Validate the name and pass the request to storage." },
      {
        layer: "data",
        detail: "The simulated data service is offline. The write fails.",
        failed: true,
      },
      { layer: "response", detail: "Report the failure so the interface can offer a retry." },
    ],
  },
];

const stateLabels = {
  waiting: "Waiting",
  active: "Running",
  complete: "Done",
  error: "Stopped",
  skipped: "Skipped",
};

export function RequestLab() {
  const [selected, setSelected] = useState("success");
  const [progress, setProgress] = useState(-1);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scenario = scenarios.find((item) => item.id === selected)!;
  const finished = !running && progress === scenario.trace.length - 1;

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  function reset() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    setProgress(-1);
    setRunning(false);
  }

  function run() {
    if (running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(scenario.trace.length - 1);
      return;
    }
    setProgress(0);
    setRunning(true);
    function advance(next: number) {
      timer.current = setTimeout(() => {
        if (next === scenario.trace.length) {
          timer.current = null;
          setRunning(false);
          return;
        }
        setProgress(next);
        advance(next + 1);
      }, 520);
    }
    advance(1);
  }

  return (
    <section
      id="request-lab"
      className="section section-anchor request-lab-section"
      aria-labelledby="request-lab-title"
    >
      <div className="container">
        <Reveal className="request-lab-heading">
          <div>
            <p className="eyebrow">
              <FlaskConical size={15} aria-hidden="true" /> Interactive request lab
            </p>
            <h2 id="request-lab-title">
              One request.
              <br />
              Every layer<span className="accent">.</span>
            </h2>
          </div>
          <p>
            There&apos;s more to an application than its interface. Follow a request through the
            stack, then change the conditions and see what happens.
          </p>
        </Reveal>
        <Reveal className="request-lab-panel">
          <div className="request-lab-topbar">
            <span className="mono">
              <span className="status-dot" /> UNDER THE HOOD
            </span>
            <span>Browser simulation &middot; no data sent</span>
          </div>
          <div
            className="request-lab-scenarios"
            role="group"
            aria-label="Choose a request scenario"
          >
            {scenarios.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                aria-describedby={`lab-scenario-${item.id}`}
                aria-pressed={selected === item.id}
                onClick={() => {
                  reset();
                  setSelected(item.id);
                }}
              >
                <span className="mono">0{index + 1}</span>
                <span>
                  <strong>{item.label}</strong>
                  <small id={`lab-scenario-${item.id}`}>{item.description}</small>
                </span>
                <span className="request-lab-selection" aria-hidden="true">
                  {selected === item.id && <Check size={12} />}
                </span>
              </button>
            ))}
          </div>
          <div className="request-lab-workspace">
            <div className="request-lab-journey">
              <p className="eyebrow">Follow the request</p>
              <ol className="request-lab-layers" aria-label="Request journey">
                {layers.map((layer, index) => {
                  const stepIndex = scenario.trace.findIndex((step) => step.layer === layer.id);
                  const step = scenario.trace[stepIndex];
                  const visited = stepIndex !== -1 && stepIndex <= progress;
                  const active = visited && stepIndex === progress && running;
                  const state = !visited
                    ? finished
                      ? "skipped"
                      : "waiting"
                    : step.failed
                      ? "error"
                      : active
                        ? "active"
                        : "complete";
                  const Icon = layer.icon;
                  return (
                    <li
                      key={layer.id}
                      data-layer={layer.id}
                      data-state={state}
                      aria-current={active ? "step" : undefined}
                    >
                      <span className="request-lab-node" aria-hidden="true">
                        <Icon size={20} strokeWidth={1.5} />
                      </span>
                      <div>
                        <div className="request-lab-layer-title">
                          <span className="mono">0{index + 1}</span>
                          <h3>{layer.label}</h3>
                        </div>
                        <p>
                          {visited
                            ? step.detail
                            : state === "skipped"
                              ? "Skipped. Invalid input never reaches storage."
                              : layer.description}
                        </p>
                      </div>
                      <span className="request-lab-state">
                        {state === "complete" ? (
                          <Check size={12} />
                        ) : state === "error" ? (
                          <X size={12} />
                        ) : state === "active" ? (
                          <LoaderCircle size={12} className="spin" />
                        ) : (
                          <CircleDashed size={12} />
                        )}
                        {stateLabels[state]}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="request-lab-console" aria-label="Simulated request and response">
              <div className="request-lab-console-bar">
                <span className="mono">DEMO REQUEST</span>
                <span className="request-lab-console-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="request-lab-code">
                <p className="request-lab-endpoint">
                  <span>POST</span> /demo/projects
                </p>
                <pre>
                  <code>{JSON.stringify(scenario.payload, null, 2)}</code>
                </pre>
              </div>
              <div className="request-lab-response" aria-busy={running}>
                <p className="request-lab-response-label">
                  <span className="mono">RESPONSE</span>
                  <span
                    className={
                      finished
                        ? `request-lab-http ${selected === "success" ? "success" : "error"}`
                        : "request-lab-pending"
                    }
                  >
                    {finished ? scenario.code : running ? "In progress" : "Not sent"}
                  </span>
                </p>
                <pre>
                  <code>
                    {finished
                      ? JSON.stringify(scenario.body, null, 2)
                      : "// Run the request to see its response."}
                  </code>
                </pre>
              </div>
            </div>
          </div>
          <div className="request-lab-bottom">
            <div className="request-lab-controls">
              <Button type="button" onClick={run} disabled={running}>
                {running ? <LoaderCircle size={16} className="spin" /> : <Play size={15} />}
                {running ? "Running…" : progress === -1 ? "Run request" : "Run again"}
              </Button>
              <Button type="button" variant="ghost" onClick={reset} disabled={progress === -1}>
                <RotateCcw size={14} />
                Reset demo
              </Button>
            </div>
            <p
              className="request-lab-announcement"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {finished
                ? scenario.summary
                : running
                  ? "Tracing the request through each layer…"
                  : "Choose a scenario, then run a request."}
            </p>
          </div>
        </Reveal>
        <div className="request-lab-takeaway">
          <div>
            <p className="eyebrow">Why it matters</p>
            <p>{scenario.lesson}</p>
          </div>
          <a className="text-link" href="/#project-builder">
            Let&apos;s build your idea
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}

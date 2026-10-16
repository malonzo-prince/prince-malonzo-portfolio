"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Check,
  CheckCheck,
  Copy,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  CreditCard,
  FolderKanban,
  Layers3,
  LayoutTemplate,
  MapPin,
  Network,
  Package,
  PanelsTopLeft,
  Radio,
  ShieldCheck,
  Smartphone,
  ShoppingBag,
  Store,
  Receipt,
  Wrench,
} from "lucide-react";
import {
  blueprintFeatures,
  getBlueprint,
  projectCategories,
  projectTypes,
  type BlueprintFeature,
  type ProjectType,
  type ProjectCategory,
} from "@/lib/blueprint";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

const featureIcons = {
  accounts: ShieldCheck,
  dashboard: PanelsTopLeft,
  maps: MapPin,
  content: LayoutTemplate,
  integrations: Network,
  notifications: Radio,
  records: ClipboardList,
  inventory: Package,
  sales: Receipt,
  orders: ShoppingBag,
  bookings: CalendarDays,
  reports: ChartNoAxesCombined,
  payments: CreditCard,
};
const platformIcons = { web: LayoutTemplate, mobile: Smartphone, both: Layers3 };
const categoryIcons = {
  website: LayoutTemplate,
  management: FolderKanban,
  pos: Receipt,
  ecommerce: Store,
  booking: CalendarDays,
  custom: Wrench,
};

export function ProjectBlueprint() {
  const [type, setType] = useState<ProjectType>("web");
  const [category, setCategory] = useState<ProjectCategory>("website");
  const [features, setFeatures] = useState<BlueprintFeature[]>(["content"]);
  const [customName, setCustomName] = useState("");
  const [notes, setNotes] = useState("");
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const blueprint = getBlueprint(type, features, { category, customName, notes });
  const recommended = projectCategories.find((item) => item.id === category)!
    .defaults as readonly BlueprintFeature[];
  const primaryFeatures = new Set<BlueprintFeature>([
    ...recommended,
    "accounts",
    "dashboard",
    "content",
    "integrations",
    "notifications",
  ]);
  const visibleFeatures = showAllFeatures
    ? blueprintFeatures
    : blueprintFeatures.filter(
        (feature) => primaryFeatures.has(feature.id) || features.includes(feature.id),
      );

  function chooseCategory(next: ProjectCategory) {
    setCategory(next);
    setFeatures([...projectCategories.find((item) => item.id === next)!.defaults]);
    setCopyStatus("");
  }

  function toggleFeature(feature: BlueprintFeature) {
    setFeatures((previous) =>
      previous.includes(feature)
        ? previous.filter((item) => item !== feature)
        : [...previous, feature],
    );
    setCopyStatus("");
  }
  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(blueprint.brief);
      setCopyStatus("Brief copied. Add your idea, timeline, and budget when you’re ready.");
    } catch {
      setCopyStatus(
        "Copy isn’t available here. Use ‘Let’s discuss this’ to add the brief to the form.",
      );
    }
  }

  return (
    <section
      id="project-builder"
      className="section section-anchor blueprint-section"
      aria-labelledby="blueprint-title"
    >
      <div id="blueprint" className="container section-anchor">
        <Reveal>
          <div className="blueprint-heading">
            <div>
              <p className="eyebrow">
                <span className="status-dot" />
                Open for freelance work
              </p>
              <h2 id="blueprint-title">
                Your idea.
                <br />
                <span>A starting point.</span>
              </h2>
            </div>
            <p>
              A custom website, a management system, a POS, or an idea of your own. I build around
              your workflow. Choose a starting point, then make it yours.
            </p>
          </div>
        </Reveal>
        <Reveal className="blueprint-builder">
          <div className="blueprint-controls">
            <fieldset>
              <legend>
                <span className="mono">01</span>What would you like to build?
              </legend>
              <div className="blueprint-categories">
                {projectCategories.map((item) => {
                  const Icon = categoryIcons[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`blueprint-category${category === item.id ? " selected" : ""}`}
                      aria-pressed={category === item.id}
                      onClick={() => chooseCategory(item.id)}
                    >
                      <Icon size={19} strokeWidth={1.5} />
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.detail}</small>
                      </span>
                      <span className="blueprint-selection">
                        {category === item.id && <Check size={11} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {category === "custom" && (
                <div className="blueprint-custom-name">
                  <label htmlFor="blueprint-project-name">What kind of project?</label>
                  <input
                    id="blueprint-project-name"
                    value={customName}
                    onChange={(event) => {
                      setCustomName(event.target.value);
                      setCopyStatus("");
                    }}
                    maxLength={100}
                    placeholder="e.g. School portal, rental system, custom tool"
                  />
                </div>
              )}
            </fieldset>
            <fieldset>
              <legend>
                <span className="mono">02</span>Where should it run?
              </legend>
              <div className="blueprint-platforms">
                {projectTypes.map((platform) => {
                  const Icon = platformIcons[platform.id];
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      aria-pressed={type === platform.id}
                      onClick={() => {
                        setType(platform.id);
                        setCopyStatus("");
                      }}
                      className={`blueprint-platform${type === platform.id ? " selected" : ""}`}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                      <span>
                        <strong>{platform.label}</strong>
                      </span>
                      <span className="blueprint-selection">
                        {type === platform.id && <Check size={11} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <fieldset>
              <legend>
                <span className="mono">03</span>Make it yours.
              </legend>
              <p className="blueprint-hint">
                Start with the suggested features. Add or remove anything.
              </p>
              <div id="blueprint-features" className="blueprint-features">
                {visibleFeatures.map((feature) => {
                  const Icon = featureIcons[feature.id];
                  const selected = features.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleFeature(feature.id)}
                      className={`blueprint-feature${selected ? " selected" : ""}`}
                    >
                      <Icon size={17} strokeWidth={1.5} />
                      <span>
                        <strong>{feature.label}</strong>
                        <small>{feature.detail}</small>
                      </span>
                      {selected && <Check size={12} />}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="text-link blueprint-more-features"
                aria-expanded={showAllFeatures}
                aria-controls="blueprint-features"
                onClick={() => setShowAllFeatures(!showAllFeatures)}
              >
                {showAllFeatures ? "Show suggested features" : "Explore all features"}
                <span aria-hidden="true">{showAllFeatures ? "−" : "+"}</span>
              </button>
            </fieldset>
            <div className="blueprint-notes">
              <label htmlFor="blueprint-notes">
                Your ideas & customization <span>Optional</span>
              </label>
              <textarea
                id="blueprint-notes"
                value={notes}
                onChange={(event) => {
                  setNotes(event.target.value);
                  setCopyStatus("");
                }}
                rows={3}
                maxLength={1000}
                placeholder="Tell me about your business, the design you like, or a feature you don’t see here."
              />
              <p>Anything else in mind? Include it here so we can discuss what’s possible.</p>
            </div>
          </div>
          <div className="blueprint-output">
            <div className="blueprint-output-top">
              <span className="mono">YOUR PROJECT BLUEPRINT</span>
              <Braces size={21} strokeWidth={1.3} />
            </div>
            <div className="blueprint-summary" aria-live="polite" aria-atomic="true">
              <h3>
                {blueprint.projectLabel}
                <span className="accent">.</span>
              </h3>
              <p>
                {blueprint.platformLabel} ·{" "}
                {features.length
                  ? `${features.length} feature ${features.length === 1 ? "area" : "areas"}, one connected experience.`
                  : "A blank canvas. Plenty of possibilities."}
              </p>
              <div className="blueprint-flow">
                {blueprint.layers.map((layer, index) => (
                  <div className="blueprint-layer" key={layer.label}>
                    <span className="blueprint-layer-number mono">0{index + 1}</span>
                    <div>
                      <span>{layer.label}</span>
                      <strong>{layer.value}</strong>
                    </div>
                    {index < blueprint.layers.length - 1 && (
                      <ArrowDown size={12} className="blueprint-flow-arrow" />
                    )}
                  </div>
                ))}
              </div>
              <div className="blueprint-stack">
                <span className="mono">A POSSIBLE TOOLKIT</span>
                <div className="project-stack">
                  {blueprint.stack.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="blueprint-output-note">
              A starting direction, not a fixed scope or quote. We’ll work out the right approach
              together.
            </p>
            <div className="blueprint-actions">
              <Button asChild>
                <a
                  href="#contact"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("portfolio:brief", { detail: { message: blueprint.brief } }),
                    )
                  }
                >
                  Let’s discuss this
                  <ArrowUpRight size={16} />
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copyBrief}
                aria-label="Copy project brief"
                title="Copy project brief"
              >
                {copyStatus.startsWith("Brief copied") ? (
                  <CheckCheck size={17} />
                ) : (
                  <Copy size={17} />
                )}
              </Button>
            </div>
            <p className="blueprint-copy-status" role="status">
              {copyStatus}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

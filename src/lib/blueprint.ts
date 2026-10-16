export const projectTypes = [
  { id: "web", label: "Web application", detail: "A useful experience in the browser." },
  { id: "mobile", label: "Mobile application", detail: "An experience made for life on the go." },
  { id: "both", label: "Web + mobile", detail: "One idea, connected across screens." },
] as const;

export type ProjectType = (typeof projectTypes)[number]["id"];

export const projectCategories = [
  {
    id: "website",
    label: "Custom website",
    detail: "Your brand, your design, your features.",
    defaults: ["content"],
  },
  {
    id: "management",
    label: "Management system",
    detail: "Organize people, records, and workflows.",
    defaults: ["accounts", "dashboard", "records", "reports"],
  },
  {
    id: "pos",
    label: "Point of sale (POS)",
    detail: "Sales, receipts, and stock in one place.",
    defaults: ["accounts", "inventory", "sales", "reports"],
  },
  {
    id: "ecommerce",
    label: "E-commerce store",
    detail: "Products, orders, and online checkout.",
    defaults: ["inventory", "orders", "payments", "accounts"],
  },
  {
    id: "booking",
    label: "Booking system",
    detail: "Appointments, schedules, and reservations.",
    defaults: ["bookings", "accounts", "notifications"],
  },
  {
    id: "custom",
    label: "Something else",
    detail: "A custom idea, built around your needs.",
    defaults: [],
  },
] as const;

export type ProjectCategory = (typeof projectCategories)[number]["id"];

export const blueprintFeatures = [
  { id: "accounts", label: "User accounts", detail: "Sign-in and access" },
  { id: "dashboard", label: "Dashboard", detail: "Data at a glance" },
  { id: "maps", label: "Maps & places", detail: "Location features" },
  { id: "content", label: "Manage content", detail: "Easy everyday updates" },
  { id: "integrations", label: "API integrations", detail: "Connect your tools" },
  { id: "notifications", label: "Notifications", detail: "Keep people in the loop" },
  { id: "records", label: "Records & workflows", detail: "Organize your operations" },
  { id: "inventory", label: "Products & inventory", detail: "Catalogs and stock levels" },
  { id: "sales", label: "Sales & receipts", detail: "Checkout and transactions" },
  { id: "orders", label: "Order management", detail: "Track orders and fulfilment" },
  { id: "bookings", label: "Bookings & schedules", detail: "Manage appointments" },
  { id: "reports", label: "Reports & analytics", detail: "Understand your business" },
  { id: "payments", label: "Online payments", detail: "A connected payment provider" },
] as const;

export type BlueprintFeature = (typeof blueprintFeatures)[number]["id"];

export function getBlueprint(
  type: ProjectType,
  features: BlueprintFeature[],
  options: { category?: ProjectCategory; customName?: string; notes?: string } = {},
) {
  const category = projectCategories.find((item) => item.id === (options.category || "website"))!;
  const customName = options.customName?.trim().slice(0, 100);
  const projectLabel = category.id === "custom" ? customName || "Custom project" : category.label;
  const platformLabel = projectTypes.find((item) => item.id === type)!.label;
  const platforms =
    type === "web"
      ? ["Next.js", "TypeScript"]
      : type === "mobile"
        ? ["React Native", "TypeScript"]
        : ["Next.js", "React Native", "TypeScript"];
  const needsData = category.id !== "website" || features.some((feature) => feature !== "content");
  const stack = needsData ? [...platforms, "Node.js", "PostgreSQL"] : platforms;
  if (features.includes("maps")) stack.push("Mapbox API");
  const logic = {
    website: "Custom pages, content + features",
    management: "Records, roles + business workflows",
    pos: "Sales, receipts + checkout workflows",
    ecommerce: "Products, orders + online checkout",
    booking: "Schedules + reservation workflows",
    custom: "Custom features + business rules",
  }[category.id];
  const layers = [
    {
      label: "Experience",
      value:
        type === "both"
          ? "Web + mobile interfaces"
          : type === "mobile"
            ? "Mobile interface"
            : "Responsive web interface",
    },
    {
      label: "Logic",
      value: features.includes("integrations") ? `${logic} + integrations` : logic,
    },
    {
      label: "Data",
      value: !needsData
        ? "Page content + site assets"
        : features.includes("accounts")
          ? "Database + secure user access"
          : "Structured application data",
    },
    { label: "Delivery", value: "Testing, deployment + handover" },
  ];
  const labels = blueprintFeatures
    .filter((feature) => features.includes(feature.id))
    .map((feature) => feature.label);
  const brief = [
    "Hi Prince, I’d like to discuss a freelance project.",
    "",
    `Project type: ${projectLabel}`,
    `Platform: ${platformLabel}`,
    `Features I’m considering: ${labels.length ? labels.join(", ") : "Let’s work these out together"}.`,
    "",
    "My idea and customization requirements:",
    options.notes?.trim().slice(0, 1000) || "I’d like to discuss the details together.",
    "",
    "My preferred timeline:",
    "",
    "My budget range (if available):",
  ].join("\n");
  return { stack, layers, labels, projectLabel, platformLabel, brief };
}

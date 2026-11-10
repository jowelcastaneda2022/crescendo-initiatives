export type Initiative = {
  slug: string;
  code: string;
  title: string;
  tagline: string;
  status: "Active" | "Tracking";
  color: string; // hex accent
  overview: string;
  objectives: string[];
  highlights: { label: string; value: string }[];
  roadmap?: { phase: string; detail: string; done: boolean }[];
  stack: string[];
  howItWorks?: string;
  prerequisites?: string[];
  architecture?: { image?: string; alt?: string; title?: string; flow: string[] };
  why?: string;
  finishLine?: string;
  workflow?: { step: string; title: string; detail: string; tickets: { id: string; label: string; status: string }[] }[];
  inScope?: string[];
  outOfScope?: string[];
  docs?: string;
};

export const initiatives: Initiative[] = [
  {
    slug: "webkiosk-figma-to-magnolia",
    code: "01",
    title: "Webkiosk: Figma to Magnolia",
    tagline: "From design file to live CMS pages, automatically.",
    status: "Active",
    color: "#22d3ee",
    overview:
      "Webkiosk is an internal tool that lets team members build and manage Magnolia CMS content without using the command line or Magnolia directly. It provides a simple web UI that runs Claude AI skills in the background to automate content workflows.",
    objectives: [
      "Build a full site from Figma: point it at a Figma design file and a JCR path, and it generates every page with the correct templates, uploads all images to DAM, and sets up the shared header, navigation and footer automatically",
      "Build a single page from Figma: the same workflow, one page at a time",
    ],
    highlights: [
      { label: "Input", value: "Figma file + JCR path" },
      { label: "Output", value: "Pages, DAM images, header/nav/footer" },
      { label: "Feedback", value: "Live progress tracker" },
    ],
    howItWorks:
      "The UI spawns the Claude CLI as a background process, passing it a skill prompt. Claude reads the skill instructions from the hcpportal-front-web repository and uses the magnolia-dev MCP server to call the Magnolia author API and Figma API on your behalf. Output streams back to the UI in real time, with a progress tracker showing which stage the build is at.",
    prerequisites: [
      "hcpportal-front-web cloned locally",
      "Claude CLI installed and authenticated",
      "Figma personal access token",
      "Magnolia author credentials",
      "A fresh Magnolia browser session cookie (pasted into the UI before each session)",
    ],
    architecture: {
      image: "/initiatives/webkiosk-architecture.png",
      alt: "Webkiosk architecture: UI, Next.js API route, Claude CLI, magnolia-dev MCP server, magnolia-proxy and Magnolia Author",
      flow: [
        "Browser (webkiosk UI)",
        "↓ HTTP POST /api/run-skill (SSE stream)",
        "Next.js API route (route.ts)",
        "↓ spawns process",
        'claude --output-format stream-json --verbose --print "<prompt>"',
        "↓ reads MCP tools from hcpportal-front-web/.mcp.json → magnolia-dev MCP server",
        "↓ MCP tools call",
        "http://localhost:8765 (magnolia-proxy.mjs)",
        "↓ proxies to",
        "https://magnolia-author.test.accelerator.sanofi",
      ],
    },
    stack: ["Claude CLI", "MCP (magnolia-dev)", "Figma API", "Magnolia CMS", "Next.js", "SSE"],
  },
  {
    slug: "agentic-migration",
    code: "02",
    title: "Agentic Migration",
    tagline: "AI agents that move content and code between platforms.",
    status: "Active",
    color: "#a78bfa",
    overview:
      "Project NOMAD: migration using Claude. You ask once (\"Migrate Campus Netherlands Articles to the SWSP Articles app\") and Claude Code runs a deterministic, reviewable migration inside one Magnolia instance. First pair: the Sanofi legacy articles content app to the Nova sswp-articles content app.",
    why:
      "Migration using the CLI is very tedious. Each run today means hand-pulling data, hand-writing mappings and hand-checking results. The legacy articles app is being retired, so its 271 articles (Netherlands 211, KSA 60) have to move first.",
    finishLine:
      "Done when a re-run finds nothing left to migrate: every Netherlands article (then KSA) exists in sswp-articles with the current approved mapping, no exceptions are open, and the 10 spot-check articles per country are approved. Code lives in magic-migrations; decisions are in ADR-0001 as amended by ADR-0002.",
    objectives: [
      "Migrate legacy articles to sswp-articles, run per folder (/Netherlands first, then /KSA), target layout /<site>/articles/<slug>",
      "Field and body mapping (block and column-pattern to section rules)",
      "Review pack and decision file, dry run, Go check, Apply with change detection and conflict protection",
      "Check and the done rule; read-only inspect commands and the /magnolia-migrate skill in magic-migrations, credentials only in .env",
    ],
    highlights: [
      { label: "Articles to move", value: "271 (NL 211, KSA 60)" },
      { label: "Spot checks", value: "10 per country" },
      { label: "Environment", value: "Local author only" },
    ],
    workflow: [
      { step: "1", title: "Map", detail: "Claude drafts the mapping from real data (inspect profile, column patterns, target content type). Reads only.", tickets: [
        { id: "AIX-32", label: "Inspect commands", status: "Done" },
        { id: "AIX-34", label: "Container patterns", status: "Done" },
        { id: "AIX-33", label: "/magnolia-migrate skill", status: "To Do" } ] },
      { step: "2", title: "Review", detail: "You approve the mapping (local review page, decisions saved to a committed file).", tickets: [
        { id: "AIX-37", label: "Review pack and decision file", status: "To Do" } ] },
      { step: "3", title: "Dry run", detail: "Shows what would change. Writes nothing to Magnolia.", tickets: [
        { id: "AIX-35", label: "Magnolia-source dry run", status: "To Do" } ] },
      { step: "4", title: "Go", detail: "You say \"go\" for that exact dry run.", tickets: [
        { id: "AIX-38", label: "Go check before Apply", status: "To Do" } ] },
      { step: "5", title: "Apply", detail: "Code writes the items to Magnolia. The only step that writes; updates changed items in place, never overwrites editor changes.", tickets: [
        { id: "AIX-36", label: "Apply with change detection and conflict protection", status: "To Do" } ] },
      { step: "6", title: "Check", detail: "Validate pages, sort out exceptions and conflicts. Exceptions? Update the mapping and go round again (back to Review).", tickets: [
        { id: "AIX-39", label: "Check pack and done rule", status: "To Do" } ] },
    ],
    architecture: {
      title: "Dependency diagram",
      flow: [
        "AIX-32 inspect commands (Done) ──► AIX-34 container patterns (Done) ──► AIX-33 Map: /magnolia-migrate skill",
        "AIX-33 ─┬─► AIX-35 Dry run ──► AIX-36 Apply ──────────────► AIX-39 Check + done rule",
        "        │        │                                             ▲",
        "        │        └────────────► AIX-38 Go check                │",
        "        └─► AIX-37 Review pack ─┴──────────────────────────────┘",
        "AIX-31 definitions endpoint — parked (watchlist)",
      ],
    },
    inScope: [
      "Content app to content app migration inside one instance: legacy articles to sswp-articles",
      "Read-only inspect commands and the /magnolia-migrate skill in magic-migrations; credentials only in .env",
      "Field and body mapping, review pack and decision file, dry run, Go check, Apply with change detection and conflict protection, Check and the done rule",
      "Local author instance only (localhost:8080/local)",
    ],
    outOfScope: [
      "Taxonomy migration: the run report lists legacy values; editors tag in sswp-articles",
      "Re-linking pages that reference legacy articles, and switching live-site consumers to sswp-articles",
      "Publishing migrated items (editors publish)",
      "Retiring or deleting the legacy app",
      "P1 / P2 page migrations, cross-instance migrations, shared or production environments",
      "The Definitions API (AIX-31, parked) and the Magnolia MCP for writes",
    ],
    docs:
      "ais repo, projects/magnolia-migration/: project hub CLAUDE.md, ADR-0001, ADR-0002, and feature briefs (agentic node reads, block-to-section mapping, content-app migration, review loop).",
    stack: ["Claude Code", "magic-migrations", "Magnolia", "/magnolia-migrate skill", "ADR-0001/0002"],
  },
  {
    slug: "qa-automation-tool",
    code: "03",
    title: "QA Automation Tool",
    tagline: "Faster, smarter regression testing for every release.",
    status: "Active",
    color: "#34d399",
    overview:
      "A QA automation platform that generates, runs and reports on end-to-end tests across our web properties, catching visual and functional regressions before they reach production.",
    objectives: [
      "Auto-generate test cases from user flows",
      "Run visual and functional regression on every release",
      "Surface clear, actionable reports for teams",
    ],
    highlights: [
      { label: "Coverage", value: "E2E + visual" },
      { label: "Runs", value: "CI-integrated" },
      { label: "Reporting", value: "Real-time" },
    ],
    roadmap: [
      { phase: "Framework", detail: "Core runner and reporting", done: true },
      { phase: "Generation", detail: "AI-assisted test authoring", done: false },
      { phase: "CI/CD", detail: "Pipeline integration", done: false },
      { phase: "Dashboards", detail: "Quality metrics for stakeholders", done: false },
    ],
    stack: ["Playwright", "CI/CD", "Visual Diffing", "Reporting"],
  },
  {
    slug: "ai-agent",
    code: "04",
    title: "AI Agent",
    tagline: "A digital teammate for everyday web operations.",
    status: "Active",
    color: "#f472b6",
    overview:
      "The AI Agent initiative delivers an assistant that handles routine requests, answers questions about our platforms and automates repetitive tasks, freeing teams to focus on higher-value work.",
    objectives: [
      "Automate repetitive operational requests",
      "Provide instant, grounded answers from internal knowledge",
      "Integrate safely with existing tools and permissions",
    ],
    highlights: [
      { label: "Mode", value: "Conversational" },
      { label: "Grounding", value: "Internal knowledge" },
      { label: "Guardrails", value: "Role-based access" },
    ],
    roadmap: [
      { phase: "Use cases", detail: "Prioritize high-value tasks", done: true },
      { phase: "Pilot", detail: "Limited-team rollout", done: false },
      { phase: "Integrations", detail: "Connect to core tools", done: false },
      { phase: "Expansion", detail: "Broader adoption", done: false },
    ],
    stack: ["LLM", "RAG", "Tool Use", "Access Control"],
  },
  {
    slug: "seo-geo-tool",
    code: "05",
    title: "SEO/GEO Tool",
    tagline: "Be found by search engines and generative AI alike.",
    status: "Tracking",
    color: "#fbbf24",
    overview:
      "The SEO/GEO Tool analyzes our content for traditional search optimization and generative engine optimization, recommending improvements so our pages surface in both search results and AI-generated answers.",
    objectives: [
      "Audit pages for SEO and GEO readiness",
      "Recommend structured data and content improvements",
      "Track visibility across search and AI engines",
    ],
    highlights: [
      { label: "Scope", value: "SEO + GEO" },
      { label: "Output", value: "Actionable audits" },
      { label: "Tracking", value: "Visibility trends" },
    ],
    roadmap: [
      { phase: "Requirements", detail: "Define audit criteria", done: true },
      { phase: "Audit engine", detail: "Page analysis and scoring", done: false },
      { phase: "Recommendations", detail: "Automated suggestions", done: false },
      { phase: "Monitoring", detail: "Visibility dashboards", done: false },
    ],
    stack: ["Crawler", "Structured Data", "LLM Analysis", "Analytics"],
  },
  {
    slug: "mlr-express",
    code: "06",
    title: "MLR Express",
    tagline: "Accelerating Medical, Legal and Regulatory review.",
    status: "Tracking",
    color: "#fb7185",
    overview:
      "MLR Express speeds up the Medical, Legal and Regulatory review cycle for digital content by organizing submissions, automating pre-checks and giving reviewers a clear, traceable workflow.",
    objectives: [
      "Shorten review cycle times",
      "Automate pre-checks against approved claims and references",
      "Maintain a complete, compliant approval trail",
    ],
    highlights: [
      { label: "Cycle time", value: "Reduced" },
      { label: "Compliance", value: "Full traceability" },
      { label: "Workflow", value: "Single hub" },
    ],
    roadmap: [
      { phase: "Process mapping", detail: "Document current MLR flow", done: true },
      { phase: "Workflow", detail: "Submission and review hub", done: true },
      { phase: "Pre-checks", detail: "Automated claim validation", done: false },
      { phase: "Rollout", detail: "Adoption across teams", done: false },
    ],
    stack: ["Workflow Engine", "Claims Library", "Audit Trail", "AI Pre-check"],
  },
];

export const getInitiative = (slug: string) =>
  initiatives.find((i) => i.slug === slug);

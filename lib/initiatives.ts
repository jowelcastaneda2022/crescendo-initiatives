export type Block =
  | { type: "table"; title: string; intro?: string; columns: string[]; rows: string[][] }
  | { type: "list"; title: string; intro?: string; items: string[] }
  | { type: "steps"; title: string; intro?: string; steps: { title: string; detail: string; lane: string }[]; image?: { src: string; alt: string } };

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
  blocks?: Block[];
  children?: { slug: string; title: string; tagline: string; overview?: string; highlights?: { label: string; value: string }[]; blocks?: Block[] }[];
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
    children: [
      { slug: "figma-to-magnolia-testing", title: "Figma to Magnolia Testing", tagline: "Compare a Figma design with the page that implements it.",
        overview: "QA Tools holds a Figma design against the page that implements it and reports what differs: fonts, sizes, colours and the text that carries them, with every finding pinned to where it sits on the page.",
        highlights: [
          { label: "Compares", value: "Fonts, sizes, colours, text" },
          { label: "Scope", value: "One page or a whole site" },
          { label: "Runs", value: "On a laptop, no AWS" },
        ],
        blocks: [
        {
                "type": "list",
                "title": "What a check does",
                "intro": "The SVG carries the design's fonts, sizes and colours. The page is photographed at the width the design was drawn at, and the same properties are read out of the live DOM. Matching text is paired up and compared, so a finding reads \"16px → 14px on Learn about type 2 inflammation\" rather than \"these pixels differ\".",
                "items": [
                        "Design Check: one Figma frame against the page that implements it",
                        "Site Check: the same thing across a whole site, with one design frame per page. Findings are rolled up so a mistake that appears on every page reads as one defect in a component"
                ]
        },
        {
                "type": "table",
                "title": "Four views",
                "columns": [
                        "View",
                        "What it shows"
                ],
                "rows": [
                        [
                                "Side by side",
                                "The design and the page next to each other"
                        ],
                        [
                                "Overlay",
                                "Fade between the design and the page"
                        ],
                        [
                                "Issues",
                                "Every finding as a numbered dot on the page, click to jump"
                        ],
                        [
                                "Design",
                                "The design frame itself"
                        ]
                ]
        },
        {
                "type": "list",
                "title": "Requirements and setup",
                "intro": "A slim build of the Opella Dashboard carrying QA Tools and Settings only. It runs on a laptop with no JumpCloud account, no AWS and no database to set up. The full dashboard (tickets, monitoring, analytics, Site Compare) lives on the develop branch.",
                "items": [
                        "Node 22, and Chromium for Playwright (npx playwright install chromium)",
                        "npm install, then npm run seed (creates server/database.sqlite and the admin account), then npm run dev (Vite on :5173, API on :3000)",
                        "Open http://localhost:5173 and sign in with the account the seed creates. Change its password in Settings if the machine is shared",
                        "No .env is needed: JWT_SECRET falls back to a development value, and the schema is created on first import of server/db.js"
                ]
        },
        {
                "type": "list",
                "title": "The Figma token",
                "intro": "QA Tools exports design frames through the Figma API, which needs a personal access token.",
                "items": [
                        "Paste it into Settings → API keys → Figma personal access token, then press Test. It calls /v1/me and reports the account the token belongs to",
                        "Create one in Figma under Settings → Security → personal access tokens, with file_read scope, from an account that can open the files you are checking",
                        "Tokens are stored in your local database and never returned by the API; the page shows only the last four characters",
                        "No token is needed for the Upload export path: export the frames by hand from Figma (SVG, with Outline Text unchecked) and upload them. This costs no API calls, which matters because a full-depth read of a handful of page frames can exhaust a token's rate limit for days"
                ]
        },
        {
                "type": "list",
                "title": "Demo runs",
                "intro": "npm run seed:demo restores two finished site checks so QA Tools has something real in it before you have a token or site access: a five-page Figma suite against a demo site, and a one-page upload check (9.5 MB of screenshots under demo/). Safe to run twice.",
                "items": [
                        "They are a record, not a starting point: re-running one fails by design, because credentials were left out of the bundle, one-shot preview links were stripped from the URLs, and the design SVGs were left behind",
                        "npm run demo:export rebuilds the bundle from whatever runs a dashboard holds"
                ]
        },
        {
                "type": "table",
                "title": "Layout",
                "columns": [
                        "Path",
                        "What it holds"
                ],
                "rows": [
                        [
                                "server/routes/",
                                "auth, settings, figma (the only three mounted here)"
                        ],
                        [
                                "server/lib/",
                                "figma-runner, svg-styles, design-report, page-styles, storage"
                        ],
                        [
                                "server/fonts/",
                                "Brand faces, injected when an SVG is rasterised locally"
                        ],
                        [
                                "server/db.js",
                                "Schema, applied on import"
                        ],
                        [
                                "src/pages/qa/",
                                "DesignCheckTab, SiteCheckTab"
                        ],
                        [
                                "src/composables/",
                                "useFigma, useFigmaSuite (module-level singleton refs)"
                        ]
                ]
        },
        {
                "type": "list",
                "title": "Tests",
                "intro": "No test runner. Server libraries are plain ES modules with no side effects on import, so they are exercised with throwaway scripts against a scratch database. Never point one at server/database.sqlite, which is the real one.",
                "items": [
                        "DB_PATH=/tmp/scratch.sqlite COMPARE_OUTPUT_DIR=/tmp/shots node your-script.mjs"
                ]
        }
] },
      { slug: "live-site-to-magnolia-testing", title: "Live Site to Magnolia Testing", tagline: "Verify Magnolia content matches the live site." },
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
    children: [
      { slug: "conversation-ai", title: "Conversation AI", tagline: "Conversational assistant for everyday web operations." },
      { slug: "wisdomat", title: "Wisdomat", tagline: "AI knowledge wiki with cited answers and steward review.",
        overview: "Wisdomat is an AI-powered knowledge wiki. Handbook entries and sources are compiled into wiki pages that stewards review and approve, and people use Ask to get answers with citations. Questions the wiki can't answer become gaps that stewards fill. It is tracked as the AI Tool epic (AIX-16), which is 63% done, and runs at wisdomat.app.crescendo.io.",
        highlights: [
          { label: "Progress", value: "63% done (42 of 66)" },
          { label: "Live at", value: "wisdomat.app.crescendo.io" },
          { label: "Jira epic", value: "AIX-16 AI Tool" },
        ],
        blocks: [
        {
                "type": "table",
                "title": "Progress (Jira epic AIX-16: AI Tool)",
                "columns": [
                        "Status",
                        "Items",
                        "Tickets"
                ],
                "rows": [
                        [
                                "Done",
                                "42",
                                "AIX-54 to AIX-95"
                        ],
                        [
                                "In Review",
                                "1",
                                "AIX-22 AI Tool Planning"
                        ],
                        [
                                "In Progress",
                                "3",
                                "AIX-96, AIX-97, AIX-98"
                        ],
                        [
                                "To Do",
                                "20",
                                "AIX-99 to AIX-118"
                        ]
                ]
        },
        {
                "type": "list",
                "title": "Delivered so far",
                "items": [
                        "Foundation: discovery, product design and success criteria, stack and hosting, project foundation (app, database, migrations, CI), accounts, invites and roles, sign in with Google, deploy to AWS at wisdomat.app.crescendo.io",
                        "AI layer: providers, models and fallback; admin-set AI keys and models with an hourly Ask limit; connected AIs (agent API and skill file)",
                        "Wiki: handbook entries, topics and review intervals; LLM wiki direction based on Karpathy's LLM Wiki; page types and links between pages; compile sources into changesets that stewards approve; weekly wiki health check; bulk import and entry template; AI-assisted new entry page",
                        "Ask: answers from the handbook with citations; brand and Ask layout; reported answers (\"Something wrong with this answer?\"); show where pages came from",
                        "Review and gaps: review queue for stewards; inbox for submissions the AI reads and drafts; open gaps within seconds; dismissed gaps view and auto-reopen after 3 asks; answers not in the wiki become gaps",
                        "Quality: quality canary that grades answers and compiles alerts; demo readiness (test questions checked on live, demo script)",
                        "Operations: faster CI, safe deploys (drain, update banner, self-restarting compiles), copy the live wiki to a local database, question counts per person, dependency and security updates"
                ]
        },
        {
                "type": "list",
                "title": "In progress",
                "items": [
                        "AIX-96 Partial answers become gaps for the missing part",
                        "AIX-97 Clean pages with version history and highlighted changes",
                        "AIX-98 Source attribution and clearer wiki cards"
                ]
        },
        {
                "type": "list",
                "title": "Up next",
                "items": [
                        "Quality canary live setup (test questions and Slack alerts); gap visibility with answer type, Resolved view and weekly trend; filling a gap adds a canary test question automatically",
                        "Claims: store each fact with its source and date; stale info nudges (expiry dates, as of in Ask, still true); contradictions shown like merge conflicts for a steward to pick",
                        "People directory (names, roles, teams and aliases); per-user memory (common questions and suggestions)",
                        "Confidential content (labels, access and real delete); approvals at scale (auto-approve low-risk changes); usage and quality dashboard for admins; steward decision log the AI learns from",
                        "Staging environment before live; canary load test at 2,000+ pages; upgrade to zod 4; clear remaining dependency warnings; fix open gaps tab scrolling sideways",
                        "Add knowledge from Slack and Google Drive; backup and restore runbook for the live database; company rollout (onboarding, steward training and feedback)"
                ]
        },
        {
                "type": "table",
                "title": "Epic details",
                "columns": [
                        "Field",
                        "Value"
                ],
                "rows": [
                        [
                                "Jira epic",
                                "AIX-16 AI Tool (In Progress)"
                        ],
                        [
                                "Assignee",
                                "Philip Ang"
                        ],
                        [
                                "Reporter",
                                "Joshua Figueroa"
                        ],
                        [
                                "Created",
                                "October 20, 2026"
                        ],
                        [
                                "Last updated",
                                "November 6, 2026"
                        ]
                ]
        }
] },
    ],
    stack: ["LLM", "RAG", "Tool Use", "Access Control"],
  },
  {
    slug: "seo-geo-tool",
    code: "05",
    title: "SEO/GEO Tool",
    tagline: "SEO, analytics and AI-readiness checks for any site.",
    status: "Tracking",
    color: "#fbbf24",
    overview:
      "A Crescendo tool that checks a website from a link: page metadata, structured data (schema.org), hreflang, sitemap.xml and the analytics dataLayer. A later GEO layer covers AI readiness: can AI crawlers reach the pages, and do AI answer engines cite the brand. Target users include QAs and people without a developer setup.",
    objectives: [
      "Check page metadata, structured data (schema.org), hreflang, sitemap.xml and the analytics dataLayer from a link",
      "GEO layer: can AI crawlers reach the pages, and do AI answer engines cite the brand",
      "Make it usable by QAs and people without a developer setup",
    ],
    highlights: [
      { label: "In use on", value: "Opella" },
      { label: "GEO", value: "Early research" },
      { label: "Direction", value: "One site vs Crescendo standard" },
    ],
    blocks: [
      {
            "type": "list",
            "title": "Where we are",
            "items": [
                  "In use on Opella: automated SEO, sitemap and dataLayer tests for the headful to headless Magnolia migration. They have graded every go-live batch since September 2026.",
                  "These tests compare the new site with the old site and are built around Opella's sites, so they are not reusable as they are.",
                  "GEO: early research only. The Opella schema enhancements are on hold until client approval."
            ]
      },
      {
            "type": "list",
            "title": "Direction",
            "items": [
                  "Change from \"compare with the old site\" to \"check one site against a Crescendo standard\", so any team can run it on any client site.",
                  "It can later become part of the Crescendo QA Tool (AIX-15)."
            ]
      }
],
    stack: ["schema.org", "hreflang", "sitemap.xml", "dataLayer", "Magnolia"],
  },
  {
    slug: "mlr-express",
    code: "06",
    title: "MLR Express",
    tagline: "Accelerating Medical, Legal and Regulatory review.",
    status: "Tracking",
    color: "#fb7185",
    overview:
      "Pharma companies can't publish a web page until it passes MLR review (Medical, Legal and Regulatory). The approved record of every page is kept in Veeva PromoMats. MLR Express does the keeping-in-step automatically: an editor clicks one button in the website editor (CMS), and MLR Express builds the PDF, sends it to PromoMats, brings the approval details back to the page, and watches the expiry date.",
    why:
      "Without MLR Express, keeping the website and PromoMats in step is slow, manual work: screenshot every page and hidden section, build a PDF, upload it, add notes, copy the approval details back into the website, and remember to take the page down when approval expires.",
    objectives: [],
    highlights: [
      { label: "Live customer", value: "Sanofi V-Links" },
      { label: "Magnolia connector", value: "Live" },
      { label: "Sitecore connector", value: "In development" },
    ],
    blocks: [
      {
            "type": "table",
            "title": "What it can do",
            "columns": [
                  "Feature",
                  "In simple terms"
            ],
            "rows": [
                  [
                        "PDF Creator",
                        "Makes a review-ready PDF of a page in one click, including hidden parts like tabs and accordions"
                  ],
                  [
                        "Auto Annotate",
                        "Adds notes to the PDF for reviewers (links, image descriptions, marked areas)"
                  ],
                  [
                        "Data Sync",
                        "Copies the PromoMats status, MAT code, version and expiry date onto the page"
                  ],
                  [
                        "Lifecycle",
                        "Sends alerts before expiry, can unpublish expired pages and schedule publishing"
                  ],
                  [
                        "Health Dashboard and Digest",
                        "One view of every site's content health, plus a monthly email summary"
                  ]
            ],
            "intro": "V-Links is the name of the Sanofi setup of MLR Express on Magnolia. It is the main live customer today."
      },
      {
            "type": "table",
            "title": "Architecture: the main parts",
            "columns": [
                  "Part",
                  "What it does"
            ],
            "rows": [
                  [
                        "Opus",
                        "The \"brain\" (core API). Handles logins, clients, business rules, the Veeva connection and the database. Every other part talks to it."
                  ],
                  [
                        "Capture",
                        "Turns a web page into an annotated PDF."
                  ],
                  [
                        "Dashboard",
                        "The admin website where the team sets up clients, CMS platforms, sites and PDF settings, and views reports."
                  ],
                  [
                        "CMS connectors",
                        "Plug-ins installed inside the client's website editor that add the MLR Express buttons."
                  ]
            ]
      },
      {
            "type": "table",
            "title": "CMS connectors and their status",
            "columns": [
                  "CMS",
                  "Status"
            ],
            "rows": [
                  [
                        "Magnolia",
                        "Live (Sanofi V-Links)"
                  ],
                  [
                        "Sitecore",
                        "In development"
                  ],
                  [
                        "Contentful",
                        "Proof of concept"
                  ],
                  [
                        "PowerPoint",
                        "Proof of concept (on hold)"
                  ]
            ]
      },
      {
            "type": "table",
            "title": "Environments",
            "columns": [
                  "Environment",
                  "Dashboard"
            ],
            "rows": [
                  [
                        "Dev (testing new work)",
                        "https://dev-app.mlrexpress.com/"
                  ],
                  [
                        "Preview (final checks and sales demos)",
                        "https://preview-app.mlrexpress.com/"
                  ],
                  [
                        "Production (live, used daily by Sanofi)",
                        "https://app.mlrexpress.com/"
                  ]
            ],
            "intro": "MLR Express runs on AWS with three environments."
      },
      {
            "type": "steps",
            "title": "The flow: how a page gets approved",
            "intro": "Before any of this: the support team sets up the client, the CMS platform and each site in the MLR Express Dashboard (app.mlrexpress.com), and the MLR Express module is installed in the client's CMS.",
            "image": {
                  "src": "/initiatives/mlr-express-flow.webp",
                  "alt": "MLR Express: how a web page gets MLR approved, across the website editor, MLR Express and Veeva PromoMats"
            },
            "steps": [
                  {
                        "lane": "Website editor (CMS)",
                        "title": "Editor clicks \"Send to PromoMats\"",
                        "detail": "On a page in the CMS. No screenshots or manual PDF needed."
                  },
                  {
                        "lane": "MLR Express",
                        "title": "Opus receives the request",
                        "detail": "The MLR Express API checks the site, its settings and its Veeva connection."
                  },
                  {
                        "lane": "MLR Express",
                        "title": "Capture builds a review-ready PDF",
                        "detail": "Includes tabs, accordions, carousels and safety info (ISI), plus reviewer notes."
                  },
                  {
                        "lane": "Veeva PromoMats",
                        "title": "PDF is uploaded to PromoMats",
                        "detail": "As a new document, or as a new version of the page's existing document."
                  },
                  {
                        "lane": "Veeva PromoMats",
                        "title": "MLR team reviews and approves",
                        "detail": "Medical, Legal and Regulatory review, done in PromoMats as usual."
                  },
                  {
                        "lane": "MLR Express",
                        "title": "Result is synced back",
                        "detail": "MLR Express pulls the status, MAT code, version and expiry date."
                  },
                  {
                        "lane": "Website editor (CMS)",
                        "title": "Page shows its approval details",
                        "detail": "Only pages that are Approved for Distribution should go live."
                  },
                  {
                        "lane": "MLR Express",
                        "title": "Expiry is watched",
                        "detail": "Alerts go out as the expiry date gets close."
                  },
                  {
                        "lane": "Website editor (CMS)",
                        "title": "Expired page is taken down",
                        "detail": "MLR Express can unpublish the page automatically when approval expires."
                  }
            ]
      },
      {
            "type": "table",
            "title": "Leadership",
            "columns": [
                  "Role",
                  "Person"
            ],
            "rows": [
                  [
                        "Product Owner",
                        "Jeremy Summers"
                  ],
                  [
                        "Producer",
                        "Rin Manabat"
                  ],
                  [
                        "Tech Lead",
                        "Connor McGinn (JC)"
                  ],
                  [
                        "Support Lead",
                        "Nimrod Aquino"
                  ]
            ]
      },
      {
            "type": "table",
            "title": "Teams",
            "columns": [
                  "Team",
                  "Members"
            ],
            "rows": [
                  [
                        "MLR Express Product Team",
                        "Leo Gerald Bernabe, John James Libron, Lawrence Namoc (Lucas Belcher, now deactivated)"
                  ],
                  [
                        "V-Links (Sanofi)",
                        "Connor McGinn (JC), Floriano Solijon, Lawrence Namoc (Lucas Belcher, now deactivated)"
                  ],
                  [
                        "Support Team (Sanofi)",
                        "Nimrod Aquino"
                  ]
            ]
      },
      {
            "type": "list",
            "title": "Install the Magnolia module (advanced-veeva)",
            "intro": "Installed by a developer as part of the Magnolia project. Needs Java 17, Apache Maven 3 and Magnolia CMS 6.2.46 or newer.",
            "items": [
                  "A developer adds the advanced-veeva module to the Magnolia project's Maven files (POM) and deploys Magnolia",
                  "Check it worked: an MLR Express app appears in Magnolia, and MLR Express actions appear in the Pages app",
                  "Connect to PromoMats with help from MLR Express Support: give Support the Veeva PromoMats system user details, get an MLR Express API key from Support, and enter it in the MLR Express app in Magnolia",
                  "Work with Support to map PromoMats fields to Magnolia fields",
                  "Support adds the site in the MLR Express Dashboard, activates V-Links and sets up Global Scenes (needed for PDF preview)"
            ]
      },
      {
            "type": "list",
            "title": "Install the Sitecore module (in development)",
            "intro": "Installed as a Sitecore package.",
            "items": [
                  "In Sitecore, click the Sitecore icon (bottom left), then Development Tools → Installation Wizard",
                  "Click Upload Package and upload the MLR Express package file (MLRexpress-1.0.0.zip, from the crescendo-sitecore-sandbox repo)",
                  "Select the package, click Next and follow the prompts to install",
                  "Restart Sitecore",
                  "Setup: a developer fills in the MLR Express settings file (API address, client ID and API key from Support) and adds the Veeva Metadata template to the site's page template",
                  "Optional: turn on the scheduled job that publishes approved pages and unpublishes expired pages automatically"
            ]
      },
      {
            "type": "table",
            "title": "Repositories",
            "columns": [
                  "Repository",
                  "What it is"
            ],
            "rows": [
                  [
                        "mlrx-opus",
                        "Opus, the core API"
                  ],
                  [
                        "mlrx-dashboard",
                        "The admin Dashboard website"
                  ],
                  [
                        "mlrx-capture",
                        "Capture, the page-to-PDF service"
                  ],
                  [
                        "mlrx-advanced-veeva",
                        "Magnolia connector (the module behind V-Links)"
                  ],
                  [
                        "mlrx-docs",
                        "Public docs site (docs.mlrexpress.com)"
                  ],
                  [
                        "mlrx-magnolia-audit",
                        "Support tool that checks Magnolia sites against PromoMats"
                  ],
                  [
                        "mlrx-contentful-app",
                        "Contentful connector (proof of concept)"
                  ],
                  [
                        "mlrx-ms-office",
                        "PowerPoint add-in (proof of concept, on hold)"
                  ],
                  [
                        "crescendo-sitecore-sandbox",
                        "Sitecore sandbox that holds the Sitecore connector package"
                  ]
            ]
      },
      {
            "type": "list",
            "title": "Resource links",
            "intro": "Public docs: https://docs.mlrexpress.com",
            "items": [
                  "Start here: MLRexpress Confluence space, MLRx Introduction, PromoMats and MLR Primer, New Engineer Onboarding",
                  "Jira: Product Team Kanban Board, Support Board",
                  "Engineering: Architecture and Infrastructure, Deployments, Logs and Monitoring, Troubleshooting, Access and Credentials, Releases, Release Notes",
                  "Support and operations: Adding a new site (Prod), Adding a new site (PreProd), Tenant Onboarding (Magnolia), V-Links basic smoke testing, Health Dashboard: Feature Guide"
            ]
      },
      {
            "type": "table",
            "title": "Glossary",
            "columns": [
                  "Term",
                  "Meaning"
            ],
            "rows": [
                  [
                        "MLR",
                        "Medical, Legal and Regulatory review. Required before any promotional content goes live."
                  ],
                  [
                        "Veeva PromoMats (Vault)",
                        "The system where MLR review happens and approved materials are stored."
                  ],
                  [
                        "MAT code",
                        "The ID number of an approved document in PromoMats. Each web page has its own."
                  ],
                  [
                        "CMS",
                        "The website editor, for example Magnolia or Sitecore."
                  ],
                  [
                        "V-Links",
                        "The Sanofi setup of MLR Express on Magnolia."
                  ],
                  [
                        "ISI",
                        "Important Safety Information, the safety text that must appear on pharma pages."
                  ],
                  [
                        "Tenant",
                        "A client account in MLR Express."
                  ],
                  [
                        "Approved for Distribution",
                        "The only PromoMats status that means a page may go live."
                  ]
            ]
      }
],
    stack: ["Opus (API)", "Capture (PDF)", "Dashboard", "Veeva PromoMats", "AWS", "Magnolia", "Sitecore"],
  },
];

export const getInitiative = (slug: string) =>
  initiatives.find((i) => i.slug === slug);

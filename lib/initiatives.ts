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
      "Webkiosk is an internal tool that lets team members build and manage website content in Magnolia (our website management system) without any technical commands and without working in Magnolia directly. It gives you a simple web page, and behind the scenes an AI assistant (Claude) does the work of turning designs into pages.",
    objectives: [
      "Build a full site from Figma: point Webkiosk at a Figma design file and a location in Magnolia, and it creates every page with the right templates, uploads all the images, and sets up the shared header, menu and footer automatically",
      "Build a single page from Figma: the same process, one page at a time",
    ],
    highlights: [
      { label: "You provide", value: "A Figma design + a Magnolia location" },
      { label: "You get", value: "Finished pages, images, header, menu, footer" },
      { label: "Feedback", value: "Live progress tracker" },
    ],
    howItWorks:
      "When you start a job, Webkiosk quietly launches the AI assistant (Claude) in the background and gives it the instructions for the task. Claude follows those instructions, which are kept in the hcpportal-front-web project, and uses a connector tool (called magnolia-dev) to read the design from Figma and create the pages in Magnolia on your behalf. What it is doing appears on screen in real time, with a progress tracker showing which stage the build is at.",
    prerequisites: [
      "A copy of the hcpportal-front-web project on your computer",
      "The Claude app installed and signed in",
      "A Figma access key (a personal token that lets Webkiosk read your designs)",
      "Your Magnolia author login details",
      "A fresh Magnolia browser session code, pasted into Webkiosk before each session",
    ],
    architecture: {
      image: "/initiatives/webkiosk-architecture.png",
      alt: "Webkiosk architecture: the Webkiosk screen, its server, the Claude AI assistant, the magnolia-dev connector, a helper on your computer and Magnolia Author",
      title: "How the pieces connect",
      flow: [
        "You use the Webkiosk web page",
        "↓ your request is sent, and progress is streamed back live",
        "Webkiosk's server receives the request",
        "↓ starts the AI assistant (Claude) in the background with the job instructions",
        "Claude reads which tools it may use (the magnolia-dev connector)",
        "↓ the connector asks for work to be done",
        "A small helper on your computer (magnolia-proxy) passes requests along using your login",
        "↓ forwards them to",
        "Magnolia Author, the test website system (magnolia-author.test.accelerator.sanofi)",
      ],
    },
    stack: ["Claude (AI assistant)", "magnolia-dev connector", "Figma", "Magnolia CMS", "Next.js web app", "Live progress streaming"],
  },
  {
    slug: "agentic-migration",
    code: "02",
    title: "Agentic Migration",
    tagline: "AI agents that move content and code between platforms.",
    status: "Active",
    color: "#a78bfa",
    overview:
      "Project NOMAD: moving content with the help of Claude (our AI assistant). You ask once, for example \"Migrate Campus Netherlands Articles to the SWSP Articles app\", and Claude Code carries out a predictable, reviewable migration inside a single Magnolia system. The first job moves articles from the old Sanofi articles app to the new Nova sswp-articles app.",
    why:
      "Moving content by hand-typed commands is very tedious. Every run today means pulling the data by hand, writing the rules for how old fields match new ones by hand, and checking the results by hand. The old articles app is being retired, so its 271 articles (Netherlands 211, KSA 60) have to move first.",
    finishLine:
      "Done when a re-run finds nothing left to move: every Netherlands article (then KSA) exists in sswp-articles using the current approved matching rules, no problems are left open, and 10 sample articles per country have been checked and approved. The code lives in magic-migrations, and the decisions are recorded in ADR-0001 as updated by ADR-0002 (written decision records).",
    objectives: [
      "Move the old articles into sswp-articles one folder at a time (Netherlands first, then KSA), with each article placed under its site's articles section",
      "Decide how each old field and the article body map to the new layout",
      "Give people a review pack to approve the rules, a preview of the changes, a final \"go\" check, and a careful apply step that detects changes and protects editors' work",
      "Check the results and apply a clear \"done\" rule. The assistant can only read during the early steps, and passwords are kept in a private settings file",
    ],
    highlights: [
      { label: "Articles to move", value: "271 (Netherlands 211, KSA 60)" },
      { label: "Spot checks", value: "10 per country" },
      { label: "Where it runs", value: "Local test system only" },
    ],
    workflow: [
      { step: "1", title: "Map", detail: "Claude drafts the rules for matching old fields to new ones by studying the real data. It only reads; it changes nothing.", tickets: [
        { id: "AIX-32", label: "Read-only inspection commands", status: "Done" },
        { id: "AIX-34", label: "Recognising page layout patterns", status: "Done" },
        { id: "AIX-33", label: "The /magnolia-migrate skill (Claude's instructions)", status: "To Do" } ] },
      { step: "2", title: "Review", detail: "You approve the matching rules on a local review page. Your decisions are saved to a file so there is a record.", tickets: [
        { id: "AIX-37", label: "Review pack and decision file", status: "To Do" } ] },
      { step: "3", title: "Dry run", detail: "A rehearsal that shows what would change. It writes nothing to Magnolia.", tickets: [
        { id: "AIX-35", label: "Dry run that reads from Magnolia", status: "To Do" } ] },
      { step: "4", title: "Go", detail: "You say \"go\" for that exact dry run.", tickets: [
        { id: "AIX-38", label: "\"Go\" check before applying", status: "To Do" } ] },
      { step: "5", title: "Apply", detail: "The code writes the articles into Magnolia. This is the only step that writes. It updates items that changed and never overwrites an editor's own changes.", tickets: [
        { id: "AIX-36", label: "Apply with change detection and conflict protection", status: "To Do" } ] },
      { step: "6", title: "Check", detail: "Check the pages and sort out any exceptions and conflicts. If there are exceptions, update the rules and go around again (back to Review).", tickets: [
        { id: "AIX-39", label: "Check pack and the \"done\" rule", status: "To Do" } ] },
    ],
    architecture: {
      title: "How the pieces depend on each other",
      flow: [
        "AIX-32 inspection commands (Done) ──► AIX-34 layout patterns (Done) ──► AIX-33 Map: /magnolia-migrate skill",
        "AIX-33 ─┬─► AIX-35 Dry run ──► AIX-36 Apply ──────────────► AIX-39 Check + done rule",
        "        │        │                                             ▲",
        "        │        └────────────► AIX-38 Go check                │",
        "        └─► AIX-37 Review pack ─┴──────────────────────────────┘",
        "AIX-31 definitions endpoint — parked (kept on a watchlist)",
      ],
    },
    inScope: [
      "Moving content from one content app to another inside a single Magnolia system: old articles to sswp-articles",
      "Read-only inspection commands and the /magnolia-migrate skill (Claude's instructions) in magic-migrations; passwords kept only in a private settings file",
      "Matching old fields and article bodies to the new layout, the review pack and decision file, the dry run, the \"go\" check, apply with change detection and conflict protection, and the final check with the \"done\" rule",
      "The local test author system only (localhost:8080/local)",
    ],
    outOfScope: [
      "Categories and tags: the run report lists the old values, and editors tag articles in sswp-articles themselves",
      "Re-linking pages that point to the old articles, and switching live-site users over to sswp-articles",
      "Publishing the moved articles (editors publish)",
      "Retiring or deleting the old app",
      "Page migrations (P1 / P2), moves between different systems, and shared or production systems",
      "The Definitions API (AIX-31, parked) and using the Magnolia connector for writing",
    ],
    docs:
      "In the ais project, under projects/magnolia-migration/: the project hub (CLAUDE.md), the two decision records (ADR-0001, ADR-0002), and feature briefs on reading content with AI, matching page blocks to sections, moving content between apps, and the review loop.",
    stack: ["Claude Code", "magic-migrations", "Magnolia", "/magnolia-migrate skill", "Decision records (ADR-0001/0002)"],
  },
  {
    slug: "qa-automation-tool",
    code: "03",
    title: "QA Automation Tool",
    tagline: "Faster, smarter regression testing for every release.",
    status: "Active",
    color: "#34d399",
    overview:
      "A quality-checking platform that creates, runs and reports on automatic tests across our websites, catching visual and functional problems before they reach the live site.",
    objectives: [
      "Create test cases automatically from how people use a site",
      "Re-check how pages look and work on every release",
      "Give teams clear, actionable reports",
    ],
    highlights: [
      { label: "Coverage", value: "Full journeys + visual checks" },
      { label: "Runs", value: "Automatically with each release" },
      { label: "Reporting", value: "Real-time" },
    ],
    children: [
      { slug: "figma-to-magnolia-testing", title: "Figma to Magnolia Testing", tagline: "Compare a Figma design with the page that implements it.",
        overview: "QA Tools places a Figma design next to the web page built from it and reports what differs: fonts, sizes, colours and the text they apply to. Every finding is pinned to the exact spot on the page.",
        highlights: [
          { label: "Compares", value: "Fonts, sizes, colours, text" },
          { label: "Scope", value: "One page or a whole site" },
          { label: "Runs", value: "On a laptop, no cloud setup" },
        ],
        blocks: [
          {
            type: "list",
            title: "What a check does",
            intro: "The design file contains the fonts, sizes and colours that were intended. The tool takes a picture of the live page at the same width the design was drawn at, and reads the same details from the page itself. It then pairs up matching text and compares it, so a finding reads \"16px → 14px on 'Learn about type 2 inflammation'\" rather than just \"these pixels differ\".",
            items: [
              "Design Check: one Figma design frame against the page built from it",
              "Site Check: the same thing across a whole site, with one design frame per page. Results are grouped so that a mistake repeated on every page is reported as a single problem in one component",
            ],
          },
          {
            type: "table",
            title: "Four views",
            columns: ["View", "What it shows"],
            rows: [
              ["Side by side", "The design and the page next to each other"],
              ["Overlay", "Fade between the design and the page"],
              ["Issues", "Every finding as a numbered dot on the page; click one to jump to it"],
              ["Design", "The design frame on its own"],
            ],
          },
          {
            type: "list",
            title: "What you need to get started",
            intro: "This is a lightweight version of the Opella Dashboard containing only QA Tools and Settings. It runs on a laptop with no company login (JumpCloud), no cloud account (AWS) and no database to set up. The full dashboard (tickets, monitoring, analytics, Site Compare) is on the develop branch.",
            items: [
              "Software needed: Node 22 and a Chromium browser for the tool to use (installed with a single command)",
              "A developer installs the tool, creates the local data store and the first admin account, and starts it. It then opens in your browser on your own computer",
              "Sign in with the account created during setup, and change its password in Settings if the computer is shared",
              "No extra settings file is needed: sensible defaults are built in for local use",
            ],
          },
          {
            type: "list",
            title: "The Figma access key",
            intro: "QA Tools gets design frames from Figma, which needs a personal access key (called a token).",
            items: [
              "Paste it into Settings → API keys → Figma personal access token, then press Test. The tool confirms which Figma account the key belongs to",
              "Create one in Figma under Settings → Security → personal access tokens, with \"file_read\" permission, using an account that can open the files you want to check",
              "Keys are stored only on your own computer and are never shown again; the page shows only the last four characters",
              "You do not need a key if you upload the designs yourself: export the frames from Figma by hand (as SVG, with \"Outline Text\" unchecked) and upload them. This uses none of Figma's request allowance, which matters because reading a handful of full page designs can use up a key's limit for days",
            ],
          },
          {
            type: "list",
            title: "Sample results",
            intro: "A built-in set of sample results gives QA Tools real content to show before you have a key or access to the sites: a five-page Figma check against a demo site, and a one-page upload check (9.5 MB of screenshots). It is safe to load more than once.",
            items: [
              "They are a record to look at, not something to re-run: passwords were deliberately left out, temporary preview links were removed, and the design files were left behind",
              "A single command rebuilds the sample set from whatever results a dashboard currently holds",
            ],
          },
          {
            type: "table",
            title: "How the code is organised (for developers)",
            columns: ["Area", "What it holds"],
            rows: [
              ["server/routes/", "Sign-in, settings and Figma (the only three parts switched on here)"],
              ["server/lib/", "The Figma reader, design style reading, report building, page style reading and storage"],
              ["server/fonts/", "Brand fonts, used when a design is turned into an image on your computer"],
              ["server/db.js", "The data layout, set up automatically on first use"],
              ["src/pages/qa/", "The Design Check and Site Check screens"],
              ["src/composables/", "Shared logic for the Figma screens"],
            ],
          },
          {
            type: "list",
            title: "How it is tested",
            intro: "There is no formal test program. Developers check the building blocks with small throwaway scripts against a practice copy of the data. They must never be pointed at the real data file.",
            items: ["Scripts run against a scratch database and scratch screenshot folder, never the real ones"],
          },
        ],
      },
      { slug: "live-site-to-magnolia-testing", title: "Live Site to Magnolia Testing", tagline: "Verify Magnolia content matches the live site." },
    ],
    stack: ["Playwright (browser testing)", "Automated release checks", "Visual comparison", "Reporting"],
  },
  {
    slug: "ai-agent",
    code: "04",
    title: "AI Agent",
    tagline: "A digital teammate for everyday web operations.",
    status: "Active",
    color: "#f472b6",
    overview:
      "The AI Agent initiative delivers an assistant that handles routine requests, answers questions about our platforms and automates repetitive tasks, so teams can focus on higher-value work.",
    objectives: [
      "Automate repetitive operational requests",
      "Give instant answers based on our own internal knowledge",
      "Connect safely to existing tools, respecting who is allowed to do what",
    ],
    highlights: [
      { label: "Style", value: "Conversational" },
      { label: "Answers based on", value: "Internal knowledge" },
      { label: "Safety", value: "Access based on role" },
    ],
    children: [
      { slug: "conversation-ai", title: "Conversation AI", tagline: "Conversational assistant for everyday web operations." },
      { slug: "wisdomat", title: "Wisdomat", tagline: "AI knowledge wiki with cited answers and steward review.",
        overview: "Wisdomat is an AI-powered knowledge wiki. Written handbook entries and other sources are turned into wiki pages, which stewards (the people responsible for the content) review and approve. People use \"Ask\" to get answers that show where the information came from. When the wiki can't answer a question, that question is logged as a gap for stewards to fill. The work is tracked as the AI Tool epic (AIX-16), which is 63% done, and the tool runs at wisdomat.app.crescendo.io.",
        highlights: [
          { label: "Progress", value: "63% done (42 of 66)" },
          { label: "Live at", value: "wisdomat.app.crescendo.io" },
          { label: "Jira epic", value: "AIX-16 AI Tool" },
        ],
        blocks: [
          {
            type: "table",
            title: "Progress (Jira epic AIX-16: AI Tool)",
            columns: ["Status", "Items", "Tickets"],
            rows: [
              ["Done", "42", "AIX-54 to AIX-95"],
              ["In Review", "1", "AIX-22 AI Tool Planning"],
              ["In Progress", "3", "AIX-96, AIX-97, AIX-98"],
              ["To Do", "20", "AIX-99 to AIX-118"],
            ],
          },
          {
            type: "list",
            title: "Delivered so far",
            items: [
              "Foundation: research into how knowledge gets lost today, product design and success measures, choice of technology and hosting, the basic app setup, accounts, invitations and roles, sign in with Google, and going live on AWS at wisdomat.app.crescendo.io",
              "AI: connections to several AI providers with a backup if one fails; admins can set the AI keys and models, with an hourly limit on questions; other AIs can connect to Wisdomat",
              "Wiki: handbook entries organised by topic with review dates; a wiki written and maintained by AI, inspired by Karpathy's LLM Wiki; different page types with links between pages; sources are compiled into proposed changes that stewards approve; a weekly wiki health check; bulk import and an entry template; an AI-assisted page for adding new entries",
              "Ask: answers drawn from the handbook with sources shown; the look and layout; a \"Something wrong with this answer?\" button to report problems; showing where each page came from",
              "Review and gaps: a review queue for stewards; an inbox for submissions that the AI reads and drafts from; unanswered questions appear as gaps within seconds; a view of dismissed gaps that reopen automatically after 3 more people ask; answers not found in the wiki become gaps",
              "Quality: a quality watchdog (\"canary\") that grades answers and sends alerts; demo readiness (test questions checked on the live site and a demo script)",
              "Day-to-day running: faster automatic testing, safe updates to the live site (including an update banner for users), the ability to copy the live wiki to a local practice copy, a count of questions per person, and security and software updates",
            ],
          },
          {
            type: "list",
            title: "In progress",
            items: [
              "AIX-96 When an answer only partly works, the missing part becomes a gap",
              "AIX-97 Cleaner pages with version history and highlighted changes",
              "AIX-98 Clearer source credits and easier-to-read wiki cards",
            ],
          },
          {
            type: "list",
            title: "Up next",
            items: [
              "Quality watchdog goes live (test questions and Slack alerts); better visibility of gaps with answer type, a Resolved view and a weekly trend; filling a gap automatically adds a test question",
              "Facts: store each fact with its source and date; gentle reminders when information may be out of date; contradictions shown side by side, like conflicting edits, for a steward to pick the right one",
              "A people directory (names, roles, teams and nicknames); a memory for each user (common questions and suggestions)",
              "Confidential content (labels, access rules and real deletion); approvals that scale (low-risk changes approved automatically); a usage and quality dashboard for admins; a log of steward decisions that the AI learns from",
              "A staging area to test changes before they go live; a load test with 2,000+ pages; routine software upgrades and clearing remaining warnings; fix the gaps tab scrolling sideways",
              "Add knowledge from Slack and Google Drive; a backup and restore guide for the live data; company-wide rollout (onboarding, steward training and feedback)",
            ],
          },
          {
            type: "table",
            title: "Epic details",
            columns: ["Field", "Value"],
            rows: [
              ["Jira epic", "AIX-16 AI Tool (In Progress)"],
              ["Assignee", "Philip Ang"],
              ["Reporter", "Joshua Figueroa"],
              ["Created", "October 20, 2026"],
              ["Last updated", "November 6, 2026"],
            ],
          },
        ],
      },
    ],
    stack: ["AI assistant", "Company knowledge base", "Connected tools", "Role-based access"],
  },
  {
    slug: "seo-geo-tool",
    code: "05",
    title: "SEO/GEO Tool",
    tagline: "SEO, analytics and AI-readiness checks for any site.",
    status: "Tracking",
    color: "#fbbf24",
    overview:
      "A Crescendo tool that checks a website from just a link. It looks at how the page describes itself to search engines (page information and structured data), whether language versions are linked correctly (hreflang), the site map file (sitemap.xml) that lists all pages, and the analytics tracking data (dataLayer). A later GEO layer covers AI readiness: can AI crawlers reach the pages, and do AI answer tools mention the brand. It is meant for QA testers and people without a developer setup.",
    objectives: [],
    highlights: [
      { label: "In use on", value: "Opella" },
      { label: "GEO", value: "Early research" },
      { label: "Direction", value: "Check any site against a Crescendo standard" },
    ],
    children: [
      { slug: "seo", title: "SEO", tagline: "Search, analytics and site-structure checks from a link.",
        overview: "Checks a website from just a link. It looks at how each page describes itself to search engines (page information and structured data), whether language versions are linked correctly (hreflang), the site map file (sitemap.xml) that lists all pages, and the analytics tracking data (dataLayer). It is meant for QA testers and people without a developer setup.",
        highlights: [
          { label: "In use on", value: "Opella" },
          { label: "Input", value: "Just a link to the site" },
          { label: "Direction", value: "Check any site against a Crescendo standard" },
        ],
        blocks: [
          { type: "list", title: "What it checks", items: [
            "Page information (metadata) and structured data (schema.org)",
            "Language links (hreflang)",
            "The site map file (sitemap.xml)",
            "The analytics tracking data (dataLayer)",
          ] },
          { type: "list", title: "Where we are", items: [
            "In use on Opella: automated checks of search information, the site map and analytics tracking for the move from the old Magnolia setup to the new one. They have graded every go-live batch since September 2026.",
            "These checks compare the new site with the old site and are built around Opella's sites, so they can't be reused as they are.",
          ] },
          { type: "list", title: "Direction", items: [
            "Change from \"compare with the old site\" to \"check one site against a Crescendo standard\", so any team can run it on any client site.",
            "It can later become part of the Crescendo QA Tool (AIX-15).",
          ] },
        ] },
      { slug: "geo", title: "GEO", tagline: "Is our content ready for AI answer tools?",
        overview: "The GEO layer covers AI readiness: can AI crawlers (the programs AI tools use to read websites) reach our pages, and do AI answer tools mention the brand. It is meant for QA testers and people without a developer setup.",
        highlights: [
          { label: "Status", value: "Early research" },
          { label: "Question 1", value: "Can AI crawlers reach the pages?" },
          { label: "Question 2", value: "Do AI answers mention the brand?" },
        ],
        blocks: [
          { type: "list", title: "Where we are", items: [
            "Early research only.",
            "The Opella structured-data improvements are on hold until the client approves.",
          ] },
          { type: "list", title: "Direction", items: [
            "It will follow the same approach as SEO: check one site against a Crescendo standard, so any team can run it on any client site.",
            "It can later become part of the Crescendo QA Tool (AIX-15).",
          ] },
        ] },
    ],
    stack: ["Structured data (schema.org)", "Language links (hreflang)", "Site map (sitemap.xml)", "Analytics tracking (dataLayer)", "Magnolia"],
  },
  {
    slug: "mlr-express",
    code: "06",
    title: "MLR Express",
    tagline: "Accelerating Medical, Legal and Regulatory review.",
    status: "Tracking",
    color: "#fb7185",
    overview:
      "Pharma companies can't publish a web page until it passes MLR review (Medical, Legal and Regulatory). The approved record of every page is kept in Veeva PromoMats, the system where reviews happen. MLR Express keeps the website and PromoMats in step automatically: an editor clicks one button in the website editor (CMS), and MLR Express builds the PDF, sends it to PromoMats, brings the approval details back to the page, and watches the expiry date.",
    why:
      "Without MLR Express, keeping the website and PromoMats in step is slow, manual work: take screenshots of every page and hidden section, build a PDF, upload it, add notes, copy the approval details back into the website, and remember to take the page down when approval expires.",
    objectives: [],
    highlights: [
      { label: "Live customer", value: "Sanofi V-Links" },
      { label: "Magnolia connector", value: "Live" },
      { label: "Sitecore connector", value: "In development" },
    ],
    blocks: [
      {
        type: "table",
        title: "What it can do",
        intro: "V-Links is the name of the Sanofi setup of MLR Express on Magnolia. It is the main live customer today.",
        columns: ["Feature", "In simple terms"],
        rows: [
          ["PDF Creator", "Makes a review-ready PDF of a page in one click, including hidden parts like tabs and accordions"],
          ["Auto Annotate", "Adds notes to the PDF for reviewers (links, image descriptions, marked areas)"],
          ["Data Sync", "Copies the PromoMats status, MAT code, version and expiry date onto the page"],
          ["Lifecycle", "Sends alerts before expiry, can take down expired pages and schedule publishing"],
          ["Health Dashboard and Digest", "One view of every site's content health, plus a monthly email summary"],
        ],
      },
      {
        type: "table",
        title: "The main parts",
        columns: ["Part", "What it does"],
        rows: [
          ["Opus", "The \"brain\" of the system. Handles logins, clients, business rules, the link to Veeva and the stored data. Every other part talks to it."],
          ["Capture", "Turns a web page into an annotated PDF."],
          ["Dashboard", "The admin website where the team sets up clients, website platforms, sites and PDF settings, and views reports."],
          ["CMS connectors", "Add-ons installed inside the client's website editor that add the MLR Express buttons."],
        ],
      },
      {
        type: "table",
        title: "Website platforms and their status",
        columns: ["Platform", "Status"],
        rows: [
          ["Magnolia", "Live (Sanofi V-Links)"],
          ["Sitecore", "In development"],
          ["Contentful", "Proof of concept"],
          ["PowerPoint", "Proof of concept (on hold)"],
        ],
      },
      {
        type: "table",
        title: "Environments",
        intro: "MLR Express runs on Amazon's cloud (AWS) in three separate copies.",
        columns: ["Environment", "Dashboard"],
        rows: [
          ["Dev (testing new work)", "https://dev-app.mlrexpress.com/"],
          ["Preview (final checks and sales demos)", "https://preview-app.mlrexpress.com/"],
          ["Production (live, used daily by Sanofi)", "https://app.mlrexpress.com/"],
        ],
      },
      {
        type: "steps",
        title: "The flow: how a page gets approved",
        intro: "Before any of this: the support team sets up the client, the website platform and each site in the MLR Express Dashboard (app.mlrexpress.com), and the MLR Express add-on is installed in the client's website editor.",
        image: {
          src: "/initiatives/mlr-express-flow.webp",
          alt: "MLR Express: how a web page gets MLR approved, across the website editor, MLR Express and Veeva PromoMats",
        },
        steps: [
          { lane: "Website editor (CMS)", title: "Editor clicks \"Send to PromoMats\"", detail: "On a page in the CMS. No screenshots or manual PDF needed." },
          { lane: "MLR Express", title: "Opus receives the request", detail: "The MLR Express system checks the site, its settings and its Veeva connection." },
          { lane: "MLR Express", title: "Capture builds a review-ready PDF", detail: "Includes tabs, accordions, carousels and safety information (ISI), plus reviewer notes." },
          { lane: "Veeva PromoMats", title: "PDF is uploaded to PromoMats", detail: "As a new document, or as a new version of the page's existing document." },
          { lane: "Veeva PromoMats", title: "MLR team reviews and approves", detail: "Medical, Legal and Regulatory review, done in PromoMats as usual." },
          { lane: "MLR Express", title: "Result is synced back", detail: "MLR Express pulls back the status, MAT code, version and expiry date." },
          { lane: "Website editor (CMS)", title: "Page shows its approval details", detail: "Only pages that are Approved for Distribution should go live." },
          { lane: "MLR Express", title: "Expiry is watched", detail: "Alerts go out as the expiry date gets close." },
          { lane: "Website editor (CMS)", title: "Expired page is taken down", detail: "MLR Express can automatically take the page down when approval expires." },
        ],
      },
      {
        type: "table",
        title: "Leadership",
        columns: ["Role", "Person"],
        rows: [
          ["Product Owner", "Jeremy Summers"],
          ["Producer", "Rin Manabat"],
          ["Tech Lead", "Connor McGinn (JC)"],
          ["Support Lead", "Nimrod Aquino"],
        ],
      },
      {
        type: "table",
        title: "Teams",
        columns: ["Team", "Members"],
        rows: [
          ["MLR Express Product Team", "Leo Gerald Bernabe, John James Libron, Lawrence Namoc (Lucas Belcher, now deactivated)"],
          ["V-Links (Sanofi)", "Connor McGinn (JC), Floriano Solijon, Lawrence Namoc (Lucas Belcher, now deactivated)"],
          ["Support Team (Sanofi)", "Nimrod Aquino"],
        ],
      },
      {
        type: "list",
        title: "Setting up on Magnolia (advanced-veeva)",
        intro: "A developer installs the Magnolia add-on as part of the Magnolia project. It needs Java 17, Apache Maven 3 and Magnolia CMS 6.2.46 or newer.",
        items: [
          "A developer adds the advanced-veeva add-on to the Magnolia project and deploys Magnolia",
          "Check it worked: an MLR Express app appears in Magnolia, and MLR Express actions appear in the Pages app",
          "Connect to PromoMats with help from MLR Express Support: give Support the Veeva PromoMats system user details, get an MLR Express access key from Support, and enter it in the MLR Express app in Magnolia",
          "Work with Support to match PromoMats fields to Magnolia fields",
          "Support adds the site in the MLR Express Dashboard, switches on V-Links and sets up Global Scenes (needed for PDF preview)",
        ],
      },
      {
        type: "list",
        title: "Setting up on Sitecore (in development)",
        intro: "Installed as a Sitecore package.",
        items: [
          "In Sitecore, click the Sitecore icon (bottom left), then Development Tools → Installation Wizard",
          "Click Upload Package and upload the MLR Express package file (MLRexpress-1.0.0.zip, from the crescendo-sitecore-sandbox project)",
          "Select the package, click Next and follow the prompts to install",
          "Restart Sitecore",
          "Setup: a developer fills in the MLR Express settings file (system address, client ID and access key from Support) and adds the Veeva Metadata template to the site's page template",
          "Optional: switch on the scheduled job that publishes approved pages and takes down expired pages automatically",
        ],
      },
      {
        type: "table",
        title: "Code projects (repositories)",
        columns: ["Project", "What it is"],
        rows: [
          ["mlrx-opus", "Opus, the core system"],
          ["mlrx-dashboard", "The admin Dashboard website"],
          ["mlrx-capture", "Capture, the page-to-PDF service"],
          ["mlrx-advanced-veeva", "Magnolia add-on (the module behind V-Links)"],
          ["mlrx-docs", "Public documentation site (docs.mlrexpress.com)"],
          ["mlrx-magnolia-audit", "Support tool that checks Magnolia sites against PromoMats"],
          ["mlrx-contentful-app", "Contentful add-on (proof of concept)"],
          ["mlrx-ms-office", "PowerPoint add-in (proof of concept, on hold)"],
          ["crescendo-sitecore-sandbox", "Sitecore practice environment that holds the Sitecore add-on package"],
        ],
      },
      {
        type: "list",
        title: "Where to find more",
        intro: "Public documentation: https://docs.mlrexpress.com",
        items: [
          "Start here: MLRexpress Confluence space, MLRx Introduction, PromoMats and MLR Primer, New Engineer Onboarding",
          "Jira: Product Team Kanban Board, Support Board",
          "Engineering: Architecture and Infrastructure, Deployments, Logs and Monitoring, Troubleshooting, Access and Credentials, Releases, Release Notes",
          "Support and operations: Adding a new site (Prod), Adding a new site (PreProd), Tenant Onboarding (Magnolia), V-Links basic smoke testing, Health Dashboard: Feature Guide",
        ],
      },
      {
        type: "table",
        title: "Glossary",
        columns: ["Term", "Meaning"],
        rows: [
          ["MLR", "Medical, Legal and Regulatory review. Required before any promotional content goes live."],
          ["Veeva PromoMats (Vault)", "The system where MLR review happens and approved materials are stored."],
          ["MAT code", "The ID number of an approved document in PromoMats. Each web page has its own."],
          ["CMS", "The website editor, for example Magnolia or Sitecore."],
          ["V-Links", "The Sanofi setup of MLR Express on Magnolia."],
          ["ISI", "Important Safety Information, the safety text that must appear on pharma pages."],
          ["Tenant", "A client account in MLR Express."],
          ["Approved for Distribution", "The only PromoMats status that means a page may go live."],
        ],
      },
    ],
    stack: ["Opus (core system)", "Capture (PDF maker)", "Dashboard", "Veeva PromoMats", "AWS cloud", "Magnolia", "Sitecore"],
  },
];

export const getInitiative = (slug: string) =>
  initiatives.find((i) => i.slug === slug);

export const RESERVED_SUBDOMAINS = new Set([
    // core app / infra
    "www", "app", "apps", "api", "apis", "admin", "administrator", "dashboard", "console",
    "portal", "panel", "manage", "manager", "backend", "frontend", "web", "root", "system",
    "internal", "private", "public", "secure", "cdn", "assets", "static", "media", "files",
    "uploads", "images", "img", "storage", "edge", "proxy", "gateway", "origin", "server",

    // environments
    "dev", "development", "staging", "stage", "test", "testing", "qa", "uat", "demo",
    "sandbox", "preview", "beta", "alpha", "canary", "prod", "production", "local", "localhost",

    // auth / account
    "auth", "login", "logout", "signin", "signup", "register", "sso", "oauth", "account",
    "accounts", "clerk", "id", "identity", "profile", "settings", "verify", "password",

    // email / DNS / network
    "mail", "email", "smtp", "imap", "pop", "pop3", "mx", "ns", "ns1", "ns2", "dns",
    "ftp", "sftp", "ssh", "vpn", "autodiscover", "autoconfig", "webmail", "postmaster",
    "hostmaster", "webmaster", "noreply", "no-reply", "mailer", "newsletter",

    // product / affiliate-specific (links and tracking must never be claimable)
    "rewardkit", "reward", "rewards", "partners", "partner", "affiliate", "affiliates",
    "referral", "referrals", "refer", "track", "tracking", "click", "clicks", "go", "link",
    "links", "r", "payouts", "payout", "commissions", "program", "programs", "invite", "join",

    // billing / payments / brand impersonation
    "billing", "pay", "payment", "payments", "checkout", "invoice", "invoices", "stripe",
    "polar", "dodo", "dodopayments", "paypal", "wise",

    // marketing / content / support
    "blog", "docs", "documentation", "help", "support", "status", "changelog", "roadmap",
    "feedback", "community", "forum", "careers", "jobs", "press", "about", "contact",
    "pricing", "features", "home", "shop", "store", "events", "learn", "academy",

    // legal / trust / abuse
    "legal", "terms", "privacy", "security", "abuse", "trust", "compliance", "dmca",
    "gdpr", "cookies", "report", "official", "staff", "team", "moderator", "mod",

    // misc
    "analytics", "metrics", "monitor", "grafana", "sentry", "webhook", "webhooks", "cron",
    "null", "undefined", "example", "anonymous", "everyone", "all", "new", "me", "my",
])

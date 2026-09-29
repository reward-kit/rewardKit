<div align="center">

<img src="public/svg/rewardkit.svg" alt="RewardKit" width="180" />

**Open-source affiliate program platform for SaaS teams.**
Launch, track, and pay affiliates on top of Stripe, Polar, or Dodo Payments, without paying enterprise prices.

[Website](https://rewardkit.example.com) · [Documentation](https://rewardkit.example.com/docs) · [Report a Bug](../../issues) · [Request a Feature](../../issues)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

</div>

---

## Why RewardKit?

Tools like Tolt, Rewardful, and FirstPromoter work well, but their pricing is hard on small SaaS teams. RewardKit gives you the same core workflow (referral links, commission tracking, payouts) as an open-source project you can self-host or use as a hosted service.

- **Built for small SaaS teams.** Simple setup, fair pricing, no lock-in.
- **Payment-provider native.** Works with Stripe, Polar, and Dodo Payments.
- **Open source.** Read the code, fork it, extend it, self-host it.

## Features

- Affiliate signup and management dashboard
- Unique referral links and click tracking
- Automatic commission attribution from payment webhooks
- Flexible commission rules (percentage or fixed, one-time or recurring)
- Payout tracking and reporting
- Integrations: **Stripe**, **Polar**, **Dodo Payments**
- Free trial on the hosted version

> Some features may still be in progress. See the [Roadmap](#roadmap).

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) and [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) and [Base UI](https://base-ui.com/)
- [pnpm](https://pnpm.io/) workspaces

## Getting Started

### Prerequisites

- Node.js 20 or later
- pnpm 9 or later
- A database (e.g. PostgreSQL)
- An account with at least one supported payment provider (Stripe, Polar, or Dodo Payments)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/rewardkit.git
cd rewardkit

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Start the dev server
pnpm dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

> Adjust this table to match the variables your project actually uses.

## How It Works

1. **Connect** your payment provider (Stripe, Polar, or Dodo Payments).
2. **Create** your affiliate program and set commission rules.
3. **Invite** affiliates and share their unique referral links.
4. **Track** clicks, signups, and conversions automatically through webhooks.
5. **Pay** your affiliates and keep a clear record of every commission.

## Project Structure

```
rewardkit/
├── apps/
│   └── web/            # Next.js application
├── packages/
│   └── ui/             # Shared UI components (shadcn/ui)
├── .env.example
├── package.json
└── pnpm-workspace.yaml
```

> Update this to match your actual folder layout.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run the production build |
| `pnpm lint` | Lint the codebase |

Have an idea? [Open an issue](../../issues) and let us know.

## Contributing

Contributions are welcome and appreciated.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please open an issue first for larger changes so we can discuss the approach.

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

## Author

Built by [Manikandan](https://github.com/<your-username>) at [BearOne Technologies](https://bearone.example.com).

---

<div align="center">

If you find RewardKit useful, consider giving it a ⭐ on GitHub.

</div>
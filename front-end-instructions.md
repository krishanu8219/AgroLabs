# Project Overview
Use this guide to build an AI web app that helps make informed decisions

# Feature Requirements

**Tech Stack and Frameworks:**
- **Next.js**
- **Tailwind CSS**: For modern, utility-first styling to ensure a responsive and visually appealing UI.
- **Supabase**: For database management.
- **Clerk**: For secure user authentication and profile management, including sign-up, log-in, and password resets.
- **shadcn UI**: For building accessible and customizable UI components.


# Current File structure
.
├── app
│   ├── fonts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ui
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib
│   └── utils.ts
├── node_modules
├── requirements
│   └── frontend_instruction.md
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

# Rules
- All new components should go in `/components` and be named using the convention `example-component.tsx`.
- All new pages go in `/app`.
- Follow best practices for code organization, naming, and version control.
k:\ACME_AI\
├── backend/                          # NestJS Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.controller.ts
│   │   │   ├── config.service.ts
│   │   │   ├── config.module.ts
│   │   │   ├── entities/
│   │   │   │   └── config.entity.ts
│   │   │   └── dto/
│   │   │       └── update-config.dto.ts
│   │   ├── calculation/
│   │   │   ├── calculation.controller.ts
│   │   │   ├── calculation.service.ts
│   │   │   ├── calculation.module.ts
│   │   │   └── dto/
│   │   │       ├── calculate-bill.dto.ts
│   │   │       └── bill-result.dto.ts
│   │   ├── auth/
│   │   │   ├── admin-auth.guard.ts
│   │   │   └── auth.module.ts
│   │   ├── database/
│   │   │   └── database.module.ts
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── test/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── nest-cli.json
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                         # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminPanel/
│   │   │   │   ├── AdminPanel.tsx
│   │   │   │   ├── AdminPanel.css
│   │   │   │   └── AdminLogin.tsx
│   │   │   ├── UserPanel/
│   │   │   │   ├── UserPanel.tsx
│   │   │   │   ├── UserPanel.css
│   │   │   │   └── BillResult.tsx
│   │   │   └── common/
│   │   │       ├── Header.tsx
│   │   │       └── Layout.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── pdfGenerator.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── validation.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.tsx
│   │   ├── index.css
│   │   └── react-app-env.d.ts
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── .gitignore
└── README.md
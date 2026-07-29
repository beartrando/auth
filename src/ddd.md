src/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── device.entity.ts
│   │   └── session.entity.ts
│   │
│   ├── value-objects/
│   │   ├── auth.vo.ts
│   │   ├── access-token.vo.ts
│   │   ├── refresh-token.vo.ts
│   │   ├── user-id.vo.ts
│   │   ├── device-id.vo.ts
│   │   └── session-id.vo.ts
│   │
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── device.repository.ts
│   │   └── session.repository.ts
│   │
│   └── services/
│       └── auth.domain-service.ts
│
└── infrastructure/
    └── prisma/
        ├── prisma.service.ts
        └── repositories/
            ├── prisma-user.repository.ts
            ├── prisma-device.repository.ts
            └── prisma-session.repository.ts
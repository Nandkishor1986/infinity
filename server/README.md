# Backend

```bash
npm install
copy .env.example .env
npm run dev
```

On Linux/macOS use:
```bash
cp .env.example .env
```

API health check:
`GET http://localhost:5000/api/v1/health`

Create the first admin:
`POST /api/v1/auth/register-admin`

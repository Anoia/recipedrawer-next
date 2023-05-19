# Next Recipedrawer

```bash
npm run dev

npm run build

```

create types:

```bash
npx openapi-typescript "http://localhost:54321/rest/v1/?apikey=$APIKEY" --output types/supabase.ts
```

```bash
 npx prisma db pull --force
 npx prisma generate
```

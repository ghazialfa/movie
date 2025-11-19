# movie

- SSR + ISR
- /movie/popular menggunakan server component dengan cache revalidate 300 detik dan akses cookies() , jadi dirender di server tiap request sambil memakai cache hasil fetch (ISR).
  - src/app/movie/popular/page.tsx membaca cookie via cookies()
  - src/app/movie/popular/page.tsx export const revalidate = 300
  - src/app/movie/popular/page.tsx fetch(..., { next: { revalidate } })

- SSG
- / (homepage) tidak memakai use client , tidak mengambil data dinamis atau akses cookies/headers , sehingga dioptimalkan sebagai halaman statis (SSG).
  - src/app/page.tsx export default function Home() { ... }

- CSR
- Semua halaman berikut adalah client components (memakai use client ) dan data diambil di browser (React Query/axios), sehingga termasuk CSR:
  - /movie src/app/movie/page.tsx
  - /movie/detail/[id] src/app/movie/detail/[id]/page.tsx
  - /movie/genres src/app/movie/genres/page.tsx
  - /movie/genres/[slug] src/app/movie/genres/[slug]/page.tsx
  - /movie/ai src/app/movie/ai/page.tsx
  - /user/[id]/favorites src/app/user/[id]/favorites/page.tsx
  - /login src/app/(auth)/login/page.tsx
  - /register src/app/(auth)/register/page.tsx

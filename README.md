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

**Prasyarat**
- Node.js 18+ dan npm
- PostgreSQL 14+ berjalan lokal atau layanan managed
- TMDB API Key, Google Studio (Gemini) API Key, JWT Secret

**Struktur Proyek**
- `client-next` Next.js (frontend)
- `server` Express + Sequelize (backend)

**Konfigurasi Backend (`server`)**
- Env: buat file `.env` mengikuti `server/.env.example:1-3` dan isi `JWT_SECRET`, `TMDB_API_KEY`, `GOOGLE_STUDIO_API_KEY`.
- Database: sesuaikan kredensial di `server/config/config.json:2-8` atau gunakan `DATABASE_URL` saat production (`server/config/config.json:16-18`).
- Instal dependensi: jalan-kan `npm install` di direktori `server`.
- Instal CLI migrasi: `npm i -D sequelize-cli` di `server`.
- Buat database: `npx sequelize-cli db:create`.
- Migrasi skema: `npx sequelize-cli db:migrate` (melihat berkas di `server/migrations/...`).
- Seed data awal: `npx sequelize-cli db:seed:all` (menggunakan `server/seeders/20240514052919-seed-users.js`).
- Jalankan server: `node app.js` (port default `3000`, lihat `server/app.js:11,20-22`).

Catatan endpoint utama:
- Auth: `POST /login`, `POST /register`, `POST /login/google` (`server/routers/index.js:8-13`).
- Movies: `GET /movies`, `GET /movies/popular`, `GET /movies/:tmdbId`, `POST /movies/ai` (proteksi Bearer, lihat `server/middlewares/authentication.js:6-13`).
- Genres: `GET /genres`, `GET /genres/:id`.
- Favorites: `GET /favorites`, `POST /favorites/:tmdbId`, `DELETE /favorites/:dbId`, `PATCH /favorites/:id`.

**Konfigurasi Frontend (`client-next`)**
- Instal dependensi: jalan-kan `npm install` di direktori `client-next`.
- Jalankan pengembangan: `npm run dev` (port `5173`, lihat `client-next/package.json:6`). Pastikan backend berjalan di `http://localhost:3000` (`client-next/src/lib/axios.ts:3-5`).
- Build produksi: `npm run build` lalu `npm run start`.
- Jika port `3000` dipakai backend saat `start`, ubah port frontend: di PowerShell jalankan `Set-Item -Path Env:PORT 5173 ; npm run start`.

Login Google:
- Ganti `client_id` sesuai kredensial Anda di `client-next/src/app/(auth)/login/page.tsx:27`.
- Samakan `audience` pada verifikasi server di `server/controllers/Auth_ctrl.js:73-77`.

**Menjalankan Lokal (dua terminal)**
- Terminal 1 (backend):
  - `cd server`
  - `npm install`
  - `npm i -D sequelize-cli`
  - `npx sequelize-cli db:create`
  - `npx sequelize-cli db:migrate`
  - `npx sequelize-cli db:seed:all`
  - `node app.js`
- Terminal 2 (frontend):
  - `cd client-next`
  - `npm install`
  - `npm run dev`

**Deploy**
- Backend (Node + PostgreSQL):
  - Set env: `JWT_SECRET`, `TMDB_API_KEY`, `GOOGLE_STUDIO_API_KEY`, dan `DATABASE_URL` (untuk production; lihat `server/config/config.json:16-18`).
  - Jalankan migrasi dan seed di server: `npx sequelize-cli db:migrate` lalu `npx sequelize-cli db:seed:all`.
  - Start aplikasi: `node app.js` atau proses manager (PM2) pada port yang Anda tentukan.
- Frontend (Next.js):
  - Ubah base URL API agar menunjuk ke domain backend produksi di `client-next/src/lib/axios.ts:3-5`.
  - Bangun: `npm run build`; jalankan `npm run start` atau deploy ke Vercel.

**Catatan Integrasi**
- SSR popular: halaman `src/app/movie/popular/page.tsx:5-16` membaca cookie `token` via `cookies()` dan memanggil backend dengan Bearer token.
- Base URL API: `client-next/src/lib/axios.ts:3-5` default ke `http://localhost:3000` dan perlu disesuaikan saat deploy.

# CuAI - Personal AI Chat Assistant

CuAI adalah aplikasi web AI yang dirancang sebagai platform tempat pengguna dapat bercurhat dengan AI secara personal dan aman. Aplikasi ini dibangun dengan React + Vite, Tailwind CSS, shadcn/ui, dan menggunakan Supabase untuk autentikasi Google OAuth serta database.

## Fitur Utama

- 🔐 **Autentikasi Google OAuth** - Login hanya dengan Google, tanpa registrasi manual
- 💬 **Chat Interface Modern** - UI minimalis dengan bubbled messages seperti ChatGPT/Claude
- 📱 **Responsive Design** - Bekerja sempurna di desktop dan mobile
- 🌙 **Dark Theme** - Tema gelap default untuk kenyamanan mata
- 💾 **Chat History** - Riwayat percakapan tersimpan dan dapat dilanjutkan kapan saja
- 🤖 **AI Integration** - Menggunakan Google Gemini AI untuk respons cerdas
- 🔒 **Secure & Private** - Row Level Security (RLS) memastikan data pribadi terlindungi

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database + Auth)
- **AI**: Google Gemini AI
- **Deployment**: Ready for production deployment

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ dan pnpm
- Akun Supabase
- Google AI API Key
- Google OAuth credentials

### 2. Clone dan Install Dependencies

```bash
cd cuai
pnpm install
```

### 3. Setup Environment Variables

Salin file `.env.example` ke `.env` dan isi dengan konfigurasi Anda:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google AI Configuration
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

### 4. Setup Supabase

1. **Buat project baru di [Supabase](https://supabase.com)**
2. **Jalankan SQL schema** di Supabase SQL Editor:
   - Copy isi file `database-schema.sql`
   - Paste dan jalankan di Supabase SQL Editor

3. **Setup Google OAuth**:
   - Buka **Authentication > Providers** di Supabase dashboard
   - Enable **Google** provider
   - Masukkan Google OAuth credentials Anda
   - Tambahkan redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 5. Setup Google AI API

1. Buka [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Buat API key baru
3. Masukkan API key ke file `.env`

### 6. Setup Google OAuth

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing project
3. Enable Google+ API
4. Buat OAuth 2.0 credentials
5. Tambahkan authorized redirect URIs:
   - `http://localhost:5173` (untuk development)
   - `https://your-project.supabase.co/auth/v1/callback`

### 7. Run Development Server

```bash
pnpm run dev --host
```

Aplikasi akan berjalan di `http://localhost:5173`

## Project Structure

```
cuai/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Auth.jsx         # Authentication component
│   │   ├── Sidebar.jsx      # Chat history sidebar
│   │   └── ChatArea.jsx     # Main chat interface
│   ├── lib/
│   │   ├── supabase.js      # Supabase client
│   │   └── gemini.js        # Google AI client
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── database-schema.sql      # Database schema
├── .env.example            # Environment variables template
└── README.md              # This file
```

## Database Schema

Aplikasi menggunakan 3 tabel utama:

- **profiles**: Data profil pengguna
- **chats**: Riwayat percakapan
- **messages**: Pesan dalam percakapan

Semua tabel dilindungi dengan Row Level Security (RLS) untuk memastikan privasi data.

## Deployment

Aplikasi siap untuk deployment ke platform seperti:

- Vercel
- Netlify  
- Supabase Hosting

Pastikan environment variables sudah dikonfigurasi di platform deployment Anda.

## Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## License

MIT License - lihat file LICENSE untuk detail.

## Support

Jika ada pertanyaan atau masalah, silakan buka issue di repository ini.

# riantoto

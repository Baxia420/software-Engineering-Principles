# Virtual Internship Portal (VIP)

This is a Virtual Internship Portal (VIP) application built for UTM to support a three-role hierarchical architecture: **Supervisor (UTM Admin) ➔ Company Partner ➔ Student**.

## Tech Stack
- **Frontend:** React + Vite, Tailwind CSS, React Router
- **Backend/Database:** Supabase (Auth, PostgreSQL DB, Storage Buckets)

---

## Local Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Baxia420/software-Engineering-Principles.git
cd software-Engineering-Principles
```

### 2. Configure Environment Variables
Inside the `vip-frontend` directory, copy the `.env.example` file to `.env` (or `.env.local`):
```bash
cd vip-frontend
cp .env.example .env
```
Open the `.env` file and replace the placeholder values with your Supabase Project credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

*Note: If you are connecting to the same Supabase database instance as your team member, copy their active `.env` file content directly.*

### 3. Database Setup (If using a new/separate Supabase instance)
If you are setting up your own Supabase database from scratch, go to your **Supabase SQL Editor** and execute the following scripts in order:
1. Run [01_schema_and_rls.sql](supabase/01_schema_and_rls.sql) to set up tables, columns, RLS policies, and auth triggers.
2. Run [02_forum_policies.sql](supabase/02_forum_policies.sql) to set up forum tables and forum RLS policies.

Also, verify that the following buckets exist in your **Supabase Storage** and are set to public:
- `avatars`
- `resumes`

### 4. Install Dependencies & Start App
Inside the `vip-frontend` directory, run:
```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

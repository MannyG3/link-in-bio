# StudentLink: Link-in-Bio for Students

StudentLink is a full-stack link-in-bio platform designed for students. It provides a single public profile page where users can share academic and professional links, including GitHub, LinkedIn, portfolio, and capstone projects.

## Features

- Authentication with Supabase (email/password and GitHub OAuth)
- Profile management dashboard for creating and updating personal details
- Public profile pages with username-based routing
- Social and portfolio link support
- Theme support with free and premium options
- Responsive design for desktop and mobile devices

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), Tailwind CSS, Lucide Icons |
| Backend | FastAPI (Python) |
| Database and Auth | Supabase (PostgreSQL + Auth) |
| Deployment | Vercel |

## Project Structure

```
link-in-bio/
├── frontend/                 # React/Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # Auth context
│   │   ├── lib/              # Supabase and API clients
│   │   └── pages/            # Route page components
│   └── .env                  # Frontend environment variables
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── routes/           # API routes
│   │   ├── supabase_client.py
│   │   ├── schemas.py        # Pydantic models
│   │   └── auth.py           # JWT auth utilities
│   ├── main.py               # FastAPI application entry
│   └── .env                  # Backend environment variables
├── api/
│   └── index.py              # Vercel serverless entrypoint for FastAPI
├── vercel.json               # Vercel routing and build configuration
├── requirements.txt          # Root Python dependencies for Vercel Python runtime
└── supabase/
    └── schema.sql            # Database schema and RLS policies
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- A Supabase account

### 1) Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Open SQL Editor and run [supabase/schema.sql](supabase/schema.sql).
3. Enable Email authentication in Authentication > Providers.
4. Optional: Enable GitHub OAuth.

### 2) Backend Setup

```bash
cd backend

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# Set Supabase values in .env

uvicorn main:app --reload --port 8000
```

### 3) Frontend Setup

```bash
cd frontend

npm install

cp .env.example .env
# Set frontend values in .env

npm run dev
```

### 4) Application URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Environment Variables

### Backend (`backend/.env`)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=https://your-frontend-domain.vercel.app
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

### Frontend (`frontend/.env`)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=/api
```

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Authenticate user | No |
| GET | `/api/profile/{username}` | Get public profile | No |
| GET | `/api/profile/me/current` | Get current user profile | Yes |
| POST | `/api/profile/` | Create profile | Yes |
| PUT | `/api/profile/` | Update profile | Yes |
| DELETE | `/api/profile/` | Delete profile | Yes |

## Security

- Row Level Security (RLS) policies protect profile data
- JWT-based authentication through Supabase
- Users can modify only their own profile records
- Public profile data is read-only for non-owners

## Monetization

The `is_premium` field in the profile model can be used to enable premium features such as:

- Premium themes
- Additional profile customizations
- Future add-ons such as analytics and custom domains

## Deployment (Vercel)

This repository is configured to deploy both the frontend and backend in a single Vercel project:

- Frontend: static build from `frontend/`
- Backend API: Python serverless function at `api/index.py`
- API routing: `/api/*` forwarded to the FastAPI app
- SPA routing: all non-file routes fallback to `index.html`

### Deploy Steps

1. Push the repository to GitHub.
2. Import the repository into Vercel as a new project.
3. Add these environment variables in Vercel Project Settings:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
    - `SUPABASE_URL`
    - `SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `FRONTEND_URL` (your Vercel frontend domain)
    - `CORS_ORIGINS` (comma-separated if multiple origins)
4. Deploy.

After deployment:

- Frontend is served at your Vercel domain.
- FastAPI endpoints are available under `/api/*`.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request for proposed improvements.
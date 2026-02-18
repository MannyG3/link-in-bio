# 🎓 StudentLink - Link-in-Bio for Students

A professional, monetizable Link-in-Bio platform built for students. Showcase your GitHub, LinkedIn, portfolio, and capstone project all in one beautiful page.

![StudentLink](https://via.placeholder.com/800x400?text=StudentLink+Preview)

## ✨ Features

- **🔐 Authentication**: Secure signup/login via Supabase Auth (Email & GitHub OAuth)
- **📝 Profile Builder**: Easy-to-use dashboard to manage your profile
- **🔗 Social Links**: Add GitHub, LinkedIn, and portfolio links
- **🎯 Capstone Project**: Highlight your best project
- **🎨 Themes**: Light/Minimal (free) and Midnight/Dark (premium)
- **⚡ Real-time**: Changes reflect instantly on your public page
- **📱 Responsive**: Beautiful on all devices

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) + Tailwind CSS + Lucide Icons |
| Backend | FastAPI (Python) |
| Database & Auth | Supabase (PostgreSQL) |
| Deployment | Vercel (Frontend) + Render (Backend) |

## 📁 Project Structure

```
link-in-bio/
├── frontend/                 # React/Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # Auth context
│   │   ├── lib/              # Supabase & API clients
│   │   └── pages/            # Page components
│   └── .env                  # Environment variables
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── routes/           # API routes
│   │   ├── supabase_client.py
│   │   ├── schemas.py        # Pydantic models
│   │   └── auth.py           # JWT auth utilities
│   ├── main.py               # FastAPI app
│   └── .env                  # Environment variables
└── supabase/
    └── schema.sql            # Database schema & RLS policies
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- Supabase account (free tier works great!)

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Enable **Email Auth** in Authentication > Providers
4. (Optional) Enable **GitHub OAuth** for social login

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run the server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev
```

### 4. Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Frontend (`frontend/.env`)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000/api
```

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/profile/{username}` | Get public profile | No |
| GET | `/api/profile/me/current` | Get own profile | Yes |
| POST | `/api/profile/` | Create profile | Yes |
| PUT | `/api/profile/` | Update profile | Yes |
| DELETE | `/api/profile/` | Delete profile | Yes |

## 🎨 Themes

### Light/Minimal (Free)
- Clean white background
- Blue accents
- Professional look

### Midnight/Dark (Premium)
- Deep dark background
- Purple/indigo accents
- Modern aesthetic

## 🚢 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy!

### Backend (Render)

1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy!

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- JWT authentication via Supabase
- Users can only modify their own profiles
- Public profiles are read-only for everyone

## 💰 Monetization

The `is_premium` boolean in the profiles table enables:
- Premium themes (Midnight/Dark)
- Future features (analytics, custom domains, etc.)

## 📝 License

MIT License - feel free to use this for learning or commercial purposes!

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

---

Built with ❤️ for students everywhere
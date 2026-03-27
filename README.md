# 🚢 Maritime Vessel Tracking Dashboard (Team 3)

A production-ready Maritime Surveillance platform built with **Django REST Framework** and **React**. This platform provides real-time vessel tracking, safety analysis, and fleet analytics through an interactive GIS interface.

## 🌟 Key Features
- **Real-time Tracking**: Interactive Leaflet-based map visualizing global vessel movements.
- **Safety Analytics**: Automated 100km proximity alerts and anti-piracy map visualization.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admins, Analysts, and Operators.
- **Fleet Insights**: Server-side data aggregation and CSS-based analytical charts.
- **Security**: JWT-based authentication for all API endpoints.

## 🏗️ Tech Stack
- **Backend**: Django, Django REST Framework, Simple JWT, SQLite, Whitenoise.
- **Frontend**: React (Hooks), Leaflet, Axios, Vanilla CSS.

## 🚀 Quick Start

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/DHYANESHBMW/Maritime-vessel-tracking.git
cd Maritime-vessel-tracking/Maritime-Vessel-Tracking-Team-3-main

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed initial data
python seed_data.py
```

### 2. Run the Server
```bash
python manage.py runserver
```
Access the dashboard at `http://127.0.0.1:8000/`.

## 🧪 Testing
Run the automated security suite:
```bash
python manage.py test core
```

## 🛡️ License
This project is licensed under the MIT License - see the [LICENSE](file:///c:/Users/admin/OneDrive/Desktop/Maritime-Vessel-Tracking-Team-3-main/Maritime-Vessel-Tracking-Team-3-main/LICENSE) file for details.

---
*Developed by Team 3 for the Maritime Surveillance Initiative.*

# Start Backend (Django) in a new window
Write-Host "Starting Maritime Backend..." 
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\venv\Scripts\python manage.py runserver"

# Start Frontend (React) in a new window
Write-Host "Starting Maritime Frontend..." 
Set-Location .\maritime-frontend
# Ensure dependencies are installed for Recharts
npm install
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host "Both servers are initializing. Check the new windows for status." 
Write-Host "Access Dashboard at: http://localhost:3000" 

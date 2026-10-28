@echo off
title StaffSync HRM System
cd /d "C:\Users\harsh\OneDrive\Desktop\Skill-wallet-project"
set "PATH=C:\Users\harsh\.nodejs;C:\Program Files\Git\cmd;%PATH%"
echo ===================================================
echo   Starting StaffSync HRM System (MERN Stack)
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ===================================================
echo Opening browser...
start "" "http://localhost:5173"
echo.
npm run dev
pause


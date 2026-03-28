@echo off
echo ============================================================
echo Noviious Backend - Quick Start
echo ============================================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo [1/6] Creating virtual environment...
    python -m venv venv
    echo      Done!
) else (
    echo [1/6] Virtual environment already exists
)

echo.
echo [2/6] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [3/6] Installing dependencies (this may take a few minutes)...
pip install -q -r requirements\local.txt
echo      Done!

echo.
echo [4/6] Running database migrations...
python manage.py migrate
echo      Done!

echo.
echo [5/6] Creating sample data...
python manage.py seed_db
echo      Done!

echo.
echo [6/6] Setup complete!
echo.
echo ============================================================
echo Your backend is ready!
echo ============================================================
echo.
echo Default credentials:
echo   Admin: admin@noviious.com / admin123
echo   Customer: customer@test.com / customer123
echo.
echo To start the server, run:
echo   python manage.py runserver
echo.
echo API will be available at: http://localhost:8000
echo Admin panel at: http://localhost:8000/admin
echo.
pause

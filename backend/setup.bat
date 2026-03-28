@echo off
echo Setting up Noviious Backend...

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements\local.txt

echo Running migrations...
python manage.py migrate

echo Creating seed data...
python manage.py seed_db

echo.
echo Setup complete!
echo.
echo To create a superuser, run:
echo python manage.py createsuperuser
echo.
echo To start the server, run:
echo python manage.py runserver
echo.
pause

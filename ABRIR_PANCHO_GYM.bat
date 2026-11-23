@echo off
setlocal
cd /d "%~dp0"
title PANCHO GYM 2.0 - Servidor local

where py >nul 2>nul
if %errorlevel%==0 (
  start "PANCHO GYM 2.0 - servidor" cmd /k "cd /d "%~dp0" && py -3 -m http.server 8000"
  goto abrir
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "PANCHO GYM 2.0 - servidor" cmd /k "cd /d "%~dp0" && python -m http.server 8000"
  goto abrir
)

echo No se encontro Python en este equipo.
echo Instala Python 3 desde https://www.python.org/downloads/ y vuelve a ejecutar este archivo.
echo Durante la instalacion, activa la opcion Add Python to PATH.
pause
exit /b 1

:abrir
timeout /t 2 /nobreak >nul
start "" "http://localhost:8000"
exit /b 0

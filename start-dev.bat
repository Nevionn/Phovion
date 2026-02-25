REM Для работы данного bat файла, в системе должен быть установлен nodejs, использовать только после инициализации базы данных
 
@echo off
cd /d %~dp0

start cmd /k npm run dev

timeout /t 7 /nobreak > nul

start http://localhost:3000
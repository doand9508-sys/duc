@echo off
setlocal
pushd "%~dp0"
if not exist "gameupdate\patch.bat" (
    echo ERROR: gameupdate\patch.bat not found!
    pause
    exit /b 1
)
call "gameupdate\patch.bat"
popd
endlocal
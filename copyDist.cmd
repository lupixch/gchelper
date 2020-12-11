@echo off
REM This script clears and sets up the dist directory. 
REM It copies all necessary files that are not copied by the typescript compiler.
REM After running this script, a new build must be run to create the *.js files.

rmdir dist /q /s
mkdir dist\ui
mkdir dist\img
mkdir dist\lib\swissgrid
xcopy /s /e /y src\ui dist\ui
xcopy /s /e /y src\img dist\img
xcopy /s /e /y src\lib\swissgrid dist\lib\swissgrid


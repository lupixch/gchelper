@echo off
REM This script clears and sets up the dist directory. 
REM It copies all necessary files that are not copied by the typescript compiler.
REM After running this script, a new build must be run to create the *.js files.

rem rmdir dist /q /s
mkdir dist
mkdir dist\gui
mkdir dist\img
mkdir dist\lib
mkdir dist\lib\swissgrid
xcopy /s /e src\gui dist\gui
xcopy /s /e src\img dist\img
xcopy /s /e src\lib\swissgrid dist\lib\swissgrid

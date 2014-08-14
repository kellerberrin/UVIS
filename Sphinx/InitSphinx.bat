@echo off
rem This batch file create the Sphinx virtual environment using virtual_env.py
rem Important the environment variable %SPHINX_BIN% must be defined
rem and must point to the directory where the virtual python environment for Sphinx. 
rem This will usually be  "C:\Sphinx\SphinxVirtual" or similar.

rem Check to see the the environment variable exists

if not defined SPHINX_BIN (
	echo.
	echo The "SPHINX_BIN" command was not found. 
    echo The environment variable 'SPHINX_BIN' must be defined
    echo and should point to the directory that activates the virtual python environment. 
    echo This will usually be "C:\Sphinx\SphinxVirtual" or similar.
	exit /b 1
)

echo.
echo Initializing the Sphinx Virtual environment.
echo.

%SPHINX_BIN%\Scripts\activate

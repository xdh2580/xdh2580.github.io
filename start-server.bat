@echo off
cd /d "%~dp0"
echo Starting Jekyll server at http://127.0.0.1:4000 ...
echo Press Ctrl+C or close this window to stop.
bundle exec jekyll serve --livereload
pause

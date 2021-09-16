@ECHO OFF

CALL tsc --project tsconfig.json

MOVE assets\js\scripts.js assets\js\scripts.min.js

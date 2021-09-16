@ECHO OFF

CALL tsc --target ES2017 --project tsconfig.json
java -jar D:\Tools\closure-compiler.jar --js assets\js\scripts.js --js_output_file assets\js\scripts.min.js --language_in ECMASCRIPT_2017 --language_out ECMASCRIPT_2017 --strict_mode_input --compilation_level SIMPLE
DEL assets\js\scripts.js

CALL tsc --target ES2015 --project tsconfig.json
java -jar D:\Tools\closure-compiler.jar --js assets\js\scripts.js --js_output_file assets\js\scripts.es6.min.js --language_in ECMASCRIPT_2015 --language_out ECMASCRIPT_2015 --strict_mode_input --compilation_level SIMPLE
DEL assets\js\scripts.js

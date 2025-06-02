#!/bin/bash
set -e
set -o pipefail
npm install
node pbp/das/das2json.mjs arith.drawio
rm -f out.*
TARGET=ex1
python3 main.py . ${TARGET}.math main arith.drawio.json | node pbp/kernel/decodeoutput.mjs
cat out.md
mv out.py ${TARGET}.py
mv out.js ${TARGET}.js
mv out.lisp ${TARGET}.lisp
mv out.wasm ${TARGET}.wasm

SIZE="$(wc -c < out.md)"
if [ "$SIZE" -gt 2 ]; then
    echo '** Messages **'
    cat out.md
else
    echo '** code for arithmetic expression written in a little DSL **'
    cat ${TARGET}.math
    echo '** transpiled to Javascript **'
    cat ex1.js
    echo '** transpiled to Python **'
    cat ex1.py
    echo '** transpiled to lisp **'
    cat ex1.lisp
    echo '** transpiled to wasm **'
    cat ex1.wasm
fi

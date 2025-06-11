#!/bin/bash
set -e
set -o pipefail
npm install
node pbp/das/das2json.mjs arith.drawio
rm -f out.*
python3 main.py . ex1.math main arith.drawio.json | node pbp/kernel/decodeoutput.mjs
cat out.md
mv out.py ex1.py
mv out.js ex1.js
mv out.lisp ex1.lisp
mv out.wasm ex1.wasm

SIZE="$(wc -c < out.md)"
if [ "$SIZE" -gt 2 ]; then
    echo '** Messages **'
    cat out.md
else
    echo '** code for arithmetic expression written in a little DSL **'
    cat ex1.math
    echo '** transpiled to Javascript **'
    cat ex1.js
    echo '** transpiled to Python **'
    cat ex1.py
    echo '** transpiled to lisp **'
    cat ex1.lisp
    echo '** transpiled to wasm **'
    cat ex1.wasm
fi

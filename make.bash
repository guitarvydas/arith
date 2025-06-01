#!/bin/bash
set -e
node pbp/das/das2json.mjs arith.drawio
rm -f out.*
TARGET=ex1
python3 main.py . ${TARGET}.math main arith.drawio.json | node pbp/kernel/decodeoutput.mjs
cat out.md
mv out.py ${TARGET}.py
mv out.js ${TARGET}.js
mv out.lisp ${TARGET}.lisp
mv out.wasm ${TARGET}.wasm

if [ $(stat -f '%z' out.md) -gt 2 ]; then
    echo '** Messages **'
    cat out.md
else
    echo '** Javascript **'
    cat ex1.js
    echo
    echo
    echo '** Python **'
    cat ex1.py
    echo
    echo
    echo '** lisp **'
    cat ex1.lisp
    echo
    echo
    echo '** wasm **'
    cat ex1.js
fi

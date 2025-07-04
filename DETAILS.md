# Directory Contents
A set of source files needs to be supplied by the programmer.
## Manually written, supplied by programmer
- `arith.drawio`
	- source code for the program (diagram, use [draw.io](https://app.diagrams.net) to view/edit the source)
	- composition of five components,
	- read the input text file
	- send the text, as a string mevent, in parallel to four code generators
	- each code generator invokes `t2t.bash` with the grammar (`arith.ohm`) and appropriate rewriter (`arithjs.rwr`, etc.)
	- each code generator sends the generated code to the appropriate output gate
	- the final outputs are collected up and printed on `stdout` as a JSON object containing four tagged output strings, one for each target language
- `ex1.math` - text expression source code used for this example
- `arith.ohm` - the grammar in OhmJS format
- `arithcl.rwr` - the RWR (ReWRite) specification for Common Lisp
- `arithjs.rwr` - the RWR (ReWRite) specification for Common LispJavascript
- `arithpy.rwr` - the RWR (ReWRite) specification for Python
- `arithwasm.rwr` - the RWR (ReWRite) specification for WASM
- `empty.js` - file containing Javascript code for support functions (no extra functions needed, hence the file is empty)
- `main.py` - Python code to initialize and start the program and to catch exceptions if any (no exceptions expected in this simple example)

## Scaffolding for this example
- `README.md` - this documentation file
- `make.bash*` 
	- bash script that runs the program
	- converts `arith.drawio` to JSON
	- uses Python to to run the program, using the information in the converted JSON (`arith.drawio.json`)
	- uses `das2json` to convert the DPL source code (`arith.drawio`) into JSON
	- invokes `main.py` to run the program
	- pipes the output (JSON) into `decodeoutput.mjs` to split the output into separate files `out.py`, `out.js`,- `out.lisp`, `out.wasm` and `out.md` (out.md contains errors and messages, if any)
	- renames `out.py` to `ex1.py`, `out.js` to `ex1.js`, `out.lisp` to `ex1.lisp`, `out.wasm` to `ex1.wasm`

## Tools
- `pbp/das/das2json.mjs` - Diagrams as Syntax tool - converts .drawio to JSON (specifically `arith.drawio` --> `arith.drawio.json`)
- `pbp/kernel/decodeoutput.mjs` - splits resulting JSON into 5 files: `out.py`, `out.js`, `out.lisp`, `out.wasm`, `out.md`
- `pbp/kernel/kernel0d.py` - used by `t2t`tool
- `pbp/kernel/repl.py`- used by `kernel0d.py`
- `pbp/main.py` - ignored (template for main.py in DaS projects)
- `pbp/README.md` - readme for tools directory
- `pbp/refresh.bash*` - ignored (tool development helper)
- `pbp/t2t/lib/args.part.js` - utility functions for `t2t`, included in generated code
- `pbp/t2t/lib/front.part.js` - code snippet included in generated code
- `pbp/t2t/lib/middle.part.js` - code snippet included in generated code
- `pbp/t2t/lib/rwr.mjs` - RWR tool - rewriter DSL, used by `t2t.bash`
- `pbp/t2t/lib/tail.part.js` - code snippet included in generated code
- `pbp/t2t.bash*` - text to text code generator ("transpiler" tool)
- `pbp/tas/` - these tools are ignored (Text as Syntax tool) for this simple, do-nothing example (these tools would be used in a larger example)
- `pbp/tas.bash*` - ignored

## generated files
- `arith.drawio.json` - generated by `pbp/das/das2json.mjs` in `make.bash`
- `temp.rewrite.mjs`  - generated Javascript program derived from `.rwr` files above, part of `t2t` toolchain (rewritten by each code generator)
- `temp.nanodsl.mjs`  - generated Javascript program that implements `t2t` code generator ("transpiler") (rewritten by each code generator)
- `ex1.js` - Javascript result
- `ex1.lisp` - Lisp result
- `ex1.py` - Python result
- `ex1.wasm` - wasm result
- `out.md` - messages and errors (if any) (expected to be empty in this simple example)

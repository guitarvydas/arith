# Simple Example of Parts-Based Programming using Drawware
![arith](./arith-main.drawio.svg)
- source code is a drawing `arith.drawio` (view/edit with [draw.io](https://app.diagrams.net))
- uses stock example grammar that comes with OhmJS for arithmetic expressions and compiles to Javascript and Python and Lisp and Wasm all at once

# Usage:
`$ ./make.bash`
## expected output
```
$ ./make.bash 

up to date, audited 23 packages in 492ms

6 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Created: arith.drawio.json

** code for arithmetic expression written in a little DSL **
(v * (42 - 1)) / (9^3)
** transpiled to Javascript **
(v * (42 - 1)) / (Number.parseFloat(9).toExponential(3))
** transpiled to Python **
(v * (42 - 1)) / (9**3)
** transpiled to lisp **
(/ (* v (- 42 1)) (exp 9 3))
** transpiled to wasm **
(f64.div (f64.mul (local.get $v) (f64.sub 42 1)) (f64.pow 9 3))
```

The output is not of practical use, but this (simple) example shows that the same grammar can be fed into 4 emitters to produce output tailored for each language.

Each of the emitters uses `t2t` to generate code (`t2t` is a tool that performs text-to-text transpilation).


# See Also
[DETAILS.md](DETAILS.md) - files and directories

See [abc](https://github.com/guitarvydas/abc/tree/master) for a simple example of transpiling a do-nothing language. See [abc2py](https://github.com/guitarvydas/abc2py) for the same simple example language the emits running, legal Python code.

See [RWR documentation]() for how to create rewrite rules.

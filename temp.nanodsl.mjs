'use strict'

import * as ohm from 'ohm-js';

let verbose = false;

function top (stack) { let v = stack.pop (); stack.push (v); return v; }

function set_top (stack, v) { stack.pop (); stack.push (v); return v; }

let return_value_stack = [];
let rule_name_stack = [];
let depth_prefix = ' ';

function enter_rule (name) {
    if (verbose) {
	console.error (depth_prefix, ["enter", name]);
	depth_prefix += ' ';
    }
    return_value_stack.push ("");
    rule_name_stack.push (name);
}

function set_return (v) {
    set_top (return_value_stack, v);
}

function exit_rule (name) {
    if (verbose) {
	depth_prefix = depth_prefix.substr (1);
	console.error (depth_prefix, ["exit", name]);
    }
    rule_name_stack.pop ();
    return return_value_stack.pop ()
}

const grammar = String.raw`
Arithmetic {
  Exp
    = AddExp

  AddExp
    = AddExp "+" MulExp  -- plus
    | AddExp "-" MulExp  -- minus
    | MulExp

  MulExp
    = MulExp "*" ExpExp  -- times
    | MulExp "/" ExpExp  -- divide
    | ExpExp

  ExpExp
    = PriExp "^" ExpExp  -- power
    | PriExp

  PriExp
    = "(" Exp ")"  -- paren
    | "+" PriExp   -- pos
    | "-" PriExp   -- neg
    | ident        -- ident
    | number       -- number

  ident  (an identifier)
    = letter alnum*

  number  (a number)
    = digit* "." digit+  -- fract
    | digit+             -- whole
}
`;

let args = {};
function resetArgs () {
    args = {};
}
function memoArg (name, accessorString) {
    args [name] = accessorString;
};
function fetchArg (name) {
    return args [name];
}

// empty - no extra functions are needed
let parameters = {};
function pushParameter (name, v) {
    if (!parameters [name]) {
        parameters [name] = [];
    }
    parameters [name].push (v);
}
function popParameter (name) {
    parameters [name].pop ();
}
function getParameter (name) {
    return parameters [name];
}


let _rewrite = {

Exp : function (AddExp,) {
enter_rule ("Exp");
    set_return (`${AddExp.rwr ()}`);
return exit_rule ("Exp");
},
AddExp_plus : function (AddExp,kplus,MulExp,) {
enter_rule ("AddExp_plus");
    set_return (`(f64.add ${AddExp.rwr ()} ${MulExp.rwr ()})`);
return exit_rule ("AddExp_plus");
},
AddExp_minus : function (AddExp,kplus,MulExp,) {
enter_rule ("AddExp_minus");
    set_return (`(f64.sub ${AddExp.rwr ()} ${MulExp.rwr ()})`);
return exit_rule ("AddExp_minus");
},
AddExp : function (Exp,) {
enter_rule ("AddExp");
    set_return (`${Exp.rwr ()}`);
return exit_rule ("AddExp");
},
MulExp_times : function (MulExp,kasterisk,ExpExp,) {
enter_rule ("MulExp_times");
    set_return (`(f64.mul ${MulExp.rwr ()} ${ExpExp.rwr ()})`);
return exit_rule ("MulExp_times");
},
MulExp_divide : function (MulExp,kslash,ExpExp,) {
enter_rule ("MulExp_divide");
    set_return (`(f64.div ${MulExp.rwr ()} ${ExpExp.rwr ()})`);
return exit_rule ("MulExp_divide");
},
MulExp : function (ExpExp,) {
enter_rule ("MulExp");
    set_return (`${ExpExp.rwr ()}`);
return exit_rule ("MulExp");
},
ExpExp_power : function (PriExp,kcaret,ExpExp,) {
enter_rule ("ExpExp_power");
    set_return (`(f64.pow ${PriExp.rwr ()} ${ExpExp.rwr ()})`);
return exit_rule ("ExpExp_power");
},
ExpExp : function (PriExp,) {
enter_rule ("ExpExp");
    set_return (`${PriExp.rwr ()}`);
return exit_rule ("ExpExp");
},
PriExp_paren : function (lp,Exp,rp,) {
enter_rule ("PriExp_paren");
    set_return (`${Exp.rwr ()}`);
return exit_rule ("PriExp_paren");
},
PriExp_pos : function (kplus,Exp,) {
enter_rule ("PriExp_pos");
    set_return (`${Exp.rwr ()}`);
return exit_rule ("PriExp_pos");
},
PriExp_neg : function (kminus,Exp,) {
enter_rule ("PriExp_neg");
    set_return (`(f64.sub (f64.const 0) ${Exp.rwr ()})`);
return exit_rule ("PriExp_neg");
},
PriExp : function (x,) {
enter_rule ("PriExp");
    set_return (`${x.rwr ()}`);
return exit_rule ("PriExp");
},
ident : function (letter,alnumz,) {
enter_rule ("ident");
    set_return (`(local.get $${letter.rwr ()}${alnumz.rwr ().join ('')})`);
return exit_rule ("ident");
},
number_fract : function (digitz,kdot,digits,) {
enter_rule ("number_fract");
    set_return (`${digitz.rwr ().join ('')}.${digits.rwr ().join ('')}`);
return exit_rule ("number_fract");
},
number_whole : function (digits,) {
enter_rule ("number_whole");
    set_return (`${digits.rwr ().join ('')}`);
return exit_rule ("number_whole");
},
_terminal: function () { return this.sourceString; },
_iter: function (...children) { return children.map(c => c.rwr ()); }
}
import * as fs from 'fs';

function grammarname (s) {
    let n = s.search (/{/);
    return s.substr (0, n).replaceAll (/\n/g,'').trim ();
}

try {
    const argv = process.argv.slice(2);
    let srcFilename = argv[0];
    if ('-' == srcFilename) { srcFilename = 0 }
    let src = fs.readFileSync(srcFilename, 'utf-8');
    try {
	let parser = ohm.grammar (grammar);
	let cst = parser.match (src);
	if (cst.failed ()) {
	    //throw Error (`${cst.message}\ngrammar=${grammarname (grammar)}\nsrc=\n${src}`);
	    throw Error (cst.message);
	}
	let sem = parser.createSemantics ();
	sem.addOperation ('rwr', _rewrite);
	console.log (sem (cst).rwr ());
	process.exit (0);
    } catch (e) {
	//console.error (`${e}\nargv=${argv}\ngrammar=${grammarname (grammar)}\src=\n${src}`);
	console.error (`${e}\n\ngrammar = "${grammarname (grammar)}"`);
	process.exit (1);
    }
} catch (e) {
    console.error (`${e}\n\ngrammar = "${grammarname (grammar)}`);
    process.exit (1);
}


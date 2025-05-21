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

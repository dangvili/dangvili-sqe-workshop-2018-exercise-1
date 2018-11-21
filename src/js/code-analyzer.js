import * as esprima from 'esprima';
import * as escodegen from 'escodegen';



//wrapper function for record - record is a tuple in the produced table
const record = (line, type, name, condition, value) => {
    return {'Line': line, 'Type': type, 'Name':name, 'Condition':condition, 'Value':value};
};

function flattenDeep(arr1) {
    return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}

const generate  = (value) => {
    return value === null ? '' : escodegen.generate(value);
};

const programHandler = (body) => {
    return body.map(buildTable);
};

const blockHandler = (body) => {
    return body.body.map(x => recordTypes[x.type](x));
};

const varDeclHandler = (body) => {
    return body.declarations.map(x => varDeclarator(x));
};

const varDeclarator = (body) => {
    return record(body.id.loc.start.line, 'variable declaration', body.id.name, '', generate(body.init));
};

const assExpHandler = (body) => {
    return [record(body.loc.start.line, 'assignment expression', body.left.name, '', generate(body.right))];
};

const upExpHandler = (body) => {
    return record(body.loc.start.line, 'update expression', '', '', generate(body));
};

const seqExpHandler = (body) => {
    return body.expressions.map(assExpHandler);
};

const retStatementHandler = (body) => {
    return record(body.loc.start.line, 'return statement', '', '', generate(body.argument));
};

const whileStatementHandler = (body) => {
    return [record(body.loc.start.line, 'while statement', '', generate(body.test), '')].concat(recordTypes[body.body.type](body.body));
};

const ifStatementHandler = (body) => {
    return [record(body.loc.start.line, 'if statement', '', generate(body.test), '')].concat(consIf(body.consequent, body.alternate));
};

const elseIfStatement = (body) => {
    return [record(body.loc.start.line, 'else if statement', '', generate(body.test), '')].concat(consIf(body.consequent, body.alternate));
};

const consIf = (consequent, alternate) => {
    return [recordTypes[consequent.type](consequent)].concat(alternate === null ? [] : alternate.type === 'IfStatement' ? elseIfStatement(alternate) : (recordTypes[alternate.type](alternate)));
};

const funcDecl = (body) =>{
    return [record(body.loc.start.line, 'function declaration', body.id.name, '', '')].concat(body.params.map(funcVarDecl)).concat(buildTable(body.body));
};

const funcVarDecl = (body) => {
    return record(body.loc.start.line, 'variable declaration', body.name, '', '');
};

const forStatementHandler = (body) => {
    return [record(body.loc.start.line, 'for statement', '', generate(body.test), '')]
        .concat(recordTypes[body.init.type](body.init)).concat(recordTypes[body.update.type](body.update)).concat(buildTable(body.body));
};

const expHandler = (body) => {
    return recordTypes[body.expression.type](body.expression);
};

let recordTypes = {'Program':programHandler, 'BlockStatement':blockHandler, 'VariableDeclaration':varDeclHandler, 'ExpressionStatement':expHandler,
    'ReturnStatement':retStatementHandler, 'WhileStatement':whileStatementHandler, 'IfStatement':ifStatementHandler,
    'FunctionDeclaration': funcDecl, 'ForStatement': forStatementHandler,'SequenceExpression': seqExpHandler, 'AssignmentExpression': assExpHandler, 'UpdateExpression':upExpHandler};

const buildTable = (parsedCode) => {
    return parsedCode.body.map(x => recordTypes[x.type](x));
};


const parseCode = (codeToParse) => {
    return flattenDeep(buildTable(esprima.parseScript(codeToParse, {loc: true})));
};

export {parseCode};

import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';


const testCase = (title, code, expectedOutput) =>{
    return it(title, () => assert.equal(JSON.stringify(parseCode(code)), expectedOutput));
};

let generalCodeSegment = 'function binarySearch(X, V, n){\n' +
    '    let low, high, mid;\n' +
    '    low = 0;\n' +
    '    high = n - 1;\n' +
    '    while (low <= high) {\n' +
    '        mid = (low + high)/2;\n' +
    '        if (X < V[mid])\n' +
    '            high = mid - 1;\n' +
    '        else if (X > V[mid])\n' +
    '            low = mid + 1;\n' +
    '        else\n' +
    '            return mid;\n' +
    '    }\n' +
    '    return -1;\n' +
    '}';

describe('The javascript parser', () => {
    testCase ('is parsing an empty function correctly', '', '[]');
    testCase ('is parsing an variable declaration correctly', 'let x = 12;', '[{"Line":1,"Type":"variable declaration","Name":"x","Condition":"","Value":"12"}]');
    testCase ('is parsing an assignment expression correctly', 'x=7;', '[{"Line":1,"Type":"assignment expression","Name":"x","Condition":"","Value":"7"}]');
    testCase ('is parsing an sequence expression correctly', 'x=2, y=3, z=4;', '[{"Line":1,"Type":"assignment expression","Name":"x","Condition":"","Value":"2"},{"Line":1,"Type":"assignment expression","Name":"y","Condition":"","Value":"3"},{"Line":1,"Type":"assignment expression","Name":"z","Condition":"","Value":"4"}]');
    testCase ('is parsing an update expression correctly', 'i++;', '[{"Line":1,"Type":"update expression","Name":"","Condition":"","Value":"i++"}]');
    testCase ('is parsing an return statement/simple function correctly', 'function f (x,y,z){return x;}', '[{"Line":1,"Type":"function declaration","Name":"f","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"x","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"y","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"z","Condition":"","Value":""},{"Line":1,"Type":"return statement","Name":"","Condition":"","Value":"x"}]');
    testCase ('is parsing an while statement correctly', 'while (x>3){x=4;}', '[{"Line":1,"Type":"while statement","Name":"","Condition":"x > 3","Value":""},{"Line":1,"Type":"assignment expression","Name":"x","Condition":"","Value":"4"}]');
    testCase ('is parsing an if statement correctly', 'if(x=1){x=2;}', '[{"Line":1,"Type":"if statement","Name":"","Condition":"x = 1","Value":""},{"Line":1,"Type":"assignment expression","Name":"x","Condition":"","Value":"2"}]');
    testCase ('is parsing an if/else if statement correctly', 'if(x=1){x=2;}else if(x=2){x=3;} else if(x=3){x=4;}', '[{"Line":1,"Type":"if statement","Name":"","Condition":"x = 1","Value":""},{"Line":1,"Type":"assignment expression","Name":"x","Condition":"","Value":"2"},{"Line":1,"Type":"else if statement","Name":"","Condition":"x = 2","Value":""},{"Line":1,"Type":"assignment expression","Name":"x","Condition":"","Value":"3"},{"Line":1,"Type":"else if statement","Name":"","Condition":"x = 3","Value":""},{"Line":1,"Type":"assignment expression","Name":"x","Condition":"","Value":"4"}]');
    testCase ('is parsing an if/else correctly', 'if(x=1){x=2;}else{x=5;}', '[{"Line":1,"Type":"if statement","Name":"","Condition":"x = 1","Value":""},{"Line":1,"Type":"assignment expression","Name":"x","Condition":"","Value":"2"},{"Line":1,"Type":"assignment expression","Name":"x","Condition":"","Value":"5"}]');
    testCase ('is parsing an for statement correctly', 'for(i=1; i<3; i++){x=4;}', '[{"Line":1,"Type":"for statement","Name":"","Condition":"i < 3","Value":""},{"Line":1,"Type":"assignment expression","Name":"i","Condition":"","Value":"1"},{"Line":1,"Type":"update expression","Name":"","Condition":"","Value":"i++"},{"Line":1,"Type":"assignment expression","Name":"x","Condition":"","Value":"4"}]');
    testCase ('is parsing an general code segment correctly', generalCodeSegment, '[{"Line":1,"Type":"function declaration","Name":"binarySearch","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"X","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"V","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"n","Condition":"","Value":""},{"Line":2,"Type":"variable declaration","Name":"low","Condition":"","Value":""},{"Line":2,"Type":"variable declaration","Name":"high","Condition":"","Value":""},{"Line":2,"Type":"variable declaration","Name":"mid","Condition":"","Value":""},{"Line":3,"Type":"assignment expression","Name":"low","Condition":"","Value":"0"},{"Line":4,"Type":"assignment expression","Name":"high","Condition":"","Value":"n - 1"},{"Line":5,"Type":"while statement","Name":"","Condition":"low <= high","Value":""},{"Line":6,"Type":"assignment expression","Name":"mid","Condition":"","Value":"(low + high) / 2"},{"Line":7,"Type":"if statement","Name":"","Condition":"X < V[mid]","Value":""},{"Line":8,"Type":"assignment expression","Name":"high","Condition":"","Value":"mid - 1"},{"Line":9,"Type":"else if statement","Name":"","Condition":"X > V[mid]","Value":""},{"Line":10,"Type":"assignment expression","Name":"low","Condition":"","Value":"mid + 1"},{"Line":12,"Type":"return statement","Name":"","Condition":"","Value":"mid"},{"Line":14,"Type":"return statement","Name":"","Condition":"","Value":"-1"}]');
});

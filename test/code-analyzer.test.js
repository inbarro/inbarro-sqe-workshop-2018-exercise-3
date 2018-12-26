import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {parsedCodeToSymbolicSubstitutionWithColor} from '../src/js/code-analyzer';

describe('function declaration', () => {
    let inputCode = 'function foo(x, y, z){ }';
    let inputVector = '1|3|[2,2,2]';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('function declaration length', () => {
        assert.equal(output.length,2);
    });
    it('function declaration appears right', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
    });
    it('function declaration appears right', () => {
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'}', color:''}));
    });
});

describe('variables decleration', () => {
    let inputCode = 'function foo(x, y, z){let low;}';
    let inputVector = '1|3|[2,2,2]';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('variables decleration appears right', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
    });
    it('variables decleration appears right', () => {
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'}', color:''}));
    });
});

describe('variables assignment', () => {
    let inputCode = 'function foo(x, y, z){let low; low=5; low=low+1;}';
    let inputVector = '1|3|[2,2,2]';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('variables decleration appears right', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
    });
    it('variables decleration appears right', () => {
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'}', color:''}));
    });
});

describe('simple if test', () => {
    let inputCode = 'function foo(x, y, z){ let a = x + 1;  let b = a + y;  let c = 0; if (b < z) {}}';
    let inputVector = '1|3|2';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('if function length', () => {
        assert.equal(output.length,4);
    });
    it('simple if with variables decleration', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'if (x+1+y < z) {', color:'red'}));
        assert.equal(JSON.stringify(output[2]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[3]),JSON.stringify({str:'}', color:''}));
    });
});

describe('simple if with variables decleration and assignment', () => {
    let inputCode = 'function foo(x, y, z){ let a = x + 1;  let b = a + y;  let c = 0; if (b < z) {c= c+5;}}';
    let inputVector = '1|3|2';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('simple if with assignment function length', () => {
        assert.equal(output.length,4);
    });
    it('simple if with assignment appears right', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'if (x+1+y < z) {', color:'red'}));
        assert.equal(JSON.stringify(output[2]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[3]),JSON.stringify({str:'}', color:''}));
    });
});

describe('simple if with return', () => {
    let inputCode = 'function foo(x, y, z){ let a = x + 1;  let b = a + y;  let c = 0; if (b < z) {c= c+5; return x + y + z + c;}}';
    let inputVector = '1|3|2';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('simple if with assignment function length', () => {
        assert.equal(output.length,5);
    });
    it('simple if with assignment appears right', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'if (x+1+y < z) {', color:'red'}));
        assert.equal(JSON.stringify(output[2]),JSON.stringify({str:'return x+y+z+5;', color:''}));
        assert.equal(JSON.stringify(output[3]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[4]),JSON.stringify({str:'}', color:''}));
    });
});

describe('simple if with return', () => {
    let inputCode = 'function foo(x, y, z){ let a = x + 1;  let b = a + y;  let c = 0; if (b < z) {c= c+5; return x + y + z + c;}}';
    let inputVector = '1|3|2';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('simple if with assignment function length', () => {
        assert.equal(output.length,5);
    });
    it('simple if with assignment appears right', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'if (x+1+y < z) {', color:'red'}));
        assert.equal(JSON.stringify(output[2]),JSON.stringify({str:'return x+y+z+5;', color:''}));
        assert.equal(JSON.stringify(output[3]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[4]),JSON.stringify({str:'}', color:''}));
    });
});

describe('if else test', () => {
    let inputCode = 'function foo(x, y, z){ let a = x + 1;  let b = a + y;  let c = 0; if (b < z) {c= c+5; return x + y + z + c;  } else if (b < z * 2) { c = c + x + 5;  return x + y + z + c;} else { c = c + z + 5;return x + y + z + c;}}';
    let inputVector = '1|2|3';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('simple if else', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'if (x+1+y < z) {', color:'red'}));
        assert.equal(JSON.stringify(output[2]),JSON.stringify({str:'return x+y+z+5;', color:''}));
        assert.equal(JSON.stringify(output[3]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[4]),JSON.stringify({str:'else if (x+1+y < z*2) {', color:'green'}));
        assert.equal(JSON.stringify(output[5]),JSON.stringify({str:'return x+y+z+0+x+5;', color:''}));
        assert.equal(JSON.stringify(output[6]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[7]),JSON.stringify({str:'else{', color:'red'}));
        assert.equal(JSON.stringify(output[8]),JSON.stringify({str:'return x+y+z+0+z+5;', color:''}));
        assert.equal(JSON.stringify(output[9]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[10]),JSON.stringify({str:'}', color:''}));
    });
});

describe('nested if else',() => {
    let inputCode = 'function foo(x, y, z){ let a = x + 1;  let b = a + y;  let c = 0; if (b < z) {c= c+5; if(b>z+1){ return x + y + z + c;} else{ return x + y + z + c + 1; }} else if (b < z * 2) { c = c + x + 5;  return x + y + z + c;} else { c = c + z + 5; return x + y + z + c;}}';
    let inputVector = '1|2|3';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('nested else appears right', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'if (x+1+y < z) {', color:'red'}));
        assert.equal(JSON.stringify(output[2]),JSON.stringify({str:'if (x+1+y > z+1) {', color:'red'}));
        assert.equal(JSON.stringify(output[3]),JSON.stringify({str:'return x+y+z+5;', color:''}));
        assert.equal(JSON.stringify(output[4]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[5]),JSON.stringify({str:'else{', color:'green'}));
        assert.equal(JSON.stringify(output[6]),JSON.stringify({str:'return x+y+z+5+1;', color:''}));
        assert.equal(JSON.stringify(output[7]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[8]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[9]),JSON.stringify({str:'else if (x+1+y < z*2) {', color:'green'}));
        assert.equal(JSON.stringify(output[10]),JSON.stringify({str:'return x+y+z+0+x+5;', color:''}));
        assert.equal(JSON.stringify(output[11]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[12]),JSON.stringify({str:'else{', color:'red'}));
        assert.equal(JSON.stringify(output[13]),JSON.stringify({str:'return x+y+z+0+z+5;', color:''}));
        assert.equal(JSON.stringify(output[14]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[15]),JSON.stringify({str:'}', color:''}));
    });
});

describe('simple while test ', () => {
    let inputCode = 'function foo(x, y, z){ let a = x + 1;  let b = a + y; while (a < z) {}}';
    let inputVector = '1|3|2';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('simple while with function length', () => {
        assert.equal(output.length,4);
    });
    it('simple while with assignment appears right', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'while ( x+1 < z) {', color:'red'}));
        assert.equal(JSON.stringify(output[2]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[3]),JSON.stringify({str:'}', color:''}));
    });
});

describe('simple while test with assignment', () => {
    let inputCode = 'function foo(x, y, z){ let a = x + 1;  let b = a + y; while (a < z) {a= a+b;}}';
    let inputVector = '1|3|2';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('simple while with assignment function length', () => {
        assert.equal(output.length,4);
    });
    it('simple while with assignment appears right', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'while ( x+1 < z) {', color:'red'}));
        assert.equal(JSON.stringify(output[2]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[3]),JSON.stringify({str:'}', color:''}));
    });
});

describe('simple while with return test', () => {
    let inputCode = 'function foo(x, y, z){ let a = x + 1;  let b = a + y;  let c = 0; while (a < z) {c= a+b; z = c * 2; return z;}}';
    let inputVector = '1|3|2';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('simple while with return function length', () => {
        assert.equal(output.length,5);
    });
    it('simple while with return appears right', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'while ( x+1 < z) {', color:'red'}));
        assert.equal(JSON.stringify(output[2]),JSON.stringify({str:'return z;', color:''}));
        assert.equal(JSON.stringify(output[3]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[4]),JSON.stringify({str:'}', color:''}));
    });
});


describe('if with while test', () => {
    let inputCode = 'function foo(x, y, z){ let a = x + 1;  let b = a + y;  let c = 0; if (b < z) {c= c+5; return x + y + z + c;  } else { c = c + z + 5;return x + y + z + c;} while (x<y){ x=x+1}}';
    let inputVector = '1|2|3';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('if while', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'if (x+1+y < z) {', color:'red'}));
        assert.equal(JSON.stringify(output[2]),JSON.stringify({str:'return x+y+z+5;', color:''}));
        assert.equal(JSON.stringify(output[3]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[4]),JSON.stringify({str:'else{', color:'green'}));
        assert.equal(JSON.stringify(output[5]),JSON.stringify({str:'return x+y+z+0+z+5;', color:''}));
        assert.equal(JSON.stringify(output[6]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[7]),JSON.stringify({str:'while ( x < y) {', color:'green'}));
        assert.equal(JSON.stringify(output[8]),JSON.stringify({str:'}', color:''}));
    });
});

describe(' while inside if test', () => {
    let inputCode = 'function foo(x, y, z){  if (x < z) {while(x<y){x = x+1}}else{while (z<x){z = z+1}}}';
    let inputVector = '1|2|3';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('if while', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function foo (x, y, z){', color:''}));
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'if (x < z) {', color:'green'}));
        assert.equal(JSON.stringify(output[2]),JSON.stringify({str:'while ( x < y) {', color:'green'}));
        assert.equal(JSON.stringify(output[3]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[4]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[5]),JSON.stringify({str:'else{', color:'red'}));
        assert.equal(JSON.stringify(output[6]),JSON.stringify({str:'while ( z < x) {', color:'red'}));
        assert.equal(JSON.stringify(output[7]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[8]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[9]),JSON.stringify({str:'}', color:''}));

    });
});

describe(' while inside if test', () => {
    let inputCode = 'function binarySearch(X, V, n){let low, high, mid; low = 0; high = n - 1; while (low <= high) { mid = (low + high)/2; if (X < V[mid]){  high = mid - 1;}  else if (X > V[mid]){low = mid + 1;} else{ return -1;}}return -1;}';
    let inputVector = '1|[2,2.2]|3';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToSymbolicSubstitutionWithColor(inputVector,parsedCode);
    it('if while', () => {
        assert.equal(JSON.stringify(output[0]),JSON.stringify({str:'function binarySearch (X, V, n){', color:''}));
        assert.equal(JSON.stringify(output[1]),JSON.stringify({str:'while ( 0 <= n-1) {', color:'green'}));
        assert.equal(JSON.stringify(output[2]),JSON.stringify({str:'if (X < V[0+n-1/2]) {', color:'green'}));
        assert.equal(JSON.stringify(output[3]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[4]),JSON.stringify({str:'else if (X > V[0+n-1/2]) {', color:'red'}));
        assert.equal(JSON.stringify(output[5]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[6]),JSON.stringify({str:'else{', color:'green'}));
        assert.equal(JSON.stringify(output[7]),JSON.stringify({str:'return -1;', color:''}));
        assert.equal(JSON.stringify(output[8]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[9]),JSON.stringify({str:'}', color:''}));
        assert.equal(JSON.stringify(output[10]),JSON.stringify({str:'return -1;', color:''}));
        assert.equal(JSON.stringify(output[11]),JSON.stringify({str:'}', color:''}));


    });
});

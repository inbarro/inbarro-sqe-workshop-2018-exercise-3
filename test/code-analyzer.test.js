import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {parsedCodeToflowChartWrap} from '../src/js/code-analyzer';



function colors(allnodes){
    let red = 0;
    let green = 0;
    for (let i=0;i<allnodes.length;i++)
    {
        if (allnodes[i].color == "red")
            red++;
        else
            green++;
    }
    return {'green':green,'red':red};
}

describe('function declaration and variable decleration', () => {
    let inputCode = 'function IR(x) { let a = 0; let b = 1; }';
    let inputVector = '1';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToflowChartWrap(inputVector, parsedCode);
    it('flowChart length', () => {
        assert.equal(output.allNodes.length, 2);
    });
    it('second flowChart length', () => {
        assert.equal(output.finalAttachmentsList.length, 0);
    });
});

describe('function declaration and variable init', () => {
    let inputCode = 'function IR(x) { let a; let b; }';
    let inputVector = '1';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToflowChartWrap(inputVector, parsedCode);
    it('flowChart length', () => {
        assert.equal(output.allNodes.length, 2);
    });
    it('second flowChart length', () => {
        assert.equal(output.finalAttachmentsList.length, 0);
    });
});


describe('function declaration and variable init with binary expression with number', () => {
    let inputCode = 'function IR(x) { let a= 1+2; }';
    let inputVector = '1';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToflowChartWrap(inputVector, parsedCode);
    it('flowChart length', () => {
        assert.equal(output.allNodes.length, 2);
    });
    it('second flowChart length', () => {
        assert.equal(output.finalAttachmentsList.length, 0);
    });
});



describe('simple if function', () => {
    let inputCode = 'function IR(x) { if (x<2){ x=x+1;} }';
    let inputVector = '1';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToflowChartWrap(inputVector,parsedCode);
    it('flowChart  length', () => {
        assert.equal(output.allNodes.length,3);
    });
    it('second flowChart length', () => {
        assert.equal(output.finalAttachmentsList.length, 1);
    });
    it('function declaration appears right', () => {

        assert.equal(JSON.stringify(output.allNodes[1]),JSON.stringify({  id: 1, value: 'x < 2',color: 'green', type: 'condition', pointerTrue: 2,pointerFalse: ''}));
    });
});

describe('member function', () => {
    let inputCode = 'function IR(x) { if (x[0]<1){ x=x+1;} }';
    let inputVector = '[1,2,3]';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToflowChartWrap(inputVector,parsedCode);
    it('flowChart  length', () => {
        assert.equal(output.allNodes.length,3);
    });
    it('second flowChart length', () => {
        assert.equal(output.finalAttachmentsList.length, 1);
    });
    it('member function appears right', () => {

        assert.equal(JSON.stringify(output.allNodes[1]),JSON.stringify({  id: 1, value: 'x[0] < 1',color: 'green', type: 'condition', pointerTrue: 2,pointerFalse: ''}));
    });
});

describe('simple if and else function', () => {
    let inputCode = 'function IR(x) { if (x<2){ x=x+1;} else {x=x+2 } return -1;}';
    let inputVector = '1';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToflowChartWrap(inputVector,parsedCode);
    // it('flowChart  length', () => {
    //     assert.equal(output.allNodes.length,6);
    // });
    // it('second flowChart length', () => {
    //     assert.equal(output.finalAttachmentsList.length, 1);
    // });
    it('simple if and else appears right', () => {
        assert.equal(JSON.stringify(output.allNodes[1]),JSON.stringify({  id: 1, value: 'x < 2',color: 'green', type: 'condition', pointerTrue: 2,pointerFalse: 3}));
    });
});

describe('simple if and else and else if function', () => {
    let inputCode = 'function IR(x) { if (x<2){ x=x+1;}else if(x<1){x=x+3}else {x=x+2 } return -1;}';
    let inputVector = '1';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToflowChartWrap(inputVector,parsedCode);
    it('flowChart  length', () => {
        assert.equal(output.allNodes.length,7);
    });
    it('second flowChart length', () => {
        assert.equal(output.finalAttachmentsList.length, 1);
    });
    it('function declaration appears right', () => {
        assert.equal(JSON.stringify(output.allNodes[1]),JSON.stringify({  id: 1, value: 'x < 2',color: 'green', type: 'condition', pointerTrue: 2,pointerFalse: 3}));
    });
});

describe('simple nested if function', () => {
    let inputCode = 'function IR(x) { if (x<2){ x=x+1;if (x<2) {x=x}}else {x=x+2} return -1;}';
    let inputVector = '1';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToflowChartWrap(inputVector,parsedCode);
    it('flowChart  length', () => {
        assert.equal(output.allNodes.length,7);
    });
    it('second flowChart length', () => {
        assert.equal(output.finalAttachmentsList.length, 2);
    });
    it('function declaration appears right', () => {
        assert.equal(JSON.stringify(output.allNodes[1]),JSON.stringify({  id: 1, value: 'x < 2',color: 'green', type: 'condition', pointerTrue: 2,pointerFalse: 5}));
    });
});


describe('simple nested if else if function', () => {
    let inputCode = 'function IR(x) { if (x<2){ x=x+1;if (x<2) {x=x} else if (x<1) {x=x+1}}else {x=x+2} return -1;}';
    let inputVector = '1';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToflowChartWrap(inputVector,parsedCode);
    it('flowChart  length', () => {
        assert.equal(output.allNodes.length,9);
    });
    it('second flowChart length', () => {
        assert.equal(output.finalAttachmentsList.length, 2);
    });
    it('function declaration appears right', () => {
        assert.equal(JSON.stringify(output.allNodes[1]),JSON.stringify({  id: 1, value: 'x < 2',color: 'green', type: 'condition', pointerTrue: 2,pointerFalse: 7}));
    });
});

describe('simple nested if else if function big if not good', () => {
    let inputCode = 'function IR(x) { if (x<2){ x=x+1;if (x<2) {x=x} else if (x<1) {x=x+1}}else {x=x+2} return -1;}';
    let inputVector = '3';
    let parsedCode = parseCode(inputCode);
    let output = parsedCodeToflowChartWrap(inputVector,parsedCode);
    it('flowChart  length', () => {
        assert.equal(output.allNodes.length,9);
    });
    it('second flowChart length', () => {
        assert.equal(output.finalAttachmentsList.length, 2);
    });
    it('function declaration appears right', () => {
        assert.equal(JSON.stringify(output.allNodes[1]),JSON.stringify({  id: 1, value: 'x < 2',color: 'green', type: 'condition', pointerTrue: 2,pointerFalse: 7}));
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

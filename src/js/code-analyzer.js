import * as esprima from 'esprima';

let funcArgs;
let variablesValues;
let allNodes;
let currentNode;
let ifStack;
let ifIsInStack;
let lastIf;
let noElse;
let ifAttachments;
let currentAttach;
let ifStatus;
let finalAttachmentsList;
let  finalAttachmentsListCounter;



const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};
export {parseCode};

function parsedCodeToflowChartWrap(args,parsedCode){
    variablesValues = new Map();
    allNodes = [];
    ifStack=[];
    ifIsInStack=[];
    ifIsInStack.push(true);
    lastIf = [];
    noElse = [];
    ifAttachments=[];
    ifStatus=[];
    currentAttach=-1;
    finalAttachmentsList=[];
    finalAttachmentsListCounter = 0;
    currentNode=0;
    funcArgs = args.split('|');

    return parsedCodeToflowChart(parsedCode);
}
export {parsedCodeToflowChartWrap};

function parsedCodeToflowChart(parsedCode){
    switch (parsedCode.type) {
    case ('Program'):
        parseProgram(parsedCode);
        console.log(allNodes);
        console.log(finalAttachmentsList);
        return allNodes;
    case ('FunctionDeclaration'):
        parseFunctionDeclaration(parsedCode);
        break;
    case ('BlockStatement'):
        parseBlockStatement(parsedCode.body);
        break;
    default:
        return switchCaseContinue1(parsedCode);
    }
}

function switchCaseContinue1(parsedCode) {
    switch (parsedCode.type) {
    case ('VariableDeclaration'):
        parseVariableDeclaration(parsedCode.declarations);
        break;
    case ('ExpressionStatement'):
        return parseExpressionStatement(parsedCode);
    case ('AssignmentExpression'):
        parseAssignmentExpression(parsedCode);
        break;
    default:
        return switchCaseContinue2(parsedCode);
    }
}

function switchCaseContinue2 (parsedCode) {
    switch (parsedCode.type) {
    case ('BinaryExpression'):
        return parseBinaryExpression(parsedCode);
    case ('Identifier'):
        return parseIdentifier(parsedCode);
    case ('Literal'):
        return parseLiteral(parsedCode);
    // case ('WhileStatement'):
    //     parseWhileStatementPart2(parsedCode);
    //     break;
    default:
        return switchCaseContinue3(parsedCode);
    }
}

function switchCaseContinue3 (parsedCode) {
    switch (parsedCode.type) {
    case ('IfStatement'):
        parseIfStatement(parsedCode,0);
        break;
    case ('MemberExpression'):
        return parseMemberExpression(parsedCode);
    case ('UnaryExpression'):
        return parseUnaryExpression(parsedCode);
    case ('ReturnStatement'):
        parseReturnStatement(parsedCode);
        break;
    }
}

function parseProgram(parsedCode) {
    parsedCodeToflowChart(parsedCode.body[0]);
}

function parseFunctionDeclaration (parsedCode){
    parseFunctionVariableDeclaration(parsedCode.params);
    parsedCodeToflowChart(parsedCode.body);
}

function parseFunctionVariableDeclaration (parsedCode){
    let i;
    for (i = 0; i < parsedCode.length; i++) {
        variablesValues.set(parsedCode[i].name,funcArgs[i]);
    }
}

function parseBlockStatement(parsedCode) {
    let counter=0;
    for (let i = 0; i < parsedCode.length; i++) {
        if (parsedCode[i].type==='IfStatement'){
            if (currentNode>0)
                allNodes[currentNode].pointerTrue = currentNode + 1;
            currentNode++;
            allNodes[currentNode] = {}; allNodes[currentNode].id = currentNode; allNodes[currentNode].value = ''; allNodes[currentNode].color = 'green';  allNodes[currentNode].type = 'condition'; allNodes[currentNode].pointerTrue = '';  allNodes[currentNode].pointerFalse = '';
            if (!top(ifIsInStack)){
                allNodes[currentNode].color = 'red';
            }
            parsedCodeToflowChart(parsedCode[i]);
            counter=0;}
        else{
            if (counter===0){
                currentNode++;
                allNodes[currentNode] = {};allNodes[currentNode].id = currentNode;allNodes[currentNode].value = '';allNodes[currentNode].type = 'square'; allNodes[currentNode].color = 'green';
                if (!top(ifIsInStack)){
                    allNodes[currentNode].color = 'red';
                }
                if (ifStack.length !== 0 && allNodes[currentNode-1].type !== 'square')
                    allNodes[top(ifStack)].pointerTrue=currentNode;
                parsedCodeToflowChart(parsedCode[i]);
                counter=1;
            }else{
                parsedCodeToflowChart(parsedCode[i]); }}}
    if (ifStack.length !==0 && ifAttachments.length>0) {
        allNodes[currentNode].pointerToAttachment = ifAttachments[ifAttachments.length-1];
    }
}


function parseVariableDeclaration(parsedCode){
    let i;
    for (i = 0; i < parsedCode.length; i++) {
        let name = parsedCode[i].id.name;
        let row = name+ ' = ';
        if (parsedCode[i].init != null) {
            row += parsedCodeToflowChart(parsedCode[i].init) + '; ';
        } else {
            row += '; ';
        }
        allNodes[currentNode].value += row;
        let stringToEval = calcStringToNumbersString(parsedCode[i].init);
        variablesValues.set(name, eval(stringToEval));
    }
}

function parseExpressionStatement(parsedCode){
    return parsedCodeToflowChart(parsedCode.expression);
}

function parseAssignmentExpression(parsedCode){
    let row='';
    let left = parsedCode.left.name;
    let right = parsedCodeToflowChart(parsedCode.right);
    row+=left + ' = ' + right;
    allNodes[currentNode].value += row;
    variablesValues.set(parsedCode.left.name, eval(calcStringToNumbersString((parsedCode.right))));
}

function parseIdentifier(parsedCode){
    return parsedCode.name;
}

function parseLiteral(parsedCode){
    return parsedCode.value;
}

function parseMemberExpression (parsedCode){
    let obj=parsedCodeToflowChart(parsedCode.object);
    let prop =parsedCodeToflowChart(parsedCode.property);
    return obj+ '[' + prop +']';
}

function parseUnaryExpression (parsedCode){
    let argument = parsedCodeToflowChart(parsedCode.argument);
    let operator = parsedCode.operator;
    return operator+argument;
}

function parseBinaryExpression(parsedCode){
    let left = parsedCodeToflowChart(parsedCode.left);
    let operator = parsedCode.operator;
    let right = parsedCodeToflowChart(parsedCode.right);
    if (isNumber(left) && isNumber(right))
        return eval( left + operator + right);
    return left + operator + right;
}

function parseIfStatement(parsedCode,isElseIf) {
    let left = parsedCodeToflowChart(parsedCode.test.left); let right = parsedCodeToflowChart(parsedCode.test.right); let op = parsedCode.test.operator;
    let condition = calcStringToNumbersString(parsedCode.test);     let conditionRealResult = eval(condition);

    if(isElseIf == 1){
        currentNode++;
        allNodes[currentNode] = {}; allNodes[currentNode].id = currentNode; allNodes[currentNode].value = '';
        allNodes[currentNode].type = 'condition';

        if (top(ifIsInStack)){
            if (!top(ifStatus)){
                allNodes[currentNode].color = 'green';
            }
            else{
                allNodes[currentNode].color = 'red';
            }
            ifStatus.push(ifStatus.pop() || conditionRealResult);
        }
        else{
            allNodes[currentNode].color = 'red';
        }
        if (lastIf.length !== 0)
            allNodes[lastIf.pop()].pointerFalse = currentNode;
    }
    else{
        currentAttach++;
        ifAttachments.push(currentAttach);
        ifStatus.push(conditionRealResult);
        allNodes[currentNode].color = 'green';
        if (!top(ifIsInStack)){
            allNodes[currentNode].color = 'red';
        }
    }
    allNodes[currentNode].value +=  left + ' ' + op + ' ' + right;


    ifStack.push(allNodes[currentNode].id);
    lastIf.push(allNodes[currentNode].id);
    ifIsInStack.push(top(ifIsInStack) && top(ifStatus));
    if (ifStatus.length===0|| top(ifIsInStack))
        parsedCodeToflowChart(parsedCode.consequent);
    else{
        let tempDictionary =new Map(variablesValues);
        parsedCodeToflowChart(parsedCode.consequent);
        variablesValues = tempDictionary;
    }
    let forElse = ifIsInStack.pop();
    ifStack.pop();
    if (parsedCode.alternate !== null) {
        if (parsedCode.alternate.type === 'IfStatement') {
            parseIfStatement(parsedCode.alternate, 1 );
        } else {
            ifIsInStack.push(!forElse);
            parseElseStatement(parsedCode.alternate);
        }
    }
    else{
        noElse.push(true);
        lastIf.pop();
    }

    if (isElseIf === 0) {
        let currIfAttachment = ifAttachments.pop();
        let check = checkIfIsOnlyOnePointerToAttach(currIfAttachment);
        if (check!== undefined && check!== null){
            allNodes[check].pointerToAttachment=undefined;
            allNodes[check].pointerTrue = currentNode+1;
        }
        else{
            finalAttachmentsList[finalAttachmentsListCounter] = {};
            finalAttachmentsList[finalAttachmentsListCounter].id = currIfAttachment;
            finalAttachmentsList[finalAttachmentsListCounter].pointer = currentNode+1;
            finalAttachmentsListCounter++;
        }
        ifStatus.pop();
    }
}

function checkIfIsOnlyOnePointerToAttach(currIfAttachment) {
    let nodeThatPoints;
    let counter = 0;
    for (let i = 0; i < currIfAttachment.length; i++) {
        if (allNodes[i].pointerToAttachment !== undefined && allNodes[i].pointerToAttachment === currIfAttachment) {
            nodeThatPoints = allNodes[i].id;
            counter++;
        }
    }
    if (counter === 1) {
        return nodeThatPoints;
    } else
        return null;
}

function parseElseStatement(parsedCode) {
    currentNode++;
    allNodes[lastIf.pop()].pointerFalse = currentNode;
    allNodes[currentNode] = {}; allNodes[currentNode].id = currentNode; allNodes[currentNode].value = '';  allNodes[currentNode].color = 'green';
    allNodes[currentNode].type = 'square';
    ifStack.push(allNodes[currentNode].id);


    if (ifStatus.length===0|| !top(ifStatus))
        for (let i = 0; i < parsedCode.body.length; i++) {
            parsedCodeToflowChart(parsedCode.body[i]);
        }    else{
        allNodes[currentNode].color = 'red';
        let tempDictionary =new Map(variablesValues);
        for (let i = 0; i < parsedCode.body.length; i++) {
            parsedCodeToflowChart(parsedCode.body[i]);
        }
        variablesValues = tempDictionary;
    }
    if (ifStack.length !==0 && ifAttachments.length>0) {
        allNodes[currentNode].pointerToAttachment = ifAttachments[ifAttachments.length-1];
    }
}

function parseReturnStatement (parsedCode) {
    let returnLine = '';
    let arg = parsedCodeToflowChart(parsedCode.argument);
    returnLine += 'return ' + arg + ';';
    allNodes[currentNode].value += returnLine;
}

function calcStringToNumbersString(condition) {
    if (condition.type == 'BinaryExpression') {
        return calcBinaryToVal(condition);
    }
    if (condition.type == 'Identifier') {
        return variablesValues.get(condition.name);
    }
    if (condition.type == 'Literal')
        return condition.raw;
    //if (condition.type == 'MemberExpression'){
    let obj = condition.object.name;
    let theArgumentOfObject = variablesValues.get(obj);
    let realArray = JSON.parse(theArgumentOfObject);
    let propVal = calcStringToNumbersString(condition.property);
    let propRealVal = eval(propVal);
    let realValueFromArrayToReturn = realArray[propRealVal];
    return realValueFromArrayToReturn;
}

function calcBinaryToVal(condition) {
    let left = calcStringToNumbersString(condition.left);
    let right = calcStringToNumbersString(condition.right);
    let op = condition.operator;
    return ( left + op + right);

}

function top(stack){
    if (stack != null)
        return stack[stack.length-1];
    return null;
}


function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


// function parseWhileStatementPart2 (parsedCode){
//     let left = parsedCodeToSymbolicSubstitution(parsedCode.test.left);
//     let right = parsedCodeToSymbolicSubstitution(parsedCode.test.right);
//     let operator = parsedCode.test.operator;
//     let whileLine = 'while ( ' + left + ' ' + operator + ' ' + right + ') {';
//     let conditionRealResult = eval(calcStringToNumbersString(parsedCode.test));
//     if (conditionRealResult) {
//         newFunction.push({str: whileLine, color: 'green'});}
//     else{
//         //isNotTrue=true;
//         newFunction.push({str: whileLine, color: 'red'});}
//     parsedCodeToSymbolicSubstitution(parsedCode.body);
//     //isNotTrue=false;
//     newFunction.push({str: '}', color: ''});
// }
//
// function parseReturnStatementPart2 (parsedCode) {
//     let returnLine = '';
//     let arg = parsedCodeToSymbolicSubstitution(parsedCode.argument);
//     returnLine+='return ' + arg + ';';
//     newFunction.push({str:returnLine, color:''});
// }



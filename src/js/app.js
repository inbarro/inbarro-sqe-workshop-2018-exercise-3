import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parsedCodeToflowChartWrap} from './code-analyzer';
import * as flowchart from './flowchart';


let flowCarts;
$(document).ready(function () {
    $('#toFlowchart').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        console.log(parsedCode);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let args =  $('#arguments').val();
        flowCarts = parsedCodeToflowChartWrap(args,parsedCode);
        draw();
    }); });

function draw() {
    let flowChartstring='';
    flowChartstring +=createNodes();
    flowChartstring +=createTrueArrows();
    console.log(flowChartstring);
    const diagram = flowchart.parse(flowChartstring);
    diagram.drawSVG('diagram', {
        'x': 0,
        'y': 0,
        'line-width': 3,
        'line-length': 50,
        'text-margin': 10,
        'font-size': 14,
        'font-color': 'black',
        'line-color': 'black',
        'element-color': 'black',
        'fill': 'white',
        'yes-text': 'T',
        'no-text': 'F',
        'arrow-end': 'block',
        'scale': 1,
        'flowstate' : {
            'true' : { 'fill' : '#005a02', 'font-size' : 12},
            'false' : { 'fill' : '#ff000c'},
        }
    });

}

function createNodes(){
    let finalString='';
    for (let i = 1; i < flowCarts.allNodes.length-1; i++) {
        finalString+=flowCarts.allNodes[i].id + '=>' + flowCarts.allNodes[i].type + ': ' + flowCarts.allNodes[i].id + ' - ' + flowCarts.allNodes[i].value + '|' + flowCarts.allNodes[i].color + '\n' ;
    }
    for (let i = 1; i <= flowCarts.finalAttachmentsList.length-1; i++) {
        finalString += 'ifAttachment '+ flowCarts.finalAttachmentsList[i].id + '=>' + 'operation' + ': ' + 'if' + flowCarts.finalAttachmentsList[i].id + '\n';
    }
    finalString +=' ';
    return finalString;
}

function createTrueArrows(){
    let finalString='';
    for (let i = 1; i < flowCarts.allNodes.length; i++) {
        if (!(flowCarts.allNodes[i].pointerTrue === undefined))
            finalString += flowCarts.allNodes[i].id + '->' + flowCarts.allNodes[i].pointerTrue +'(right)' + '\n';
    }
    return finalString;
}


function createFalseArrows(){
    let finalString='';
    for (let i = 1; i < flowCarts.allNodes.length; i++) {
        if (!(flowCarts.allNodes[i].pointerFalse === undefined))
            finalString += flowCarts.allNodes[i].id + '->' + flowCarts.allNodes[i].pointerFalse +'(left)' + '\n';
    }
    return finalString;
}




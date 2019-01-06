import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parsedCodeToflowChartWrap} from './code-analyzer';


$(document).ready(function () {
    $('#toFlowchart').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        console.log(parsedCode);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let args =  $('#arguments').val();
        let flowCarts = parsedCodeToflowChartWrap(args,parsedCode);

        /*

            } */}); });









"use strict";
class Point{
  constructor(width=400, height=400) {
    this.x = Math.round(Math.random() * width);
    this.y = Math.round(Math.random() * height);
    if (this.x > this.y) {
      this.expected = 1;
    } else {
      this.expected = -1
    }
  }
}

let nextTrainStep = false;
let i=0;
let width = 400;
let height = 400;

let tblEpoch = document.getElementById("tdEpoch");
let tblMethodPass = document.getElementById("methodPass");
let tblMethodError = document.getElementById("methodError");
let tblDrawPass = document.getElementById("drawPass");
let tblDrawError = document.getElementById("drawError");

let newInfoTableData = false;

function draw(){
  ctx.clearRect(0, 0, width, height);

  drawBackground();

  doTraining();

  drawPoints();

  if(trainingToEnd && p.passCnt==100 && p.errorCnt == 0 && drawExpGuessEq == 100 && drawError == 0) {
    trainingToEnd = 0;
    trainingCnt = 0;
  }

  drawInfoTable();

  requestAnimationFrame(draw);
}

function drawBackground(){
  ctx.beginPath();
  ctx.lineWidth = 1;
  //ctx.strokeStyle = "#FF0000";
  ctx.fillStyle = '#ffe6e6';
  ctx.moveTo(0,0);
  ctx.lineTo(width, height);
  ctx.lineTo(width, 0);
  ctx.closePath();
  ctx.fill();
  //ctx.stroke();
  
  ctx.beginPath();
  ctx.lineWidth = 1;
  //ctx.strokeStyle = "#FF0000";
  ctx.fillStyle = '#e6ffe6';
  ctx.moveTo(0,0);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  //ctx.stroke();
}


function drawInfoTable(){
  if (newInfoTableData){
    newInfoTableData = false;
    // console.log(infoTableHandler);
    infoTableHandler.addRow(p.epochCnt);
    infoTableHandler.addContent(p.epochCnt, 0, p.epochCnt);
    infoTableHandler.addContent(p.epochCnt, 1, p.passCnt);
    infoTableHandler.addContent(p.epochCnt, 2, p.errorCnt);
    infoTableHandler.addContent(p.epochCnt, 3, drawExpGuessEq);
    infoTableHandler.addContent(p.epochCnt, 4, drawError);
    infoTableHandler.addContent(p.epochCnt, 5, p.alpha);
    infoTableHandler.addContent(p.epochCnt, 6, p.weights[0]);
    infoTableHandler.addContent(p.epochCnt, 7, p.weights[1]);
  }
}

let drawExpGuessEq = 0;
let drawError = 0;

function drawPoints(){
  drawExpGuessEq = 0;
  drawError = 0;
  for (let i=0; i<points.length; i++) {
    
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(points[i].x,points[i].y,6,0,2*Math.PI,false);
    const guess = p.guess([points[i].x, points[i].y]);
    
    if (points[i].expected == guess){
      drawExpGuessEq++;
      ctx.strokeStyle = (points[i].expected == 1)? 'red' : 'green';
      ctx.fillStyle = (guess == 1)? 'red' : 'green';
    } else {
      drawError++;
      ctx.strokeStyle = (points[i].expected == 1)? 'red' : 'green';
      ctx.fillStyle = 'black';
    }
    ctx.fill();
    ctx.stroke();
  }
}

 var infoTableHandler = infoTableHandler || (function () {
  // let elTblInfo = document.getElementById("tblInfo");
  let elTblInfo = document.getElementById("infoBody");
  let actualEpoch = 0;
  
  function addRow(pEpoch = 0){
    const epoch = pEpoch;
    const elNewRow = elTblInfo.insertRow(pEpoch);

    for (let i=0; i < 8; i++){
      const elNewTD = elNewRow.insertCell(i);
      elNewTD.innerHTML = 'new c' + i;
      elNewTD.id = 'e' + epoch + '-' + 'col' + i;
    }
  }

  function addContent(pEpoch, pCol, pContent) {
    const elTD = document.getElementById('e' + pEpoch + '-' + 'col' + pCol);
    elTD.innerHTML = pContent;
  }

  function removeDatarows() {
    const elInfoBody = document.getElementById("infoBody");
    while (elInfoBody.firstChild) {
      elInfoBody.removeChild(elInfoBody.firstChild);
    }
  }
  
  return {
    addRow: addRow,
    addContent: addContent,
    removeDatarows: removeDatarows
  }
})();

let c = document.getElementById('myCanvas1');
let ctx = c.getContext('2d');
let points = new Array(100);
let p = new SimplePerceptron();

window.onload = function () {
  initAlpha();
  initInput();
  
  draw();
};

function initAlpha() {
  document.getElementById("alpha").value = p.alpha;
}

function initInput() {
  for (let i=0; i<points.length; i++) {
    points[i] = new Point(width, height);
  }
  newInfoTableData = true;
  datarowStore.addArrayToStore();
}

let trainingCnt = 0;
let trainingCntUser = document.getElementById('epoch').value;
let trainingToEnd = false;

function doTraining(){

  if (nextTrainStep || (trainingToEnd && trainingCnt > 0) || trainingCnt > 0){
    nextTrainStep = false;
    trainingCnt--;
    p.incEpochCount();
    p.initErrorCount();
    for (let i=0; i<points.length; i++) {
      let inputs = [points[i].x, points[i].y];
      p.train(inputs, points[i].expected);
    }
    newInfoTableData = true;
  }
}

function doNextTrainStep(){
  nextTrainStep = true;
  trainingCnt++;
}

function doTrainEpochs(){
  trainingCnt = trainingCntUser;
}

function doTrainAll(){
  trainingCnt = 1000;
  trainingToEnd = true;
}

function doNewInput(){
  p.incEpochCount();
  initInput();
}

function inputEpochChanged() {
  trainingCntUser = document.getElementById('epoch').value;
}


var datarowStore = datarowStore || (function () {
  const elDivAllInputs = document.getElementById("allInputs");
  let allInputs = new Array();
  let datarowCnt = 0;
  
  function initStore(){
    allInputs = [];
    datarowCnt = 0;
    removeAllButtons();
  }

  function removeAllButtons() {
    while (elDivAllInputs.firstChild) {
      elDivAllInputs.removeChild(elDivAllInputs.firstChild);
    }

    // @ToDo: remove click events
  }
  
  function addArrayToStore() {
    let tmpArr = []; // create empty array to hold copy
      
    for (let i = 0; i <points.length; i++) {
      tmpArr[i] = {}; // empty object to hold properties added below
      for (var prop in points[i]) {
        tmpArr[i][prop] = points[i][prop]; // copy properties from arObj to ar2
      }
    }
  
    allInputs.push(tmpArr);
    addButton();
  }
  
  function addButton() {
    let buttonnode = document.createElement('input');
    buttonnode.setAttribute('type','button');
    buttonnode.setAttribute('id','btn-datarow-'+datarowCnt);
    buttonnode.setAttribute('name','btnDatarow');
    buttonnode.setAttribute('value', datarowCnt);
    buttonnode.setAttribute('class','btn');
    elDivAllInputs.appendChild(buttonnode);
    datarowCnt++;
  }

  function changeToClick(e){
    if (e.target !== e.currentTarget) {
      points = allInputs[e.target.value];
    }
    e.stopPropagation();
  }
  
  return {
    changeToClick: changeToClick,
    addArrayToStore: addArrayToStore,
    initStore: initStore
  }
})();

function inputAlphaChanged(){
  p.setAlpha(document.getElementById("alpha").value);
}

function reInitTrain() {
  // remove table rows
  infoTableHandler.removeDatarows();
  // clear all input data and buttons
  datarowStore.initStore();
  // reset weights and several counter
  p.reinitializeTraining();
  // new input data
  initInput();
}

addEventListener("DOMContentLoaded", function(){
  //    ---> click <---
  // BESSER: addEventListener anstelle von onClick im HTML
  // https://stackoverflow.com/a/41077586
  // https://www.w3schools.com/js/js_htmldom_eventlistener.asp
  // https://developer.mozilla.org/de/docs/Web/API/EventTarget/addEventListener
  // https://www.mediaevent.de/javascript/event-listener.html
  let btnTrainNext = document.getElementById("trainNext");
  let btnNewInput = document.getElementById("newInput");
  let inEpoch = document.getElementById("epoch");
  let btnTrainEpoch = document.getElementById("trainEpoch");
  let btnTrainAll = document.getElementById("trainAll");
  let btnAllInputs = document.getElementById("allInputs");
  let inAlpha = document.getElementById("alpha");
  let btnReInitTrain = document.getElementById("reInitTrain");
  // in case of QUnit Test, Element 'btn_toggleButton' is not available - therefore is no EventListener necessary (no Button, no click)
  
  /*
      <input name="" />
      <button id="">
*/

  if (btnTrainNext != null)
    btnTrainNext.addEventListener("click", doNextTrainStep);
  if (btnNewInput != null)
    btnNewInput.addEventListener("click", doNewInput);
  if (btnTrainEpoch != null)
    btnTrainEpoch.addEventListener("click", doTrainEpochs);
  if (btnTrainAll != null)
    btnTrainAll.addEventListener("click", doTrainAll);
  if (btnAllInputs != null)
    btnAllInputs.addEventListener("click", datarowStore.changeToClick, false);
  if (btnReInitTrain != null)
    btnReInitTrain.addEventListener("click", reInitTrain);
  
  inEpoch.addEventListener("change", inputEpochChanged);
  inAlpha.addEventListener("change", inputAlphaChanged);
});
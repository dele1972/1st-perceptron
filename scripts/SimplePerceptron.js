"use strict";

class SimplePerceptron {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class
  
  constructor() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array
    this.alpha = 0.1;                     // learning rate
    this.weights = new Float32Array(2);
    this.epochCnt = 0; // 
    this.errorCnt = 0; // initErrorCount()
    this.passCnt = 0;
    this.initWeights();
  }
  
  reinitializeTraining() {
    this.epochCnt = 0; 
    this.initErrorCount();
    this.passCnt = 0;
    this.initWeights();
  }

  setAlpha(value){
    if (value < 1.0 && value > 0.0){
      this.alpha = value;
    }
  }
  
  initErrorCount() {
    this.errorCnt = 0;
    this.passCnt = 0;
  }
  
  incErrorCount() {
    this.errorCnt++;
  }
  
  incPassCount() {
    this.passCnt++;
  }
  
  incEpochCount() {
    this.epochCnt++;
  }
  
  initWeights() {
    for (let i=0; i < this.weights.length; i++) {
      this.weights[i] = (Math.round(Math.random()) == 1) ? (Math.random() * -1) : Math.random();
    }
  }
  
  activation(number) {
    return (Math.sign(number) == 0) ? 1 : Math.sign(number);
  }
  
  guess(inputs) {
    let sum = 0;
    for (let i=0; i < this.weights.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    return this.activation(sum);
  }
  
  train(inputs, expected) {
    const trainGuess = this.guess(inputs);
    const error = expected - trainGuess;

    // @ToDo: shuffle array randomly to avoid oscilloscpe effect
    // https://stackoverflow.com/a/2450976/6628517
    
    for (let i=0; i < this.weights.length; i++) {
      this.weights[i] += error * inputs[i] * this.alpha;
    }
    if (error != 0){
      this.incErrorCount();
    } else {
      this.incPassCount();
    }
  }
}

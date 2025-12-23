const display = document.getElementById('display');
const preview = document.getElementById('history-preview');
const historyList = document.getElementById('history-list');
const degLabel = document.getElementById('label-deg');
const radLabel = document.getElementById('label-rad');

let currentInput = "";
let isDegrees = true;

const PI = Math.PI;
const e = Math.E;

const sin = (x) => Math.sin(toRad(x));
const cos = (x) => Math.cos(toRad(x));
const tan = (x) => Math.tan(toRad(x));
const asin = (x) => toDeg(Math.asin(x));
const acos = (x) => toDeg(Math.acos(x));
const atan = (x) => toDeg(Math.atan(x));

const log = (x) => Math.log10(x);
const ln = (x) => Math.log(x);
const sqrt = (x) => Math.sqrt(x);
const abs = (x) => Math.abs(x);


const fact = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
};



function toRad(input) {
    return isDegrees ? input * (Math.PI / 180) : input;
}
function toDeg(input) {
    return isDegrees ? input * (180 / Math.PI) : input;
}


function toggleDegRad() {
    isDegrees = !isDegrees;
    if (isDegrees) {
        degLabel.classList.add('mode-active');
        radLabel.classList.remove('mode-active');
    } else {
        degLabel.classList.remove('mode-active');
        radLabel.classList.add('mode-active');
    }
}

function updateScreen() {
    let view = currentInput
        .replace(/\*/g, '×')
        .replace(/\//g, '÷')
        .replace(/PI/g, 'π');
    display.value = view;
}

function addNum(num) {
    currentInput += num;
    updateScreen();
}

function addOp(op) {
    const last = currentInput.slice(-1);
    if ("+-*/.".includes(last)) return;
    currentInput += op;
    updateScreen();
}


function addConst(c) {
    if (c === 'π') currentInput += 'PI';
    else currentInput += c;
    updateScreen();
}

function addOp(op) {
    const last = currentInput.slice(-1);
    if ("+-*/.^".includes(last)) return;
    currentInput += op;
    updateScreen();
}


function addFunc(fn) {
    currentInput += fn;
    updateScreen();
}

function clearAll() {
    currentInput = "";
    preview.innerText = "";
    updateScreen();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateScreen();
}

function calculate() {
    if (currentInput === "") return;
    
    let expression = currentInput.replace(/\^/g, '**');

    try {
        const result = eval(expression);
        
        if (isNaN(result) || !isFinite(result)) throw new Error("Invalid");

        const formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
        
        addToHistory(display.value, formattedResult);
        
        preview.innerText = display.value + " =";
        currentInput = formattedResult.toString();
        updateScreen();
    } catch (e) {
        const original = display.value;
        display.value = "Error";
        setTimeout(() => { display.value = original; }, 1500);
    }
}


function addToHistory(expression, result) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
        <div class="h-eq">${expression}</div>
        <div class="h-res">= ${result}</div>
    `;
    item.onclick = () => {
        currentInput += result.toString();
        updateScreen();
    };
    historyList.prepend(item);
}


document.addEventListener('keydown', (e) => {
    const key = e.key;
    if ((key >= '0' && key <= '9') || key === '.') addNum(key);
    if (key === '+') addOp('+');
    if (key === '-') addOp('-');
    if (key === '*') addOp('*');
    if (key === '/') addOp('/');
    if (key === '(' || key === ')') addNum(key);
    if (key === '^') addOp('^');
    if (key === 'Enter') calculate();
    if (key === 'Backspace') deleteLast();
    if (key === 'Escape') clearAll();
});
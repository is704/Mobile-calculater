document.addEventListener('DOMContentLoaded', function() {
    const displayCurrent = document.querySelector('.current-operation');
    const displayPrevious = document.querySelector('.previous-operation');
    const buttons = document.querySelectorAll('.btn');
    
    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let resetScreen = false;
    
    // تحديث العرض
    function updateDisplay() {
        displayCurrent.textContent = currentOperand;
        if (operation != null) {
            displayPrevious.textContent = `${previousOperand} ${getOperationSymbol(operation)}`;
        } else {
            displayPrevious.textContent = previousOperand;
        }
    }
    
    // الحصول على رمز العملية
    function getOperationSymbol(op) {
        switch(op) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }
    
    // إضافة رقم
    function appendNumber(number) {
        if (resetScreen) {
            currentOperand = '';
            resetScreen = false;
        }
        
        if (number === '.' && currentOperand.includes('.')) return;
        
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
    }
    
    // اختيار العملية
    function chooseOperation(op) {
        if (currentOperand === '') return;
        
        if (previousOperand !== '') {
            calculate();
        }
        
        operation = op;
        previousOperand = currentOperand;
        resetScreen = true;
    }
    
    // إجراء الحساب
    function calculate() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch(operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert("لا يمكن القسمة على صفر!");
                    clear();
                    return;
                }
                computation = prev / current;
                break;
            case 'percentage':
                computation = prev * (current / 100);
                break;
            default:
                return;
        }
        
        // تقريب النتيجة لتجنب الأخطاء العشرية
        currentOperand = Math.round(computation * 100000000) / 100000000;
        operation = undefined;
        previousOperand = '';
    }
    
    // مسح كل شيء
    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }
    
    // حذف آخر رقم
    function backspace() {
        if (currentOperand.length > 1) {
            currentOperand = currentOperand.slice(0, -1);
        } else {
            currentOperand = '0';
        }
    }
    
    // التعامل مع ضغطات الأزرار
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // تأثير الضغط
            button.classList.add('active');
            setTimeout(() => {
                button.classList.remove('active');
            }, 100);
            
            if (button.hasAttribute('data-number')) {
                appendNumber(button.getAttribute('data-number'));
                updateDisplay();
            } else if (button.hasAttribute('data-action')) {
                const action = button.getAttribute('data-action');
                
                switch(action) {
                    case 'clear':
                        clear();
                        break;
                    case 'backspace':
                        backspace();
                        break;
                    case 'equals':
                        calculate();
                        break;
                    case 'decimal':
                        appendNumber('.');
                        break;
                    case 'percentage':
                        if (currentOperand !== '') {
                            currentOperand = (parseFloat(currentOperand) / 100).toString();
                        }
                        break;
                    default:
                        chooseOperation(action);
                        break;
                }
                updateDisplay();
            }
        });
    });
    
    // إضافة تأثيرات للوحة المفاتيح
    document.addEventListener('keydown', event => {
        if (event.key >= '0' && event.key <= '9') {
            appendNumber(event.key);
            updateDisplay();
        } else if (event.key === '.') {
            appendNumber('.');
            updateDisplay();
        } else if (event.key === '+') {
            chooseOperation('add');
            updateDisplay();
        } else if (event.key === '-') {
            chooseOperation('subtract');
            updateDisplay();
        } else if (event.key === '*') {
            chooseOperation('multiply');
            updateDisplay();
        } else if (event.key === '/') {
            event.preventDefault();
            chooseOperation('divide');
            updateDisplay();
        } else if (event.key === 'Enter' || event.key === '=') {
            calculate();
            updateDisplay();
        } else if (event.key === 'Escape') {
            clear();
            updateDisplay();
        } else if (event.key === 'Backspace') {
            backspace();
            updateDisplay();
        } else if (event.key === '%') {
            if (currentOperand !== '') {
                currentOperand = (parseFloat(currentOperand) / 100).toString();
                updateDisplay();
            }
        }
    });
    
    // التهيئة الأولى
    updateDisplay();
});

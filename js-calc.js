document.addEventListener('DOMContentLoaded', () => {
    // 1. Данные (Цены)
    const prices = {
        basic: 100,
        standard: { base: 200, options: { "Fast: +50$": 50, "Eco: +20$": 20 } },
        premium: { base: 500, options: { "VIP: +150$": 150, "Express: +100$": 100 }, extra: 75 }
    };
    // 2. Элементы DOM
    const serviceTypeSelect = document.getElementById('service-type');
    const quantityInput = document.getElementById('quantity');
    const dynamicArea = document.getElementById('dynamic-area');
    const totalPriceDisplay = document.getElementById('total-price');
    // 3. Функция перерисовки динамической зоны
    const renderDynamicContent = () => {
    const type = serviceTypeSelect.value;
    dynamicArea.innerHTML = ''; // Очищаем старое
    if (type === 'standard') {
        // Тип 2: Только Select
        const container = document.createElement('div');
        container.className = 'dynamic-item';
        container.innerHTML = `
        <label for="option-select">Выберите опцию:</label>
        <select id="option-select">
        <option value="0">Нет опции</option>
        <option value="50">Fast (+50$)</option>
        <option value="20">Eco (+20$)</option>
        </select>`;
        dynamicArea.appendChild(container);
        // Добавляем слушатель на новый элемент
        document.getElementById('option-select').addEventListener('change', calculate);
    } else if (type === 'premium') {
        // Тип 3: Select + Checkbox
        const container = document.createElement('div');
        container.className = 'dynamic-item';
        container.innerHTML = `
        <label for="option-select">Выберите опцию:</label>
        <select id="option-select">
        <option value="0">Нет опции</option>
        <option value="150">VIP (+150$)</option>
        <option value="100">Express (+100$)</option>
        </select>
        <div class="checkbox-group" style="margin-top:10px">
        <input type="checkbox" id="extra-check">
        <label for="extra-check">Доп. страховка (+75$)</label>
        </div>
        `;
        dynamicArea.appendChild(container);
        // Вешаем слушатели на новые элементы
        document.getElementById('option-select').addEventListener('change', calculate);
        document.getElementById('extra-check').addEventListener('change', calculate);
    }
    calculate(); // Пересчитываем при смене типа
    };
    // 4. Функция расчета
    const calculate = () => {
        const type = serviceTypeSelect.value;
        const quantity = parseInt(quantityInput.value) || 0;
        let unitPrice = 0;
        if (type === 'basic') {
            unitPrice = prices.basic;
        }
        else if (type === 'standard') {
            const optionPrice = parseFloat(document.getElementById('option-select').value) || 0;
            unitPrice = prices.standard.base + optionPrice;
        }
        else if (type === 'premium') {
            const optionPrice = parseFloat(document.getElementById('option-select').value) || 0;
            const extraCheck = document.getElementById('extra-check').checked; const extraPrice =
            extraCheck ? prices.premium.extra : 0; unitPrice = prices.premium.base + optionPrice +
            extraPrice; }
            const total = unitPrice * quantity;
            totalPriceDisplay.textContent = total.toLocaleString();
        };
        // 5. Инициализация слушателей на основные элементы
        serviceTypeSelect.addEventListener('change', renderDynamicContent);
        quantityInput.addEventListener('input', calculate);
        // Первый запуск
        renderDynamicContent();
    });
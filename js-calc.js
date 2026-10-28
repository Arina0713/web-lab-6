/*Логика калькулятора услуг*/
document.addEventListener('DOMContentLoaded', () => {
    // 1. Данные
    const services = [
        { id: 's1', name: 'Базовая услуга', basePrice: 100, optionsType: 'none', options: [] },
        { id: 's2', name: 'Премиум услуга', basePrice: 200, optionsType: 'select', options: [
            { name: 'Ускоренная доставка', price: 50 },
            { name: 'VIP поддержка', price: 100 }
        ]},
        { id: 's3', name: 'Комплексная услуга', basePrice: 500, optionsType: 'checkbox',
            options: [
                { name: 'Страховка', price: 50 },
                { name: 'Упаковка', price: 30 },
                { name: 'Подарочная карта', price: 20 }
            ]}
        ];
        // 2. Инициализация элементов DOM
        const quantityInput = document.getElementById('quantity');
        const radioContainer = document.getElementById('radio-container');
        const optionsContainer = document.getElementById('dynamic-options-container');
        const totalPriceDisplay = document.getElementById('total-price');
        const errorMsg = document.getElementById('error-msg');
        // 3. Вспомогательные функции
        const clearError = () => { errorMsg.textContent = ''; };
        const setError = (text) => { errorMsg.textContent = text; errorMsg.style.color = 'red'; };
        // 4. Отрисовка радиокнопок
        const renderRadioButtons = () => {
            radioContainer.innerHTML = ''; // Очистка перед отрисовкой
            services.forEach(service => {
            const wrapper = document.createElement('label');
            wrapper.style.display = 'block'; // Чтобы кнопки были друг под другом
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'service-type';
            radio.value = service.id;
            radio.addEventListener('change', () => {
                updateDynamicUI(service.id);
                calculateTotal();
            });
            wrapper.appendChild(radio);
            wrapper.appendChild(document.createTextNode(service.name));
            radioContainer.appendChild(wrapper);
        });
    };
    // 5. Динамическое изменение формы
    const updateDynamicUI = (selectedId) => {
    const service = services.find(s => s.id === selectedId); optionsContainer.innerHTML = '';
    if (service.optionsType === 'select') {
        const select = document.createElement('select');
        select.id = 'extra-option';
        const defaultOpt = document.createElement('option');
        defaultOpt.text = '-- Выберите опцию --';
        defaultOpt.value = '0';
        select.appendChild(defaultOpt);
        service.options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.price;
            option.text = `${opt.name} (+${opt.price}$)`;
            select.appendChild(option);
        });
        select.addEventListener('change', calculateTotal);
        optionsContainer.appendChild(select);
    } else if (service.optionsType === 'checkbox') {
        service.options.forEach(opt => {
            const label = document.createElement('label');
            label.style.display = 'block';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'extra-checkbox';
            cb.value = opt.price;
            cb.addEventListener('change', calculateTotal);

            label.appendChild(cb);
            label.appendChild(document.createTextNode(` ${opt.name} (+${opt.price}$)`));
            optionsContainer.appendChild(label);
        });
    }
};
// 6. Расчет итоговой суммы
const calculateTotal = () => {
    clearError();
    const qty = parseInt(quantityInput.value);
    if (isNaN(qty) || qty <= 0) {
        setError('Введите корректное количество');
        totalPriceDisplay.textContent = '0';
        return;
    }
    const selectedRadio = document.querySelector('input[name="service-type"]:checked');
    if (!selectedRadio) return;
    const service = services.find(s => s.id === selectedRadio.value);
    let extraPrice = 0;
    if (service.optionsType === 'select') {
        const select = document.getElementById('extra-option');
        extraPrice = parseFloat(select.value);
    } else if (service.optionsType === 'checkbox') {
        const checkboxes = document.querySelectorAll('.extra-checkbox:checked');
        checkboxes.forEach(cb => extraPrice += parseFloat(cb.value));
    }
    const total = (service.basePrice + extraPrice) * qty;
    totalPriceDisplay.textContent = total.toFixed(2)
};
// Слушатель ввода количества
quantityInput.addEventListener('input', calculateTotal);
// ЗАПУСК ИНИЦИАЛИЗАЦИИ
renderRadioButtons();
});

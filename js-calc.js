/*Логика калькулятора услуг*/
document.addEventListener('DOMContentLoaded', () => {
    // 1. Данные (имитация базы данных)
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
        const setError = (text) => { errorMsg.textContent = text; };
        // 4. Отрисовка радиокнопок (типов услуг)
        const renderRadioButtons = () => {
            services.forEach(service => {
                const wrapper = document.createElement('label');
                wrapper.className = 'radio-group';
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'service-type';
                radio.value = service.id;
                // При клике на радио — обновляем динамический интерфейс и пересчитываем
                итог
                radio.addEventListener('change', () => {
                    updateDynamicUI(service.id);
                    calculateTotal();
                });
                wrapper.appendChild(radio);
                wrapper.appendChild(document.createTextNode(service.name));
                radioContainer.appendChild(wrapper);
            });
        };
        // 5. Динамическое изменение формы (Select или Checkbox)
        const updateDynamicUI = (selectedId) => {
            const service = services.find(s => s.id === selectedId);
            optionsContainer.innerHTML = ''; // Полная очистка контейнера
            if (service.optionsType === 'none') {
                optionsContainer.innerHTML = '<small style="color: #888;"> Дополнительных опций нет</small>';
            }
            else if (service.optionsType === 'select') {
                const select = document.createElement('select');
                select.id = 'dynamic-select';
                // Добавляем вариант "Без дополнений"
                const defaultOpt = document.createElement('option');
                defaultOpt.value = "0";
                defaultOpt.textContent = "-- Без дополнений --";
                select.appendChild(defaultOpt);
                // Заполняем селект опциями из массива
                service.options.forEach(opt => {
                    const o = document.createElement('option');
                    o.value = opt.price;
                    o.textContent = `${opt.name} (+${opt.price}$)`;
                    select.appendChild(o);
                });
                select.addEventListener('change', calculateTotal);
                optionsContainer.appendChild(select);
            }
            else if (service.optionsType === 'checkbox') {
                service.options.forEach(opt => {
                    const div = document.createElement('div');
                    div.className = 'option-item';
                    const cb = document.createElement('input');
                    cb.type = 'checkbox';
                    cb.className = 'dynamic-checkbox';
                    cb.value = opt.price;
                    cb.addEventListener('change', calculateTotal);
                    const lbl = document.createElement('label');
                    lbl.textContent = `${opt.name} (+${opt.price}$)`;
                    lbl.style.margin = "0";
                    lbl.style.fontWeight = "normal";
                    div.appendChild(cb);
                    div.appendChild(lbl);
                    optionsContainer.appendChild(div);
                });
            }
        };
        // 6. Основная функция расчета
        const calculateTotal = () => {
            clearError();
            const quantityStr = quantityInput.value.trim();
            const selectedRadio = document.querySelector('input[name="service-type"]:checked');
            // Если тип услуги не выбран, ничего не считаем
            if (!selectedRadio) return;
            // Валидация поля количества
            if (quantityStr === "") {
                setError("Введите количество!");
                totalPriceDisplay.textContent = "0";
                return;
            }
            // Регулярное выражение: только целые положительные числа
            const digitRegex = /^[1-9]\d*$/;
            if (!digitRegex.test(quantityStr)) {
            setError("Ошибка: введите целое число больше 0!");
            totalPriceDisplay.textContent = "0";
            return;
        }
        const quantity = parseInt(quantityStr, 10);
        const service = services.find(s => s.id === selectedRadio.value);
        let extraCost = 0;
        // Логика подсчета доп. стоимости
        if (service.optionsType === 'select') {
            const select = document.getElementById('dynamic-select');
            extraCost = select ? parseInt(select.value, 10) : 0;
        }
        else if (service.optionsType === 'checkbox') {
            const checkedBoxes =
            optionsContainer.querySelectorAll('.dynamic-checkbox:checked');
            checkedBoxes.forEach(cb => {
                extraCost += parseInt(cb.value, 10);
            });
        }
        // Итоговая формула: (База + Допы) * Количество
        const total = (service.basePrice + extraCost) * quantity;
        totalPriceDisplay.textContent = total;
    };
    // Слушатель на ввод количества (чтобы расчет был мгновенным при печати)
    quantityInput.addEventListener('input', calculateTotal);
    // Запуск инициализации
    renderRadioButtons();
});
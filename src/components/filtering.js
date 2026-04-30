import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
// Добавляем кастомное правило для диапазона суммы
const customRules = [...defaultRules, (row, filter) => {
    // Фильтрация по totalFrom (минимальная сумма)
    if (filter.totalFrom !== undefined && filter.totalFrom !== '') {
        const totalValue = Number(row.total);
        const fromValue = Number(filter.totalFrom);
        if (totalValue < fromValue) {
            return false;
        }
    }
    
    // Фильтрация по totalTo (максимальная сумма)
    if (filter.totalTo !== undefined && filter.totalTo !== '') {
        const totalValue = Number(row.total);
        const toValue = Number(filter.totalTo);
        if (totalValue > toValue) {
            return false;
        }
    }
    
    return true; // Если все проверки пройдены
}];

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)
        .forEach((elementName) => {
            elements[elementName].append(
                ...Object.values(indexes[elementName])
                    .map(name => {
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        return option;
                    })
            )
        });
    
    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === "clear") {
            const container = action.closest('.table-column');
            const input = container.querySelector('input');
            input.value = ''; 
            state[action.dataset.field] = '';
        }
        
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter((row) => compare(row, state));
    }
}
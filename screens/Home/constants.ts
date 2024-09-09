import {useCallback, useState} from 'react';

export type Unit = 'mmol' | 'mg';

export const CONVERSION_FACTOR = 18;

export const useGlucoseInput = (initialUnit: Unit) => {
    const [values, setValues] = useState({mmol: '0', mg: '0'});
    const [currentUnit, setCurrentUnit] = useState<Unit>(initialUnit);

    const convertValue = useCallback((value: string, fromUnit: Unit): string => {
        if (value === '0' || value === '') return '0';
        if (value === '.') return value;
        const floatValue = parseFloat(value);
        return fromUnit === 'mmol'
            ? (floatValue * CONVERSION_FACTOR).toFixed(0)
            : (floatValue / CONVERSION_FACTOR).toFixed(2);
    }, []);

    const onNumberPress = (n: string) => {
        //mg doesn't accept decimal numbers
        if (n === '.' && currentUnit === 'mg') return;
        setValues(prevValues => {
            const currentValue = prevValues[currentUnit];
            let newValue;

            if (currentValue === '0' && n !== '.') {
                newValue = n; // Replace '0' with the pressed number
            } else if (currentValue.includes('.') && n === '.') {
                newValue = currentValue; // Prevent adding another '.'
            } else {
                newValue = currentValue + n; // Append the pressed number
            }

            return {
                ...prevValues,
                [currentUnit]: newValue,
                [currentUnit === 'mmol' ? 'mg' : 'mmol']: convertValue(newValue, currentUnit),
            };
        });
    };

    const onBackspace = () => {
        setValues(prevValues => {
            const currentValue = prevValues[currentUnit];
            let newValue = currentValue.slice(0, -1) || '0'; // Remove last character

            if (newValue === '-' || newValue === '') {
                newValue = '0';
            }

            return {
                ...prevValues,
                [currentUnit]: newValue,
                [currentUnit === 'mmol' ? 'mg' : 'mmol']: convertValue(newValue, currentUnit),
            };
        });
    };
    return {
        values,
        currentUnit,
        setCurrentUnit,
        onNumberPress,
        onBackspace,
    };
};

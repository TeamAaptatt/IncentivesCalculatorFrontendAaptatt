export function formatNumberIndianSystem(number) {
    // Split number into integer and decimal parts
    let [integerPart, decimalPart] = Math.abs(number).toString().split('.');

    // Insert commas every three digits from the right in the integer part
    let formattedInteger = '';
    let count = 0;
    for (let i = integerPart.length - 1; i >= 0; i--) {
        formattedInteger = integerPart[i] + formattedInteger; // Append digit
        count++;
        if (count === 3 && i !== 0) {
            formattedInteger = ',' + formattedInteger; // Insert comma every three digits
            count = 0;
        }
    }

    // Combine integer and decimal parts
    let formattedNumber = decimalPart ? formattedInteger + '.' + decimalPart : formattedInteger;

    // Add minus sign if the number was negative
    if (number < 0) {
        formattedNumber = "-" + formattedNumber;
    }
    if(formattedNumber===NaN){
        return 0;
    }
    return formattedNumber;
}

export const PrepareFloat = (value) => {
    return Number(value.replace(/[^0-9\\.]+/g, ''));
};

export const RelativePercentage = (amountOne, amountTwo) => {
    return PrepareFloat(amountOne) / PrepareFloat(amountTwo);
};

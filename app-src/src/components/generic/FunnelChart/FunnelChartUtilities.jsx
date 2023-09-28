export const CalculateChildDimPixels = (parentDim, childDim) => {
    if (childDim.toString().includes('%'))
        return (
            parentDim - (parentDim * (100 - childDim.replace('%', ''))) / 100
        );
    return parentDim - childDim;
};

export const CalculateFractionPixels = (parentDim, childCount) => {
    return parentDim / childCount;
};

export const CalculateStatusValues = (values, statusKey, valueKey) => {
    const statusSums = [];
    let statusIndex;

    const getNumber = (value) => {
        if (typeof value === 'number') return value;
        else if (typeof value === 'string') {
            const valuestr = value.replace('£', '').replace(',', '');
            return valuestr;
        } else {
            return 0;
        }
    };

    for (let i = 0; i < values?.length; i++) {
        statusIndex = statusSums.findIndex(
            (statusSum) => statusSum[statusKey] === values[i][statusKey]
        );
        if (statusIndex !== -1) {
            statusSums[statusIndex][valueKey] = `£${
                parseFloat(getNumber(statusSums[statusIndex][valueKey])) +
                parseFloat(getNumber(values[i][valueKey]))
            }`;
            if (!statusSums[statusIndex][valueKey]?.includes('.'))
                statusSums[statusIndex][valueKey] += '.00';
        } else {
            statusSums.push({
                [statusKey]: values[i][statusKey],
                [valueKey]: values[i][valueKey]
            });
        }
    }

    if (values?.length < 4) {
        for (let i = values?.length; i < 5; i++) {
            statusSums.push({
                [statusKey]: '',
                [valueKey]: '£0.00'
            });
        }
    }

    return statusSums;
};

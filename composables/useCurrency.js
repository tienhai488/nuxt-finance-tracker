export const useCurrency = (amount) => {
    const currency = new Intl.NumberFormat(
        'vi-VN',
        { style: 'currency', currency: 'VND' })
        .format(
            isRef(amount) ? amount.value : amount
        );

    return {
        currency,
    }
}
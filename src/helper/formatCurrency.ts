export function formatWithCurrency(
  value: number | string,
  code: string,
  locale = "en"
) {
  try {
    const numericValue = Number(value);

    if (isNaN(numericValue)) return `0 ${code}`;

    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return formatter.format(numericValue);
  } catch {
    return `${value || 0} ${code}`;
  }
}

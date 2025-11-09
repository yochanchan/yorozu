export const formatNumber = (value: number): string =>
  new Intl.NumberFormat("ja-JP").format(value);

export const formatPercent = (value: number, digits = 1): string =>
  `${(value * 100).toFixed(digits)}%`;

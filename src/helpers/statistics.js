// Colours from the Figma statistics table, matched to the backend category names.
const CATEGORY_COLORS = {
  'Main expenses': '#fed057',
  Products: '#ffd8d0',
  Car: '#fd9498',
  'Self care': '#c5baff',
  'Child care': '#6e78e8',
  'Household products': '#4a56e2',
  Education: '#81e1ff',
  Leisure: '#24cca7',
  'Other expenses': '#00ad84',
  Entertainment: '#ff868d',
};
const FALLBACK_COLORS = Object.values(CATEGORY_COLORS);

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// The backend returns expense totals as negative numbers.
export const getExpenseCategories = (categoriesSummary = []) =>
  categoriesSummary
    .filter(({ type, total }) => type === 'EXPENSE' && total !== 0)
    .map(({ name, total }, index) => ({
      name,
      total: Math.abs(total),
      color:
        CATEGORY_COLORS[name] ??
        FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    }));

// "8 700.00" style used across the app.
export const formatAmount = (value) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(Math.abs(Number(value) || 0))
    .replaceAll(',', ' ');

// Years offered in the filter: the current one and the five before it.
export const getYearOptions = (currentYear, count = 6) =>
  Array.from({ length: count }, (_, index) => currentYear - index);

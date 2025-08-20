export const parseAndValidateDate = (dateString: string): Date | null => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return null;
  }
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatMonthForDisplay = (dateString: string, lang: string): string => {
  const date = parseAndValidateDate(dateString);
  if (!date) {
    return 'Invalid Date';
  }
  return date.toLocaleString(lang, {
    month: 'long',
    year: 'numeric',
  });
};
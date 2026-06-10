const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateOnly(value) {
  if (!datePattern.test(value || '')) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parsePositiveInt(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

module.exports = {
  isValidDateOnly,
  parsePositiveInt,
};

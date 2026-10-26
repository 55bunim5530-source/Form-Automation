const test = require('node:test');
const assert = require('node:assert/strict');
const holidays = require('../korean-holidays.js');

test('shows published lunar holidays, election days, and temporary holidays', () => {
  assert.equal(holidays.getHoliday('2025-01-27')?.name, '임시공휴일');
  assert.equal(holidays.getHoliday('2025-06-03')?.name, '대통령선거일');
  assert.equal(holidays.getHoliday('2026-02-17')?.name, '설날');
  assert.equal(holidays.getHoliday('2026-09-25')?.name, '추석');
  assert.equal(holidays.getHoliday('2026-10-05')?.name, '대체공휴일(개천절)');
  assert.equal(holidays.getHoliday('2027-02-09')?.name, '대체공휴일(설날)');
});

test('includes the 2026 Labor Day and Constitution Day rule changes', () => {
  assert.equal(holidays.getHoliday('2025-07-17'), null);
  assert.equal(holidays.getHoliday('2026-05-01')?.name, '노동절');
  assert.equal(holidays.getHoliday('2026-07-17')?.name, '제헌절');
  assert.equal(holidays.getHoliday('2027-05-03')?.name, '대체공휴일(노동절)');
  assert.equal(holidays.getHoliday('2027-07-19')?.name, '대체공휴일(제헌절)');
});

test('keeps future years partial and does not invent a New Year substitute', () => {
  assert.equal(holidays.hasFullYearData(2027), true);
  assert.equal(holidays.hasFullYearData(2028), false);
  assert.equal(holidays.getHoliday('2028-01-01')?.name, '신정');
  assert.equal(holidays.getHoliday('2028-01-03'), null);
  assert.equal(holidays.getHoliday('2028-03-02'), null);
});

test('last business day excludes weekends, statutory holidays, and entered school closure days', () => {
  assert.equal(holidays.lastBusinessDay(2026, 10), '2026-10-30');
  assert.equal(holidays.lastBusinessDay(2026, 10, ['2026-10-30']), '2026-10-29');
  assert.equal(holidays.isNonWorkingDay('2026-10-09'), true);
  assert.equal(holidays.isNonWorkingDay('2026-10-11'), true);
  assert.equal(holidays.getHoliday('2026-10-30', ['2026-10-30'])?.name, '학교 휴무');
});

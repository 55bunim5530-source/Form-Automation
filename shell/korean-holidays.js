/*
 * Offline calendar dates for South Korean public holidays.
 * 2025–2027 movable dates: Korea Astronomy and Space Science Institute calendar data
 * https://astro.kasi.re.kr/kor/life/post/calendarData?search_year=2025
 * https://astro.kasi.re.kr/kor/life/post/calendarData?search_year=2026
 * https://astro.kasi.re.kr/kor/life/post/calendarData?search_year=2027
 * 2026 Labor Day / Constitution Day and their substitutes: Public Holidays Act and
 * Regulation on Public Holidays of Government Offices (effective May 2026).
 * https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=285779
 * Later years display fixed-date holidays only until the official annual dates are added.
 */
(function (root, makeApi) {
  const api = makeApi();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.KoreanPublicHolidays = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';

  const annual = {
    2025: {
      '01-27': '임시공휴일', '01-28': '설날 연휴', '01-29': '설날', '01-30': '설날 연휴',
      '03-03': '대체공휴일(삼일절)', '05-05': '어린이날 · 부처님오신날',
      '05-06': '대체공휴일(부처님오신날)', '06-03': '대통령선거일',
      '10-05': '추석 연휴', '10-06': '추석', '10-07': '추석 연휴', '10-08': '대체공휴일(추석)'
    },
    2026: {
      '02-16': '설날 연휴', '02-17': '설날', '02-18': '설날 연휴',
      '03-02': '대체공휴일(삼일절)', '05-24': '부처님오신날',
      '05-25': '대체공휴일(부처님오신날)', '06-03': '지방선거일',
      '08-17': '대체공휴일(광복절)', '09-24': '추석 연휴',
      '09-25': '추석', '09-26': '추석 연휴', '10-05': '대체공휴일(개천절)'
    },
    2027: {
      '02-06': '설날 연휴', '02-07': '설날', '02-08': '설날 연휴',
      '02-09': '대체공휴일(설날)', '05-03': '대체공휴일(노동절)',
      '05-13': '부처님오신날', '07-19': '대체공휴일(제헌절)',
      '08-16': '대체공휴일(광복절)', '09-14': '추석 연휴',
      '09-15': '추석', '09-16': '추석 연휴',
      '10-04': '대체공휴일(개천절)', '10-11': '대체공휴일(한글날)',
      '12-27': '대체공휴일(기독탄신일)'
    }
  };

  const fixed = {
    '01-01': '신정', '03-01': '삼일절', '05-05': '어린이날',
    '06-06': '현충일', '08-15': '광복절', '10-03': '개천절',
    '10-09': '한글날', '12-25': '기독탄신일'
  };
  const substituteEligible = new Set(['03-01', '05-01', '05-05', '07-17', '08-15', '10-03', '10-09', '12-25']);
  const cache = new Map();

  function validIso(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T12:00:00Z');
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }
  function addDay(iso, count) {
    const date = new Date(iso + 'T12:00:00Z');
    date.setUTCDate(date.getUTCDate() + count);
    return date.toISOString().slice(0, 10);
  }
  function weekday(iso) { return new Date(iso + 'T12:00:00Z').getUTCDay(); }

  function holidaysForYear(year) {
    if (cache.has(year)) return cache.get(year);
    const dates = new Map();
    for (const [suffix, name] of Object.entries(fixed)) dates.set(`${year}-${suffix}`, { name, kind: 'public' });
    if (year >= 2026) {
      dates.set(`${year}-05-01`, { name: '노동절', kind: 'public' });
      dates.set(`${year}-07-17`, { name: '제헌절', kind: 'public' });
    }
    if (annual[year]) {
      for (const [suffix, name] of Object.entries(annual[year])) {
        dates.set(`${year}-${suffix}`, { name, kind: 'public' });
      }
    } else {
      // Fixed-date substitutes are predictable. Lunar and ad-hoc holidays need official annual data.
      for (const suffix of substituteEligible) {
        if (year < 2026 && (suffix === '05-01' || suffix === '07-17')) continue;
        const base = `${year}-${suffix}`;
        if (!dates.has(base) || ![0, 6].includes(weekday(base))) continue;
        let substitute = addDay(base, 1);
        while ([0, 6].includes(weekday(substitute)) || dates.has(substitute)) substitute = addDay(substitute, 1);
        dates.set(substitute, { name: `대체공휴일(${dates.get(base).name})`, kind: 'public', provisional: true });
      }
    }
    cache.set(year, dates);
    return dates;
  }

  function getHoliday(iso, customDates = []) {
    if (!validIso(iso)) return null;
    const official = holidaysForYear(Number(iso.slice(0, 4))).get(iso);
    if (official) return { ...official };
    return Array.isArray(customDates) && customDates.includes(iso)
      ? { name: '학교 휴무', kind: 'custom' }
      : null;
  }
  function isNonWorkingDay(iso, customDates = []) {
    return validIso(iso) && ([0, 6].includes(weekday(iso)) || !!getHoliday(iso, customDates));
  }
  function lastBusinessDay(year, month, customDates = []) {
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return '';
    const date = new Date(Date.UTC(year, month, 0, 12));
    for (let i = 0; i < 31; i++) {
      const iso = date.toISOString().slice(0, 10);
      if (!isNonWorkingDay(iso, customDates)) return iso;
      date.setUTCDate(date.getUTCDate() - 1);
    }
    return '';
  }
  function hasFullYearData(year) { return Object.hasOwn(annual, year); }

  return Object.freeze({ getHoliday, isNonWorkingDay, lastBusinessDay, hasFullYearData });
});

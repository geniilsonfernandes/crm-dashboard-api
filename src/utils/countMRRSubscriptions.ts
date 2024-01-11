import { subscriptions } from '@prisma/client';
import dayjs from 'dayjs';
import isActiveSubscription from './isActiveSubscription';

const updateMRRPerMonthMonthly = (
  subscription: subscriptions,
  mrrPerMonth: number[],
  year_query: string
) => {
  const { billing_quantity, amount } = subscription;
  const startDate = dayjs(subscription.start_date);
  const startYearSubscription = startDate.year();
  const mrrPerMonthObject = {} as { [key: string]: number };

  for (let i = 0; i <= parseFloat(billing_quantity) - 1; i++) {
    const currentMonthYear = dayjs()
      .set('year', startYearSubscription)
      .set('month', startDate.month() + i);
    const key = currentMonthYear.format('MM/DD/YY');

    mrrPerMonthObject[key] = parseFloat(amount) / parseFloat(billing_quantity);
  }

  for (const billing in mrrPerMonthObject) {
    const getMonth = dayjs(billing).month();
    const getYear = dayjs(billing).year();
    console.log(getMonth, getYear, mrrPerMonthObject[billing]);

    if (getYear === parseFloat(year_query)) {
      mrrPerMonth[getMonth] += mrrPerMonthObject[billing];
    }
  }
};

const updateMRRPerMonthAnnually = (
  subscription: subscriptions,
  mrrPerMonth: number[],
  year_query: string
) => {
  const startDate = dayjs(subscription.start_date);
  const endDate = dayjs(subscription.next_cycle);
  const parseAmount = parseFloat(subscription.amount) / 12;
  const startYearSubscription = startDate.year();
  const lastYear =
    startYearSubscription + parseFloat(subscription.billing_quantity);
  const isInYearRange =
    startYearSubscription <= parseFloat(year_query) &&
    lastYear >= parseFloat(year_query);

  if (!isInYearRange) {
    console.log('ano fora do range');

    mrrPerMonth.fill(0);
    return;
  }

  if (startYearSubscription === parseFloat(year_query)) {
    for (let i = startDate.month(); i < 12; i++) {
      mrrPerMonth[i] += parseAmount;
    }
    return;
  }

  if (lastYear > parseFloat(year_query)) {
    mrrPerMonth.fill(parseAmount, 0, 12);
    return;
  }

  if (lastYear === parseFloat(year_query)) {
    for (let i = 0; i < endDate.month() + 1; i++) {
      mrrPerMonth[i] += parseAmount;
    }
  }
};

export function countMRRSubscriptions(subscriptions: subscriptions[]) {
  const mrrPerMonth: number[] = Array(12).fill(0);

  const year_query = '2022';

  subscriptions.forEach((subscription) => {
    if (isActiveSubscription(subscription)) {
      const { periodicity } = subscription;

      if (periodicity === 'Mensal') {
        updateMRRPerMonthMonthly(subscription, mrrPerMonth, year_query);
        return;
      }

      if (periodicity === 'Anual') {
        updateMRRPerMonthAnnually(subscription, mrrPerMonth, year_query);
      }
    }
  });

  return { mrrPerMonth };
}

export default countMRRSubscriptions;

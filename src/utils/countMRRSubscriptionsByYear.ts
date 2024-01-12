import { subscriptions } from '@prisma/client';
import dayjs from 'dayjs';
import isActiveSubscription from './isActiveSubscription';

const updateMRRPerMonthMonthly = (
  subscription: subscriptions,
  mrrPerMonth: number[],
  year_query: string,
  activeSubscriptionsByMonth: number[]
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

    if (getYear === parseFloat(year_query)) {
      mrrPerMonth[getMonth] += mrrPerMonthObject[billing];
      activeSubscriptionsByMonth[getMonth] += 1;
    }
  }
};

const updateMRRPerMonthAnnually = (
  subscription: subscriptions,
  mrrPerMonth: number[],
  year_query: string,
  activeSubscriptionsByMonth: number[]
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
    return;
  }

  if (startYearSubscription === parseFloat(year_query)) {
    for (let i = startDate.month(); i < 12; i++) {
      activeSubscriptionsByMonth[i] += 1;
      mrrPerMonth[i] += parseAmount;
    }
    return;
  }

  if (lastYear > parseFloat(year_query)) {
    for (let i = 0; i < 12; i++) {
      mrrPerMonth[i] += parseAmount;
      activeSubscriptionsByMonth[i] += 1;
    }
    return;
  }

  if (lastYear === parseFloat(year_query)) {
    for (let i = 0; i < endDate.month() + 1; i++) {
      activeSubscriptionsByMonth[i] += 1;
      mrrPerMonth[i] += parseAmount;
    }
  }
};

export function countMRRSubscriptionsByYear(
  subscriptions: subscriptions[],
  year_query: string
) {
  const mrrPerMonth: number[] = Array(12).fill(0);
  const chrunRatePerMonth: number[] = Array(12).fill(0);
  const activeSubscriptionsByMonth: number[] = Array(12).fill(0);

  const isDesactiveSubscription = (sub: subscriptions) => {
    return sub.status === 'Cancelada';
  };

  subscriptions.forEach((subscription) => {
    if (isDesactiveSubscription(subscription)) {
      const { cancellation_date } = subscription;

      if (cancellation_date) {
        const calculationDate = dayjs(cancellation_date);

        if (calculationDate.year() === parseFloat(year_query)) {
          chrunRatePerMonth[calculationDate.month()] += 1;
        }
      }
    }

    if (isActiveSubscription(subscription)) {
      const { periodicity } = subscription;

      if (periodicity === 'Mensal') {
        updateMRRPerMonthMonthly(
          subscription,
          mrrPerMonth,
          year_query,
          activeSubscriptionsByMonth
        );
        return;
      }

      if (periodicity === 'Anual') {
        updateMRRPerMonthAnnually(
          subscription,
          mrrPerMonth,
          year_query,
          activeSubscriptionsByMonth
        );
      }
    }
  });

  return {
    mrrPerMonth: mrrPerMonth.map((value) => Math.floor(value)),
    activeSubscriptionsByMonth,
    chrunRatePerMonth,
  };
}

export default countMRRSubscriptionsByYear;

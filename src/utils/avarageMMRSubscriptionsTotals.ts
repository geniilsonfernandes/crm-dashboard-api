import { subscriptions } from '@prisma/client';
import isActiveSubscription from './isActiveSubscription';

function avarageMMRSubscriptionsTotals(subscriptions: subscriptions[]) {
  const totalSubscriptions = subscriptions.length;
  const mrr = subscriptions.reduce((amout, assinatura) => {
    if (isActiveSubscription(assinatura)) {
      return amout + parseFloat(assinatura.amount);
    }
    return amout;
  }, 0);

  return mrr / totalSubscriptions;
}

export default avarageMMRSubscriptionsTotals;

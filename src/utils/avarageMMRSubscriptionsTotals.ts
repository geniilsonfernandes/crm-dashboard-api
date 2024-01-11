import { subscriptions } from '@prisma/client';
import isActiveSubscription from './isActiveSubscription';

function avarageMMRSubscriptionsTotals(subscriptions: subscriptions[]) {
  const mrr = subscriptions.reduce((amout, assinatura) => {
    if (isActiveSubscription(assinatura)) {
      return amout + parseFloat(assinatura.amount);
    }
    return amout;
  }, 0);

  return mrr / subscriptions.length;
}

export default avarageMMRSubscriptionsTotals;

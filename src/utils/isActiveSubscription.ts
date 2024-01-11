import { subscriptions } from '@prisma/client';

function isActiveSubscription(subscription: subscriptions) {
  return subscription.status === 'Ativa' && !subscription.cancellation_date;
}

export default isActiveSubscription;

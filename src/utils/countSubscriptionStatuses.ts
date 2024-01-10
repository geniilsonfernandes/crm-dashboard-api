import { subscriptions } from '@prisma/client';

const countSubscriptionStatuses = (subscriptions: subscriptions[]) => {
  const counts = {
    active: 0,
    late: 0,
    cancelled: 0,
    trial_active: 0,
    trial_cancelled: 0,
    upgrades: 0,
    total: subscriptions.length,
  };

  for (const sub of subscriptions) {
    switch (sub.status) {
      case 'Ativa':
        counts.active++;
        break;
      case 'Cancelada':
        counts.cancelled++;
        break;
      case 'Atrasada':
        counts.late++;
        break;
      case 'Trial Ativa':
        counts.trial_active++;
        break;
      case 'Trial cancelado':
        counts.trial_cancelled++;
        break;
      case 'Upgrade':
        counts.upgrades++;
        break;
    }
  }

  return counts;
};

export default countSubscriptionStatuses;

import PlanCard from './PlanCard';
import { IPlan } from '@/types/subscriptions';
import { useEffect, useState } from 'react';
import { useCreateCheckoutSession } from '@/api/subscriptionsPlan';
import { useCheckUserSubscription } from '@/api/userManagement';
import { ClassValue } from 'clsx';
import { cn } from '@/lib/utils';

const PlanCards = ({ plans, classNames }: { plans: IPlan[]; classNames?: ClassValue }) => {
  const [hasActivePlan, setHasActivePlan] = useState(true);
  const { data: userSubscription } = useCheckUserSubscription();
  const { mutate, data, isPending } = useCreateCheckoutSession();

  const handleSubscribe = (price_id: string) => {
    mutate(price_id);
  };

  useEffect(() => {
    if (data && data.checkout_url) {
      window.location.href = data.checkout_url;
    }
  }, [data]);

  useEffect(() => {
    if (userSubscription?.has_active_plan) {
      setHasActivePlan(true);
    } else {
      setHasActivePlan(false);
    }
  }, [userSubscription]);

  if (!plans || plans.length === 0) {
    return <div>No plans available</div>;
  }

  return (
    <div className={cn('flex w-full flex-wrap justify-start gap-4 md:gap-8', classNames)}>
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} onClick={handleSubscribe} buttonDisabled={isPending || hasActivePlan} />
      ))}
    </div>
  );
};

export default PlanCards;

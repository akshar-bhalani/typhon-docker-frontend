import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IPlan } from '@/types/subscriptions';

const PlanCard = ({
  plan,
  onClick,
  buttonDisabled,
}: {
  plan: IPlan;
  onClick: (priceId: string) => void;
  buttonDisabled: boolean;
}) => {
  return (
    <Card className="w-full max-w-sm transition hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{plan?.name}</CardTitle>
        <CardDescription>{plan?.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-lg font-semibold">
          {plan?.currency.toUpperCase()} {plan?.price_per_month} /month
        </p>
        <ul className="!mb-2 list-inside list-disc text-gray-600">
          <li>Max Blogs per Month: {plan?.max_blogs_per_month}</li>
          <li>Max Refresh Count: {plan?.max_refresh_count}</li>
          <li>Frequency: {plan?.frequency}</li>
        </ul>
        <Button
          className="mt-4 w-full"
          onClick={() => plan?.price_id && onClick(plan.price_id)}
          disabled={buttonDisabled}
        >
          Subscribe
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;

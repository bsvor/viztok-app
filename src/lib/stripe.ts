import Stripe from "stripe";

export { FREE_WEEKLY_VIEW_LIMIT, TIERS } from "./stripe-config";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

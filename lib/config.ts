/**
 * App-wide constants.
 * Update DONATION_URL here (or override via NEXT_PUBLIC_DONATION_URL in .env.local)
 * when the Stripe payment link changes.
 */
export const DONATION_URL =
  process.env.NEXT_PUBLIC_DONATION_URL ??
  "https://buy.stripe.com/test_bJe00idI64nOaAi15SfYY00";

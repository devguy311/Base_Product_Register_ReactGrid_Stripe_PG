import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
    if (!stripePromise) {
        if (process.env.REACT_APP_PUBLISHABLE_KEY !== undefined) stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);
    }
    return stripePromise;
};

export default getStripe;

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
})

export async function POST(request) {
    try {

        const body = await request.text();
        const sif = request.headers.get("stripe-signature");

        const event = stripe.web

    } catch (error) {


    }
}

export const config = {
    api: { bodyparser: false }
}
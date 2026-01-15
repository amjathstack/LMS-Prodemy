import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
});

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { status: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const data = Object.fromEntries(formData.entries());

        const price = Number(data.price);

        if (!price || price <= 0) {
            return NextResponse.json(
                { status: false, message: "Invalid price" },
                { status: 400 }
            );
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: data.title,
                        },
                        unit_amount: price * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXTAUTH_URL}/enrolled-player/${data.courseId}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/`,
            metadata: {
                userId: session.user.id,
                courseId: data.courseId,
            },
        });

        return NextResponse.json({
            status: true,
            url: checkoutSession.url,
        });
    } catch (error) {
        console.error("STRIPE ERROR:", error);
        return NextResponse.json(
            { status: false, message: error.message },
            { status: 500 }
        );
    }
}

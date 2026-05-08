import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Called by your polling on the verify page
export async function GET(req: NextRequest) {
  try {
    // we can also use ?tap_id=
    const orderId = req.nextUrl.searchParams.get("orderId");

    const order = await prisma.order.findUnique({
      where: { id: orderId! },
      select: { isPaid: true },
    });

    return NextResponse.json({ isPaid: order?.isPaid ?? false });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// Called by Tap webhook
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const status = body.status;
    const orderId = body.reference?.order;

    if (status === "CAPTURED") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(Number(body.transaction.created)),
          paymentResult: {
            id: body.id,
            status: body.status,
            email_address: body.customer.email,
            phone: body.customer.phone.number,
          },
        },
      });
      console.log(`Payment confirmed for Order: ${orderId}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 },
    );
  }
}

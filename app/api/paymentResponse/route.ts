import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateHashForPayment } from "@/lib/actions/payment.action";

// Called by your polling on the verify page
export async function GET(req: NextRequest) {
  try {
    // we can also use ?tap_id= which is their charge id from tap documents
    const orderId = req.nextUrl.searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { isPaid: true, paymentResult: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (!order.paymentResult) {
      return NextResponse.json({ status: "WAITING_FOR_WEBHOOK" });
    }
    console.log(order.paymentResult);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentData = order.paymentResult as any;
      console.log(order.paymentResult);
      return NextResponse.json({ status: paymentData.status });
    } catch (parseError) {
      return NextResponse.json({ status: "PROCESSING_ERROR" });
    }
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
    const amount = body.amount;
    const currency = body.currency;
    const orderId = body.reference?.order;
    const myHash = await calculateHashForPayment(orderId, amount, currency);

    console.log(body);

    if (status === "CAPTURED") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(Number(body.transaction.created)),
          paymentResult: body,
        },
      });
      console.log(`Payment confirmed for Order: ${orderId}`);
    }
    if (status === "DECLINED" || status === "NOT CAPTURED") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: body.id,
            status: body.status,
            email_address: body.customer.email,
            phone: body.customer.phone.number,
          },
        },
      });
      console.log(
        status === "DECLINED"
          ? `Payment declined for Order: ${orderId}`
          : `Payment was not successful for Order: ${orderId}`,
      );
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

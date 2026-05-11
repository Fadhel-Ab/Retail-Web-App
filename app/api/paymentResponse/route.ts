import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateWebhookHash } from "@/lib/actions/payment.action";
import { getLocale } from "next-intlayer/server";
import { revalidatePath } from "next/cache";
export const dynamic = "force-dynamic";
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
  const locale=getLocale();
  try {
    const body = await req.json();

    const status = body.status;
    const orderId = body.reference?.order;
    const isValid = await validateWebhookHash(body, req.headers.get("hashstring") || "");
    const incomingHash = req.headers.get("hashstring");
    console.log("hashstring from header:", incomingHash);
    const createdTime = parseInt(body.transaction?.created); //"1662544525491"
    const currentTime = Date.now();
    const FIVE_MINUTES_MS = 5 * 60 * 1000;

    // Check if the timestamp is older than 5 minutes
    if (currentTime - createdTime > FIVE_MINUTES_MS) {
      return NextResponse.json({ error: "Request expired" }, { status: 403 });
    }

    if (!incomingHash) {
      return NextResponse.json(
        { error: "Missing hashstring" },
        { status: 400 },
      );
    }

    if (isValid) {
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
      if (status === "DECLINED" || status === "NOT CAPTURED") {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentResult: body,
          },
        });
        console.log(
          status === "DECLINED"
            ? `Payment declined for Order: ${orderId}`
            : `Payment was not successful for Order: ${orderId}`,
        );
      }
      revalidatePath(`/${locale}/order/${orderId}`);
      return NextResponse.json({ received: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 },
    );
  }
}

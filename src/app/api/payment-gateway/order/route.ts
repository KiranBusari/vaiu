import axios from "axios";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const salt_key = process.env.SALT_KEY;
const merchant_id = process.env.MERCHANT_ID;

export async function POST(req: NextRequest) {
  try {
    const reqData = await req.json();

    const merchantTransactionId = reqData.transactionId;

    const data = {
      merchantId: merchant_id,
      merchantTransactionId: merchantTransactionId,
      name: reqData.name,
      amount: reqData.amount * 100,
      redirectUrl: `http://localhost:3000/api/payment-gateway/status?id=${merchantTransactionId}`,
      redirectMode: "POST",
      callbackUrl: `http://localhost:3000/api/payment-gateway/status?id=${merchantTransactionId}`,
      mobileNumber: reqData.phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const prod_URL =
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    const response = await axios(options);

    return NextResponse.json(response.data);
  } catch (error) {
    const err = error as Error;
    console.log(error);

    return NextResponse.json(
      { error: "Payment initiation failed", details: err.message },
      { status: 500 }
    );
  }
}
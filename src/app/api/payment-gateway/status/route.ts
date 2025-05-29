import crypto from "crypto";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const saltKey = process.env.SALT_KEY;
const merchantId = process.env.MERCHANT_ID;

export async function POST(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const merchantTransactionId = searchParams.get("id");

        const keyIndex = 1;

        const string =
            `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
        const sha256 = crypto.createHash("sha256").update(string).digest("hex");
        const checksum = sha256 + "###" + keyIndex;

        const options = {
            method: "GET",
            url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                "X-MERCHANT-ID": merchantId,
            },
        };

        const response = await axios(options);

        if (response.data.success === true) {
            return NextResponse.redirect("http://localhost:3000/success", {
                status: 301,
            });
        } else {
            return NextResponse.redirect("http://localhost:3000/failed", {
                status: 301,
            });
        }
    } catch (error) {
        const err = error as Error;
        console.error(error);

        return NextResponse.json(
            { error: "Payment check failed", details: err.message },
            { status: 500 }
        );
    }
}
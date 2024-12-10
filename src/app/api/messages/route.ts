import { DATABASE_ID, MESSAGE_ID } from "@/config";
import { getCurrent } from "@/features/auth/queries";
import { createSessionClient } from "@/lib/appwrite";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await getCurrent()

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const roomId = searchParams.get("roomId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!roomId)
      return new NextResponse("Missing roomId", { status: 400 });

    // let messages: Message[] = [];

    // if (cursor) {
    //   messages = await db.message.findMany({
    //     take: MESSAGES_BATCH,
    //     skip: 1,
    //     cursor: {
    //       id: cursor,
    //     },
    //     where: {
    //       channelId,
    //     },
    //     include: {
    //       member: {
    //         include: {
    //           profile: true,
    //         },
    //       },
    //     },
    //     orderBy: {
    //       createdAt: "desc",
    //     },
    //   });
    // } else {
    //   messages = await db.message.findMany({
    //     take: MESSAGES_BATCH,
    //     where: {
    //       channelId,
    //     },
    //     include: {
    //       member: {
    //         include: {
    //           profile: true,
    //         },
    //       },
    //     },
    //     orderBy: {
    //       createdAt: "desc",
    //     },
    //   });
    // }

    // let nextCursor = null;

    // if (messages.length === MESSAGES_BATCH) {
    //   nextCursor = messages[messages.length - 1].id;
    // }

    // return NextResponse.json({
    //   items: messages,
    //   nextCursor,
    // });
    
    let queries = [
      Query.equal('roomId', roomId),
      Query.orderDesc('createdAt'),
      Query.limit(MESSAGES_BATCH),
    ];

    if (cursor) {
      queries.push(Query.cursorAfter(cursor));
    }

    const {databases} = await createSessionClient()

    const response = await databases.listDocuments(
      DATABASE_ID,
      MESSAGE_ID,
      queries
    );

    const messages = response.documents;
    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[messages.length - 1].$id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGES_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

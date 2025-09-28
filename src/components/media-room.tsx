"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { useCurrent } from "@/features/auth/api/use-curent";
import { useRouter } from "next/navigation";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom: React.FC<MediaRoomProps> = ({
  chatId,
  video,
  audio,
}) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { data: user } = useCurrent();

  useEffect(() => {
    if (!user?.name) return;

    const name = `${user.name}`;

    (async () => {
      try {
        const response = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`,
        );

        const data = await response.json();
        setToken(data.token);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, [chatId, user?.name]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      audio={audio}
      video={video}
      onDisconnected={() => router.push("/")}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

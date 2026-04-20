import React from "react";
import { useSearchParams } from "react-router-dom";
import VideoConference from "@/components/video/VideoConference";

export default function VideoSession() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-900">
      <VideoConference sessionId={sessionId} />
    </div>
  );
}
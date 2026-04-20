import React, { useState, useEffect, useRef } from "react";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff,
  Phone,
  Users,
  MessageCircle,
  Pen,
  Download,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function VideoConference({ session, userEmail, isHost }) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#000000");

  // Simulated video conference (in real implementation, use WebRTC or service like Jitsi/Agora)
  useEffect(() => {
    // Simulate participants joining
    setParticipants([
      { email: userEmail, name: userEmail.split('@')[0], isHost: true },
      { email: "student1@example.com", name: "محمد", isHost: false },
      { email: "student2@example.com", name: "سارة", isHost: false },
    ]);
  }, [userEmail]);

  // Whiteboard drawing logic
  useEffect(() => {
    if (canvasRef.current && showWhiteboard) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  }, [showWhiteboard, drawColor]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatMessages([...chatMessages, {
      sender: userEmail.split('@')[0],
      message: chatMessage,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold">{session?.title}</h2>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                {participants.length} مشارك
              </p>
            </div>
          </div>
          
          <Badge className="bg-red-600">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
            مباشر
          </Badge>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {/* Main Video Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Main Screen */}
            <Card className="border-0 bg-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                  {showWhiteboard ? (
                    <div className="relative w-full h-full">
                      <canvas
                        ref={canvasRef}
                        width={1280}
                        height={720}
                        className="w-full h-full bg-white cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <input
                          type="color"
                          value={drawColor}
                          onChange={(e) => setDrawColor(e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <Button
                          size="sm"
                          onClick={clearWhiteboard}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          مسح
                        </Button>
                      </div>
                    </div>
                  ) : isScreenSharing ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Monitor className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <p className="text-white text-lg">جاري مشاركة الشاشة...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {isVideoOn ? (
                        <div className="text-center">
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-4xl font-bold">
                              {userEmail.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-white text-lg">{userEmail.split('@')[0]}</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <VideoOff className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">الكاميرا مغلقة</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Session Info Overlay */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p className="text-white text-sm">
                      {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                variant={isAudioOn ? "default" : "destructive"}
                onClick={() => setIsAudioOn(!isAudioOn)}
                className="rounded-full w-14 h-14"
              >
                {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </Button>

              <Button
                size="lg"
                variant={isVideoOn ? "default" : "destructive"}
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="rounded-full w-14 h-14"
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </Button>

              {isHost && (
                <>
                  <Button
                    size="lg"
                    variant={isScreenSharing ? "default" : "outline"}
                    onClick={() => {
                      setIsScreenSharing(!isScreenSharing);
                      setShowWhiteboard(false);
                    }}
                    className="rounded-full w-14 h-14"
                  >
                    {isScreenSharing ? <Monitor className="w-6 h-6" /> : <MonitorOff className="w-6 h-6" />}
                  </Button>

                  <Button
                    size="lg"
                    variant={showWhiteboard ? "default" : "outline"}
                    onClick={() => {
                      setShowWhiteboard(!showWhiteboard);
                      setIsScreenSharing(false);
                    }}
                    className="rounded-full w-14 h-14"
                  >
                    <Pen className="w-6 h-6" />
                  </Button>
                </>
              )}

              <Button
                size="lg"
                variant={showChat ? "default" : "outline"}
                onClick={() => setShowChat(!showChat)}
                className="rounded-full w-14 h-14"
              >
                <MessageCircle className="w-6 h-6" />
              </Button>

              <Button
                size="lg"
                variant="destructive"
                className="rounded-full w-14 h-14"
              >
                <Phone className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Participants */}
            <Card className="border-0 bg-gray-800">
              <CardContent className="p-4">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  المشاركون ({participants.length})
                </h3>
                <div className="space-y-2">
                  {participants.map((participant, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{participant.name}</p>
                        {participant.isHost && (
                          <Badge className="bg-blue-600 text-xs mt-1">مقدم</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Panel */}
            {showChat && (
              <Card className="border-0 bg-gray-800">
                <CardContent className="p-4">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    الدردشة
                  </h3>
                  
                  <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className="bg-gray-700 rounded-lg p-2">
                        <p className="text-xs text-gray-400">{msg.sender} - {msg.time}</p>
                        <p className="text-sm text-white">{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="اكتب رسالة..."
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    <Button 
                      size="sm"
                      onClick={handleSendMessage}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      إرسال
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Session Info */}
            <Card className="border-0 bg-gray-800">
              <CardContent className="p-4">
                <h3 className="text-white font-bold mb-3">معلومات الجلسة</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">المدة</span>
                    <span className="text-white">{session?.duration_minutes} دقيقة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">الحالة</span>
                    <Badge className="bg-green-600">مباشر</Badge>
                  </div>
                  {isHost && session?.recording_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 text-white border-gray-600 hover:bg-gray-700"
                      asChild
                    >
                      <a href={session.recording_url} download>
                        <Download className="w-4 h-4 ml-2" />
                        تحميل التسجيل
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { MessageCircle, Phone, Send, X } from "lucide-react";
import { getClinicSettings } from "@/lib/firebaseServices";
import { clinic as fallbackClinic } from "@/lib/clinic";

export function WhatsAppFab() {
  const [clinic, setClinic] = useState(fallbackClinic);
  const [chatOpen, setChatOpen] = useState(false);
  const [userMsg, setUserMsg] = useState("");

  useEffect(() => {
    getClinicSettings().then(setClinic);
  }, []);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userMsg.trim()) return;
    const url = `https://wa.me/${clinic.phoneRaw}?text=${encodeURIComponent(userMsg)}`;
    window.open(url, "_blank");
    setUserMsg("");
    setChatOpen(false);
  };

  const cleanPhone = clinic.phoneRaw || "919244323441";

  return (
    <>
      {/* 1. CALL FLOATING BUTTON */}
      <a
        href={`tel:+${cleanPhone}`}
        aria-label="Call Clinic"
        className="fixed bottom-[84px] right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-xl ring-4 ring-primary/20 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-primary/95"
      >
        <Phone className="h-5 w-5 animate-pulse" />
      </a>

      {/* 2. WHATSAPP CHAT DRAWER / FLOATING POPUP */}
      {chatOpen && (
        <div className="fixed bottom-[84px] right-5 z-50 w-[300px] sm:w-[350px] rounded-3xl border bg-white shadow-2xl overflow-hidden flex flex-col animate-fade-up max-h-[400px] border-emerald-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 px-5 py-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border-2 border-white/40 bg-white">
                <img
                  src="https://res.cloudinary.com/dntsjzbei/image/upload/v1780681530/yotg2haunjnbiblavmpb.png"
                  alt="Doctor"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border border-white" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-extrabold">{clinic.doctor || "Dr. Amit Jain"}</div>
                <div className="text-[10px] text-emerald-100 font-semibold flex items-center gap-1">
                  <span>Chief Dermatologist</span>
                  <span>•</span>
                  <span className="animate-pulse">Replies in mins</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded-full p-1 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Messages Panel */}
          <div 
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f0f2f5] min-h-[160px]"
            style={{
              backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
              backgroundSize: 'contain',
              backgroundRepeat: 'repeat'
            }}
          >
            {/* System / Timestamp */}
            <div className="text-center">
              <span className="inline-block text-[9px] font-bold bg-white/70 backdrop-blur-sm text-gray-500 px-2 py-0.5 rounded-full shadow-sm">
                TODAY
              </span>
            </div>

            {/* Doctor Bubble */}
            <div className="flex gap-2 items-end max-w-[88%]">
              <div className="bg-white text-gray-800 text-[11px] px-3 py-2.5 rounded-2xl rounded-bl-none shadow-sm relative leading-relaxed">
                Hello! Welcome to Dr Jain's Skin Care Clinic. How can I help you today with your skin or hair concern?
                <span className="block text-[8px] text-gray-400 text-right mt-1.5 font-semibold">Just Now</span>
              </div>
            </div>
          </div>

          {/* Form input field footer */}
          <form onSubmit={handleSend} className="bg-gray-50 p-3 border-t flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your clinical query here..."
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-gray-800"
              required
            />
            <button
              type="submit"
              disabled={!userMsg.trim()}
              className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* 3. WHATSAPP CHAT TOGGLE FAB */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        aria-label="Chat on WhatsApp"
        className={`fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-xl ring-4 transition-all duration-300 active:scale-95 ${
          chatOpen 
            ? "bg-red-500 hover:bg-red-600 ring-red-300/50 hover:rotate-90" 
            : "bg-emerald-500 hover:bg-emerald-600 ring-emerald-300/50 hover:scale-110"
        }`}
      >
        {chatOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </button>
    </>
  );
}
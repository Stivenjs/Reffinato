import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toast } from "@/components/ui/toast";
import VideoSection from "@/components/shared/VideoSection";
import Categories from "../../components/shared/Categories";
import SocialShop from "../../components/shared/SocialShop";
export default function Home() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-blue-50">
        <main className="pt-20">
          <VideoSection />
          <Categories />
          <SocialShop />
        </main>

        {showToast && (
          <Toast
            variant="default"
            onClose={() => setShowToast(false)}
            className="fixed bottom-4 right-4 z-50"
          >
            {toastMessage}
          </Toast>
        )}
      </div>
    </TooltipProvider>
  );
}

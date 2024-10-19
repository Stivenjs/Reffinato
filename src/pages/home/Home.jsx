import { TooltipProvider } from "@/components/ui/tooltip";
import VideoSection from "@/components/shared/VideoSection";
import Categories from "../../components/shared/Categories";
import SocialShop from "../../components/shared/SocialShop";
export default function Home() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-blue-50">
        <main className="pt-20">
          <VideoSection />
          <Categories />
          <SocialShop />
        </main>
      </div>
    </TooltipProvider>
  );
}

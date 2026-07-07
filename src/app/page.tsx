import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingShowcaseCards } from "@/components/landing/LandingShowcaseCards";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingBanks } from "@/components/landing/LandingBanks";

export default function LandingPage() {
  return (
    <main className="landing-page min-h-screen min-h-[100dvh] text-slate-900">
      <LandingNavbar />
      <LandingHero />
      <LandingShowcaseCards />
      <LandingFeatures />
      <LandingBanks />
    </main>
  );
}

"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DashboardPreview from "./components/DashboardPreview";
import Comparison from "./components/Comparison";
import Features from "./components/Features";
import RoiCalculator from "./components/RoiCalculator";
import Pricing from "./components/Pricing";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import TrialModal from "./components/TrialModal";

export default function Home() {
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

  const handleOpenTrial = () => {
    setIsTrialModalOpen(true);
  };

  const handleCloseTrial = () => {
    setIsTrialModalOpen(false);
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar with modal trigger */}
      <Navbar onOpenTrial={handleOpenTrial} />

      {/* Hero Section */}
      <Hero onOpenTrial={handleOpenTrial} />

      {/* Interactive Mockup & Unification Demo */}
      <DashboardPreview />

      {/* Before vs After Comparison */}
      <Comparison />

      {/* Core ERP + E-commerce Features */}
      <Features />

      {/* Interactive Time and Cost Savings Calculator */}
      <RoiCalculator onOpenTrial={handleOpenTrial} />

      {/* Transparent Pricing Cards */}
      <Pricing onOpenTrial={handleOpenTrial} />

      {/* Frequently Asked Questions */}
      <Faq />

      {/* Final CTA Banner and Footer */}
      <Footer onOpenTrial={handleOpenTrial} />

      {/* 14-Day Free Trial Modal */}
      <TrialModal isOpen={isTrialModalOpen} onClose={handleCloseTrial} />
    </main>
  );
}

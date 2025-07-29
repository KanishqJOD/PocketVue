"use client";

import Link from "next/link";
// Card and CardContent are defined in the file but never used
// You can either remove their definitions or keep them for future use
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BarChart2, IndianRupee, TrendingDown, FileUp, Home, User } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// These components are defined but never used, so we can remove them
// or keep them if they might be used in the future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
    {children}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("p-6", className)}>
    {children}
  </div>
);

export default function HomePage() {
  const { user } = useAuth();
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("home");

  // Animation for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    const scrollElements = document.querySelectorAll(".scroll-reveal");
    scrollElements.forEach((el) => observer.observe(el));

    return () => {
      scrollElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Function to render the appropriate content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case "income":
        return (
          <div className="mt-16">
            <div className="bento-grid grid grid-cols-1 gap-6 text-left">
              {/* Income Management Card */}
              <Link href="/income" className="group">
                <div className="bento-card p-6 relative overflow-hidden transition-all duration-300 group-hover:border-primary/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 z-0"></div>
                  <div className="relative z-10">
                    <div className="h-40 w-full mb-4 relative rounded-lg overflow-hidden bg-black/40">
                      {/* Income Management Image */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IndianRupee className="h-16 w-16 text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
                      <span>Manage Income</span>
                      <ArrowRight className="h-5 w-5 text-primary transform transition-transform duration-300 group-hover:translate-x-1" />
                    </h3>
                    <p className="text-muted-foreground">View, add, and analyze your income sources</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      case "expense":
        return (
          <div className="mt-16">
            <div className="bento-grid grid grid-cols-1 gap-6 text-left">
              {/* Expense Management Card */}
              <Link href="/expense" className="group">
                <div className="bento-card p-6 relative overflow-hidden transition-all duration-300 group-hover:border-primary/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 z-0"></div>
                  <div className="relative z-10">
                    <div className="h-40 w-full mb-4 relative rounded-lg overflow-hidden bg-black/40">
                      {/* Expense Management Image */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingDown className="h-16 w-16 text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
                      <span>Expense Management</span>
                      <ArrowRight className="h-5 w-5 text-primary transform transition-transform duration-300 group-hover:translate-x-1" />
                    </h3>
                    <p className="text-muted-foreground">Track and manage your expenses efficiently</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="mt-16">
            <div className="bento-grid grid grid-cols-1 gap-6 text-left">
              {/* Visual Analytics Card */}
              <Link href="/statistics" className="group">
                <div className="bento-card p-6 relative overflow-hidden transition-all duration-300 group-hover:border-primary/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 z-0"></div>
                  <div className="relative z-10">
                    <div className="h-40 w-full mb-4 relative rounded-lg overflow-hidden bg-black/40">
                      {/* Visual Analytics Image */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BarChart2 className="h-16 w-16 text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
                      <span>Visual Analytics</span>
                      <ArrowRight className="h-5 w-5 text-primary transform transition-transform duration-300 group-hover:translate-x-1" />
                    </h3>
                    <p className="text-muted-foreground">Beautiful charts for trends, categories, and savings</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      case "upload":
        return (
          <div className="mt-16">
            <div className="bento-grid grid grid-cols-1 gap-6 text-left">
              {/* Upload Transactions Card */}
              <Link href="/upload-transactions" className="group">
                <div className="bento-card p-6 relative overflow-hidden transition-all duration-300 group-hover:border-primary/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 z-0"></div>
                  <div className="relative z-10">
                    <div className="h-40 w-full mb-4 relative rounded-lg overflow-hidden bg-black/40">
                      {/* Upload Transactions Image */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileUp className="h-16 w-16 text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
                      <span>Upload Transactions</span>
                      <ArrowRight className="h-5 w-5 text-primary transform transition-transform duration-300 group-hover:translate-x-1" />
                    </h3>
                    <p className="text-muted-foreground">Scan receipts and upload PDFs to auto-extract transactions</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      default: // home tab
        return (
          <div ref={cardsRef} className="mt-16">
            <div className="bento-grid grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Income Management Card */}
              <Link href="/income" className="group">
                <div className="bento-card p-6 relative overflow-hidden transition-all duration-300 group-hover:border-primary/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 z-0"></div>
                  <div className="relative z-10">
                    <div className="h-40 w-full mb-4 relative rounded-lg overflow-hidden bg-black/40">
                      {/* Income Management Image */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IndianRupee className="h-16 w-16 text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
                      <span>Manage Income</span>
                      <ArrowRight className="h-5 w-5 text-primary transform transition-transform duration-300 group-hover:translate-x-1" />
                    </h3>
                    <p className="text-muted-foreground">View, add, and analyze your income sources</p>
                  </div>
                </div>
              </Link>
              
              {/* Expense Management Card */}
              <Link href="/expense" className="group">
                <div className="bento-card p-6 relative overflow-hidden transition-all duration-300 group-hover:border-primary/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 z-0"></div>
                  <div className="relative z-10">
                    <div className="h-40 w-full mb-4 relative rounded-lg overflow-hidden bg-black/40">
                      {/* Expense Management Image */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingDown className="h-16 w-16 text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
                      <span>Expense Management</span>
                      <ArrowRight className="h-5 w-5 text-primary transform transition-transform duration-300 group-hover:translate-x-1" />
                    </h3>
                    <p className="text-muted-foreground">Track and manage your expenses efficiently</p>
                  </div>
                </div>
              </Link>
              
              {/* Visual Analytics Card */}
              <Link href="/statistics" className="group">
                <div className="bento-card p-6 relative overflow-hidden transition-all duration-300 group-hover:border-primary/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 z-0"></div>
                  <div className="relative z-10">
                    <div className="h-40 w-full mb-4 relative rounded-lg overflow-hidden bg-black/40">
                      {/* Visual Analytics Image */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BarChart2 className="h-16 w-16 text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
                      <span>Visual Analytics</span>
                      <ArrowRight className="h-5 w-5 text-primary transform transition-transform duration-300 group-hover:translate-x-1" />
                    </h3>
                    <p className="text-muted-foreground">Beautiful charts for trends, categories, and savings</p>
                  </div>
                </div>
              </Link>
              
              {/* Upload Transactions Card */}
              <Link href="/upload-transactions" className="group">
                <div className="bento-card p-6 relative overflow-hidden transition-all duration-300 group-hover:border-primary/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 z-0"></div>
                  <div className="relative z-10">
                    <div className="h-40 w-full mb-4 relative rounded-lg overflow-hidden bg-black/40">
                      {/* Upload Transactions Image */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileUp className="h-16 w-16 text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
                      <span>Upload Transactions</span>
                      <ArrowRight className="h-5 w-5 text-primary transform transition-transform duration-300 group-hover:translate-x-1" />
                    </h3>
                    <p className="text-muted-foreground">Scan receipts and upload PDFs to auto-extract transactions</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full text-foreground overflow-hidden flex flex-col bg-background">
      {/* Account Button (Top Right) */}
      <div className="absolute top-4 right-4 z-50">
        {user ? (
          <Link href="/account">
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10 text-primary">
              <User className="w-5 h-5" />
              Account
            </Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10 text-primary">
              <User className="w-5 h-5" />
              Login
            </Button>
          </Link>
        )}
      </div>
      
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-5xl w-full text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight scroll-reveal">
            Welcome to <span className="text-primary">PocketVue</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto scroll-reveal">
            Your AI-powered personal finance assistant — track your income, control your expenses,
            gain financial insights, and plan better with ease.
          </p>

          {/* Round Navbar */}
          <div className="round-navbar scroll-reveal">
            <button 
              className={cn("round-navbar-item", activeTab === "home" && "active")}
              onClick={() => setActiveTab("home")}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </button>
            <button 
              className={cn("round-navbar-item", activeTab === "income" && "active")}
              onClick={() => setActiveTab("income")}
            >
              <IndianRupee className="w-4 h-4 mr-2" />
              Income
            </button>
            <button 
              className={cn("round-navbar-item", activeTab === "expense" && "active")}
              onClick={() => setActiveTab("expense")}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Expenses
            </button>
            <button 
              className={cn("round-navbar-item", activeTab === "analytics" && "active")}
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Analytics
            </button>
            <button 
              className={cn("round-navbar-item", activeTab === "upload" && "active")}
              onClick={() => setActiveTab("upload")}
            >
              <FileUp className="w-4 h-4 mr-2" />
              Upload
            </button>
            <Link href={user ? "/account" : "/login"} className="round-navbar-item">
              <User className="w-4 h-4 mr-2" />
              {user ? "Account" : "Login"}
            </Link>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 scroll-reveal">
            {!user && (
              <>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-xl shadow-lg">
                    Register to Track Expenses
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="text-primary border-primary hover:bg-primary/10 text-lg px-8 py-6 rounded-xl shadow-lg">
                    Already have an account? Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Render content based on active tab */}
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground relative z-10 border-t border-border">
        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-12 scroll-reveal">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent rounded-2xl blur-xl opacity-30 -z-10"></div>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg border border-gray-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="p-6">
                <Accordion>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <span className="text-lg font-medium">Do I need to create an account?</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="leading-relaxed">
                        Yes, creating an account keeps your financial data secure and synced across all your devices. It only takes a minute to sign up.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      <span className="text-lg font-medium">What can I do with PocketVue?</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="leading-relaxed">
                        Track your income and expenses, see where your money goes with beautiful charts, and get insights to help you budget better. It&apos;s your complete financial overview in one place.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      <span className="text-lg font-medium">Can I upload receipts to track expenses?</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="leading-relaxed">
                        Yes! Simply upload a photo of your receipt or PDF, and PocketVue automatically extracts the amount, date, and category. No more manual typing.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      <span className="text-lg font-medium">Is my data safe?</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="leading-relaxed">
                        Absolutely. Your financial information is encrypted and stored securely. We never share your data with third parties.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      <span className="text-lg font-medium">Can I see my spending patterns?</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="leading-relaxed">
                        Yes! View colorful charts showing your spending by category and time period. Perfect for understanding your habits and planning your budget.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
        
        Copyright © 2025 PocketVue
      </footer>
    </div>
  );
}
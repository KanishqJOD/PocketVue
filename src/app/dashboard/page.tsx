"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import TotalBalanceCard from "@/components/dashboard/TotalBalanceCard";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import InsightSummaryCard from "@/components/dashboard/InsightSummaryCard";
import SpendingCategoryChart from "@/components/dashboard/SpendingCategoryChart";
import LatestTransactionsTable from "@/components/dashboard/LatestTransactionsTable";
import SavingsTrendChart from "@/components/dashboard/SavingsTrendChart";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------- Constants ----------
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const generateYears = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

// ---------- Main Component ----------
export default function DashboardPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [userName, setUserName] = useState<string>("User");
  const cardsRef = useRef<HTMLDivElement>(null);

  const years = generateYears(2020, currentYear + 5);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User");
      }
    });
    return () => unsubscribe();
  }, []);

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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 text-foreground">
        {/* Header */}
        <div className="scroll-reveal">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            👋 Welcome back, {userName}!
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Welcome to <span className="font-semibold text-primary">PocketVue</span>, your personal finance assistant. Track your income, control your spending, and build your savings — all in one place.
          </p>
        </div>

        {/* Filters */}
        <div className="text-base md:text-lg mt-2 flex flex-wrap items-center gap-1 scroll-reveal">
          <span>Showing insights and trends for Month</span>

          <Select
            value={selectedMonth.toString()}
            onValueChange={(val) => setSelectedMonth(Number(val))}
          >
            <SelectTrigger className="underline underline-offset-4 px-1 py-0 bg-transparent border-none text-primary font-medium h-auto w-auto focus:ring-0 focus:outline-none hover:text-primary/80">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="bg-card text-card-foreground border border-border shadow-lg">
              {MONTHS.map((month, idx) => (
                <SelectItem key={month} value={idx.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span>, Year</span>

          <Select
            value={selectedYear.toString()}
            onValueChange={(val) => setSelectedYear(Number(val))}
          >
            <SelectTrigger className="underline underline-offset-4 px-1 py-0 bg-transparent border-none text-primary font-medium h-auto w-auto focus:ring-0 focus:outline-none hover:text-primary/80">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-card text-card-foreground border border-border shadow-lg">
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dashboard Charts - Bento Grid */}
        <div ref={cardsRef} className="bento-grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bento-card md:col-span-1">
            <TotalBalanceCard month={selectedMonth} year={selectedYear} />
          </div>
          <div className="bento-card md:col-span-1">
            <IncomeExpenseChart year={selectedYear} />
          </div>
          <div className="bento-card md:col-span-1">
            <InsightSummaryCard month={selectedMonth} year={selectedYear} />
          </div>
          <div className="bento-card md:col-span-1 md:row-span-2">
            <SpendingCategoryChart month={selectedMonth} year={selectedYear} />
          </div>
          <div className="bento-card md:col-span-2">
            <LatestTransactionsTable month={selectedMonth} year={selectedYear} />
          </div>
          <div className="bento-card md:col-span-3">
            <SavingsTrendChart year={selectedYear} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

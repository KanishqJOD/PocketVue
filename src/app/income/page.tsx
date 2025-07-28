// app/income/page.tsx
"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import AddIncomeForm from "@/components/income/AddIncomeForm";
import IncomeList from "@/components/income/IncomeList";
import IncomeChart from "@/components/income/IncomeChart";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";

export default function IncomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={item}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <IndianRupee className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Income Management</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-12">
            View, add, and analyze your income sources
          </p>
        </motion.div>

        {/* Charts + Form */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 overflow-hidden hover:shadow-lg transition-all duration-300" variant="gradient" hoverable>
            <IncomeChart refreshKey={refreshKey}/>
          </Card>
          <Card className="bg-card shadow-lg border border-border/50 hover:border-primary/30 transition-all duration-300" hoverable>
            <AddIncomeForm onAdded={() => setRefreshKey((prev) => prev + 1)} />
          </Card>
        </motion.div>

        {/* Latest Incomes */}
        <motion.div variants={item}>
          <IncomeList refreshKey={refreshKey} />
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

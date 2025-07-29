"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import TotalBalanceCard from "@/components/dashboard/TotalBalanceCard";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import SavingsTrendChart from "@/components/dashboard/SavingsTrendChart";
import SpendingCategoryChart from "@/components/dashboard/SpendingCategoryChart";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon, 
  BarChart2 
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

// ---------- Constants ----------
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const generateYears = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

// Helper functions
const parseDate = (raw: unknown): Date | null => {
  if (!raw) return null;
  if (typeof raw === 'object' && raw !== null && 'seconds' in raw) {
    return new Date((raw as { seconds: number }).seconds * 1000);
  }
  if (typeof raw === "string") return new Date(raw);
  if (raw instanceof Date) return raw;
  return null;
};

// Function to fetch yearly income
async function fetchYearlyIncome(userId: string, year: number): Promise<number> {
  let totalIncome = 0;
  
  const incomeQuery = query(
    collection(db, "incomes"),
    where("userId", "==", userId)
  );
  
  const snapshot = await getDocs(incomeQuery);
  
  snapshot.forEach((doc) => {
    const { amount, date } = doc.data();
    const parsedDate = parseDate(date);
    
    if (parsedDate && parsedDate.getFullYear() === year && typeof amount === "number") {
      totalIncome += amount;
    }
  });
  
  return totalIncome;
}

// Function to fetch yearly expense
async function fetchYearlyExpense(userId: string, year: number): Promise<number> {
  let totalExpense = 0;
  
  const expenseQuery = query(
    collection(db, "expenses"),
    where("userId", "==", userId)
  );
  
  const snapshot = await getDocs(expenseQuery);
  
  snapshot.forEach((doc) => {
    const { amount, date } = doc.data();
    const parsedDate = parseDate(date);
    
    if (parsedDate && parsedDate.getFullYear() === year && typeof amount === "number") {
      totalExpense += amount;
    }
  });
  
  return totalExpense;
}

// Annual Summary Card Component
interface AnnualSummaryCardProps {
  title: string;
  icon: React.ReactNode;
  year: number;
  type: 'income' | 'expense' | 'savings' | 'average';
}

function AnnualSummaryCard({ title, icon, year, type }: AnnualSummaryCardProps) {
  const [amount, setAmount] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch data for current year
        const currentYearIncome = await fetchYearlyIncome(user.uid, year);
        const currentYearExpense = await fetchYearlyExpense(user.uid, year);
        const currentYearSavings = currentYearIncome - currentYearExpense;
        
        // Fetch data for previous year to calculate change percentage
        const prevYearIncome = await fetchYearlyIncome(user.uid, year - 1);
        const prevYearExpense = await fetchYearlyExpense(user.uid, year - 1);
        const prevYearSavings = prevYearIncome - prevYearExpense;
        
        let currentAmount = 0;
        let prevAmount = 0;
        
        // Set the appropriate amount based on card type
        switch (type) {
          case 'income':
            currentAmount = currentYearIncome;
            prevAmount = prevYearIncome;
            break;
          case 'expense':
            currentAmount = currentYearExpense;
            prevAmount = prevYearExpense;
            break;
          case 'savings':
            currentAmount = currentYearSavings;
            prevAmount = prevYearSavings;
            break;
          case 'average':
            // Calculate average monthly savings
            currentAmount = currentYearSavings / 12;
            prevAmount = prevYearSavings / 12;
            break;
        }
        
        setAmount(currentAmount);
        
        // Calculate percentage change
        if (prevAmount > 0) {
          const changePercent = ((currentAmount - prevAmount) / prevAmount) * 100;
          setChange(parseFloat(changePercent.toFixed(1)));
        } else if (prevAmount === 0 && currentAmount > 0) {
          setChange(100); // If previous was 0 and current is positive, 100% increase
        } else {
          setChange(0);
        }
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
      }
    };

    fetchData();
  }, [user, year, type]);

  return (
    <Card className="bg-[#161b33] text-white hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="p-2 rounded-full bg-white/10">
            {icon}
          </div>
        </div>
        
        <p className="text-2xl font-bold mt-2">₹{amount.toLocaleString()}</p>
        
        <div className="flex items-center mt-1 text-sm">
          <span className={change >= 0 ? "text-green-400 flex items-center" : "text-red-400 flex items-center"}>
            {change >= 0 ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
            {Math.abs(change)}%
          </span>
          <span className="text-gray-400 ml-2">vs previous year</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Yearly Spending Category Chart Component
function YearlySpendingCategoryChart({ year }: { year: number }) {
  const { user } = useAuth();
  const [data, setData] = useState<{name: string, value: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const COLORS = [
    "#60a5fa", "#fcd34d", "#a78bfa", "#34d399", "#f87171",
    "#818cf8", "#fb923c", "#c084fc", "#2dd4bf", "#e879f9",
  ];

  useEffect(() => {
    if (!user) return;

    const fetchCategoryData = async () => {
      setLoading(true);
      setError(null);

      const categoryMap: Record<string, number> = {};

      try {
        const expenseQuery = query(
          collection(db, "expenses"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(expenseQuery);

        snapshot.forEach((doc) => {
          const { date, amount, category } = doc.data();
          const parsedDate = parseDate(date);
          if (
            parsedDate &&
            parsedDate.getFullYear() === year &&
            typeof amount === "number"
          ) {
            const cat = category || "Uncategorized";
            categoryMap[cat] = (categoryMap[cat] || 0) + amount;
          }
        });

        const formattedData = Object.entries(categoryMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        setData(formattedData);
      } catch (err) {
        console.error("Failed to fetch category data:", err);
        setError("Failed to load spending category data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [year, user]);

  return (
    <Card className="bg-[#161b33] text-white">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">Annual Spending by Category</h2>
        <p className="text-sm mb-4 text-muted-foreground">
          For {year}
        </p>
        
        {loading && (
          <div className="h-64 flex items-center justify-center text-gray-400">
            <span>Loading category data...</span>
          </div>
        )}
        
        {error && (
          <div className="h-64 flex items-center justify-center text-red-400">
            {error}
          </div>
        )}
        
        {!loading && !error && data.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={80}
                  labelLine={false}
                  isAnimationActive
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e213a",
                    borderRadius: 8,
                    border: "none",
                  }}
                  labelStyle={{ color: "#c3c3c3" }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value: number, name: string) => [
                    `₹${value.toFixed(2)}`,
                    name,
                  ]}
                />
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  wrapperStyle={{ color: "#fff", paddingTop: 16 }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {!loading && !error && data.length === 0 && (
          <div className="h-64 flex items-center justify-center text-gray-400">
            <span>No spending data for {year}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Monthly Comparison Chart Component
function MonthlyComparisonChart({ year }: { year: number }) {
  const { user } = useAuth();
  const [data, setData] = useState<{month: string, income: number, expenses: number, savings: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Move monthNames to useMemo to prevent recreation on each render
  const monthNames = useMemo(() => [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ], []);

  useEffect(() => {
    if (!user) return;

    const fetchMonthlyData = async () => {
      setLoading(true);
      setError(null);

      const monthly = monthNames.map((month) => ({
        month,
        income: 0,
        expenses: 0,
        savings: 0,
      }));

      try {
        const [incomeSnap, expenseSnap] = await Promise.all([
          getDocs(query(collection(db, "incomes"), where("userId", "==", user.uid))),
          getDocs(query(collection(db, "expenses"), where("userId", "==", user.uid))),
        ]);

        incomeSnap.forEach((doc) => {
          const { amount, date } = doc.data();
          const parsed = parseDate(date);
          if (parsed && parsed.getFullYear() === year && typeof amount === "number") {
            monthly[parsed.getMonth()].income += amount;
          }
        });

        expenseSnap.forEach((doc) => {
          const { amount, date } = doc.data();
          const parsed = parseDate(date);
          if (parsed && parsed.getFullYear() === year && typeof amount === "number") {
            monthly[parsed.getMonth()].expenses += amount;
          }
        });

        monthly.forEach((entry) => {
          entry.savings = entry.income - entry.expenses;
        });

        setData(monthly);
      } catch (error) {
        console.error("Failed to fetch monthly data:", error);
        setError("Failed to load monthly comparison data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [user, year, monthNames]);

  return (
    <Card className="bg-[#161b33] text-white">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">Monthly Financial Comparison</h2>
        <p className="text-sm mb-4 text-muted-foreground">
          Income vs Expenses vs Savings for {year}
        </p>
        
        {loading && (
          <div className="h-64 flex items-center justify-center text-gray-400">
            <span>Loading monthly data...</span>
          </div>
        )}
        
        {error && (
          <div className="h-64 flex items-center justify-center text-red-400">
            {error}
          </div>
        )}
        
        {!loading && !error && data.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3652" />
                <XAxis dataKey="month" stroke="#c3c3c3" />
                <YAxis stroke="#c3c3c3" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e213a", borderRadius: 8 }}
                  labelStyle={{ color: "#c3c3c3" }}
                  formatter={(value: number, name: string) => [
                    `₹${value.toFixed(2)}`,
                    name.charAt(0).toUpperCase() + name.slice(1),
                  ]}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />
                <Bar dataKey="income" fill="#34d399" name="Income" />
                <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
                <Bar dataKey="savings" fill="#60a5fa" name="Savings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {!loading && !error && data.length === 0 && (
          <div className="h-64 flex items-center justify-center text-gray-400">
            <span>No data available for {year}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------- Main Component ----------
export default function FinancialSummaryPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
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
             Financial Summary
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Your comprehensive financial overview for <span className="font-semibold text-primary">{selectedYear}</span>. Track your yearly progress, analyze trends, and plan for the future.
          </p>
        </div>

        {/* Filters */}
        <div className="text-base md:text-lg mt-2 flex flex-wrap items-center gap-1 scroll-reveal">
          <span>Showing annual summary for</span>

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

        {/* Annual Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 scroll-reveal">
          <AnnualSummaryCard 
            title="Total Income" 
            icon={<TrendingUp className="h-5 w-5 text-green-400" />}
            year={selectedYear}
            type="income"
          />
          <AnnualSummaryCard 
            title="Total Expenses" 
            icon={<TrendingDown className="h-5 w-5 text-red-400" />}
            year={selectedYear}
            type="expense"
          />
          <AnnualSummaryCard 
            title="Net Savings" 
            icon={<ArrowUp className="h-5 w-5 text-blue-400" />}
            year={selectedYear}
            type="savings"
          />
          <AnnualSummaryCard 
            title="Avg. Monthly Savings" 
            icon={<BarChart2 className="h-5 w-5 text-purple-400" />}
            year={selectedYear}
            type="average"
          />
        </div>

        {/* Dashboard Charts - Bento Grid */}
        <div ref={cardsRef} className="bento-grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bento-card md:col-span-3">
            <SavingsTrendChart year={selectedYear} />
          </div>
          <div className="bento-card md:col-span-2">
            <IncomeExpenseChart year={selectedYear} />
          </div>
          <div className="bento-card md:col-span-1">
            <YearlySpendingCategoryChart year={selectedYear} />
          </div>
          <div className="bento-card md:col-span-3">
            <MonthlyComparisonChart year={selectedYear} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
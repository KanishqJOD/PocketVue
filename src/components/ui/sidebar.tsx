"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  IndianRupee,
  TrendingDown,
  User,
  Settings,
  Menu,
  X,
  FileUp,
  Home,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById("sidebar");
        const toggleBtn = document.getElementById("sidebar-toggle");
        
        if (sidebar && !sidebar.contains(e.target as Node) && 
            toggleBtn && !toggleBtn.contains(e.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [pathname]);

  const navItems = [
    { href: "/", icon: <Home className="w-5 h-5" />, label: "Dashboard" },
    { href: "/income", icon: <IndianRupee className="w-5 h-5" />, label: "Manage Income" },
    { href: "/expense", icon: <TrendingDown className="w-5 h-5" />, label: "Manage Expenses" },
    { href: "/upload-transactions", icon: <FileUp className="w-5 h-5" />, label: "Upload Transactions" },
    { href: "/statistics", icon: <BarChart2 className="w-5 h-5" />, label: "Statistics" },
    { href: "/account", icon: <User className="w-5 h-5" />, label: "Account" },
  ];

  return (
    <>
      {/* Toggle Button (Visible on small screens) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          id="sidebar-toggle"
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-primary/10 text-primary shadow-lg backdrop-blur-md border border-primary/20"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        id="sidebar"
        className={clsx(
          "fixed z-40 lg:static top-0 left-0 h-full w-72 bg-gradient-to-b from-black to-card text-foreground flex flex-col p-6 shadow-xl border-r border-border/30",
          "transition-all duration-300 ease-in-out",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
            "lg:translate-x-0": true,
          }
        )}
        initial={false}
        animate={{
          boxShadow: isOpen ? "10px 0 30px rgba(0,0,0,0.2)" : "none",
        }}
      >
        <Link href="/">
          <div className="mb-10 flex flex-col items-start">
            <motion.h1 
              className="text-2xl font-extrabold tracking-tight flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-3xl">💸</span> PocketVue
            </motion.h1>
            <motion.p 
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Your Finance Assistant
            </motion.p>
          </div>
        </Link>
        
        <nav className="flex-1 space-y-2 text-sm">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || 
                          (item.href !== "/" && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-primary/10 hover:text-primary hover:translate-x-1",
                  isActive 
                    ? "bg-primary/20 text-primary font-medium border-l-4 border-primary" 
                    : "border-l-4 border-transparent"
                )}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05 * index }}
                >
                  {item.icon}
                </motion.div>
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    className="ml-auto h-2 w-2 rounded-full bg-primary"
                    layoutId="activeIndicator"
                  />
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-4 border-t border-border/30 text-xs text-muted-foreground">
          <p>© 2025 PocketVue</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </motion.aside>
    </>
  );
}

export { Sidebar };

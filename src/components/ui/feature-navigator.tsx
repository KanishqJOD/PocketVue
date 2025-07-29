import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
// Remove cn import if not used
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  IndianRupee, TrendingDown, BarChart2, FileUp,
  ArrowRight, ArrowUpRight, Home, 
  // Remove Sparkles import
} from 'lucide-react';

type FeatureType = 'income' | 'expense' | 'statistics' | 'upload' | 'dashboard';

interface FeatureData {
  id: FeatureType;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  nextFeatures: FeatureType[];
  nextSteps: string[];
}

export function FeatureNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentFeature, setCurrentFeature] = useState<FeatureType | null>(null);
  
  // Define all features with their connections and next steps
  const features: Record<FeatureType, FeatureData> = {
    dashboard: {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Your financial overview',
      icon: <Home className="h-5 w-5" />,
      path: '/dashboard',
      color: 'from-blue-600 to-blue-800',
      nextFeatures: ['income', 'expense', 'statistics'],
      nextSteps: ['Add your income sources', 'Track your expenses', 'View detailed statistics']
    },
    income: {
      id: 'income',
      title: 'Income Management',
      description: 'Track your earnings',
      icon: <IndianRupee className="h-5 w-5" />,
      path: '/income',
      color: 'from-green-600 to-green-800',
      nextFeatures: ['expense', 'statistics', 'upload'],
      nextSteps: ['Record your expenses', 'View income analytics', 'Upload income statements']
    },
    expense: {
      id: 'expense',
      title: 'Expense Management',
      description: 'Control your spending',
      icon: <TrendingDown className="h-5 w-5" />,
      path: '/expense',
      color: 'from-red-600 to-red-800',
      nextFeatures: ['income', 'statistics', 'upload'],
      nextSteps: ['Add more income sources', 'Analyze spending patterns', 'Upload expense receipts']
    },
    statistics: {
      id: 'statistics',
      title: 'Statistics',
      description: 'Visualize your finances',
      icon: <BarChart2 className="h-5 w-5" />,
      path: '/statistics',
      color: 'from-purple-600 to-purple-800',
      nextFeatures: ['income', 'expense', 'dashboard'],
      nextSteps: ['Update your income', 'Review your expenses', 'Return to dashboard']
    },
    upload: {
      id: 'upload',
      title: 'Upload Transactions',
      description: 'Import financial data',
      icon: <FileUp className="h-5 w-5" />,
      path: '/upload-transactions',
      color: 'from-amber-600 to-amber-800',
      nextFeatures: ['income', 'expense', 'statistics'],
      nextSteps: ['Verify imported income', 'Check expense categories', 'View updated statistics']
    }
  };

  // Determine current feature based on pathname
  useEffect(() => {
    if (pathname.includes('/income')) setCurrentFeature('income');
    else if (pathname.includes('/expense')) setCurrentFeature('expense');
    else if (pathname.includes('/statistics')) setCurrentFeature('statistics');
    else if (pathname.includes('/upload-transactions')) setCurrentFeature('upload');
    else if (pathname.includes('/dashboard')) setCurrentFeature('dashboard');
    else setCurrentFeature(null);
  }, [pathname]);

  // If not on a feature page, don't show the navigator
  if (!currentFeature) return null;

  const current = features[currentFeature];
  
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="bg-black/80 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full bg-gradient-to-br ${current.color}`}>
              {current.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Currently in: {current.title}</h3>
              <p className="text-xs text-white/70">{current.description}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white"
            onClick={() => router.push('/dashboard')}
          >
            <Home className="h-4 w-4 mr-1" /> Dashboard
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {current.nextFeatures.map((featureId, index) => {
            const feature = features[featureId];
            return (
              <Link href={feature.path} key={featureId}>
                <Card className="bg-white/5 hover:bg-white/10 border-white/10 transition-all duration-300 p-3 h-full">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full bg-gradient-to-br ${feature.color}`}>
                        {feature.icon}
                      </div>
                      <span className="text-sm font-medium text-white">{feature.title}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-white/50" />
                  </div>
                  <p className="text-xs text-white/70 mt-2 pl-8">
                    {current.nextSteps[index]}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
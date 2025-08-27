'use client';

import { motion } from 'framer-motion';
import { TimelineData } from '@/types/blog';

interface TimelineNavigationProps {
  years: number[];
  selectedYear: number | null;
  selectedMonth: number | null;
  onYearSelect: (year: number) => void;
  onMonthSelect: (month: number) => void;
  timelineData: TimelineData;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function TimelineNavigation({
  years,
  selectedYear,
  selectedMonth,
  onYearSelect,
  onMonthSelect,
  timelineData
}: TimelineNavigationProps) {
  const getMonthsForYear = (year: number): number[] => {
    if (!timelineData[year]) return [];
    return Object.keys(timelineData[year]).map(Number).sort((a, b) => b - a);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Navigate Timeline</h3>
      
      {/* Years Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {years.map(year => {
            const postCount = Object.values(timelineData[year] || {}).reduce(
              (total, monthPosts) => total + monthPosts.length, 
              0
            );
            
            return (
              <motion.button
                key={year}
                onClick={() => onYearSelect(year)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${selectedYear === year
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white'
                  }
                `}
              >
                {year}
                <span className="ml-1 text-xs opacity-75">({postCount})</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Months Navigation */}
      {selectedYear && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-slate-600 pt-4"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            Months in {selectedYear}
          </h4>
          <div className="flex flex-wrap gap-2">
            {getMonthsForYear(selectedYear).map(month => {
              const postCount = timelineData[selectedYear]?.[month]?.length || 0;
              
              return (
                <motion.button
                  key={month}
                  onClick={() => onMonthSelect(month)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                    ${selectedMonth === month
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white'
                    }
                  `}
                >
                  {MONTHS[month]}
                  <span className="ml-1 text-xs opacity-75">({postCount})</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-slate-600">
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <div>
            <span className="font-medium text-white">{years.length}</span> years
          </div>
          <div>
            <span className="font-medium text-white">
              {Object.values(timelineData).reduce(
                (total, yearData) => total + Object.values(yearData).reduce(
                  (yearTotal, monthPosts) => yearTotal + monthPosts.length, 
                  0
                ), 
                0
              )}
            </span> total posts
          </div>
          {selectedYear && (
            <div>
              <span className="font-medium text-white">
                {Object.values(timelineData[selectedYear] || {}).reduce(
                  (total, monthPosts) => total + monthPosts.length, 
                  0
                )}
              </span> posts in {selectedYear}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
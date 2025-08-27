'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineData, BlogPostListItem, Tag } from '@/types/blog';
import TimelineNavigation from './TimelineNavigation';
import BlogPostCard from './BlogPostCard';
import TagFilter from './TagFilter';
import LoadingSpinner from '@/components/3d/LoadingSpinner';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BlogTimeline() {
  const [timelineData, setTimelineData] = useState<TimelineData>({});
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTimelineData();
    fetchTags();
  }, []);

  const fetchTimelineData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/timeline`);
      const data = await response.json();

      if (data.success) {
        setTimelineData(data.data);
        // Set initial year to the most recent year with posts
        const years = Object.keys(data.data).map(Number).sort((a, b) => b - a);
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } else {
        setError(data.error || 'Failed to load timeline');
      }
    } catch (err) {
      setError('Failed to load timeline');
      console.error('Timeline fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/tags`);
      const data = await response.json();

      if (data.success) {
        setTags(data.data);
      }
    } catch (err) {
      console.error('Tags fetch error:', err);
    }
  };

  const getFilteredPosts = (): BlogPostListItem[] => {
    let posts: BlogPostListItem[] = [];

    // Collect posts based on selected year/month
    if (selectedYear && timelineData[selectedYear]) {
      if (selectedMonth !== null && timelineData[selectedYear][selectedMonth]) {
        posts = timelineData[selectedYear][selectedMonth];
      } else {
        // Get all posts from the selected year
        Object.values(timelineData[selectedYear]).forEach(monthPosts => {
          posts.push(...monthPosts);
        });
      }
    } else {
      // Get all posts
      Object.values(timelineData).forEach(yearData => {
        Object.values(yearData).forEach(monthPosts => {
          posts.push(...monthPosts);
        });
      });
    }

    // Filter by tag if selected
    if (selectedTag) {
      posts = posts.filter(post => post.tags.includes(selectedTag));
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  };

  const scrollToYear = (year: number) => {
    const yearElement = document.getElementById(`year-${year}`);
    if (yearElement && timelineRef.current) {
      yearElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    scrollToYear(year);
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchTimelineData();
          }}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const years = Object.keys(timelineData).map(Number).sort((a, b) => b - a);
  const filteredPosts = getFilteredPosts();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation and Filters */}
      <div className="mb-8 space-y-6">
        <TimelineNavigation
          years={years}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearSelect={handleYearSelect}
          onMonthSelect={handleMonthSelect}
          timelineData={timelineData}
        />

        <TagFilter
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={handleTagSelect}
        />
      </div>

      {/* Timeline Content */}
      <div ref={timelineRef} className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 hidden md:block" />

        {years.map(year => (
          <motion.div
            key={year}
            id={`year-${year}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            {/* Year Header */}
            <div className="flex items-center mb-8">
              <div className="hidden md:block w-4 h-4 bg-blue-400 rounded-full border-4 border-slate-900 relative z-10" />
              <h2 className="text-3xl font-bold text-white ml-6 md:ml-8">
                {year}
              </h2>
            </div>

            {/* Months */}
            {Object.keys(timelineData[year] || {}).map(monthIndex => {
              const month = parseInt(monthIndex);
              const monthPosts = timelineData[year][month];

              // Filter posts by tag if selected
              const visiblePosts = selectedTag
                ? monthPosts.filter(post => post.tags.includes(selectedTag))
                : monthPosts;

              if (visiblePosts.length === 0 && selectedTag) return null;

              return (
                <motion.div
                  key={`${year}-${month}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mb-8 ml-0 md:ml-16"
                >
                  {/* Month Header */}
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-purple-400 rounded-full border-2 border-slate-900 hidden md:block" />
                    <h3 className="text-xl font-semibold text-gray-300 ml-0 md:ml-4">
                      {MONTHS[month]}
                    </h3>
                    <span className="text-sm text-gray-500 ml-2">
                      ({visiblePosts.length} post{visiblePosts.length !== 1 ? 's' : ''})
                    </span>
                  </div>

                  {/* Posts Grid */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                      {visiblePosts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <BlogPostCard post={post} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ))}

        {/* No Posts Message */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-xl mb-4">
              {selectedTag ? `No posts found with tag "${selectedTag}"` : 'No posts found'}
            </div>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Clear Filter
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
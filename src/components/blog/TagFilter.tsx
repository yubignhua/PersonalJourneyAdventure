'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Tag } from '@/types/blog';
import { useState } from 'react';

interface TagFilterProps {
  tags: Tag[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  
  const displayTags = showAllTags ? tags : tags.slice(0, 8);
  const hasMoreTags = tags.length > 8;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Filter by Topic</h3>
        {selectedTag && (
          <motion.button
            onClick={() => onTagSelect(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Clear Filter ✕
          </motion.button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <AnimatePresence>
          {displayTags.map((tag, index) => (
            <motion.button
              key={tag.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              onClick={() => onTagSelect(tag.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${selectedTag === tag.name
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white'
                }
              `}
            >
              {tag.name}
              <span className="ml-1 text-xs opacity-75">({tag.count})</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {hasMoreTags && (
        <motion.button
          onClick={() => setShowAllTags(!showAllTags)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          {showAllTags ? (
            <>
              Show Less
              <motion.span
                animate={{ rotate: showAllTags ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ↑
              </motion.span>
            </>
          ) : (
            <>
              Show {tags.length - 8} More Tags
              <motion.span
                animate={{ rotate: showAllTags ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ↓
              </motion.span>
            </>
          )}
        </motion.button>
      )}

      {/* Tag Cloud Visualization */}
      {tags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-600">
          <div className="text-xs text-gray-500 mb-2">Popular Topics</div>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 5).map((tag, index) => {
              const size = Math.max(0.7, Math.min(1.2, tag.count / Math.max(...tags.map(t => t.count))));
              return (
                <motion.span
                  key={tag.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ fontSize: `${size}rem` }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  onClick={() => onTagSelect(tag.name)}
                >
                  {tag.name}
                </motion.span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
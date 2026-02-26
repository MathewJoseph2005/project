// Skeleton Loading Components
import React from 'react';

export const SkeletonLoader = ({ count = 1, height = '20px', className = '' }) => {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-700 rounded animate-pulse ${className}`}
          style={{ height, minHeight: height }}
        />
      ))}
    </>
  );
};

export const UserCardSkeleton = () => (
  <div className="bg-gray-700 rounded-lg p-4 space-y-3 animate-pulse">
    <SkeletonLoader height="20px" className="w-1/2" />
    <SkeletonLoader height="16px" className="w-3/4" />
    <div className="flex gap-2">
      <SkeletonLoader height="24px" className="w-20" />
      <SkeletonLoader height="24px" className="w-20" />
    </div>
    <SkeletonLoader height="16px" className="w-1/3" />
    <SkeletonLoader height="40px" className="w-full" />
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 sm:p-6 shadow-xl animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <SkeletonLoader height="12px" className="w-1/2 mb-2" />
        <SkeletonLoader height="32px" className="w-2/3" />
      </div>
      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-600 rounded-lg" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-gray-700">
    <td className="py-3 px-4"><SkeletonLoader height="16px" /></td>
    <td className="py-3 px-4"><SkeletonLoader height="16px" /></td>
    <td className="py-3 px-4"><SkeletonLoader height="24px" className="w-20" /></td>
    <td className="py-3 px-4"><SkeletonLoader height="24px" className="w-16" /></td>
    <td className="py-3 px-4"><SkeletonLoader height="16px" /></td>
    <td className="py-3 px-4"><SkeletonLoader height="32px" className="w-20" /></td>
  </tr>
);

export const GameStatsSkeleton = () => (
  <div className="bg-gray-800 rounded-lg p-6 space-y-4 animate-pulse">
    <SkeletonLoader height="24px" className="w-1/3" />
    <div className="grid grid-cols-2 gap-4">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="bg-gray-700 rounded-lg p-4">
          <SkeletonLoader height="12px" className="w-1/2 mb-2" />
          <SkeletonLoader height="28px" className="w-2/3" />
        </div>
      ))}
    </div>
  </div>
);

export const PerformanceSkeleton = () => (
  <div className="bg-gray-800 rounded-lg p-6 space-y-4 animate-pulse">
    <SkeletonLoader height="20px" className="w-1/4" />
    <div className="space-y-3">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <SkeletonLoader height="14px" className="w-1/4" />
          <SkeletonLoader height="14px" className="w-1/6" />
        </div>
      ))}
    </div>
  </div>
);

// Shimmer effect for more fancy loading
export const ShimmerEffect = ({ className = '' }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer" />
  </div>
);

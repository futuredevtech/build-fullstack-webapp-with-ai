import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse rounded-md bg-slate-800/80',
          className
        )
      )}
      {...props}
    />
  )
}

export const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
      <Skeleton className="w-full aspect-video rounded-xl" />
      <div className="space-y-2">
        <div className="flex gap-2">
          <Skeleton className="w-16 h-5 rounded-full" />
          <Skeleton className="w-20 h-5 rounded-full" />
        </div>
        <Skeleton className="w-4/5 h-6 rounded" />
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-3/4 h-4 rounded" />
      </div>
      <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
        <Skeleton className="w-24 h-4 rounded" />
        <Skeleton className="w-20 h-8 rounded-lg" />
      </div>
    </div>
  )
}

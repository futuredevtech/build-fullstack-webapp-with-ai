import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from './Button'

export interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-rose-900/40 bg-rose-950/20 backdrop-blur-sm max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-600/40 flex items-center justify-center text-rose-400 mb-4 shadow-inner">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-rose-200">{title}</h3>
      <p className="mt-2 text-sm text-slate-300 max-w-sm leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <div className="mt-6">
          <Button
            variant="outline"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={onRetry}
            className="border-rose-700/60 text-rose-200 hover:bg-rose-900/30"
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  )
}

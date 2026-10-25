import React, { useState, useEffect } from 'react'
import {
  BUNDLED_COURSE_ARTWORK,
  DEFAULT_COURSE_THUMBNAIL,
  isValidHttpsImageUrl,
  testImageLoad,
} from '@/lib/utils/imageUrl'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Check, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react'

export interface CourseArtworkPickerProps {
  value: string
  onChange: (newUrl: string) => void
  onValidityChange?: (isValid: boolean) => void
  disabled?: boolean
}

export const CourseArtworkPicker: React.FC<CourseArtworkPickerProps> = ({
  value,
  onChange,
  onValidityChange,
  disabled = false,
}) => {
  const isCustomUrl = value && value.startsWith('https://')
  const [mode, setMode] = useState<'bundled' | 'custom'>(isCustomUrl ? 'custom' : 'bundled')
  const [customInput, setCustomInput] = useState(isCustomUrl ? value : '')
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle')
  const [testError, setTestError] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'bundled') {
      onValidityChange?.(true)
      setTestingStatus('idle')
      setTestError(null)
    } else {
      if (!customInput) {
        onValidityChange?.(false)
        setTestingStatus('idle')
        setTestError('A valid HTTPS image URL is required.')
      } else if (!isValidHttpsImageUrl(customInput)) {
        onValidityChange?.(false)
        setTestingStatus('invalid')
        setTestError('URL must use direct HTTPS protocol (e.g. https://cdn.example.com/image.jpg)')
      } else {
        // Test loading
        let cancelled = false
        setTestingStatus('testing')
        setTestError(null)

        testImageLoad(customInput).then((loaded) => {
          if (cancelled) return
          if (loaded) {
            setTestingStatus('valid')
            setTestError(null)
            onValidityChange?.(true)
            onChange(customInput.trim())
          } else {
            setTestingStatus('invalid')
            setTestError('Browser failed to load this image. Check permissions, CORS, or URL format.')
            onValidityChange?.(false)
          }
        })

        return () => {
          cancelled = true
        }
      }
    }
  }, [mode, customInput, onChange, onValidityChange])

  const handleSelectBundled = (path: string) => {
    onChange(path)
    onValidityChange?.(true)
  }

  return (
    <div className="space-y-4 rounded-2xl bg-slate-900 border border-slate-800 p-5 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <label className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            Course Artwork &amp; Thumbnail
          </label>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose bundled zero-cost SVG artwork or enter a direct public HTTPS image URL.
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 shrink-0">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setMode('bundled')
              if (!value || value.startsWith('https://')) {
                onChange(DEFAULT_COURSE_THUMBNAIL)
              }
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              mode === 'bundled'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bundled Artwork
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setMode('custom')
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              mode === 'custom'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Public HTTPS URL
          </button>
        </div>
      </div>

      {/* Mode 1: Bundled Artwork Selection */}
      {mode === 'bundled' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Select one of the built-in SVG course illustrations (recommended for zero-latency, free-tier hosting):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {BUNDLED_COURSE_ARTWORK.map((item) => {
              const isSelected = value === item.path
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectBundled(item.path)}
                  className={`group relative rounded-xl overflow-hidden border-2 p-1.5 transition-all text-left bg-slate-950/60 focus:outline-none ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-900">
                    <img
                      src={item.path}
                      alt={item.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-300 truncate">
                      {item.label}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Custom HTTPS Image URL */}
      {mode === 'custom' && (
        <div className="space-y-4">
          <Input
            label="Direct HTTPS Image URL"
            placeholder="https://images.example.com/course-banner.jpg"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            disabled={disabled}
            hint="Must be a direct, publicly accessible HTTPS image link. Data URLs and file uploads are disabled."
            error={testError || undefined}
          />

          {/* Live Preview Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Live Preview &amp; Verification</span>
              {testingStatus === 'testing' && (
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying image load...
                </span>
              )}
              {testingStatus === 'valid' && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Verified browser loadable
                </span>
              )}
              {testingStatus === 'invalid' && (
                <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> Failed to load
                </span>
              )}
            </div>

            <div className="relative aspect-video max-w-sm rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
              {testingStatus === 'valid' && customInput ? (
                <img
                  src={customInput}
                  alt="Artwork preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center text-slate-500">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs">
                    {testingStatus === 'testing'
                      ? 'Loading preview...'
                      : testingStatus === 'invalid'
                      ? 'Preview unavailable — please fix URL or switch to bundled artwork'
                      : 'Enter a valid HTTPS image URL above to preview'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

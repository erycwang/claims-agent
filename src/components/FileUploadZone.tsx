import { useRef, useState } from 'react'
import type { FileMetadata } from '../types/claims'

interface FileUploadZoneProps {
  label: string
  accept?: string
  files: FileMetadata[]
  onChange: (files: FileMetadata[]) => void
}

export function FileUploadZone({ label, accept = '*', files, onChange }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const newFiles: FileMetadata[] = Array.from(incoming).map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
    }))
    onChange([...files, ...newFiles])
  }

  const remove = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div>
      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
        {label} <span className="text-neutral-400 dark:text-neutral-600 font-normal text-xs">(optional)</span>
      </p>
      <div
        className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/5'
            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
      >
        <svg className="mx-auto mb-2 w-6 h-6 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          Drop files or <span className="text-violet-600 dark:text-violet-400">browse</span>
        </p>
        <input ref={inputRef} type="file" accept={accept} multiple className="hidden" onChange={e => addFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                {f.previewUrl ? (
                  <img src={f.previewUrl} alt="" className="w-7 h-7 rounded object-cover shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                <span className="text-neutral-700 dark:text-neutral-300 truncate text-xs">{f.name}</span>
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-neutral-300 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-300 ml-2 shrink-0 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

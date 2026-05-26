type TabNavTab = 'demo' | 'prd' | 'architecture'

interface TabNavProps {
  active: TabNavTab
  onDemo: () => void
  onPrd: () => void
  onArchitecture: () => void
}

export function TabNav({ active, onDemo, onPrd, onArchitecture }: TabNavProps) {
  const tabs: { id: TabNavTab; label: string; onClick: () => void }[] = [
    { id: 'demo', label: 'Demo', onClick: onDemo },
    { id: 'prd', label: 'PRD', onClick: onPrd },
    { id: 'architecture', label: 'Architecture', onClick: onArchitecture },
  ]

  return (
    <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden text-xs">
      {tabs.map((tab, i) => (
        <div key={tab.id} className="flex items-center">
          {i > 0 && <div className="w-px h-4 bg-neutral-200 shrink-0" />}
          <button
            type="button"
            onClick={active !== tab.id ? tab.onClick : undefined}
            className={`px-3 py-1.5 transition-colors ${
              active === tab.id
                ? 'bg-neutral-100 text-neutral-800 font-medium cursor-default'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 cursor-pointer'
            }`}
          >
            {tab.label}
          </button>
        </div>
      ))}
    </div>
  )
}

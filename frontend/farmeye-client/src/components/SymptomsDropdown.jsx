// src/components/SymptomsDropdown.jsx
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'

export default function SymptomsDropdown({ options, selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  // Cerrar dropdown al clickear fuera
  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const toggleOption = (opt) => {
    if (selected.includes(opt))
      onChange(selected.filter((s) => s !== opt))
    else
      onChange([...selected, opt])
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-green-50 border border-green-200 text-green-800 flex items-center justify-between px-4 py-2 rounded-xl focus:outline-none"
      >
        <div className="flex flex-wrap gap-2">
          {selected.length === 0
            ? <span className="text-green-700/60">Elige síntomas…</span>
            : selected.map((s) => (
                <span
                  key={s}
                  className="bg-green-200 text-green-800 px-2 py-1 rounded-full flex items-center gap-1 text-sm"
                >
                  {s}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleOption(s)
                    }}
                  />
                </span>
              ))
          }
        </div>
        <ChevronDown className="w-5 h-5 text-green-600" />
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-auto">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => toggleOption(opt)}
              className={`px-4 py-2 text-sm cursor-pointer 
                         ${selected.includes(opt) ? 'bg-green-50' : 'hover:bg-gray-100'}`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

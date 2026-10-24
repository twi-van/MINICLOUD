/** Decorative artwork; all values remain in the adjacent accessible text. */
export function StudentStatArtwork({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 100 76" fill="none" aria-hidden="true" focusable="false">
      {index === 0 ? (
        <g fill="currentColor">
          <circle cx="50" cy="20" r="13" />
          <circle cx="21" cy="29" r="10" opacity=".7" />
          <circle cx="79" cy="29" r="10" opacity=".7" />
          <path d="M27 70v-9a23 23 0 0 1 46 0v9H27Z" />
          <path
            d="M4 70v-8a18 18 0 0 1 24-17 29 29 0 0 0-7 19v6H4ZM79 70v-6a29 29 0 0 0-7-19 18 18 0 0 1 24 17v8H79Z"
            opacity=".65"
          />
        </g>
      ) : index === 1 ? (
        <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
          <path d="m18 52 50-10 19 8-50 12-19-10Z" fill="currentColor" fillOpacity=".12" />
          <path d="M18 52c-5 3-5 11 0 14l19 7 50-12M37 62v11M85 51v10" />
          <path d="m15 32 50-10 20 8-50 12-20-10Z" fill="currentColor" fillOpacity=".15" />
          <path d="M15 32c-5 3-5 11 0 14l20 7 50-12M35 42v11M83 31v10" />
          <path d="m19 12 50-9 20 8-50 11-20-10Z" fill="currentColor" fillOpacity=".2" />
          <path d="M19 12c-5 3-5 11 0 14l20 7 50-12M39 22v11M87 12v9" />
        </g>
      ) : (
        <g fill="currentColor">
          <rect x="9" y="54" width="15" height="18" rx="2" opacity=".35" />
          <rect x="31" y="39" width="15" height="33" rx="2" opacity=".55" />
          <rect x="53" y="23" width="15" height="49" rx="2" opacity=".75" />
          <rect x="75" y="6" width="15" height="66" rx="2" />
        </g>
      )}
    </svg>
  )
}

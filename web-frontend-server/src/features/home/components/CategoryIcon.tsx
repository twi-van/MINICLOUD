export function CategoryIcon({ index }: { index: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {index === 0 ? (
        <>
          <path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9" />
        </>
      ) : index === 1 ? (
        <>
          <rect x="5" y="3" width="14" height="18" rx="1" />
          <path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M10 21v-6h4v6" />
        </>
      ) : index === 2 ? (
        <>
          <circle cx="9" cy="7" r="3" />
          <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 13a5 5 0 0 1 3 5v3" />
        </>
      ) : (
        <>
          <rect x="3" y="4" width="18" height="17" rx="1" />
          <path d="M3 12h18M12 4v8M16 12v9M12 16h4" />
        </>
      )}
    </svg>
  )
}

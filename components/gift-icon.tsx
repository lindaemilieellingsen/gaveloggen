interface GiftIconProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function GiftIcon({ className = "", size = "md" }: GiftIconProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12 md:h-16 md:w-16",
  }

  return (
    <svg viewBox="0 0 100 100" className={`${sizeClasses[size]} ${className}`} fill="none">
      {/* Gift box base - varm kremhvit */}
      <rect x="15" y="45" width="70" height="45" rx="4" fill="#FDF8F0" stroke="#8B6914" strokeWidth="2" />
      {/* Gift box lid */}
      <rect x="10" y="35" width="80" height="15" rx="3" fill="#FDF8F0" stroke="#8B6914" strokeWidth="2" />
      {/* Vertical ribbon - bronse */}
      <rect x="45" y="35" width="10" height="55" fill="#A67C00" />
      {/* Horizontal ribbon */}
      <rect x="15" y="50" width="70" height="8" fill="#A67C00" />
      {/* Bow left loop - gull med bronse kant */}
      <ellipse cx="38" cy="30" rx="12" ry="10" fill="#C9A227" stroke="#8B6914" strokeWidth="1.5" />
      {/* Bow right loop */}
      <ellipse cx="62" cy="30" rx="12" ry="10" fill="#C9A227" stroke="#8B6914" strokeWidth="1.5" />
      {/* Bow center - mørkere bronse */}
      <circle cx="50" cy="32" r="6" fill="#8B6914" />
      {/* Ribbon tails */}
      <path d="M44 38 L38 55 L42 52 L46 38" fill="#A67C00" />
      <path d="M56 38 L62 55 L58 52 L54 38" fill="#A67C00" />
    </svg>
  )
}

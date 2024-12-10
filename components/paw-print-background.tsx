export function PawPrintBackground() {
  return (
    <div 
      className="fixed inset-0 w-full h-full z-0 opacity-20"
      style={{
        backgroundImage: `url('/footprint.png')`,
        backgroundSize: '100px',
        backgroundRepeat: 'repeat',
        pointerEvents: 'none'
      }}
    />
  )
}


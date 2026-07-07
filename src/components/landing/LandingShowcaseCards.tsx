function EmvChip() {
  return (
    <div
      className="w-7 h-5 sm:w-9 sm:h-7 rounded-md shrink-0"
      style={{
        background:
          "linear-gradient(135deg, #f5d76e 0%, #d4a84b 40%, #c9a227 60%, #e8c547 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.15)",
      }}
      aria-hidden
    />
  );
}

function MastercardLogo() {
  return (
    <div className="flex -space-x-1.5 sm:-space-x-2" aria-hidden>
      <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500/90" />
      <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400/90" />
    </div>
  );
}

const WALLET_CARDS = [
  {
    gradient: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
    network: "VISA",
    networkType: "visa" as const,
    last4: "2141",
    name: "Rahul Sharma",
    balance: "₹2,34,000",
    rotate: -5,
  },
  {
    gradient: "linear-gradient(145deg, #4b5563 0%, #1f2937 50%, #030712 100%)",
    network: "Mastercard",
    networkType: "mastercard" as const,
    last4: "7812",
    name: "Priya Mehta",
    balance: "₹94,000",
    rotate: 2,
  },
  {
    gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    network: "VISA",
    networkType: "visa" as const,
    last4: "4502",
    name: "Amit Verma",
    balance: "₹1,45,500",
    rotate: -2,
  },
  {
    gradient: "linear-gradient(135deg, #f472b6 0%, #fb923c 70%, #fdba74 100%)",
    network: "RuPay",
    networkType: "rupay" as const,
    last4: "8976",
    name: "Neha Kapoor",
    balance: "₹87,300",
    rotate: 5,
  },
];

export function LandingShowcaseCards() {
  return (
    <section id="how-it-works" className="pt-2 pb-12 sm:pt-4 sm:pb-16 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="landing-wallet-container rounded-[32px] p-6 sm:p-10">
          <div className="landing-wallet-stack">
            {WALLET_CARDS.map((card, index) => (
              <div
                key={card.last4}
                className="landing-wallet-card"
                style={{
                  zIndex: index + 1,
                  ["--card-rotate" as string]: `${card.rotate}deg`,
                }}
              >
                <div
                  className="landing-wallet-card-inner text-white"
                  style={{
                    background: card.gradient,
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_55%)] pointer-events-none rounded-[inherit]" />

                  <div className="relative flex justify-between items-start">
                    <EmvChip />
                    {card.networkType === "mastercard" ? (
                      <MastercardLogo />
                    ) : (
                      <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.12em] opacity-95">
                        {card.network}
                      </span>
                    )}
                  </div>

                  <div className="relative min-w-0">
                    <p className="text-base sm:text-lg font-mono tracking-[0.2em] font-medium">
                      •••• {card.last4}
                    </p>
                    <p className="text-xs mt-1.5 opacity-90 font-medium">
                      {card.name}
                    </p>
                  </div>

                  <div className="relative flex justify-between items-end gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider opacity-75 font-medium">
                        Available balance
                      </p>
                      <p className="text-sm font-bold mt-0.5">{card.balance}</p>
                    </div>
                    {card.networkType === "mastercard" && (
                      <span className="text-[8px] sm:text-[10px] font-bold tracking-wider opacity-80 shrink-0">
                        mastercard
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 sm:mt-10 text-center text-sm text-slate-500 font-medium">
            🔒 Your statements never leave your device. No bank login required.
          </p>
        </div>
      </div>
    </section>
  );
}

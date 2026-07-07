const BANKS = [
  { name: "HDFC BANK", color: "#004C8F" },
  { name: "ICICI Bank", color: "#F58220" },
  { name: "SBI", color: "#22409A" },
  { name: "AXIS BANK", color: "#971237" },
  { name: "kotak", color: "#ED1C24" },
  { name: "YES BANK", color: "#004B8D" },
];

export function LandingBanks() {
  return (
    <section id="pricing" className="py-16 sm:py-20 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-medium text-slate-500 mb-8">
          Works with all major banks in India
        </p>
        <div className="inline-flex flex-wrap justify-center items-center gap-4 sm:gap-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/80 px-8 sm:px-10 py-6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]">
          {BANKS.map((bank) => (
            <span
              key={bank.name}
              className="text-xs sm:text-sm font-bold tracking-tight"
              style={{ color: bank.color }}
            >
              {bank.name}
            </span>
          ))}
          <span className="text-xs sm:text-sm font-medium text-slate-400">+ 100+ more</span>
        </div>
      </div>
    </section>
  );
}

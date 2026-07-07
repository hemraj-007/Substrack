const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    iconBg: "bg-violet-100 text-violet-500",
    title: "Smart Statement Analysis",
    description:
      "Upload any bank statement. Our AI instantly detects recurring subscriptions and payments.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    iconBg: "bg-emerald-100 text-emerald-500",
    title: "Renewal Reminders",
    description:
      "Get notified before any charge hits your account. Never miss or forget a renewal again.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    iconBg: "bg-orange-100 text-orange-500",
    title: "Spending Insights",
    description:
      "Visualize your spending patterns and discover opportunities to save more.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    iconBg: "bg-sky-100 text-sky-500",
    title: "AI Savings",
    description:
      "Get personalized tips and recommendations to cut unnecessary subscriptions.",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="pt-6 pb-16 sm:pt-8 sm:pb-20 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-block rounded-full bg-indigo-50 border border-indigo-100/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 mb-5">
            Powerful Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 tracking-tight leading-tight">
            Everything you need to stay on top
          </h2>
          <p className="mt-4 text-slate-500 text-base sm:text-lg leading-relaxed">
            Smart tracking, instant insights, better financial decisions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="landing-glass-card group rounded-3xl p-7 sm:p-8">
              <span
                className={`inline-flex w-12 h-12 rounded-2xl items-center justify-center ${feature.iconBg} transition-transform duration-300 group-hover:scale-110`}
              >
                {feature.icon}
              </span>
              <h3 className="mt-6 text-lg font-bold text-slate-900 tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              <span className="inline-block mt-6 text-sm font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

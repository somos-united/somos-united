export function HoldingPageContent({
  lead,
  contactLabel,
}: {
  lead: string;
  contactLabel: string;
}) {
  return (
    <main className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[linear-gradient(180deg,#C8C2F4_0%,#CBBDEC_45%,#D6B9E7_100%)] bg-[length:100%_220%] px-lg py-huge motion-safe:animate-[gradient-drift_14s_ease-in-out_infinite]">
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col">
        <p className="motion-safe:animate-[reveal_0.6s_cubic-bezier(0.16,1,0.3,1)_both] text-2xl font-normal text-ink md:text-3xl">
          {lead}
        </p>
        <h1 className="text-6xl font-black uppercase leading-[0.95] tracking-tight text-ink md:text-8xl">
          <span className="motion-safe:animate-[reveal_0.6s_cubic-bezier(0.16,1,0.3,1)_0.12s_both] block">
            Somos
          </span>
          <span className="motion-safe:animate-[reveal_0.6s_cubic-bezier(0.16,1,0.3,1)_0.24s_both] ml-[0.35em] block">
            United
          </span>
        </h1>
        <a
          href="mailto:tech@somosunited.ch"
          className="motion-safe:animate-[reveal_0.6s_cubic-bezier(0.16,1,0.3,1)_0.36s_both] mt-md inline-block text-xl text-ink underline decoration-1 underline-offset-4 transition-transform duration-200 hover:translate-x-1.5 md:text-2xl"
        >
          {contactLabel} →
        </a>
      </div>
    </main>
  );
}

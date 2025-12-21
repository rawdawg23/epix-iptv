interface GuaranteeSectionProps {
  brandName?: string;
  primaryColor?: string;
  guaranteeDays?: number;
}

export default function GuaranteeSection({ brandName = 'IPTV', primaryColor, guaranteeDays = 7 }: GuaranteeSectionProps) {
  const guaranteePoints = [
    'Full refund if credentials are not delivered',
    'Money back if service does not meet expectations',
    `No questions asked within ${guaranteeDays} days`,
    'Risk-free trial of all features',
  ];
  return (
    <section className="section-container bg-muted/30" id="guarantee">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              100% Money-Back Guarantee
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              With {brandName}, your satisfaction is our top priority. If your credentials are not delivered or your account is not working, we provide a risk-free solution to ensure you are fully satisfied. Access exclusive, top-quality content with ease and confidence.
            </p>
            
            <ul className="space-y-4 mb-8">
              {guaranteePoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>

            <a href="/pricing" className="btn-primary inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Start the Fun
            </a>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 rounded-full border-8 border-green-500/30 flex items-center justify-center relative">
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-5xl font-black text-green-500">{guaranteeDays}</span>
                    <span className="block text-xl font-bold text-green-400 uppercase tracking-wide">Day</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-green-500 rounded-full text-white font-bold text-sm uppercase tracking-wider shadow-lg">
                  Money Back Guaranteed
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-16 h-16">
                <svg className="w-full h-full text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

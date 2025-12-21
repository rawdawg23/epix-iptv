interface HowToPurchaseSectionProps {
  brandName?: string;
  primaryColor?: string;
}

const steps = [
  {
    number: 1,
    title: 'Choose Your Plan',
    description: 'Select the IPTV plan that best fits your viewing preferences. Whether you are looking for a basic package or an extensive plan with premium channels, we offer flexible options to suit your needs.',
  },
  {
    number: 2,
    title: 'Complete Your Payment',
    description: 'Securely complete your payment using one of our convenient methods. We support a variety of payment options to ensure a hassle-free transaction.',
  },
  {
    number: 3,
    title: 'Receive Your Account Details',
    description: 'Once your payment is processed, you will receive your account details instantly. Start enjoying your favorite live channels, movies, and on-demand content right away!',
  },
];

export default function HowToPurchaseSection({ brandName = 'IPTV', primaryColor }: HowToPurchaseSectionProps) {
  return (
    <section className="section-container bg-background" id="how-to-purchase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">
            How to Purchase Your IPTV?
          </h2>
          <p className="section-subtitle">
            Getting started is quick and easy. Follow these simple steps to begin streaming.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="step-card text-center">
              <div className="flex justify-center">
                <div className="step-number">{step.number}</div>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

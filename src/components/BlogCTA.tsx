interface BlogCTAProps {
  headline: string;
  description: string;
  couponCode?: string;
  couponDiscount?: string;
  primaryColor?: string;
  pricingLink?: string;
}

export default function BlogCTA({
  headline,
  description,
  couponCode,
  couponDiscount,
  primaryColor = '#3B82F6',
  pricingLink = '/pricing'
}: BlogCTAProps) {
  const handleCopyCode = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
    }
  };

  return (
    <div 
      className="my-12 rounded-lg p-8 text-center"
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}25)`,
        border: `1px solid ${primaryColor}30`
      }}
    >
      <h3 className="text-2xl font-bold mb-3" style={{ color: primaryColor }}>
        {headline}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
        {description}
      </p>

      {couponCode && (
        <div className="mb-6">
          <div className="inline-flex items-center gap-3 bg-background/80 rounded-lg px-4 py-3 border border-border">
            <span className="text-sm text-muted-foreground">Use code:</span>
            <code 
              className="font-mono font-bold text-lg px-3 py-1 rounded"
              style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
            >
              {couponCode}
            </code>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              title="Copy code"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          {couponDiscount && (
            <p className="mt-2 text-sm font-medium" style={{ color: primaryColor }}>
              Save {couponDiscount} on your subscription!
            </p>
          )}
        </div>
      )}

      <a
        href={pricingLink}
        className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg"
        style={{ backgroundColor: primaryColor }}
      >
        View Pricing Plans
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>

      <p className="mt-4 text-sm text-muted-foreground">
        100% Money Back Guarantee | Instant Activation | 24/7 Support
      </p>
    </div>
  );
}

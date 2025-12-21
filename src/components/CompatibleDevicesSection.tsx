interface CompatibleDevicesSectionProps {
  brandName?: string;
  primaryColor?: string;
}

const devices = [
  { name: 'LG', subtitle: 'Smart TV', icon: 'tv' },
  { name: 'Boitier IPTV', subtitle: 'Set-top boxes', icon: 'box' },
  { name: 'Apple', subtitle: 'iPhone & iPad', icon: 'apple' },
  { name: 'Android', subtitle: 'Phone & Tablets', icon: 'android' },
  { name: 'Mac & PC', subtitle: 'Laptop/Desktop', icon: 'laptop' },
  { name: 'Decodeur IPTV', subtitle: 'IPTV Receiver', icon: 'router' },
];

export default function CompatibleDevicesSection({ brandName = 'IPTV', primaryColor }: CompatibleDevicesSectionProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'tv':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth={1.5} />
            <path strokeLinecap="round" strokeWidth={1.5} d="M8 21h8" />
          </svg>
        );
      case 'box':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="4" y="8" width="16" height="10" rx="1" strokeWidth={1.5} />
            <path strokeLinecap="round" strokeWidth={1.5} d="M8 12h2M14 12h2" />
          </svg>
        );
      case 'apple':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        );
      case 'android':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 10H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zM5 14h14M9 6l-2 4M15 6l2 4M9 6h6" />
          </svg>
        );
      case 'laptop':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="4" width="18" height="12" rx="2" strokeWidth={1.5} />
            <path strokeLinecap="round" strokeWidth={1.5} d="M2 20h20" />
          </svg>
        );
      case 'router':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="11" width="18" height="8" rx="2" strokeWidth={1.5} />
            <path strokeLinecap="round" strokeWidth={1.5} d="M7 15h.01M11 15h.01M8 11V7a4 4 0 018 0v4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="section-container bg-muted/30" id="devices">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">
            Compatible with all your <span className="text-gradient">Devices</span>
          </h2>
          <p className="section-subtitle">
            Watch anywhere, anytime. {brandName} works seamlessly on all your favorite devices.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {devices.map((device) => (
            <div key={device.name} className="device-card">
              <div className="text-muted-foreground mb-3 flex justify-center">
                {getIcon(device.icon)}
              </div>
              <h3 className="font-bold text-sm">{device.name}</h3>
              <p className="text-xs text-muted-foreground">{device.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

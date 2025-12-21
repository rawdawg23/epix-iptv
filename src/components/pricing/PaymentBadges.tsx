import { Shield } from 'lucide-react';

export default function PaymentBadges() {
  return (
    <div className="flex flex-col items-center gap-2 mt-4 pt-4 border-t border-border/30">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
        <Shield className="w-3 h-3" />
        <span>Guaranteed Safe & Secure Checkout</span>
      </div>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="text-[10px] px-2 py-0.5 bg-muted/50 rounded font-medium">McAfee SECURE</span>
        <span className="text-[10px] px-2 py-0.5 bg-[#1a1f71] text-white rounded font-bold">VISA</span>
        <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-[#eb001b] to-[#f79e1b] text-white rounded font-bold">MC</span>
        <span className="text-[10px] px-2 py-0.5 bg-[#006fcf] text-white rounded font-bold">AMEX</span>
        <span className="text-[10px] px-2 py-0.5 bg-[#003087] text-white rounded font-bold">PayPal</span>
      </div>
    </div>
  );
}

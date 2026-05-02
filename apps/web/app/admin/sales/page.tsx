import { Wrench } from "lucide-react";

export default function SalesStub() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="font-cormorant text-4xl text-charcoal mb-4">POS Sales</h1>
      <p className="font-inter text-beige-300 mb-8">View completed transactions from the physical shop floors.</p>
      
      <div className="bg-gold-50 border border-gold/20 p-12 flex flex-col items-center justify-center text-center">
        <Wrench className="w-12 h-12 text-gold-400 mb-4" />
        <h2 className="font-cormorant text-2xl text-gold-600 mb-2">Coming in Phase C</h2>
        <p className="font-inter text-sm text-gold-500 max-w-md">
          This module will provide a detailed log of all receipts, refunds, and cashier shifts from the POS system.
        </p>
      </div>
    </div>
  );
}

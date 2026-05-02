import { Wrench } from "lucide-react";

export default function StaffStub() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="font-cormorant text-4xl text-charcoal mb-4">Staff Directory</h1>
      <p className="font-inter text-beige-300 mb-8">Manage employee accounts, roles, and shop assignments.</p>
      
      <div className="bg-gold-50 border border-gold/20 p-12 flex flex-col items-center justify-center text-center">
        <Wrench className="w-12 h-12 text-gold-400 mb-4" />
        <h2 className="font-cormorant text-2xl text-gold-600 mb-2">Coming in Phase B+</h2>
        <p className="font-inter text-sm text-gold-500 max-w-md">
          This module will allow you to create new staff accounts for the POS, manage passwords, and view staff performance.
        </p>
      </div>
    </div>
  );
}

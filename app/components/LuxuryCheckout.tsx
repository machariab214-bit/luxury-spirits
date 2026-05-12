'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Apple, CreditCard, AlertCircle } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface CheckoutState {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const initialState: CheckoutState = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
};

export default function LuxuryCheckout() {
  const [step, setStep] = useState(1); // 1: Contact, 2: Shipping, 3: Payment
  const [formData, setFormData] = useState<CheckoutState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    }

    if (stepNum === 2) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.zipCode) newErrors.zipCode = 'Zip code is required';
    }

    if (stepNum === 3) {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepChange = (nextStep: number) => {
    if (validateStep(step)) {
      setStep(nextStep);
      trackEvent('checkout_step_completed', {
        step: step,
        form_filled: true,
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsProcessing(true);
    trackEvent('checkout_submission', {
      step: 3,
      email: formData.email,
    });

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      trackEvent('checkout_completed', {
        email: formData.email,
        total_amount: 349.0,
        currency: 'KSH',
      });

      setStep(4); // Success state
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ submit: 'Payment failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left: Secure Form */}
        <div className="space-y-8">

          {/* Progress Bar */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`h-1 flex-1 rounded ${step >= 1 ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
            <div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
            <div className={`h-1 flex-1 rounded ${step >= 3 ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
          </div>

          <AnimatePresence mode="wait">

            {/* Step 1: Contact Information */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-serif">Contact Information</h2>

                {/* Apple Pay Button */}
                <button
                  onClick={() => trackEvent('apple_pay_clicked', {})}
                  className="w-full py-4 bg-white text-black rounded-xl flex items-center justify-center gap-2 font-bold mb-6 hover:bg-gray-100 transition-colors"
                >
                  <Apple fill="black" size={20} />
                  Pay
                </button>

                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">
                    Or pay with card
                  </span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email for order tracking"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-white/5 border ${
                      errors.email ? 'border-red-500' : 'border-white/10'
                    } p-4 rounded-xl focus:border-[#D4AF37] outline-none transition-colors`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>

                <button
                  onClick={() => handleStepChange(2)}
                  className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl uppercase tracking-widest hover:bg-[#FFBF00] transition-colors"
                >
                  Continue to Shipping
                </button>
              </motion.div>
            )}

            {/* Step 2: Shipping Information */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-serif">Shipping Address</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border ${
                        errors.firstName ? 'border-red-500' : 'border-white/10'
                      } p-4 rounded-xl focus:border-[#D4AF37] outline-none`}
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full bg-white/5 border ${
                        errors.lastName ? 'border-red-500' : 'border-white/10'
                      } p-4 rounded-xl focus:border-[#D4AF37] outline-none`}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full bg-white/5 border ${
                    errors.address ? 'border-red-500' : 'border-white/10'
                  } p-4 rounded-xl focus:border-[#D4AF37] outline-none`}
                />
                {errors.address && (
                  <p className="text-red-400 text-sm">{errors.address}</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full bg-white/5 border ${
                      errors.city ? 'border-red-500' : 'border-white/10'
                    } p-4 rounded-xl focus:border-[#D4AF37] outline-none`}
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full bg-white/5 border ${
                      errors.zipCode ? 'border-red-500' : 'border-white/10'
                    } p-4 rounded-xl focus:border-[#D4AF37] outline-none`}
                  />
                </div>
                {(errors.city || errors.zipCode) && (
                  <p className="text-red-400 text-sm">
                    {errors.city || errors.zipCode}
                  </p>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl uppercase tracking-widest hover:bg-white/20 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleStepChange(3)}
                    className="flex-1 py-4 bg-[#D4AF37] text-black font-bold rounded-xl uppercase tracking-widest hover:bg-[#FFBF00] transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-serif">Payment Details</h2>

                {errors.submit && (
                  <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-xl flex gap-3">
                    <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                    <p className="text-red-200">{errors.submit}</p>
                  </div>
                )}

                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  maxLength={19}
                  className={`w-full bg-white/5 border ${
                    errors.cardNumber ? 'border-red-500' : 'border-white/10'
                  } p-4 rounded-xl focus:border-[#D4AF37] outline-none`}
                />
                {errors.cardNumber && (
                  <p className="text-red-400 text-sm">{errors.cardNumber}</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    maxLength={5}
                    className={`w-full bg-white/5 border ${
                      errors.expiryDate ? 'border-red-500' : 'border-white/10'
                    } p-4 rounded-xl focus:border-[#D4AF37] outline-none`}
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    maxLength={3}
                    className={`w-full bg-white/5 border ${
                      errors.cvv ? 'border-red-500' : 'border-white/10'
                    } p-4 rounded-xl focus:border-[#D4AF37] outline-none`}
                  />
                </div>
                {(errors.expiryDate || errors.cvv) && (
                  <p className="text-red-400 text-sm">
                    {errors.expiryDate || errors.cvv}
                  </p>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl uppercase tracking-widest hover:bg-white/20 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-[#D4AF37] text-black font-bold rounded-xl uppercase tracking-widest hover:bg-[#FFBF00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Complete Purchase'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Order Confirmation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-6 py-12"
              >
                <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="text-green-400" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-serif mb-2">Order Confirmed!</h2>
                  <p className="text-gray-400">
                    Confirmation sent to <span className="text-[#D4AF37]">{formData.email}</span>
                  </p>
                </div>
                <button className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl uppercase tracking-widest hover:bg-[#FFBF00] transition-colors">
                  Return to Home
                </button>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* Right: Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">

          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-6">
            <Lock size={14} />
            Secure Encryption Active
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">The Obsidian Reserve (750ml)</span>
              <span>KSH 34,900</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Priority White-Glove Shipping</span>
              <span className="text-green-500">FREE</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mb-6">
            <div className="flex justify-between items-end">
              <span className="text-xl font-serif">Total Due</span>
              <span className="text-3xl font-serif text-[#D4AF37]">
                KSH 34,900
              </span>
            </div>
          </div>

          {/* Scarcity & Security Info */}
          <div className="space-y-3">
            <div className="p-4 bg-amber-900/10 border border-amber-700/30 rounded-xl text-xs text-amber-200 leading-relaxed">
              <strong>Inventory Reserved:</strong> Your selection is held for{" "}
              <span className="font-mono text-white">09:54</span>. Items in cart
              are not guaranteed until checkout is complete.
            </div>

            <div className="p-4 bg-blue-900/10 border border-blue-700/30 rounded-xl text-xs text-blue-200 leading-relaxed flex gap-3">
              <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
              <span>Your payment is secured by industry-leading encryption</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

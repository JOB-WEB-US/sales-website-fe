'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  onSuccess: (details: { orderId: string; payerName?: string; payerEmail?: string }) => void;
  onError?: (err: any) => void;
  disabled?: boolean;
}

export default function PayPalButton({
  amount,
  currency = 'USD',
  onSuccess,
  onError,
  disabled = false,
}: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb'; // Default to standard 'sb' (Sandbox)
  const isSandbox = clientId === 'sb' || clientId.includes('sandbox') || process.env.NODE_ENV !== 'production';

  useEffect(() => {
    let isMounted = true;

    // Load PayPal JavaScript SDK dynamically
    const loadPayPalScript = () => {
      if (window.paypal) {
        if (isMounted) {
          setSdkReady(true);
          setLoading(false);
        }
        return;
      }

      const existingScript = document.getElementById('paypal-sdk-script');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          if (isMounted) {
            setSdkReady(true);
            setLoading(false);
          }
        });
        existingScript.addEventListener('error', () => {
          if (isMounted) {
            setScriptError('Failed to load PayPal SDK script');
            setLoading(false);
          }
        });
        return;
      }

      const script = document.createElement('script');
      script.id = 'paypal-sdk-script';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&components=buttons,funding-eligibility`;
      script.async = true;

      script.onload = () => {
        if (isMounted) {
          setSdkReady(true);
          setLoading(false);
        }
      };

      script.onerror = () => {
        if (isMounted) {
          setScriptError('Unable to connect to PayPal SDK. Sandbox mode enabled.');
          setLoading(false);
        }
      };

      document.body.appendChild(script);
    };

    loadPayPalScript();

    return () => {
      isMounted = false;
    };
  }, [clientId, currency]);

  useEffect(() => {
    if (!sdkReady || !window.paypal || !containerRef.current) return;

    // Clear previous buttons if re-rendering
    containerRef.current.innerHTML = '';

    try {
      window.paypal
        .Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 48,
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount.toFixed(2),
                  },
                  description: 'VELORA TEES Graphic Apparel Order',
                },
              ],
            });
          },
          onApprove: async (data: any, actions: any) => {
            setIsProcessing(true);
            try {
              const details = await actions.order.capture();
              const payerName = details.payer?.name?.given_name 
                ? `${details.payer.name.given_name} ${details.payer.name.surname || ''}`.trim()
                : 'Customer';
              const payerEmail = details.payer?.email_address;
              const orderId = details.id || `PAYPAL-${Math.floor(100000 + Math.random() * 900000)}`;

              onSuccess({
                orderId,
                payerName,
                payerEmail,
              });
            } catch (err) {
              console.error('PayPal capture error:', err);
              if (onError) onError(err);
            } finally {
              setIsProcessing(false);
            }
          },
          onError: (err: any) => {
            console.error('PayPal Button Error:', err);
            if (onError) onError(err);
          },
        })
        .render(containerRef.current);
    } catch (e) {
      console.warn('PayPal button render exception:', e);
    }
  }, [sdkReady, amount, currency, onSuccess, onError]);



  return (
    <div className="space-y-4 pt-2">


      {loading && (
        <div className="flex items-center justify-center py-6 bg-[#161616] rounded-xl border border-[#262626] text-gray-400 text-xs gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#ff7700]" />
          <span>Connecting to PayPal Sandbox Gateway...</span>
        </div>
      )}

      {/* Official PayPal Buttons Container */}
      <div className={disabled || isProcessing ? 'opacity-50 pointer-events-none' : ''}>
        <div ref={containerRef} className="min-h-[96px] z-10" />
      </div>



      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Buyer Protection & 256-Bit Encrypted Checkout</span>
      </div>
    </div>
  );
}

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package } from 'lucide-react'

export default function OrderConfirmationPage({
  params,
}: {
  params: { orderNumber: string }
}) {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Message */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>

          <h1 className="text-3xl font-bold mb-2 text-foreground">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We&apos;re preparing your items for shipment.
          </p>

          {/* Order Number */}
          <div className="bg-muted p-4 rounded-lg mb-8">
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="text-2xl font-bold text-primary">{params.orderNumber}</p>
          </div>

          {/* What's Next */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-foreground">What&apos;s Next</h2>
            <div className="space-y-3 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                  </div>
                </div>
                <div>
                  <p className="font-medium text-foreground">Payment Processing</p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;re processing your payment and will send a confirmation email.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    2
                  </div>
                </div>
                <div>
                  <p className="font-medium text-foreground">Order Preparation</p>
                  <p className="text-sm text-muted-foreground">
                    Our warehouse will pick and pack your order carefully.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    3
                  </div>
                </div>
                <div>
                  <p className="font-medium text-foreground">Shipment</p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll send you a tracking number when your order ships.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/orders">
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <Package className="h-4 w-4 mr-2" />
                View Orders
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Have questions? We&apos;re here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a href="mailto:support@hardwaretools.com" className="text-primary hover:text-primary/80">
                Email: support@hardwaretools.com
              </a>
              <a href="tel:+254700000000" className="text-primary hover:text-primary/80">
                Phone: +254 700 000 000
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

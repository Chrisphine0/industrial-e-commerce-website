import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

export async function sendOrderConfirmationEmail(params: {
  to: string
  orderNumber: string
  customerName: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  shippingAddress: string
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping email")
    return { success: false, error: "Email not configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `HardwareTools <${fromEmail}>`,
      to: params.to,
      subject: `Order Confirmed #${params.orderNumber}`,
      html: `
        <html>
          <head />
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 30px; border-radius: 8px;">
              <h1 style="color: #1f2937;">✅ Order Confirmed!</h1>
              <p>Hi ${params.customerName},</p>
              <p>Thank you for your order. We've received your order and it's being processed.</p>
              <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin-top: 10px;">
                <p style="font-weight: bold;">Order #${params.orderNumber}</p>
                ${params.items.map(item => `
                  <div style="margin-bottom: 5px;">
                    <span>${item.name} × ${item.quantity}</span>
                    <span style="float: right;">$${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                `).join('')}
                <hr />
                <div>
                  <span style="font-weight: bold;">Total</span>
                  <span style="float: right; font-weight: bold;">$${params.total.toFixed(2)}</span>
                </div>
              </div>
              <p style="margin-top: 20px;">Shipping to: ${params.shippingAddress}</p>
              <p>We'll notify you when your order ships.</p>
              <p>— HardwareTools Team</p>
            </div>
          </body>
        </html>
      `,
    })
    if (error) console.error("Email error:", error)
    return { success: true, data }
  } catch (error) {
    console.error("Failed to send confirmation email:", error)
    return { success: false, error }
  }
}

export async function sendOrderShippedEmail(params: {
  to: string
  orderNumber: string
  customerName: string
  trackingNumber?: string
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping email")
    return { success: false, error: "Email not configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `HardwareTools <${fromEmail}>`,
      to: params.to,
      subject: `Your Order #${params.orderNumber} Has Shipped!`,
      html: `
        <html>
          <head />
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 30px; border-radius: 8px;">
              <h1 style="color: #2563eb;">🚚 Your Order Has Shipped!</h1>
              <p>Hi ${params.customerName},</p>
              <p>Great news! Your order #${params.orderNumber} is on its way.</p>
              ${params.trackingNumber ? `<p><strong>Tracking Number:</strong> ${params.trackingNumber}</p>` : ''}
              <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin-top: 10px;">
                <p>You can track your order status anytime in your account dashboard.</p>
              </div>
              <p>— HardwareTools Team</p>
            </div>
          </body>
        </html>
      `,
    })
    if (error) console.error("Email error:", error)
    return { success: true, data }
  } catch (error) {
    console.error("Failed to send shipped email:", error)
    return { success: false, error }
  }
}

export async function sendOrderDeliveredEmail(params: {
  to: string
  orderNumber: string
  customerName: string
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping email")
    return { success: false, error: "Email not configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `HardwareTools <${fromEmail}>`,
      to: params.to,
      subject: `Order #${params.orderNumber} Delivered!`,
      html: `
        <html>
          <head />
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 30px; border-radius: 8px;">
              <h1 style="color: #16a34a;">📦 Order Delivered!</h1>
              <p>Hi ${params.customerName},</p>
              <p>Your order #${params.orderNumber} has been delivered. We hope you love your new tools!</p>
              <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin-top: 10px;">
                <p>Have a moment? We'd love your feedback on the products you purchased.</p>
              </div>
              <p>— HardwareTools Team</p>
            </div>
          </body>
        </html>
      `,
    })
    if (error) console.error("Email error:", error)
    return { success: true, data }
  } catch (error) {
    console.error("Failed to send delivered email:", error)
    return { success: false, error }
  }
}
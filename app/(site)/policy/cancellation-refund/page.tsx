export default function CancellationRefundPage() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground">
          Cancellation & Refund Policy
        </h1>

        <p className="text-muted-foreground">
          Our cancellation and refund policy is designed to be transparent and
          fair for both customers and artisans.
        </p>

        <ul className="space-y-4 text-muted-foreground list-disc list-inside">
          <li>Orders can be cancelled within 24 hours of placement, before dispatch.</li>
          <li>Once shipped, orders cannot be cancelled — you may request a return per our Return Policy.</li>
          <li>Refunds for prepaid orders are processed after product inspection (if applicable).</li>
          <li>Online payments are processed via Cashfree; refunds go to the original UPI, card, or bank account.</li>
          <li>COD orders cancelled before dispatch incur no charge.</li>
          <li>Refund processing typically takes 5–7 business days after approval.</li>
        </ul>

        <p className="text-muted-foreground">
          For cancellation or refund requests, please reach out to our support
          team with your order details.
        </p>
      </div>
    </section>
  );
}

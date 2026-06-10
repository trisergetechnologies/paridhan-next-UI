export default function ReturnPolicyPage() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground">Return Policy</h1>

        <p className="text-muted-foreground leading-relaxed">
          At Paridhan Emporium we want you to love every saree you receive. If something is not
          right, our return policy is designed to be fair and straightforward for handcrafted and
          ready-to-wear ethnic pieces.
        </p>

        <div className="space-y-6 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">7-day return window</h2>
            <p>
              You may request a return within 7 days of delivery for unused sarees with original
              tags, blouse piece (if included), and packaging intact.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Eligible items</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Unused sarees without stains, odour, or alterations</li>
              <li>Items with all original labels and accessories</li>
              <li>Products that arrived damaged or defective (photo proof required)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Non-returnable</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Customised or altered sarees</li>
              <li>Items marked final sale or clearance</li>
              <li>Products used, washed, or worn for events</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">How to initiate a return</h2>
            <p>
              Contact our support team with your order number and reason for return. Once approved,
              we will arrange pickup or share return instructions. Refunds are processed to your
              original payment method (UPI, card, or net banking via Cashfree) or as store credit
              where applicable, within 5–7 business days after inspection.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Related policies</h2>
            <p>
              For exchanges, see our{" "}
              <a href="/policy/exchange-policy" className="text-primary hover:underline">
                Exchange Policy
              </a>
              . For order cancellations before dispatch, see{" "}
              <a href="/policy/cancellation-refund" className="text-primary hover:underline">
                Cancellation & Refund Policy
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

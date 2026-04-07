export default function ExchangePolicyPage() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        {/* TITLE */}
        <h1 className="font-serif text-3xl md:text-4xl text-foreground">
          Exchange Policy
        </h1>

        {/* INTRO */}
        <p className="text-muted-foreground">
          At Paridhan Emporium, every piece is crafted and curated with care.
          Our exchange policy ensures fairness while preserving the integrity
          of premium ethnic wear.
        </p>

        {/* CONTENT */}
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            We allow exchanges under specific conditions to maintain quality
            standards and hygiene. Please read the policy carefully before
            initiating an exchange request.
          </p>

          <ul className="space-y-4 list-disc list-inside">
            <li>
              Exchange requests must be raised within <strong>7 days</strong> of
              receiving the product.
            </li>
            <li>
              Products must be unused, unwashed, and returned in original
              packaging with tags intact.
            </li>
            <li>
              Custom-stitched, altered, or discounted items are not eligible for
              exchange.
            </li>
            <li>
              All exchange requests are subject to quality inspection by our
              team.
            </li>
            <li>
              Shipping charges for exchanges may be applicable.
            </li>
          </ul>

          <p>
            Once the exchange request is approved, you may choose an alternate
            product of equal or higher value (price difference payable).
          </p>

          <p>
            To initiate an exchange, please contact our support team with your
            order ID and reason for exchange.
          </p>
        </div>
      </div>
    </section>
  );
}

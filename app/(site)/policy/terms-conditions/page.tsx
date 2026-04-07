export default function TermsConditionsPage() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground">
          Terms & Conditions
        </h1>

        <p className="text-muted-foreground">
          By accessing or purchasing from Paridhan Emporium, you agree to the
          following terms and conditions.
        </p>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            All content, designs, and images on this website are the intellectual
            property of Paridhan Emporium.
          </p>

          <p>
            Prices, availability, and product descriptions are subject to change
            without prior notice.
          </p>

          <p>
            Any misuse of the website, including fraudulent activity, may result
            in account termination.
          </p>

          <p>
            These terms are governed by applicable laws of India.
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clock,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Shield,
} from "lucide-react";
import { submitContactMessage } from "@/lib/contactApi";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const result = await submitContactMessage({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    });

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.message || "Something went wrong.");
      return;
    }

    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    window.setTimeout(() => setIsSubmitted(false), 4000);
  };

  const contactInfo = useMemo(() => {
    type Block = {
      icon: typeof Mail;
      title: string;
      details: string[];
      description: string;
    };
    const blocks: Block[] = [];
    const emails =
      process.env.NEXT_PUBLIC_CONTACT_EMAIL?.split(/[,;]/).map((s) => s.trim()).filter(Boolean) ?? [];
    if (emails.length) {
      blocks.push({
        icon: Mail,
        title: "Email",
        details: emails,
        description: "We respond as soon as we can.",
      });
    }
    const phones =
      process.env.NEXT_PUBLIC_CONTACT_PHONE?.split(/[,;]/).map((s) => s.trim()).filter(Boolean) ?? [];
    if (phones.length) {
      blocks.push({
        icon: Phone,
        title: "Phone",
        details: phones,
        description: "",
      });
    }
    const addr =
      process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.split("|").map((s) => s.trim()).filter(Boolean) ?? [];
    if (addr.length) {
      blocks.push({
        icon: MapPin,
        title: "Address",
        details: addr,
        description: "",
      });
    }
    const hours =
      process.env.NEXT_PUBLIC_CONTACT_HOURS?.split("|").map((s) => s.trim()).filter(Boolean) ?? [];
    if (hours.length) {
      blocks.push({
        icon: Clock,
        title: "Hours",
        details: hours,
        description: "",
      });
    }
    return blocks;
  }, []);

  const features = [
    {
      icon: MessageSquare,
      title: "Write to us",
      description: "Use the form — we read every message.",
    },
    {
      icon: Shield,
      title: "Privacy",
      description: "Your details are used only to respond to you.",
    },
    {
      icon: Headphones,
      title: "Policies",
      description: "Shipping, returns, and more are in our policy pages.",
    },
  ];

  return (
    <div className="bg-background">
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 bg-primary text-primary-foreground">
              Get in Touch
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              We&apos;d love to{" "}
              <span className="text-primary block lg:inline lg:ml-4">
                hear from you
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question, suggestion, or just want to say hello? We&apos;re
              here to help and would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Send us a message
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and we&apos;ll get back to you as
                    soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitError ? (
                      <p
                        className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                        role="alert"
                      >
                        {submitError}
                      </p>
                    ) : null}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-foreground"
                        >
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-background border-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-foreground"
                        >
                          Your Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium text-foreground"
                      >
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium text-foreground"
                      >
                        Your Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your question or concern..."
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="bg-background border-border resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || isSubmitted}
                      className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </div>
                      ) : isSubmitted ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Message Sent!
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Contact details are not configured. Use the form — we&apos;ll reach you at the email you provide.
                      You can set <span className="font-mono text-xs">NEXT_PUBLIC_CONTACT_*</span> in your environment
                      to show phone and address here.
                    </p>
                  ) : (
                    contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <info.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 font-semibold text-foreground">{info.title}</h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">
                              {detail}
                            </p>
                          ))}
                          {info.description ? (
                            <p className="mt-1 text-xs text-muted-foreground">{info.description}</p>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Why Contact Us?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index}>
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-accent/10 rounded">
                          <feature.icon className="h-4 w-4 text-accent-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground text-sm">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      {index < features.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-6">
              Help
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">Policies & help</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Answers to shipping, returns, and legal questions are kept up to date on our policy pages.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            {[
              { href: "/policy/privacy-policy", title: "Privacy policy", desc: "How we handle your data." },
              { href: "/policy/exchange-policy", title: "Exchange policy", desc: "Returns and exchanges." },
              { href: "/policy/terms-conditions", title: "Terms & conditions", desc: "Using our store." },
              { href: "/policy/cancellation-refund", title: "Cancellation & refunds", desc: "Orders and refunds." },
            ].map((row) => (
              <Card key={row.href} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <Link href={row.href} className="group block">
                    <h3 className="mb-2 font-semibold text-foreground group-hover:text-primary">{row.title}</h3>
                    <p className="text-sm text-muted-foreground">{row.desc}</p>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">Still have questions?</h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                Send a message using the form above, or read our policies for shipping and returns.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL ? (
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL.split(",")[0].trim()}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email us
                    </a>
                  </Button>
                ) : null}
                <Button size="lg" variant="outline" asChild>
                  <Link href="/policy">
                    <Shield className="mr-2 h-4 w-4" />
                    View policies
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

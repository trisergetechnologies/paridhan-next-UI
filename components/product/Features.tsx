import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Shield, Truck } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      desc: "Complimentary delivery across India",
    },
    {
      icon: Shield,
      title: "Authentic Quality",
      desc: "Carefully curated fabrics and craftsmanship",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      desc: "Hassle-free returns within 7 days of delivery",
    },
  ];

  return (
    <Card className="mb-16">
      <CardContent className="p-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground mb-1">
                  {feature.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

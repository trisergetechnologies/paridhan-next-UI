import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // 🔴 PRIMARY RED BUTTON
        default:
          "bg-primary text-white shadow-sm hover:bg-primary/90 hover:shadow-md",

        // 🟡 GOLD / ADD TO CART
        gold:
          "bg-[oklch(0.7686_0.1647_70.0804)] text-black shadow-sm hover:bg-[oklch(0.72_0.16_70)]",

        // ⚠️ Destructive (still red but darker)
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90",

        // ⚪ WHITE BUTTON WITH RED BORDER
        outline:
          "border border-primary text-primary bg-white hover:bg-primary hover:text-white",

        // 🤍 SOFT WHITE / GREY SECONDARY
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        // MINIMAL (no background)
        ghost:
          "text-primary hover:bg-primary/10",

        // TEXT LINK
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (

      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
      
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

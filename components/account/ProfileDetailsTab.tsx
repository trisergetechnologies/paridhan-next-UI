"use client";

import type { User } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, User as UserIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  user: User;
};

export function ProfileDetailsTab({ user }: Props) {
  return (
    <div className="min-w-0 space-y-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
          Profile
        </p>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Profile details
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Your account information used for orders and communication.
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-border/60 ring-offset-2 ring-offset-background">
              <Image
                src="/images/profile.jpg"
                alt="Profile"
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>

            <dl className="min-w-0 flex-1 space-y-4 text-center sm:text-left">
              <div>
                <dt className="sr-only">Name</dt>
                <dd className="flex items-center justify-center gap-2 sm:justify-start">
                  <UserIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span className="font-serif text-xl font-semibold text-foreground">
                    {user.name}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Email</dt>
                <dd className="flex items-center justify-center gap-2 break-all text-sm text-muted-foreground sm:justify-start">
                  <Mail className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                  {user.email}
                </dd>
              </div>
              {user.phone ? (
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd className="flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
                    <Phone className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    +91 {user.phone}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type PasswordState = {
  current: string;
  next: string;
  confirm: string;
};

type Props = {
  passwords: PasswordState;
  onChange: (passwords: PasswordState) => void;
};

export function ChangePasswordTab({ passwords, onChange }: Props) {
  return (
    <div className="min-w-0 space-y-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
          Security
        </p>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Change password
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Update your password to keep your account secure.
        </p>
      </div>

      <Card className="max-w-xl rounded-2xl border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="current-password" className="text-sm font-medium">
              Current password
            </label>
            <Input
              id="current-password"
              type="password"
              placeholder="Current password"
              value={passwords.current}
              onChange={(e) =>
                onChange({ ...passwords, current: e.target.value })
              }
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm font-medium">
              New password
            </label>
            <Input
              id="new-password"
              type="password"
              placeholder="New password"
              value={passwords.next}
              onChange={(e) => onChange({ ...passwords, next: e.target.value })}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm new password
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={(e) =>
                onChange({ ...passwords, confirm: e.target.value })
              }
              autoComplete="new-password"
            />
          </div>
          <Button type="button" className="mt-2">
            Update password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

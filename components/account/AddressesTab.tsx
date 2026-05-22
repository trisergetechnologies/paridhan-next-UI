"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Edit, MapPin, Phone, Plus, Trash2, X } from "lucide-react";
import type { Address } from "./types";

type AddressFormField = keyof Omit<Address, "isDefault">;

const FORM_FIELDS: { key: AddressFormField; label: string; fullWidth?: boolean }[] = [
  { key: "slug", label: "Address label (ID)" },
  { key: "fullName", label: "Full name" },
  { key: "phone", label: "Phone" },
  { key: "postalCode", label: "Postal code" },
  { key: "street", label: "Street address", fullWidth: true },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
];

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91 ${digits}`;
  if (phone.startsWith("+")) return phone;
  return phone;
}

type Props = {
  addresses: Address[];
  loadingAddresses: boolean;
  addressError: string | null;
  isFormOpen: boolean;
  editingSlug: string | null;
  addressForm: Address;
  savingAddress: boolean;
  onOpenAddForm: () => void;
  onOpenEditForm: (addr: Address) => void;
  onCloseForm: () => void;
  onFormChange: (form: Address) => void;
  onSaveAddress: () => void;
  onSetDefault: (slug: string) => void;
  onDelete: (slug: string) => void;
};

export function AddressesTab({
  addresses,
  loadingAddresses,
  addressError,
  isFormOpen,
  editingSlug,
  addressForm,
  savingAddress,
  onOpenAddForm,
  onOpenEditForm,
  onCloseForm,
  onFormChange,
  onSaveAddress,
  onSetDefault,
  onDelete,
}: Props) {
  const handleDelete = (slug: string, fullName: string) => {
    if (
      window.confirm(
        `Delete address for ${fullName}? This cannot be undone.`
      )
    ) {
      onDelete(slug);
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
            Delivery
          </p>
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Saved addresses
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Manage where we deliver your orders. Your default address is used at
            checkout.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="shrink-0"
          onClick={onOpenAddForm}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new address
        </Button>
      </div>

      {addressError ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {addressError}
        </div>
      ) : null}

      {isFormOpen ? (
        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-serif text-lg">
              {editingSlug ? "Edit address" : "Add new address"}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onCloseForm}
              aria-label="Close form"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {FORM_FIELDS.map(({ key, label, fullWidth }) => (
                <div
                  key={key}
                  className={cn("space-y-2", fullWidth && "md:col-span-2")}
                >
                  <label htmlFor={`addr-${key}`} className="text-sm font-medium">
                    {label}
                  </label>
                  <Input
                    id={`addr-${key}`}
                    value={addressForm[key]}
                    onChange={(e) =>
                      onFormChange({ ...addressForm, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="addr-default"
                checked={addressForm.isDefault}
                onCheckedChange={(checked) =>
                  onFormChange({
                    ...addressForm,
                    isDefault: checked === true,
                  })
                }
              />
              <label
                htmlFor="addr-default"
                className="cursor-pointer text-sm text-muted-foreground"
              >
                Use as default delivery address
              </label>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="button"
                onClick={onSaveAddress}
                disabled={savingAddress}
              >
                {savingAddress ? "Saving..." : "Save address"}
              </Button>
              <Button type="button" variant="outline" onClick={onCloseForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {loadingAddresses ? (
        <div className="space-y-4" aria-busy="true" aria-label="Loading addresses">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-border/60 bg-card"
            />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState
          title="No saved addresses"
          description="Add a delivery address to speed up checkout and order updates."
          icon={MapPin}
        >
          <Button type="button" onClick={onOpenAddForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add your first address
          </Button>
        </EmptyState>
      ) : (
        <ul className="space-y-4 md:space-y-5">
          {addresses.map((addr) => (
            <li key={addr.slug}>
              <article
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm",
                  "transition-all duration-300 hover:border-primary/25 hover:shadow-md"
                )}
              >
                {addr.isDefault ? (
                  <div
                    className="absolute left-0 top-0 h-full w-1 bg-primary/80"
                    aria-hidden
                  />
                ) : null}

                <div className={cn("p-4 sm:p-5", addr.isDefault && "pl-5 sm:pl-6")}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {addr.fullName}
                      </h3>
                      {addr.isDefault ? (
                        <Badge className="text-[10px] uppercase tracking-wide">
                          Default
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p className="flex min-w-0 gap-2 break-words">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary/80"
                        aria-hidden
                      />
                      <span>
                        <span className="block text-foreground/90">
                          {addr.street}
                        </span>
                        <span>
                          {addr.city}, {addr.state} · {addr.postalCode}
                        </span>
                        {addr.country ? (
                          <span className="block text-xs">{addr.country}</span>
                        ) : null}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone
                        className="h-4 w-4 shrink-0 text-primary/80"
                        aria-hidden
                      />
                      {formatPhone(addr.phone)}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                    {!addr.isDefault ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onSetDefault(addr.slug)}
                      >
                        Set as default
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => onOpenEditForm(addr)}
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(addr.slug, addr.fullName)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

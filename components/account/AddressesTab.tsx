"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/input";
import {
  ADDRESS_LABELS,
  INDIAN_STATES_AND_UTS,
  isValidIndianPhone,
  isValidPincode,
  slugFromAddressLabel,
} from "@/lib/indianStates";
import { lookupPincode } from "@/lib/pincodeLookup";
import { cn } from "@/lib/utils";
import { CheckCircle2, Edit, Loader2, MapPin, Phone, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Address } from "./types";

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
  onSaveAddress: (form: Address) => void;
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
  const [formError, setFormError] = useState<string | null>(null);
  const [pinLoading, setPinLoading] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [labelChoice, setLabelChoice] = useState("Home");

  useEffect(() => {
    if (isFormOpen && !editingSlug) {
      setLabelChoice("Home");
      setFormError(null);
      setPinVerified(false);
    }
  }, [isFormOpen, editingSlug]);

  const handleDelete = (slug: string, fullName: string) => {
    if (window.confirm(`Delete address for ${fullName}? This cannot be undone.`)) {
      onDelete(slug);
    }
  };

  const handlePinLookup = async (pin: string) => {
    if (!isValidPincode(pin)) {
      setPinVerified(false);
      return;
    }
    setPinLoading(true);
    const result = await lookupPincode(pin);
    setPinLoading(false);
    if (result.success && result.data?.serviceable) {
      setPinVerified(true);
      onFormChange({
        ...addressForm,
        postalCode: result.data.pin,
        city: result.data.city || addressForm.city,
        state: result.data.state || addressForm.state,
        country: "India",
      });
    } else {
      setPinVerified(false);
      setFormError(result.message || "Could not verify this PIN code");
    }
  };

  const validateAndSave = () => {
    setFormError(null);
    if (!addressForm.fullName.trim()) {
      setFormError("Full name is required");
      return;
    }
    if (!isValidIndianPhone(addressForm.phone)) {
      setFormError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    if (!addressForm.street.trim()) {
      setFormError("Street address is required");
      return;
    }
    if (!isValidPincode(addressForm.postalCode)) {
      setFormError("Enter a valid 6-digit PIN code");
      return;
    }
    if (!addressForm.city.trim() || !addressForm.state.trim()) {
      setFormError("City and state are required — use PIN lookup or fill manually");
      return;
    }

    const payload = { ...addressForm, country: addressForm.country || "India" };
    if (!editingSlug) {
      const slug = slugFromAddressLabel(
        labelChoice,
        addresses.map((a) => a.slug)
      );
      payload.slug = slug;
    }
    onSaveAddress(payload);
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
            Add a delivery address with PIN verification for accurate saree delivery.
          </p>
        </div>
        <Button type="button" size="sm" className="shrink-0" onClick={onOpenAddForm}>
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
              {editingSlug ? "Edit address" : "Add delivery address"}
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
          <CardContent className="space-y-5">
            {!editingSlug ? (
              <div className="space-y-2">
                <span className="text-sm font-medium">Address label</span>
                <div className="flex flex-wrap gap-2">
                  {ADDRESS_LABELS.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setLabelChoice(label)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                        labelChoice === label
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="addr-fullName" className="text-sm font-medium">
                  Full name
                </label>
                <Input
                  id="addr-fullName"
                  placeholder="Name as on ID"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    onFormChange({ ...addressForm, fullName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="addr-phone" className="text-sm font-medium">
                  Mobile number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                    +91
                  </span>
                  <Input
                    id="addr-phone"
                    className="rounded-l-none"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={addressForm.phone.replace(/^\+?91/, "")}
                    onChange={(e) =>
                      onFormChange({
                        ...addressForm,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="addr-pin" className="text-sm font-medium">
                  PIN code
                </label>
                <div className="relative">
                  <Input
                    id="addr-pin"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit PIN"
                    value={addressForm.postalCode}
                    onChange={(e) => {
                      const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setPinVerified(false);
                      onFormChange({ ...addressForm, postalCode: pin });
                      if (pin.length === 6) void handlePinLookup(pin);
                    }}
                  />
                  {pinLoading ? (
                    <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                  ) : pinVerified ? (
                    <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-emerald-600" />
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  City & state auto-fill when PIN is verified
                </p>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="addr-street" className="text-sm font-medium">
                  House no., street, landmark
                </label>
                <Input
                  id="addr-street"
                  placeholder="Flat 4B, Silk Lane, near City Mall"
                  value={addressForm.street}
                  onChange={(e) =>
                    onFormChange({ ...addressForm, street: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="addr-city" className="text-sm font-medium">
                  City / District
                </label>
                <Input
                  id="addr-city"
                  value={addressForm.city}
                  onChange={(e) =>
                    onFormChange({ ...addressForm, city: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="addr-state" className="text-sm font-medium">
                  State
                </label>
                <select
                  id="addr-state"
                  value={addressForm.state}
                  onChange={(e) =>
                    onFormChange({ ...addressForm, state: e.target.value })
                  }
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm"
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES_AND_UTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
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

            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="button" onClick={validateAndSave} disabled={savingAddress}>
                {savingAddress ? "Saving…" : "Save address"}
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
          description="Add a delivery address with PIN verification to speed up checkout."
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
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground">{addr.fullName}</h3>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {addr.slug}
                    </Badge>
                    {addr.isDefault ? (
                      <Badge className="text-[10px] uppercase tracking-wide">Default</Badge>
                    ) : null}
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p className="flex min-w-0 gap-2 break-words">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                      <span>
                        <span className="block text-foreground/90">{addr.street}</span>
                        <span>
                          {addr.city}, {addr.state} — {addr.postalCode}
                        </span>
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
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

"use client";

import { AccountShell } from "@/components/account/AccountShell";
import { AddressesTab } from "@/components/account/AddressesTab";
import { ChangePasswordTab } from "@/components/account/ChangePasswordTab";
import { PlaceholderTab } from "@/components/account/PlaceholderTab";
import { ProfileDetailsTab } from "@/components/account/ProfileDetailsTab";
import {
  type AccountTabId,
  type Address,
  parseAccountTab,
} from "@/components/account/types";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/authFetch";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useId, useState } from "react";

const EMPTY_ADDRESS_FORM: Address = {
  slug: "",
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

function AccountPageContent() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const baseId = useId();
  const panelId = `${baseId}-panel`;

  const tabFromUrl = parseAccountTab(searchParams.get("tab"));
  const [activeTab, setActiveTab] = useState<AccountTabId>(
    tabFromUrl ?? "profile"
  );

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Address>(EMPTY_ADDRESS_FORM);
  const [savingAddress, setSavingAddress] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  useEffect(() => {
    const parsed = parseAccountTab(searchParams.get("tab"));
    if (parsed) setActiveTab(parsed);
  }, [searchParams]);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoadingAddresses(true);
      const res = await authFetch(`${getBrowserApiBase()}/customer/address`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        setAddressError(json.message || "Failed to fetch addresses");
        return;
      }
      setAddressError(null);
      setAddresses(json.data.items || []);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
      setAddressError("Failed to fetch addresses");
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchAddresses();
  }, [isAuthenticated, fetchAddresses]);

  const handleTabChange = (tab: AccountTabId) => {
    if (tab !== "addresses") {
      setIsFormOpen(false);
      setEditingSlug(null);
    }
    setActiveTab(tab);
  };

  const openAddForm = () => {
    setEditingSlug(null);
    setAddressForm({ ...EMPTY_ADDRESS_FORM });
    setIsFormOpen(true);
    setActiveTab("addresses");
  };

  const openEditForm = (addr: Address) => {
    setEditingSlug(addr.slug);
    setAddressForm({ ...addr });
    setIsFormOpen(true);
    setActiveTab("addresses");
  };

  const saveAddress = async () => {
    try {
      setSavingAddress(true);
      const isEdit = Boolean(editingSlug);
      const endpoint = isEdit
        ? `${getBrowserApiBase()}/customer/address/${editingSlug}`
        : `${getBrowserApiBase()}/customer/address`;
      const method = isEdit ? "PUT" : "POST";

      const res = await authFetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setAddressError(json.message || "Failed to save address");
        return;
      }

      setIsFormOpen(false);
      setEditingSlug(null);
      setAddressError(null);
      await fetchAddresses();
    } catch (error) {
      console.error("Save address failed", error);
      setAddressError("Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const setDefaultAddress = async (slug: string) => {
    try {
      const res = await authFetch(
        `${getBrowserApiBase()}/customer/address/${slug}/default`,
        { method: "PATCH" }
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        setAddressError(json.message || "Failed to set default address");
        return;
      }
      setAddressError(null);
      await fetchAddresses();
    } catch (error) {
      console.error("Set default address failed", error);
      setAddressError("Failed to set default address");
    }
  };

  const deleteAddress = async (slug: string) => {
    try {
      const res = await authFetch(
        `${getBrowserApiBase()}/customer/address/${slug}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        setAddressError(json.message || "Failed to delete address");
        return;
      }
      setAddressError(null);
      await fetchAddresses();
    } catch (error) {
      console.error("Delete address failed", error);
      setAddressError("Failed to delete address");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-[60vh] bg-muted/25">
      <div className="border-b border-border/80 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-12">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
            Account
          </p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            My account
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Manage your profile, delivery addresses, and account security.
          </p>
        </div>
      </div>

      <AccountShell
        activeTab={activeTab}
        onTabChange={handleTabChange}
        panelId={panelId}
        baseId={baseId}
      >
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeTab}`}
          className="min-w-0 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-6 md:p-8"
        >
          {activeTab === "profile" ? (
            <ProfileDetailsTab user={user} />
          ) : activeTab === "addresses" ? (
            <AddressesTab
              addresses={addresses}
              loadingAddresses={loadingAddresses}
              addressError={addressError}
              isFormOpen={isFormOpen}
              editingSlug={editingSlug}
              addressForm={addressForm}
              savingAddress={savingAddress}
              onOpenAddForm={openAddForm}
              onOpenEditForm={openEditForm}
              onCloseForm={() => {
                setIsFormOpen(false);
                setEditingSlug(null);
              }}
              onFormChange={setAddressForm}
              onSaveAddress={saveAddress}
              onSetDefault={setDefaultAddress}
              onDelete={deleteAddress}
            />
          ) : activeTab === "password" ? (
            <ChangePasswordTab passwords={passwords} onChange={setPasswords} />
          ) : activeTab === "help" ? (
            <PlaceholderTab tab="help" />
          ) : (
            <PlaceholderTab tab="support" />
          )}
        </div>
      </AccountShell>
    </div>
  );
}

function AccountPageFallback() {
  return (
    <div className="min-h-[60vh] bg-muted/25">
      <div className="border-b border-border/80 bg-background/90">
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-12">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-9 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountPageFallback />}>
      <AccountPageContent />
    </Suspense>
  );
}

"use client";

import { authFetch } from "@/lib/authFetch";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, Edit, Plus, Trash2, X } from "lucide-react";

/* ---------------- TYPES ---------------- */

type Address = {
  slug: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

/* ---------------- COMPONENT ---------------- */

export default function AccountPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  /* ---------------- STATE ---------------- */

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const [addressForm, setAddressForm] = useState<Address>({
    slug: "",
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });
  const [savingAddress, setSavingAddress] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  /* ---------------- AUTH GUARD ---------------- */

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const fetchAddresses = async () => {
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
  };

  useEffect(() => {
    if (isAuthenticated) fetchAddresses();
  }, [isAuthenticated]);

  if (!user) return null;

  /* ---------------- ADDRESS HANDLERS ---------------- */

  const openAddForm = () => {
    setEditingSlug(null);
    setAddressForm({
      slug: "",
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    });
    setIsFormOpen(true);
  };

  const openEditForm = (addr: Address) => {
    setEditingSlug(addr.slug);
    setAddressForm({ ...addr });
    setIsFormOpen(true);
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
      const res = await authFetch(`${getBrowserApiBase()}/customer/address/${slug}`, {
        method: "DELETE",
      });
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

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">
      {/* ================= PROFILE ================= */}
      <section className="grid md:grid-cols-[120px_1fr] gap-6 items-center">
        <div className="relative w-28 h-28 rounded-full overflow-hidden bg-muted">
          <Image
            src="/images/profile.jpg"
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {user.phone && (
            <p className="text-muted-foreground mt-1">
              +91 {user.phone}
            </p>
          )}
        </div>
      </section>

      {/* ================= ADDRESSES ================= */}
      <section>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Saved Addresses</h2>
          <Button size="sm" variant="outline" onClick={openAddForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>

        <div className="space-y-4">
          {addressError && (
            <p className="text-sm text-red-600">{addressError}</p>
          )}
          {loadingAddresses && (
            <p className="text-sm text-muted-foreground">Loading addresses...</p>
          )}
          {addresses.map((addr) => (
            <div
              key={addr.slug}
              className="rounded-xl border bg-white p-5 flex gap-4"
            >
              <button onClick={() => setDefaultAddress(addr.slug)}>
                {addr.isDefault ? (
                  <Check className="h-5 w-5 text-primary" />
                ) : (
                  <div className="h-5 w-5 rounded-full border" />
                )}
              </button>

              <div className="flex-1">
                <p className="font-medium">{addr.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {addr.phone} | {addr.slug}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => openEditForm(addr)}
                  className="text-sm text-primary flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => deleteAddress(addr.slug)}
                  className="text-sm text-red-600 flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ADDRESS FORM */}
        {isFormOpen && (
          <div className="mt-6 rounded-xl border bg-white p-6 space-y-4 max-w-xl">
            <h3 className="font-semibold">
              {editingSlug ? "Edit Address" : "Add New Address"}
            </h3>

            {["slug", "fullName", "phone", "street", "city", "state", "postalCode", "country"].map((field) => (
              <input
                key={field}
                placeholder={field.toUpperCase()}
                className="w-full border rounded-lg px-4 py-2"
                value={(addressForm as any)[field]}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    [field]: e.target.value,
                  })
                }
              />
            ))}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    isDefault: e.target.checked,
                  })
                }
              />
              Set as default address
            </label>

            <div className="flex gap-3">
              <Button onClick={saveAddress} disabled={savingAddress}>
                {savingAddress ? "Saving..." : "Save Address"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsFormOpen(false)}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* ================= CHANGE PASSWORD ================= */}
      <section className="max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <div className="rounded-xl border bg-white p-6 space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full border rounded-lg px-4 py-2"
            value={passwords.current}
            onChange={(e) =>
              setPasswords({ ...passwords, current: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full border rounded-lg px-4 py-2"
            value={passwords.next}
            onChange={(e) =>
              setPasswords({ ...passwords, next: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full border rounded-lg px-4 py-2"
            value={passwords.confirm}
            onChange={(e) =>
              setPasswords({ ...passwords, confirm: e.target.value })
            }
          />
          <Button>Update Password</Button>
        </div>
      </section>
    </div>
  );
}

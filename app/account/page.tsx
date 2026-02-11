"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, Edit, Plus, X } from "lucide-react";

/* ---------------- TYPES ---------------- */

type Address = {
  id: string;
  name: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

type RecentOrder = {
  id: string;
  image: string;
  name: string;
  price: number;
};

/* ---------------- COMPONENT ---------------- */

export default function AccountPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  /* ---------------- STATE ---------------- */

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Home",
      line1: "Sector 8, Rohini",
      city: "Delhi",
      state: "Delhi",
      pincode: "110085",
      isDefault: true,
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [addressForm, setAddressForm] = useState<Omit<Address, "id">>({
    name: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const recentOrders: RecentOrder[] = [
    {
      id: "o1",
      image:
        "https://images.unsplash.com/photo-1732709470611-670308da8c5e?q=80&w=880&auto=format&fit=crop",
      name: "Banarasi Silk Saree",
      price: 4999,
    },
    {
      id: "o2",
      image:
        "https://images.unsplash.com/photo-1732709470611-670308da8c5e?q=80&w=880&auto=format&fit=crop",
      name: "Kanjivaram Wedding Saree",
      price: 8999,
    },
  ];

  /* ---------------- AUTH GUARD ---------------- */

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  if (!user) return null;

  /* ---------------- ADDRESS HANDLERS ---------------- */

  const openAddForm = () => {
    setEditingId(null);
    setAddressForm({
      name: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
    setIsFormOpen(true);
  };

  const openEditForm = (addr: Address) => {
    setEditingId(addr.id);
    setAddressForm({ ...addr });
    setIsFormOpen(true);
  };

  const saveAddress = () => {
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...addressForm,
                id: editingId,
              }
            : addressForm.isDefault
            ? { ...a, isDefault: false }
            : a
        )
      );
    } else {
      setAddresses((prev) => [
        ...prev.map((a) =>
          addressForm.isDefault ? { ...a, isDefault: false } : a
        ),
        {
          ...addressForm,
          id: Date.now().toString(),
        },
      ]);
    }

    setIsFormOpen(false);
    setEditingId(null);
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
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
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-xl border bg-white p-5 flex gap-4"
            >
              <button onClick={() => setDefaultAddress(addr.id)}>
                {addr.isDefault ? (
                  <Check className="h-5 w-5 text-primary" />
                ) : (
                  <div className="h-5 w-5 rounded-full border" />
                )}
              </button>

              <div className="flex-1">
                <p className="font-medium">{addr.name}</p>
                <p className="text-sm text-muted-foreground">
                  {addr.line1}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>

              <button
                onClick={() => openEditForm(addr)}
                className="text-sm text-primary flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
            </div>
          ))}
        </div>

        {/* ADDRESS FORM */}
        {isFormOpen && (
          <div className="mt-6 rounded-xl border bg-white p-6 space-y-4 max-w-xl">
            <h3 className="font-semibold">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>

            {["name", "line1", "city", "state", "pincode"].map((field) => (
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
              <Button onClick={saveAddress}>Save Address</Button>
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

      {/* ================= RECENT ORDERS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="min-w-[220px] rounded-xl border bg-white overflow-hidden"
            >
              <div className="relative h-56">
                <Image
                  src={order.image}
                  alt={order.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium line-clamp-2">
                  {order.name}
                </p>
                <p className="font-semibold text-primary">
                  ₹{order.price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

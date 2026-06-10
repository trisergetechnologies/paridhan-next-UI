import { getBrowserApiBase } from "@/lib/publicApiBase";

export type PincodeResult = {
  pin: string;
  serviceable: boolean;
  city?: string;
  state?: string;
  districts?: string[];
  postOffices?: {
    name: string;
    district: string;
    state: string;
    deliveryStatus?: string;
  }[];
};

export async function lookupPincode(pin: string): Promise<{
  success: boolean;
  message: string;
  data: PincodeResult | null;
}> {
  const cleaned = pin.replace(/\D/g, "");
  if (cleaned.length !== 6) {
    return {
      success: false,
      message: "Enter a valid 6-digit PIN code",
      data: null,
    };
  }

  try {
    const res = await fetch(`${getBrowserApiBase()}/public/pincode/${cleaned}`);
    const json = await res.json();
    return {
      success: Boolean(json.success),
      message: json.message || (json.success ? "PIN code found" : "Could not verify PIN"),
      data: json.data ?? null,
    };
  } catch {
    return {
      success: false,
      message: "Could not check PIN code. Try again.",
      data: null,
    };
  }
}

export function estimatedDeliveryLabel(fromDate = new Date()) {
  const min = new Date(fromDate);
  min.setDate(min.getDate() + 3);
  const max = new Date(fromDate);
  max.setDate(max.getDate() + 7);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `Estimated delivery: ${fmt(min)} – ${fmt(max)}`;
}

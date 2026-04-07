import axios from "axios";

export const PUBLIC_CONTACT_PATH = "/public/contact";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactApiResponse = {
  success: boolean;
  message: string;
  data: { id?: string } | null;
};

export async function submitContactMessage(
  payload: ContactPayload
): Promise<ContactApiResponse> {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) {
    return {
      success: false,
      message: "Service is not configured. Please try again later.",
      data: null,
    };
  }

  try {
    const { data } = await axios.post<ContactApiResponse>(
      `${base}${PUBLIC_CONTACT_PATH}`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );
    if (!data || typeof data.success !== "boolean") {
      return {
        success: false,
        message: "Invalid response from server.",
        data: null,
      };
    }
    return data;
  } catch {
    return {
      success: false,
      message:
        "We could not reach the server. Check your connection and try again.",
      data: null,
    };
  }
}

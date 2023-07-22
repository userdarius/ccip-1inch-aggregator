import { toast } from "react-toastify";

export const copyToClipboard = async (text?: string) => {
  try {
    if (text) {
      return await toast.promise(() => navigator.clipboard.writeText(text), {
        success: "Copied !",
        error: "Error while copying address : " + text,
      });
    }
  } catch (error) {
    throw new Error("Error while copying address");
  }
};

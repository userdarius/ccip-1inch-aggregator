import { toast } from "react-toastify";
import { Blockchains } from "../types/global.types";

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

export function trouverPlusGrand(coinEstimations: Blockchains) {
  let estimatedReceiving = Number.MIN_VALUE;
  let nomBlockchain = null;

  for (const [nom, valeur] of Object.entries(coinEstimations)) {
    if (valeur > estimatedReceiving) {
      estimatedReceiving = valeur;
      nomBlockchain = nom;
    }
  }

  return {
    nomBlockchain: nomBlockchain,
    estimatedReceiving: estimatedReceiving,
  };
}

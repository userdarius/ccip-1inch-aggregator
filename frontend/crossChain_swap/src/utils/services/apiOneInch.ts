import axios from "axios";
import { Quote } from "../types/swap.types";
import { Address } from "viem";

const instance = axios.create({
  baseURL: "http://localhost:6002/quote/",
  timeout: 30000,
});

const apiQuote = {
  getOptimism: (src: Address, dst: Address, amount: string) =>
    instance.get<Quote>(`optimism/`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      params: {
        src: src,
        dst: dst,
        amount: amount,
      },
    }),
  getAvalanche: (src: Address, dst: Address, amount: string) =>
    instance.get<Quote>(`avalanche/`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      params: {
        src: src,
        dst: dst,
        amount: amount,
      },
    }),
  getPolygon: (src: Address, dst: Address, amount: string) =>
    instance.get<Quote>(`polygon/`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      params: {
        src: src,
        dst: dst,
        amount: amount,
      },
    }),
  getMainnet: (src: Address, dst: Address, amount: string) =>
    instance.get<Quote>(`mainnet/`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      params: {
        src: src,
        dst: dst,
        amount: amount,
      },
    }),
  getBnbChain: (src: Address, dst: Address, amount: string) =>
    instance.get<Quote>(`bnbChain/`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      params: {
        src: src,
        dst: dst,
        amount: amount,
      },
    }),
};

export default apiQuote;

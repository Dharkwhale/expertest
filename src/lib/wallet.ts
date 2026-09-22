// Which wallet was picked on S09 (M4 decision D6 a), carried to S10 as ?wallet=metamask.
// URL input is hostile: only the four ex17 wallet ids are accepted. No param is fine (the
// big "Connect Wallet" button picks none, and S10 shows ex11's generic "Personal Vault").
import { wallets, type Wallet } from "@/mock/data";

type SearchParams = Record<string, string | string[] | undefined>;

export type WalletId = Wallet["id"];

export type ParsedWallet = { ok: true; wallet: Wallet | undefined } | { ok: false };

export function parseWallet(params: SearchParams): ParsedWallet {
  const raw = params.wallet;
  if (raw === undefined) return { ok: true, wallet: undefined };
  const wallet = typeof raw === "string" ? wallets.find((w) => w.id === raw) : undefined;
  return wallet ? { ok: true, wallet } : { ok: false };
}

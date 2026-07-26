#!/usr/bin/env node
/**
 * Lee la última address de SupplyChainTracker desde el broadcast de Foundry
 * y escribe frontend/.env.local con NEXT_PUBLIC_CONTRACT_ADDRESS.
 *
 * Uso (desde la raíz del repo):
 *   node scripts/sync-contract-address.mjs
 *   node scripts/sync-contract-address.mjs --chain-id 31337
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function parseArgs(argv) {
  let chainId = "31337";
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--chain-id" && argv[i + 1]) {
      chainId = String(argv[++i]);
    }
  }
  return { chainId };
}

function findContractAddress(broadcast) {
  const txs = Array.isArray(broadcast.transactions) ? broadcast.transactions : [];

  const createTx =
    txs.find(
      (tx) =>
        tx.transactionType === "CREATE" &&
        (tx.contractName === "SupplyChainTracker" ||
          String(tx.contractName || "").endsWith("SupplyChainTracker"))
    ) ||
    txs.find((tx) => tx.transactionType === "CREATE" && tx.contractAddress);

  if (createTx?.contractAddress) {
    return createTx.contractAddress;
  }

  // Fallback: algunos broadcasts guardan address en receipts
  const receipts = Array.isArray(broadcast.receipts) ? broadcast.receipts : [];
  const receipt = receipts.find((r) => r.contractAddress);
  if (receipt?.contractAddress) {
    return receipt.contractAddress;
  }

  return null;
}

function main() {
  const { chainId } = parseArgs(process.argv.slice(2));
  const broadcastPath = path.join(
    root,
    "SC",
    "broadcast",
    "Deploy.s.sol",
    chainId,
    "run-latest.json"
  );

  if (!fs.existsSync(broadcastPath)) {
    console.error(
      `No se encontro broadcast en:\n  ${broadcastPath}\n` +
        "Despliega primero con forge script ... --broadcast"
    );
    process.exit(1);
  }

  const broadcast = JSON.parse(fs.readFileSync(broadcastPath, "utf8"));
  const address = findContractAddress(broadcast);

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    console.error("No se pudo extraer una address valida de SupplyChainTracker del broadcast.");
    process.exit(1);
  }

  const envPath = path.join(root, "frontend", ".env.local");
  const content =
    `# Generado por scripts/sync-contract-address.mjs\n` +
    `# Chain ID: ${chainId}\n` +
    `# Fuente: ${path.relative(root, broadcastPath).replace(/\\/g, "/")}\n` +
    `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`;

  fs.writeFileSync(envPath, content, "utf8");

  console.log(`Address sincronizada: ${address}`);
  console.log(`Escrito: frontend/.env.local`);
  console.log("Reinicia `npm run dev` si el frontend ya estaba corriendo.");
}

main();

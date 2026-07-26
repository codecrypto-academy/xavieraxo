import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI } from './contracts';

// Obtener provider y signer
const getProvider = () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  throw new Error('MetaMask no está disponible');
};

const getContract = async () => {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, signer);
};

// Funciones de usuario
export const registerUser = async (role: number, name: string) => {
  const contract = await getContract();
  const tx = await contract.registerUser(role, name);
  await tx.wait();
  return tx.hash;
};

export const approveUser = async (userAddress: string) => {
  const contract = await getContract();
  const tx = await contract.approveUser(userAddress);
  await tx.wait();
  return tx.hash;
};

export const rejectUser = async (userAddress: string) => {
  const contract = await getContract();
  const tx = await contract.rejectUser(userAddress);
  await tx.wait();
  return tx.hash;
};

export const cancelUser = async (userAddress: string) => {
  const contract = await getContract();
  const tx = await contract.cancelUser(userAddress);
  await tx.wait();
  return tx.hash;
};

export const getUser = async (userAddress: string) => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  const user = await contract.getUser(userAddress);
  return {
    userAddress: user.userAddress,
    role: Number(user.role),
    status: Number(user.status),
    name: user.name,
    registrationTime: Number(user.registrationTime),
  };
};

// Funciones de tokens
export const createToken = async (metadata: string, parentTokenId: number, initialSupply: number) => {
  const contract = await getContract();
  const tx = await contract.createToken(metadata, parentTokenId, initialSupply);
  await tx.wait();
  return tx.hash;
};

export const updateTokenMetadata = async (tokenId: number, newMetadata: string) => {
  const contract = await getContract();
  const tx = await contract.updateTokenMetadata(tokenId, newMetadata);
  await tx.wait();
  return tx.hash;
};

export const getToken = async (tokenId: number) => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  const token = await contract.getToken(tokenId);
  return {
    tokenId: Number(token.tokenId),
    owner: token.owner,
    metadata: token.metadata,
    parentTokenId: Number(token.parentTokenId),
    isRawMaterial: token.isRawMaterial,
    creationTime: Number(token.creationTime),
    creator: token.creator,
  };
};

export const getBalance = async (userAddress: string, tokenId: number) => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  const balance = await contract.getBalance(userAddress, tokenId);
  return Number(balance);
};

// Funciones de transferencias
export const createTransfer = async (tokenId: number, to: string, amount: number, metadata: string = '') => {
  const contract = await getContract();
  const tx = await contract.createTransfer(tokenId, to, amount, metadata);
  await tx.wait();
  return tx.hash;
};

export const acceptTransfer = async (transferId: number) => {
  const contract = await getContract();
  const tx = await contract.acceptTransfer(transferId);
  await tx.wait();
  return tx.hash;
};

export const rejectTransfer = async (transferId: number) => {
  const contract = await getContract();
  const tx = await contract.rejectTransfer(transferId);
  await tx.wait();
  return tx.hash;
};

export const expireTransfer = async (transferId: number) => {
  const contract = await getContract();
  const tx = await contract.expireTransfer(transferId);
  await tx.wait();
  return tx.hash;
};

export const isTransferExpired = async (transferId: number) => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  return Boolean(await contract.isTransferExpired(transferId));
};

export const getTransferTimeout = async () => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  return Number(await contract.TRANSFER_TIMEOUT());
};

export const getTransfer = async (transferId: number) => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  const transfer = await contract.getTransfer(transferId);
  return {
    transferId: Number(transfer.transferId),
    tokenId: Number(transfer.tokenId),
    from: transfer.from,
    to: transfer.to,
    amount: Number(transfer.amount),
    status: Number(transfer.status),
    timestamp: Number(transfer.timestamp),
    metadata: transfer.metadata,
  };
};

// Enumeradores y listados
export const getRegisteredUsersCount = async () => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  const count = await contract.getRegisteredUsersCount();
  return Number(count);
};

export const getAllUsers = async () => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  const count = Number(await contract.getRegisteredUsersCount());

  const users = [];
  for (let i = 0; i < count; i++) {
    const address = await contract.registeredUsers(i);
    const user = await contract.getUser(address);
    users.push({
      userAddress: user.userAddress,
      role: Number(user.role),
      status: Number(user.status),
      name: user.name,
      registrationTime: Number(user.registrationTime),
    });
  }
  return users;
};

export const getTokenCounter = async () => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  return Number(await contract.tokenCounter());
};

export const getTransferCounter = async () => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  return Number(await contract.transferCounter());
};

export const getAllTokens = async () => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  const count = Number(await contract.tokenCounter());

  const tokens = [];
  for (let i = 1; i <= count; i++) {
    const token = await contract.getToken(i);
    tokens.push({
      tokenId: Number(token.tokenId),
      owner: token.owner,
      metadata: token.metadata,
      parentTokenId: Number(token.parentTokenId),
      isRawMaterial: token.isRawMaterial,
      creationTime: Number(token.creationTime),
      creator: token.creator,
    });
  }
  return tokens;
};

export const getAllTransfers = async () => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  const count = Number(await contract.transferCounter());

  const transfers = [];
  for (let i = 1; i <= count; i++) {
    const transfer = await contract.getTransfer(i);
    transfers.push({
      transferId: Number(transfer.transferId),
      tokenId: Number(transfer.tokenId),
      from: transfer.from,
      to: transfer.to,
      amount: Number(transfer.amount),
      status: Number(transfer.status),
      timestamp: Number(transfer.timestamp),
      metadata: transfer.metadata,
    });
  }
  return transfers;
};

/** Cadena de ancestros desde la materia prima hasta el token (incluye el token). */
export const getTokenLineage = async (tokenId: number) => {
  const lineage = [];
  let currentId = tokenId;
  const seen = new Set<number>();

  while (currentId > 0 && !seen.has(currentId)) {
    seen.add(currentId);
    const token = await getToken(currentId);
    if (!token.tokenId) break;
    lineage.unshift(token);
    currentId = token.parentTokenId;
  }

  return lineage;
};

/** Tokens que tienen a tokenId como padre directo. */
export const getTokenChildren = async (tokenId: number) => {
  const all = await getAllTokens();
  return all.filter((t) => t.parentTokenId === tokenId);
};

/** Transferencias asociadas a un token (orden cronológico). */
export const getTokenTransfers = async (tokenId: number) => {
  const all = await getAllTransfers();
  return all
    .filter((t) => t.tokenId === tokenId)
    .sort((a, b) => a.timestamp - b.timestamp);
};

// Tokens con balance de un usuario (recorre todos los tokens y filtra por balance > 0)
export const getUserTokens = async (userAddress: string) => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  const count = Number(await contract.tokenCounter());

  const result = [];
  for (let i = 1; i <= count; i++) {
    const balance = Number(await contract.getBalance(userAddress, i));
    if (balance > 0) {
      const token = await contract.getToken(i);
      result.push({
        tokenId: Number(token.tokenId),
        owner: token.owner,
        metadata: token.metadata,
        parentTokenId: Number(token.parentTokenId),
        isRawMaterial: token.isRawMaterial,
        creationTime: Number(token.creationTime),
        creator: token.creator,
        balance,
      });
    }
  }
  return result;
};

// Pausa de emergencia (solo admin)
export const isPaused = async () => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  return Boolean(await contract.paused());
};

export const pauseContract = async () => {
  const contract = await getContract();
  const tx = await contract.pause();
  await tx.wait();
  return tx.hash;
};

export const unpauseContract = async () => {
  const contract = await getContract();
  const tx = await contract.unpause();
  await tx.wait();
  return tx.hash;
};


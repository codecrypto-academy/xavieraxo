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

// Eventos (se pueden usar con ethers para escuchar eventos)
export const listenToEvents = (eventName: string, callback: (event: any) => void) => {
  const provider = getProvider();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUPPLY_CHAIN_TRACKER_ABI, provider);
  contract.on(eventName, callback);
};


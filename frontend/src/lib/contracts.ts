// Preferir NEXT_PUBLIC_CONTRACT_ADDRESS (frontend/.env.local).
// Tras deploy local: node scripts/sync-contract-address.mjs
// o: powershell -File scripts/deploy-local.ps1
const DEFAULT_LOCAL_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ADDRESS =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CONTRACT_ADDRESS) ||
  DEFAULT_LOCAL_ADDRESS;

// ABI del contrato SupplyChainTracker
export const SUPPLY_CHAIN_TRACKER_ABI = [
  // User Management
  "function registerUser(uint8 _role, string memory _name) external",
  "function approveUser(address _userAddress) external",
  "function rejectUser(address _userAddress) external",
  "function cancelUser(address _userAddress) external",
  "function getUser(address _userAddress) external view returns (tuple(address userAddress, uint8 role, uint8 status, string name, uint256 registrationTime))",
  
  // Token Management
  "function createToken(string memory _metadata, uint256 _parentTokenId, uint256 _initialSupply) external returns (uint256)",
  "function updateTokenMetadata(uint256 _tokenId, string memory _newMetadata) external",
  "function getToken(uint256 _tokenId) external view returns (tuple(uint256 tokenId, address owner, string metadata, uint256 parentTokenId, bool isRawMaterial, uint256 creationTime, address creator))",
  "function getBalance(address _user, uint256 _tokenId) external view returns (uint256)",
  
  // Transfer Management
  "function createTransfer(uint256 _tokenId, address _to, uint256 _amount, string memory _metadata) external",
  "function acceptTransfer(uint256 _transferId) external",
  "function rejectTransfer(uint256 _transferId) external",
  "function expireTransfer(uint256 _transferId) external",
  "function isTransferExpired(uint256 _transferId) external view returns (bool)",
  "function TRANSFER_TIMEOUT() external view returns (uint256)",
  "function getTransfer(uint256 _transferId) external view returns (tuple(uint256 transferId, uint256 tokenId, address from, address to, uint256 amount, uint8 status, uint256 timestamp, string metadata))",
  
  // Enumeradores (para listar)
  "function registeredUsers(uint256 _index) external view returns (address)",
  "function tokenCounter() external view returns (uint256)",
  "function transferCounter() external view returns (uint256)",
  "function getRegisteredUsersCount() external view returns (uint256)",

  // Admin / Pausa
  "function admin() external view returns (address)",
  "function pause() external",
  "function unpause() external",
  "function paused() external view returns (bool)",
  
  // Events
  "event UserRegistered(address indexed user, uint8 role, string name)",
  "event UserStatusChanged(address indexed user, uint8 oldStatus, uint8 newStatus)",
  "event TokenCreated(uint256 indexed tokenId, address indexed creator, bool isRawMaterial, uint256 parentTokenId)",
  "event TokenMetadataUpdated(uint256 indexed tokenId, string newMetadata)",
  "event TransferCreated(uint256 indexed transferId, uint256 indexed tokenId, address indexed from, address to, uint256 amount)",
  "event TransferStatusChanged(uint256 indexed transferId, uint8 newStatus)",
  "event BalanceUpdated(address indexed user, uint256 indexed tokenId, uint256 newBalance)",
  "event ContractPaused(address indexed account)",
  "event ContractUnpaused(address indexed account)",
] as const;

// Enums (para uso en TypeScript)
export enum UserRole {
  Admin = 0,
  Producer = 1,
  Factory = 2,
  Retailer = 3,
  Consumer = 4,
}

export enum UserStatus {
  NotRegistered = 0,
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Cancelled = 4,
}

export enum TransferStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Expired = 3,
}

// Helpers
export const ROLE_NAMES: Record<UserRole, string> = {
  [UserRole.Admin]: "Administrador",
  [UserRole.Producer]: "Productor",
  [UserRole.Factory]: "Factoría",
  [UserRole.Retailer]: "Distribuidor",
  [UserRole.Consumer]: "Consumidor",
};

export const STATUS_NAMES: Record<UserStatus, string> = {
  [UserStatus.NotRegistered]: "No Registrado",
  [UserStatus.Pending]: "Pendiente",
  [UserStatus.Approved]: "Aprobado",
  [UserStatus.Rejected]: "Rechazado",
  [UserStatus.Cancelled]: "Cancelado",
};

export const TRANSFER_STATUS_NAMES: Record<TransferStatus, string> = {
  [TransferStatus.Pending]: "Pendiente",
  [TransferStatus.Accepted]: "Aceptada",
  [TransferStatus.Rejected]: "Rechazada",
  [TransferStatus.Expired]: "Expirada",
};


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title SupplyChainTracker
 * @dev Sistema de trazabilidad de cadena de suministro con roles y tokens
 */
contract SupplyChainTracker is ReentrancyGuard, Pausable {
    // ============ ENUMS ============
    
    enum UserStatus {
        NotRegistered,  // No registrado
        Pending,        // Pendiente de aprobación
        Approved,       // Aprobado
        Rejected,       // Rechazado
        Cancelled       // Cancelado
    }
    
    enum UserRole {
        Admin,          // Administrador
        Producer,       // Productor
        Factory,        // Factoría
        Retailer,       // Distribuidor
        Consumer        // Consumidor
    }
    
    enum TransferStatus {
        Pending,        // Pendiente
        Accepted,       // Aceptada
        Rejected        // Rechazada
    }

    // ============ STRUCTS ============
    
    struct User {
        address userAddress;
        UserRole role;
        UserStatus status;
        string name;
        uint256 registrationTime;
    }
    
    struct Token {
        uint256 tokenId;
        address owner;
        string metadata;        // JSON metadata
        uint256 parentTokenId;  // 0 si es materia prima
        bool isRawMaterial;     // true si es materia prima
        uint256 creationTime;
        address creator;
    }
    
    struct Transfer {
        uint256 transferId;
        uint256 tokenId;
        address from;
        address to;
        uint256 amount;
        TransferStatus status;
        uint256 timestamp;
        string metadata;        // JSON metadata opcional para la transferencia
    }

    // ============ STATE VARIABLES ============
    
    address public admin;
    
    mapping(address => User) public users;
    mapping(uint256 => Token) public tokens;
    mapping(uint256 => Transfer) public transfers;
    mapping(address => mapping(uint256 => uint256)) public balances; // user => tokenId => balance
    
    uint256 public tokenCounter;
    uint256 public transferCounter;
    
    // Lista de todos los usuarios registrados
    address[] public registeredUsers;

    // ============ CONSTANTS ============
    
    /// @dev Límite máximo de caracteres para metadata (previene DoS por gas)
    uint256 public constant MAX_METADATA_LENGTH = 1000;
    
    /// @dev Tiempo de expiración para transferencias pendientes (30 días)
    uint256 public constant TRANSFER_TIMEOUT = 30 days;

    // ============ EVENTS ============
    
    event UserRegistered(address indexed user, UserRole role, string name);
    event UserStatusChanged(address indexed user, UserStatus oldStatus, UserStatus newStatus);
    event TokenCreated(uint256 indexed tokenId, address indexed creator, bool isRawMaterial, uint256 parentTokenId);
    event TokenMetadataUpdated(uint256 indexed tokenId, string newMetadata);
    event TransferCreated(uint256 indexed transferId, uint256 indexed tokenId, address indexed from, address to, uint256 amount);
    event TransferStatusChanged(uint256 indexed transferId, TransferStatus newStatus);
    event BalanceUpdated(address indexed user, uint256 indexed tokenId, uint256 newBalance);
    event ContractPaused(address indexed account);
    event ContractUnpaused(address indexed account);

    // ============ MODIFIERS ============
    
    modifier onlyAdmin() {
        require(users[msg.sender].role == UserRole.Admin && users[msg.sender].status == UserStatus.Approved, "Solo administrador");
        _;
    }
    
    modifier onlyApprovedUser() {
        require(users[msg.sender].status == UserStatus.Approved, "Usuario no aprobado");
        _;
    }
    
    modifier validRole(UserRole _role) {
        require(uint256(_role) >= 1 && uint256(_role) <= 4, "Rol invalido"); // Excluye Admin (0)
        _;
    }
    
    modifier validAddress(address _address) {
        require(_address != address(0), "Direccion invalida");
        _;
    }
    
    modifier tokenExists(uint256 _tokenId) {
        require(tokens[_tokenId].tokenId != 0, "Token no existe");
        _;
    }
    
    modifier validAmount(uint256 _amount) {
        require(_amount > 0, "Cantidad debe ser mayor que cero");
        _;
    }
    
    modifier validString(string memory _str) {
        require(bytes(_str).length > 0, "String no puede estar vacio");
        _;
    }
    
    modifier validMetadata(string memory _metadata) {
        require(bytes(_metadata).length > 0, "Metadata no puede estar vacia");
        require(bytes(_metadata).length <= MAX_METADATA_LENGTH, "Metadata muy larga");
        _;
    }

    // ============ CONSTRUCTOR ============
    
    constructor() {
        admin = msg.sender;
        users[msg.sender] = User({
            userAddress: msg.sender,
            role: UserRole.Admin,
            status: UserStatus.Approved,
            name: "Administrador",
            registrationTime: block.timestamp
        });
        registeredUsers.push(msg.sender);
        emit UserRegistered(msg.sender, UserRole.Admin, "Administrador");
    }
    
    // ============ PAUSE MANAGEMENT ============
    
    /**
     * @dev Pausa el contrato en caso de emergencia (solo admin)
     */
    function pause() external onlyAdmin {
        _pause();
        emit ContractPaused(msg.sender);
    }
    
    /**
     * @dev Reanuda el contrato (solo admin)
     */
    function unpause() external onlyAdmin {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    // ============ USER MANAGEMENT ============
    
    /**
     * @dev Registra un nuevo usuario con rol específico
     * @param _role Rol del usuario (Producer, Factory, Retailer, Consumer)
     * @param _name Nombre del usuario
     */
    function registerUser(UserRole _role, string memory _name) 
        external 
        whenNotPaused 
        validRole(_role) 
        validString(_name) 
    {
        require(users[msg.sender].status == UserStatus.NotRegistered, "Usuario ya registrado");
        
        users[msg.sender] = User({
            userAddress: msg.sender,
            role: _role,
            status: UserStatus.Pending,
            name: _name,
            registrationTime: block.timestamp
        });
        
        registeredUsers.push(msg.sender);
        emit UserRegistered(msg.sender, _role, _name);
        emit UserStatusChanged(msg.sender, UserStatus.NotRegistered, UserStatus.Pending);
    }
    
    /**
     * @dev Aprobar un usuario pendiente (solo admin)
     * @param _userAddress Dirección del usuario a aprobar
     */
    function approveUser(address _userAddress) external onlyAdmin validAddress(_userAddress) {
        require(users[_userAddress].status == UserStatus.Pending, "Usuario no pendiente");
        
        UserStatus oldStatus = users[_userAddress].status;
        users[_userAddress].status = UserStatus.Approved;
        
        emit UserStatusChanged(_userAddress, oldStatus, UserStatus.Approved);
    }
    
    /**
     * @dev Rechazar un usuario pendiente (solo admin)
     * @param _userAddress Dirección del usuario a rechazar
     */
    function rejectUser(address _userAddress) external onlyAdmin validAddress(_userAddress) {
        require(users[_userAddress].status == UserStatus.Pending, "Usuario no pendiente");
        
        UserStatus oldStatus = users[_userAddress].status;
        users[_userAddress].status = UserStatus.Rejected;
        
        emit UserStatusChanged(_userAddress, oldStatus, UserStatus.Rejected);
    }
    
    /**
     * @dev Cancelar un usuario (solo admin)
     * @param _userAddress Dirección del usuario a cancelar
     */
    function cancelUser(address _userAddress) external onlyAdmin validAddress(_userAddress) {
        require(
            users[_userAddress].status == UserStatus.Approved || 
            users[_userAddress].status == UserStatus.Pending,
            "Estado invalido para cancelar"
        );
        
        UserStatus oldStatus = users[_userAddress].status;
        users[_userAddress].status = UserStatus.Cancelled;
        
        emit UserStatusChanged(_userAddress, oldStatus, UserStatus.Cancelled);
    }

    // ============ TOKEN MANAGEMENT ============
    
    /**
     * @dev Crear un token (materia prima o producto terminado)
     * @param _metadata Metadata JSON del token
     * @param _parentTokenId ID del token padre (0 si es materia prima)
     * @param _initialSupply Cantidad inicial de tokens
     */
    function createToken(
        string memory _metadata,
        uint256 _parentTokenId,
        uint256 _initialSupply
    ) 
        external 
        whenNotPaused 
        onlyApprovedUser 
        validMetadata(_metadata) 
        validAmount(_initialSupply) 
        returns (uint256) 
    {
        bool isRawMaterial = (_parentTokenId == 0);
        
        // Validar parentesco si no es materia prima
        if (!isRawMaterial) {
            require(tokens[_parentTokenId].tokenId != 0, "Token padre no existe");
            require(tokens[_parentTokenId].owner == msg.sender || balances[msg.sender][_parentTokenId] > 0, "No tienes el token padre");
        }
        
        tokenCounter++;
        uint256 newTokenId = tokenCounter;
        
        tokens[newTokenId] = Token({
            tokenId: newTokenId,
            owner: msg.sender,
            metadata: _metadata,
            parentTokenId: _parentTokenId,
            isRawMaterial: isRawMaterial,
            creationTime: block.timestamp,
            creator: msg.sender
        });
        
        balances[msg.sender][newTokenId] = _initialSupply;
        
        emit TokenCreated(newTokenId, msg.sender, isRawMaterial, _parentTokenId);
        emit BalanceUpdated(msg.sender, newTokenId, _initialSupply);
        
        return newTokenId;
    }
    
    /**
     * @dev Actualizar metadata de un token
     * @param _tokenId ID del token
     * @param _newMetadata Nueva metadata JSON
     */
    function updateTokenMetadata(uint256 _tokenId, string memory _newMetadata) 
        external 
        whenNotPaused 
        onlyApprovedUser 
        tokenExists(_tokenId) 
        validMetadata(_newMetadata) 
    {
        require(tokens[_tokenId].owner == msg.sender, "No eres el propietario");
        
        tokens[_tokenId].metadata = _newMetadata;
        emit TokenMetadataUpdated(_tokenId, _newMetadata);
    }
    
    /**
     * @dev Obtener información de un token
     */
    function getToken(uint256 _tokenId) external view tokenExists(_tokenId) returns (Token memory) {
        return tokens[_tokenId];
    }

    // ============ TRANSFER MANAGEMENT ============
    
    /**
     * @dev Crear una transferencia de tokens
     * @param _tokenId ID del token a transferir
     * @param _to Dirección del receptor
     * @param _amount Cantidad a transferir
     * @param _metadata Metadata opcional de la transferencia
     */
    function createTransfer(
        uint256 _tokenId,
        address _to,
        uint256 _amount,
        string memory _metadata
    ) 
        external 
        whenNotPaused 
        onlyApprovedUser 
        tokenExists(_tokenId) 
        validAddress(_to) 
        validAmount(_amount) 
    {
        require(_to != msg.sender, "No puedes transferirte a ti mismo");
        require(balances[msg.sender][_tokenId] >= _amount, "Balance insuficiente");
        require(users[_to].status == UserStatus.Approved, "Receptor no aprobado");
        
        // Validar límite de metadata si se proporciona
        if (bytes(_metadata).length > 0) {
            require(bytes(_metadata).length <= MAX_METADATA_LENGTH, "Metadata muy larga");
        }
        
        // Validar cadena de suministro
        UserRole senderRole = users[msg.sender].role;
        UserRole receiverRole = users[_to].role;
        
        require(isValidTransfer(senderRole, receiverRole), "Transferencia no valida en la cadena");
        
        transferCounter++;
        uint256 newTransferId = transferCounter;
        
        transfers[newTransferId] = Transfer({
            transferId: newTransferId,
            tokenId: _tokenId,
            from: msg.sender,
            to: _to,
            amount: _amount,
            status: TransferStatus.Pending,
            timestamp: block.timestamp,
            metadata: _metadata
        });
        
        // Reservar el balance
        balances[msg.sender][_tokenId] -= _amount;
        
        emit TransferCreated(newTransferId, _tokenId, msg.sender, _to, _amount);
    }
    
    /**
     * @dev Aceptar una transferencia pendiente
     * @param _transferId ID de la transferencia
     */
    function acceptTransfer(uint256 _transferId) 
        external 
        whenNotPaused 
        onlyApprovedUser 
        nonReentrant 
    {
        Transfer storage transfer = transfers[_transferId];
        require(transfer.transferId != 0, "Transferencia no existe");
        require(transfer.to == msg.sender, "No eres el receptor");
        require(transfer.status == TransferStatus.Pending, "Transferencia no pendiente");
        
        // Validar que no haya expirado (opcional: solo si se implementa timeout)
        // require(block.timestamp <= transfer.timestamp + TRANSFER_TIMEOUT, "Transferencia expirada");
        
        transfer.status = TransferStatus.Accepted;
        
        // Transferir el balance al receptor
        balances[msg.sender][transfer.tokenId] += transfer.amount;
        
        emit TransferStatusChanged(_transferId, TransferStatus.Accepted);
        emit BalanceUpdated(msg.sender, transfer.tokenId, balances[msg.sender][transfer.tokenId]);
    }
    
    /**
     * @dev Rechazar una transferencia pendiente
     * @param _transferId ID de la transferencia
     */
    function rejectTransfer(uint256 _transferId) 
        external 
        whenNotPaused 
        onlyApprovedUser 
        nonReentrant 
    {
        Transfer storage transfer = transfers[_transferId];
        require(transfer.transferId != 0, "Transferencia no existe");
        require(transfer.to == msg.sender, "No eres el receptor");
        require(transfer.status == TransferStatus.Pending, "Transferencia no pendiente");
        
        transfer.status = TransferStatus.Rejected;
        
        // Devolver el balance al remitente
        balances[transfer.from][transfer.tokenId] += transfer.amount;
        
        emit TransferStatusChanged(_transferId, TransferStatus.Rejected);
        emit BalanceUpdated(transfer.from, transfer.tokenId, balances[transfer.from][transfer.tokenId]);
    }
    
    /**
     * @dev Validar si una transferencia entre roles es válida
     * @param _fromRole Rol del remitente
     * @param _toRole Rol del receptor
     * @return true si la transferencia es válida
     */
    function isValidTransfer(UserRole _fromRole, UserRole _toRole) internal pure returns (bool) {
        // Producer -> Factory
        if (_fromRole == UserRole.Producer && _toRole == UserRole.Factory) {
            return true;
        }
        // Factory -> Retailer
        if (_fromRole == UserRole.Factory && _toRole == UserRole.Retailer) {
            return true;
        }
        // Retailer -> Consumer
        if (_fromRole == UserRole.Retailer && _toRole == UserRole.Consumer) {
            return true;
        }
        return false;
    }
    
    /**
     * @dev Obtener información de una transferencia
     */
    function getTransfer(uint256 _transferId) external view returns (Transfer memory) {
        return transfers[_transferId];
    }
    
    /**
     * @dev Obtener balance de un usuario para un token
     */
    function getBalance(address _user, uint256 _tokenId) external view returns (uint256) {
        return balances[_user][_tokenId];
    }
    
    /**
     * @dev Obtener información de un usuario
     */
    function getUser(address _userAddress) external view returns (User memory) {
        return users[_userAddress];
    }
    
    /**
     * @dev Obtener total de usuarios registrados
     */
    function getRegisteredUsersCount() external view returns (uint256) {
        return registeredUsers.length;
    }
}


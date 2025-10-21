// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/* -------------------- A14: Librerías -------------------- */
library ArrayUtils {
    function removeSwap(address[] storage a, uint256 i) internal {
        require(i < a.length, "out of bounds");
        a[i] = a[a.length - 1];
        a.pop();
    }
}

library MathLib {
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }
}

/* -------------------- A13: Interface externa -------------------- */
interface INotifier {
    function notify(address who, uint256 what) external;
}

/* -------------------- A1: Ownable (lite) -------------------- */
contract OwnableLite {
    address public owner;

    error NotOwner();
    error ZeroAddress();

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address _owner) {
        if (_owner == address(0)) revert ZeroAddress();
        owner = _owner;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

/* -------------------- A6 + A10: Herencia múltiple + super -------------------- */
event Log(string m);

contract BaseAlpha {
    function who() public virtual returns (string memory) {
        emit Log("Alpha.who");
        return "Alpha";
    }
}

contract BaseBeta {
    function who() public virtual returns (string memory) {
        emit Log("Beta.who");
        return "Beta";
    }
}

contract MultiAB is BaseAlpha, BaseBeta {
    // El orden de lin. importa; super.who() seguirá MRO según "is BaseAlpha, BaseBeta"
    function who() public virtual override(BaseAlpha, BaseBeta) returns (string memory) {
        emit Log("MultiAB.who");
        return super.who(); // tomará la rama de BaseBeta en este orden (Beta→Alpha)
    }
}

/* -------------------- A11/A12/A3/A4/A7/A8/A9/A15/A16 integrados -------------------- */
contract AcademySuite is OwnableLite, MultiAB {
    using ArrayUtils for address[];

    // A11: inmutables
    address public immutable deployer;
    INotifier public immutable notifier; // puede ser address(0) si no se usa

    // A3: roles
    bytes32 public constant ADMIN = keccak256("ADMIN");
    mapping(bytes32 => mapping(address => bool)) public roles;

    event RoleGranted(bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 indexed role, address indexed account);

    // A4: mapping iterable (balances internos por address)
    mapping(address => uint256) public balance;
    mapping(address => bool) public inserted;
    address[] public keys;

    // A2: array + borrado swap
    address[] public members;

    // A7/A12: ether + eventos
    event Deposited(address indexed from, uint256 amount, bytes data);
    event Withdrawn(address indexed to, uint256 amount);
    event FallbackCalled(address indexed from, uint256 amount, bytes data);

    // A8: errores personalizados
    error NotAdmin();
    error NothingToWithdraw();
    error TransferFail();
    error AlreadyInserted();
    error MemberNotFound();

    // A16: ejemplo optimizado
    uint256 public counter;

    constructor(address _notifier) OwnableLite(msg.sender) {
        deployer = msg.sender;
        notifier = INotifier(_notifier);
        // owner ya es msg.sender por OwnableLite
        roles[ADMIN][owner] = true;
        emit RoleGranted(ADMIN, owner);
    }

    /* ---------- A12: receive/fallback ---------- */
    receive() external payable {
        balance[msg.sender] += msg.value;
        if (!inserted[msg.sender]) {
            inserted[msg.sender] = true;
            keys.push(msg.sender);
        }
        emit Deposited(msg.sender, msg.value, msg.data);
    }

    fallback() external payable {
        emit FallbackCalled(msg.sender, msg.value, msg.data);
    }

    /* ---------- A3: control de acceso (roles) ---------- */
    function grant(bytes32 r, address a) external onlyOwner {
        roles[r][a] = true;
        emit RoleGranted(r, a);
    }

    function revoke(bytes32 r, address a) external onlyOwner {
        roles[r][a] = false;
        emit RoleRevoked(r, a);
    }

    modifier onlyAdmin() {
        if (!roles[ADMIN][msg.sender]) revert NotAdmin();
        _;
    }

    // Alguna configuración protegida por ADMIN
    uint256 public configValue;

    function setConfig(uint256 v) external onlyAdmin {
        configValue = v;
    }

    /* ---------- A4: iterable map helpers ---------- */
    function setBalance(address k, uint256 v) external onlyAdmin {
        balance[k] = v;
        if (!inserted[k]) {
            inserted[k] = true;
            keys.push(k);
        }
    }

    function size() external view returns (uint256) {
        return keys.length;
    }

    function at(uint256 i) external view returns (address k, uint256 v) {
        k = keys[i];
        v = balance[k];
    }

    /* ---------- A2: members + removeSwap ---------- */
    function addMember(address m) external onlyAdmin {
        members.push(m);
    }

    function removeMember(uint256 i) external onlyAdmin {
        if (i >= members.length) revert MemberNotFound();
        members.removeSwap(i);
    }

    /* ---------- A7: enviar ETH con call (CEI) ---------- */
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        if (amount == 0 || amount > address(this).balance) revert NothingToWithdraw();
        (bool ok,) = to.call{value: amount}("");
        if (!ok) revert TransferFail();
        emit Withdrawn(to, amount);
    }

    /* ---------- A9 + A13: llamar otro contrato vía interface ---------- */
    function notifyExternal(address who, uint256 what) external onlyAdmin {
        if (address(notifier) != address(0)) {
            notifier.notify(who, what);
        }
    }

    /* ---------- A6 + A10: exponer who() del múltiple ---------- */
    function multiWho() external returns (string memory) {
        return who(); // de MultiAB (usa super)
    }

    /* ---------- A15: selfdestruct (kill switch) ---------- */
    function destroy(address payable to) external onlyOwner {
        selfdestruct(to);
    }

    /* ---------- A16: función “optimizada” sobre array ---------- */
    function sumSmallEvens(uint256[] calldata n) external {
        uint256 _c = counter;
        uint256 L = n.length;
        for (uint256 i = 0; i < L; ++i) {
            uint256 v = n[i];
            // par y < 100
            if ((v & 1) == 0 && v < 100) {
                _c += 1;
            }
        }
        counter = _c;
    }
}

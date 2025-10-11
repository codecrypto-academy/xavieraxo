// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessRoles {
    event RoleGranted(bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 indexed role, address indexed account);
    mapping(bytes32 => mapping(address => bool)) public roles;

    bytes32 public constant ADMIN = keccak256("admin");
    modifier onlyAdmin() {
        require(roles[ADMIN][msg.sender], "not admin"); _;
    }

    constructor() { roles[ADMIN][msg.sender] = true; emit RoleGranted(ADMIN, msg.sender); }

    function grant(bytes32 r, address a) external onlyAdmin {
        roles[r][a] = true; emit RoleGranted(r, a);
    }
    function revoke(bytes32 r, address a) external onlyAdmin {
        roles[r][a] = false; emit RoleRevoked(r, a);
    }
}

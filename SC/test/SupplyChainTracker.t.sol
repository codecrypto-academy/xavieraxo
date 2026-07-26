// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {SupplyChainTracker} from "../src/SupplyChainTracker.sol";

contract SupplyChainTrackerTest is Test {
    SupplyChainTracker public tracker;
    
    address public admin;
    address public producer;
    address public factory;
    address public retailer;
    address public consumer;
    
    function setUp() public {
        admin = address(this);
        producer = address(0x1);
        factory = address(0x2);
        retailer = address(0x3);
        consumer = address(0x4);
        
        tracker = new SupplyChainTracker();
    }
    
    // ============ USER REGISTRATION TESTS ============
    
    function test_AdminIsAutomaticallyRegistered() public {
        (address userAddress, , , ,) = tracker.users(admin);
        assertEq(userAddress, admin, "Admin deberia estar registrado");
    }
    
    function test_ProducerCanRegister() public {
        vm.prank(producer);
        tracker.registerUser(SupplyChainTracker.UserRole.Producer, "Productor 1");
        
        (address userAddress, SupplyChainTracker.UserRole role, SupplyChainTracker.UserStatus status, ,) = tracker.users(producer);
        assertEq(userAddress, producer, "Productor deberia estar registrado");
        assertEq(uint256(role), uint256(SupplyChainTracker.UserRole.Producer), "Rol deberia ser Producer");
        assertEq(uint256(status), uint256(SupplyChainTracker.UserStatus.Pending), "Estado deberia ser Pending");
    }
    
    function test_AdminApprovesUser() public {
        vm.prank(producer);
        tracker.registerUser(SupplyChainTracker.UserRole.Producer, "Productor 1");
        
        tracker.approveUser(producer);
        
        (,, SupplyChainTracker.UserStatus status,,) = tracker.users(producer);
        assertEq(uint256(status), uint256(SupplyChainTracker.UserStatus.Approved), "Estado deberia ser Approved");
    }
    
    function test_AdminRejectsUser() public {
        vm.prank(producer);
        tracker.registerUser(SupplyChainTracker.UserRole.Producer, "Productor 1");
        
        tracker.rejectUser(producer);
        
        (,, SupplyChainTracker.UserStatus status,,) = tracker.users(producer);
        assertEq(uint256(status), uint256(SupplyChainTracker.UserStatus.Rejected), "Estado deberia ser Rejected");
    }
    
    function test_OnlyAdminCanApprove() public {
        vm.prank(producer);
        tracker.registerUser(SupplyChainTracker.UserRole.Producer, "Productor 1");
        
        vm.prank(producer);
        vm.expectRevert("Solo administrador");
        tracker.approveUser(producer);
    }
    
    // ============ TOKEN TESTS ============
    
    function test_ProducerCreatesToken() public {
        // Setup: Registrar y aprobar productor
        vm.prank(producer);
        tracker.registerUser(SupplyChainTracker.UserRole.Producer, "Productor 1");
        tracker.approveUser(producer);
        
        // Crear token
        vm.prank(producer);
        string memory metadata = '{"nombre": "Trigo", "calidad": "A"}';
        uint256 tokenId = tracker.createToken(metadata, 0, 100);
        
        assertEq(tokenId, 1, "Token ID deberia ser 1");
        
        SupplyChainTracker.Token memory token = tracker.getToken(tokenId);
        assertEq(token.owner, producer, "Propietario deberia ser productor");
        assertEq(token.isRawMaterial, true, "Deberia ser materia prima");
        assertEq(tracker.getBalance(producer, tokenId), 100, "Balance deberia ser 100");
    }
    
    function test_FactoryCreatesProductFromRawMaterial() public {
        // Setup: Registrar y aprobar usuarios
        vm.prank(producer);
        tracker.registerUser(SupplyChainTracker.UserRole.Producer, "Productor 1");
        tracker.approveUser(producer);
        
        vm.prank(factory);
        tracker.registerUser(SupplyChainTracker.UserRole.Factory, "Factory 1");
        tracker.approveUser(factory);
        
        // Crear materia prima
        vm.prank(producer);
        string memory rawMetadata = '{"nombre": "Trigo"}';
        uint256 rawTokenId = tracker.createToken(rawMetadata, 0, 100);
        
        // Transferir materia prima a factory
        vm.prank(producer);
        tracker.createTransfer(rawTokenId, factory, 50, "");
        
        vm.prank(factory);
        tracker.acceptTransfer(1);
        
        // Factory crea producto terminado
        vm.prank(factory);
        string memory productMetadata = '{"nombre": "Harina"}';
        uint256 productTokenId = tracker.createToken(productMetadata, rawTokenId, 50);
        
        SupplyChainTracker.Token memory product = tracker.getToken(productTokenId);
        assertEq(product.parentTokenId, rawTokenId, "Deberia tener token padre");
        assertEq(product.isRawMaterial, false, "No deberia ser materia prima");
    }
    
    // ============ TRANSFER TESTS ============
    
    function test_ProducerTransfersToFactory() public {
        // Setup
        vm.prank(producer);
        tracker.registerUser(SupplyChainTracker.UserRole.Producer, "Productor 1");
        tracker.approveUser(producer);
        
        vm.prank(factory);
        tracker.registerUser(SupplyChainTracker.UserRole.Factory, "Factory 1");
        tracker.approveUser(factory);
        
        vm.prank(producer);
        uint256 tokenId = tracker.createToken('{"nombre": "Trigo"}', 0, 100);
        
        // Transferir
        vm.prank(producer);
        tracker.createTransfer(tokenId, factory, 50, "");
        
        SupplyChainTracker.Transfer memory transfer = tracker.getTransfer(1);
        assertEq(transfer.from, producer, "Remitente deberia ser productor");
        assertEq(transfer.to, factory, "Receptor deberia ser factory");
        assertEq(uint256(transfer.status), uint256(SupplyChainTracker.TransferStatus.Pending), "Estado deberia ser Pending");
    }
    
    function test_FactoryAcceptsTransfer() public {
        // Setup
        vm.prank(producer);
        tracker.registerUser(SupplyChainTracker.UserRole.Producer, "Productor 1");
        tracker.approveUser(producer);
        
        vm.prank(factory);
        tracker.registerUser(SupplyChainTracker.UserRole.Factory, "Factory 1");
        tracker.approveUser(factory);
        
        vm.prank(producer);
        uint256 tokenId = tracker.createToken('{"nombre": "Trigo"}', 0, 100);
        
        vm.prank(producer);
        tracker.createTransfer(tokenId, factory, 50, "");
        
        uint256 balanceBefore = tracker.getBalance(factory, tokenId);
        
        vm.prank(factory);
        tracker.acceptTransfer(1);
        
        SupplyChainTracker.Transfer memory transfer = tracker.getTransfer(1);
        assertEq(uint256(transfer.status), uint256(SupplyChainTracker.TransferStatus.Accepted), "Estado deberia ser Accepted");
        
        uint256 balanceAfter = tracker.getBalance(factory, tokenId);
        assertEq(balanceAfter, balanceBefore + 50, "Balance deberia incrementar");
    }
    
    function test_ProducerCannotTransferToRetailer() public {
        // Setup
        vm.prank(producer);
        tracker.registerUser(SupplyChainTracker.UserRole.Producer, "Productor 1");
        tracker.approveUser(producer);
        
        vm.prank(retailer);
        tracker.registerUser(SupplyChainTracker.UserRole.Retailer, "Retailer 1");
        tracker.approveUser(retailer);
        
        vm.prank(producer);
        uint256 tokenId = tracker.createToken('{"nombre": "Trigo"}', 0, 100);
        
        // Esta transferencia debería fallar
        vm.prank(producer);
        vm.expectRevert();
        tracker.createTransfer(tokenId, retailer, 50, "");
    }
    
    function test_RetailerRejectsTransfer() public {
        // Setup
        vm.prank(factory);
        tracker.registerUser(SupplyChainTracker.UserRole.Factory, "Factory 1");
        tracker.approveUser(factory);
        
        vm.prank(retailer);
        tracker.registerUser(SupplyChainTracker.UserRole.Retailer, "Retailer 1");
        tracker.approveUser(retailer);
        
        vm.prank(factory);
        uint256 tokenId = tracker.createToken('{"nombre": "Harina"}', 0, 100);
        
        vm.prank(factory);
        tracker.createTransfer(tokenId, retailer, 50, "");
        
        uint256 factoryBalanceBefore = tracker.getBalance(factory, tokenId);
        
        vm.prank(retailer);
        tracker.rejectTransfer(1);
        
        SupplyChainTracker.Transfer memory transfer = tracker.getTransfer(1);
        assertEq(uint256(transfer.status), uint256(SupplyChainTracker.TransferStatus.Rejected), "Estado deberia ser Rejected");
        
        uint256 factoryBalanceAfter = tracker.getBalance(factory, tokenId);
        assertEq(factoryBalanceAfter, factoryBalanceBefore + 50, "Balance deberia volver a factory");
    }
    
    // ============ FULL SUPPLY CHAIN TEST ============
    
    function test_FullSupplyChainFlow() public {
        // 1. Registrar todos los usuarios
        vm.prank(producer);
        tracker.registerUser(SupplyChainTracker.UserRole.Producer, "Productor 1");
        tracker.approveUser(producer);
        
        vm.prank(factory);
        tracker.registerUser(SupplyChainTracker.UserRole.Factory, "Factory 1");
        tracker.approveUser(factory);
        
        vm.prank(retailer);
        tracker.registerUser(SupplyChainTracker.UserRole.Retailer, "Retailer 1");
        tracker.approveUser(retailer);
        
        vm.prank(consumer);
        tracker.registerUser(SupplyChainTracker.UserRole.Consumer, "Consumer 1");
        tracker.approveUser(consumer);
        
        // 2. Producer crea materia prima
        vm.prank(producer);
        uint256 rawMaterialId = tracker.createToken('{"nombre": "Trigo", "cantidad": "1 ton"}', 0, 100);
        
        // 3. Producer -> Factory
        vm.prank(producer);
        tracker.createTransfer(rawMaterialId, factory, 100, "");
        vm.prank(factory);
        tracker.acceptTransfer(1);
        
        // 4. Factory crea producto terminado
        vm.prank(factory);
        uint256 productId = tracker.createToken('{"nombre": "Harina", "peso": "500kg"}', rawMaterialId, 100);
        
        // 5. Factory -> Retailer
        vm.prank(factory);
        tracker.createTransfer(productId, retailer, 100, "");
        vm.prank(retailer);
        tracker.acceptTransfer(2);
        
        // 6. Retailer -> Consumer
        vm.prank(retailer);
        tracker.createTransfer(productId, consumer, 50, "");
        vm.prank(consumer);
        tracker.acceptTransfer(3);
        
        // Verificaciones finales
        assertEq(tracker.getBalance(consumer, productId), 50, "Consumer deberia tener 50 unidades");
        assertEq(tracker.getBalance(retailer, productId), 50, "Retailer deberia tener 50 unidades");
        
        SupplyChainTracker.Transfer memory finalTransfer = tracker.getTransfer(3);
        assertEq(uint256(finalTransfer.status), uint256(SupplyChainTracker.TransferStatus.Accepted), "Transferencia final deberia ser aceptada");
    }

    // ============ TRANSFER TIMEOUT TESTS ============

    function _setupProducerFactoryWithPendingTransfer() internal returns (uint256 transferId, uint256 tokenId) {
        vm.prank(producer);
        tracker.registerUser(SupplyChainTracker.UserRole.Producer, "Productor 1");
        tracker.approveUser(producer);

        vm.prank(factory);
        tracker.registerUser(SupplyChainTracker.UserRole.Factory, "Factory 1");
        tracker.approveUser(factory);

        vm.prank(producer);
        tokenId = tracker.createToken('{"nombre": "Trigo"}', 0, 100);

        vm.prank(producer);
        tracker.createTransfer(tokenId, factory, 40, "");
        transferId = 1;
    }

    function test_CannotAcceptExpiredTransfer() public {
        (uint256 transferId,) = _setupProducerFactoryWithPendingTransfer();

        vm.warp(block.timestamp + tracker.TRANSFER_TIMEOUT() + 1);

        vm.prank(factory);
        vm.expectRevert("Transferencia expirada");
        tracker.acceptTransfer(transferId);
    }

    function test_CannotRejectExpiredTransfer() public {
        (uint256 transferId,) = _setupProducerFactoryWithPendingTransfer();

        vm.warp(block.timestamp + tracker.TRANSFER_TIMEOUT() + 1);

        vm.prank(factory);
        vm.expectRevert("Transferencia expirada");
        tracker.rejectTransfer(transferId);
    }

    function test_ExpireTransferReturnsBalanceToSender() public {
        (uint256 transferId, uint256 tokenId) = _setupProducerFactoryWithPendingTransfer();

        assertEq(tracker.getBalance(producer, tokenId), 60, "Balance reservado deberia restar 40");
        assertTrue(tracker.isTransferExpired(transferId) == false, "Aun no deberia estar expirada");

        vm.warp(block.timestamp + tracker.TRANSFER_TIMEOUT() + 1);
        assertTrue(tracker.isTransferExpired(transferId), "Deberia estar expirada");

        tracker.expireTransfer(transferId);

        SupplyChainTracker.Transfer memory transfer = tracker.getTransfer(transferId);
        assertEq(uint256(transfer.status), uint256(SupplyChainTracker.TransferStatus.Expired), "Estado Expired");
        assertEq(tracker.getBalance(producer, tokenId), 100, "Balance debe devolverse al emisor");
        assertEq(tracker.getBalance(factory, tokenId), 0, "Receptor no debe recibir balance");
    }

    function test_CannotExpireBeforeTimeout() public {
        (uint256 transferId,) = _setupProducerFactoryWithPendingTransfer();

        vm.expectRevert("Transferencia no expirada");
        tracker.expireTransfer(transferId);
    }
}


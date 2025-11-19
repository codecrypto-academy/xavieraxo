// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MiPrimerContrato.sol";

/**
 * @title MiPrimerContratoTest
 * @notice Tests para el contrato MiPrimerContrato
 * @dev Demuestra patrones de testing en Foundry:
 *      - setUp() para inicialización
 *      - Assertions (assertEq, assertTrue, etc.)
 *      - Testing de eventos
 *      - Testing de requires/reverts
 *      - vm.prank() para simular diferentes usuarios
 *      - vm.expectRevert() para esperar errores
 */
contract MiPrimerContratoTest is Test {
    // ============================================
    // VARIABLES
    // ============================================
    
    MiPrimerContrato public contrato;
    address public owner;
    address public usuario1;
    address public usuario2;
    
    string constant MENSAJE_INICIAL = "Hola Foundry!";
    
    // ============================================
    // SETUP
    // ============================================
    
    /**
     * @notice Se ejecuta antes de cada test
     * @dev Inicializa el contrato y las direcciones de prueba
     */
    function setUp() public {
        owner = address(this);
        usuario1 = address(0x1);
        usuario2 = address(0x2);
        
        // Desplegar el contrato
        contrato = new MiPrimerContrato(MENSAJE_INICIAL);
    }
    
    // ============================================
    // TESTS: CONSTRUCTOR Y ESTADO INICIAL
    // ============================================
    
    function testConstructor() public view {
        assertEq(contrato.obtenerMensaje(), MENSAJE_INICIAL, "Mensaje inicial incorrecto");
        assertEq(contrato.contador(), 0, "Contador inicial debe ser 0");
        assertEq(contrato.owner(), owner, "Owner incorrecto");
    }
    
    // ============================================
    // TESTS: FUNCIONES DE MENSAJE
    // ============================================
    
    function testObtenerMensaje() public view {
        string memory mensaje = contrato.obtenerMensaje();
        assertEq(mensaje, MENSAJE_INICIAL, "El mensaje no coincide");
    }
    
    function testCambiarMensaje() public {
        string memory nuevoMensaje = "Nuevo mensaje";
        
        // Esperar que se emita el evento
        vm.expectEmit(true, false, false, true);
        emit MiPrimerContrato.MensajeCambiado(nuevoMensaje, owner);
        
        contrato.cambiarMensaje(nuevoMensaje);
        
        assertEq(contrato.obtenerMensaje(), nuevoMensaje, "El mensaje no se cambio correctamente");
    }
    
    function testCambiarMensajeNoOwner() public {
        string memory nuevoMensaje = "Intento de cambio";
        
        // Simular que usuario1 intenta cambiar el mensaje
        vm.prank(usuario1);
        
        // Esperar que falle con OwnableUnauthorizedAccount
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                usuario1
            )
        );
        
        contrato.cambiarMensaje(nuevoMensaje);
    }
    
    function testCambiarMensajeVacio() public {
        // Esperar que falle con el mensaje de error
        vm.expectRevert("El mensaje no puede estar vacio");
        contrato.cambiarMensaje("");
    }
    
    // ============================================
    // TESTS: FUNCIONES DE CONTADOR
    // ============================================
    
    function testIncrementar() public {
        // Esperar evento
        vm.expectEmit(false, false, false, true);
        emit MiPrimerContrato.ContadorIncrementado(1);
        
        contrato.incrementar();
        
        assertEq(contrato.contador(), 1, "Contador debe ser 1");
        
        // Incrementar nuevamente
        contrato.incrementar();
        assertEq(contrato.contador(), 2, "Contador debe ser 2");
    }
    
    function testIncrementarPor() public {
        uint256 cantidad = 5;
        
        vm.expectEmit(false, false, false, true);
        emit MiPrimerContrato.ContadorIncrementado(cantidad);
        
        contrato.incrementarPor(cantidad);
        
        assertEq(contrato.contador(), cantidad, "Contador incorrecto");
    }
    
    function testIncrementarPorCero() public {
        vm.expectRevert("La cantidad debe ser mayor que 0");
        contrato.incrementarPor(0);
    }
    
    function testReiniciarContador() public {
        // Primero incrementar
        contrato.incrementarPor(10);
        assertEq(contrato.contador(), 10, "Contador debe ser 10");
        
        // Reiniciar
        vm.expectEmit(false, false, false, true);
        emit MiPrimerContrato.ContadorIncrementado(0);
        
        contrato.reiniciarContador();
        
        assertEq(contrato.contador(), 0, "Contador debe ser 0");
    }
    
    function testReiniciarContadorNoOwner() public {
        vm.prank(usuario1);
        
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                usuario1
            )
        );
        
        contrato.reiniciarContador();
    }
    
    // ============================================
    // TESTS: FUZZING
    // ============================================
    
    /**
     * @notice Test de fuzzing para incrementarPor
     * @dev Foundry ejecutará este test con múltiples valores aleatorios
     */
    function testFuzzIncrementarPor(uint256 cantidad) public {
        // Limitar el rango para evitar overflow
        vm.assume(cantidad > 0 && cantidad < type(uint256).max);
        
        contrato.incrementarPor(cantidad);
        assertEq(contrato.contador(), cantidad, "Contador incorrecto en fuzzing");
    }
    
    /**
     * @notice Test de fuzzing para cambiarMensaje
     */
    function testFuzzCambiarMensaje(string memory nuevoMensaje) public {
        // Asegurar que el mensaje no esté vacío
        vm.assume(bytes(nuevoMensaje).length > 0);
        
        contrato.cambiarMensaje(nuevoMensaje);
        assertEq(contrato.obtenerMensaje(), nuevoMensaje, "Mensaje incorrecto en fuzzing");
    }
    
    // ============================================
    // TESTS: MÚLTIPLES USUARIOS
    // ============================================
    
    function testMultiplesUsuariosPuedenIncrementar() public {
        // Usuario 1 incrementa
        vm.prank(usuario1);
        contrato.incrementar();
        assertEq(contrato.contador(), 1, "Contador debe ser 1");
        
        // Usuario 2 incrementa
        vm.prank(usuario2);
        contrato.incrementar();
        assertEq(contrato.contador(), 2, "Contador debe ser 2");
        
        // Owner incrementa
        contrato.incrementar();
        assertEq(contrato.contador(), 3, "Contador debe ser 3");
    }
}


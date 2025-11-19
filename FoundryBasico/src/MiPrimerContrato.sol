// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MiPrimerContrato
 * @notice Contrato de ejemplo básico para aprender Foundry
 * @dev Este contrato demuestra:
 *      - Herencia de Ownable de OpenZeppelin
 *      - Variables de estado
 *      - Funciones getter y setter
 *      - Eventos
 *      - Modificadores de acceso
 */
contract MiPrimerContrato is Ownable {
    // ============================================
    // VARIABLES DE ESTADO
    // ============================================
    
    /// @notice Mensaje almacenado en el contrato
    string private mensaje;
    
    /// @notice Contador simple
    uint256 public contador;
    
    // ============================================
    // EVENTOS
    // ============================================
    
    /// @notice Se emite cuando el mensaje cambia
    /// @param nuevoMensaje El nuevo mensaje que se estableció
    /// @param cambiador La dirección que cambió el mensaje
    event MensajeCambiado(string nuevoMensaje, address indexed cambiador);
    
    /// @notice Se emite cuando el contador se incrementa
    /// @param nuevoValor El nuevo valor del contador
    event ContadorIncrementado(uint256 nuevoValor);
    
    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    /**
     * @notice Constructor del contrato
     * @param _mensajeInicial El mensaje inicial del contrato
     */
    constructor(string memory _mensajeInicial) Ownable(msg.sender) {
        mensaje = _mensajeInicial;
        contador = 0;
    }
    
    // ============================================
    // FUNCIONES PÚBLICAS
    // ============================================
    
    /**
     * @notice Obtiene el mensaje actual
     * @return El mensaje almacenado
     */
    function obtenerMensaje() public view returns (string memory) {
        return mensaje;
    }
    
    /**
     * @notice Cambia el mensaje (solo el propietario)
     * @param _nuevoMensaje El nuevo mensaje a establecer
     */
    function cambiarMensaje(string memory _nuevoMensaje) public onlyOwner {
        require(bytes(_nuevoMensaje).length > 0, "El mensaje no puede estar vacio");
        mensaje = _nuevoMensaje;
        emit MensajeCambiado(_nuevoMensaje, msg.sender);
    }
    
    /**
     * @notice Incrementa el contador en 1
     */
    function incrementar() public {
        contador++;
        emit ContadorIncrementado(contador);
    }
    
    /**
     * @notice Incrementa el contador por una cantidad específica
     * @param _cantidad La cantidad a incrementar
     */
    function incrementarPor(uint256 _cantidad) public {
        require(_cantidad > 0, "La cantidad debe ser mayor que 0");
        contador += _cantidad;
        emit ContadorIncrementado(contador);
    }
    
    /**
     * @notice Reinicia el contador a 0 (solo el propietario)
     */
    function reiniciarContador() public onlyOwner {
        contador = 0;
        emit ContadorIncrementado(0);
    }
}


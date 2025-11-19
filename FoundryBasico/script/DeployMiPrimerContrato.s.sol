// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MiPrimerContrato.sol";

/**
 * @title DeployMiPrimerContrato
 * @notice Script de deployment para MiPrimerContrato
 * @dev Para ejecutar:
 *      forge script script/DeployMiPrimerContrato.s.sol:DeployMiPrimerContrato
 * 
 *      Para deployar en una red:
 *      forge script script/DeployMiPrimerContrato.s.sol:DeployMiPrimerContrato \
 *          --rpc-url <RPC_URL> \
 *          --private-key <PRIVATE_KEY> \
 *          --broadcast
 */
contract DeployMiPrimerContrato is Script {
    function run() external returns (MiPrimerContrato) {
        // Mensaje inicial para el contrato
        string memory mensajeInicial = "Hola desde Foundry!";
        
        // Comenzar el broadcast de transacciones
        vm.startBroadcast();
        
        // Desplegar el contrato
        MiPrimerContrato contrato = new MiPrimerContrato(mensajeInicial);
        
        // Finalizar el broadcast
        vm.stopBroadcast();
        
        // Logs de información
        console.log("Contrato desplegado en:", address(contrato));
        console.log("Owner:", contrato.owner());
        console.log("Mensaje inicial:", contrato.obtenerMensaje());
        
        return contrato;
    }
}


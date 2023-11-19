// SPDX-License-Identifire: MIT

pragma solidity ^0.8.19;

import "hardhat/console.sol";

contract WavePortal {
    uint256 private _totalWaves;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; //Waveを実行したユーザーのアドレス
        string message; //ユーザーが送ったメッセージ
        uint256 timestamp; // Waveを実行したタイムスタンプ
    }

    Wave[] private _waves;

    constructor() {
        console.log("WavePortal - Smart Contract!");
    }

    function wave(string memory _message) public {
        _totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);

        _waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return _waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", _totalWaves);
        return _totalWaves;
    }
}

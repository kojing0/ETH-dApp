// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "hardhat/console.sol";

contract WavePortal {
    uint256 private _totalWaves;
    uint256 private _seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; //Waveを実行したユーザーのアドレス
        string message; //ユーザーが送ったメッセージ
        uint256 timestamp; // Waveを実行したタイムスタンプ
        uint256 seed;
    }

    Wave[] private _waves;

    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("We have been constructed!");
        _seed = (block.timestamp + block.prevrandao) % 100;
    }

    function wave(string memory _message) public {
        // 現在ユーザーがwaveを送信している時刻と、前回waveを送信した時刻が15分以上離れていることを確認。
        require(lastWavedAt[msg.sender] + 15 minutes < block.timestamp);

        // ユーザーのタイムスタンプを更新
        lastWavedAt[msg.sender] = block.timestamp;

        _totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);

        _seed = (block.prevrandao + block.timestamp + _seed) % 100;
        _waves.push(Wave(msg.sender, _message, block.timestamp, _seed));
        console.log("Random # generated: %d", _seed);

        if (_seed <= 50) {
            console.log("%s won!", msg.sender);
            // waveを送ってくれたユーザーに0.0001ETHを送る
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
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

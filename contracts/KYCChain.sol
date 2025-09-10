// SPDX-License-Identifier
MIT
pragma solidity ^0.8.17;

contract KYCChain {
    address public admin;
    mapping(address => bool) public verifiedUsers;
    mapping(address => string) private userMetadata;

    event UserVerified(address indexed user, string metadata);
    event UserRevoked(address indexed user);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function verifyUser(address user, string calldata metadata) external onlyAdmin {
        verifiedUsers[user] = true;
        userMetadata[user] = metadata;
        emit UserVerified(user, metadata);
    }

    function revokeUser(address user) external onlyAdmin {
        verifiedUsers[user] = false;
        emit UserRevoked(user);
    }

    function isUserVerified(address user) external view returns (bool) {
        return verifiedUsers[user];
    }

    function getUserMetadata(address user) external view returns (string memory) {
        require(verifiedUsers[user], "User not verified");
        return userMetadata[user];
    }
}

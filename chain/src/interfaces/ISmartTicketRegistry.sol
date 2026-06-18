// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

interface ISmartTicketRegistry {
    enum RightStatus {
        ACTIVE,
        SUSPENDED,
        EXPIRED,
        REVOKED
    }

    enum SupportStatus {
        UNKNOWN,
        AUTHORIZED,
        REVOKED
    }

    struct RightRecord {
        bytes32 rightId;
        bytes32 holderCommitment;
        RightStatus status;
        uint64 validUntil;
        uint64 updatedAt;
        bool exists;
    }

    struct SupportRecord {
        SupportStatus status;
        uint64 updatedAt;
    }

    event RightRegistered(bytes32 indexed rightId, uint64 validUntil);
    event RightStatusUpdated(bytes32 indexed rightId, RightStatus oldStatus, RightStatus newStatus, uint64 updatedAt);
    event SupportAuthorized(bytes32 indexed rightId, bytes32 indexed supportCommitment, uint64 updatedAt);
    event SupportRevoked(bytes32 indexed rightId, bytes32 indexed supportCommitment, uint64 updatedAt);

    error InvalidAdmin();
    error InvalidRegistrar();
    error InvalidRightId();
    error InvalidHolderCommitment();
    error InvalidSupportCommitment();
    error InvalidValidUntil();
    error RightAlreadyExists(bytes32 rightId);
    error RightNotFound(bytes32 rightId);
    error SupportAlreadyKnown(bytes32 rightId, bytes32 supportCommitment);
    error SupportNotAuthorized(bytes32 rightId, bytes32 supportCommitment);

    function REGISTRAR_ROLE() external view returns (bytes32);

    function registerRight(bytes32 rightId, bytes32 holderCommitment, uint64 validUntil) external;

    function updateRightStatus(bytes32 rightId, RightStatus newStatus) external;

    function authorizeSupport(bytes32 rightId, bytes32 supportCommitment) external;

    function revokeSupport(bytes32 rightId, bytes32 supportCommitment) external;

    function replaceSupport(bytes32 rightId, bytes32 oldSupportCommitment, bytes32 newSupportCommitment) external;

    function getRight(bytes32 rightId) external view returns (RightRecord memory);

    function getSupport(bytes32 rightId, bytes32 supportCommitment) external view returns (SupportRecord memory);

    function matchesHolder(bytes32 rightId, bytes32 holderCommitment) external view returns (bool);

    function isValid(bytes32 rightId) external view returns (bool);

    function isValidForSupport(bytes32 rightId, bytes32 supportCommitment) external view returns (bool);
}


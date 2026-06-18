// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {ISmartTicketRegistry} from "./interfaces/ISmartTicketRegistry.sol";

contract SmartTicketRegistry is AccessControl, ISmartTicketRegistry {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    mapping(bytes32 rightId => RightRecord record) private _rights;
    mapping(bytes32 rightId => mapping(bytes32 supportCommitment => SupportRecord record)) private _rightSupports;

    constructor(address admin, address registrar) {
        if (admin == address(0)) {
            revert InvalidAdmin();
        }
        if (registrar == address(0)) {
            revert InvalidRegistrar();
        }

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, registrar);
    }

    function registerRight(bytes32 rightId, bytes32 holderCommitment, uint64 validUntil)
        external
        onlyRole(REGISTRAR_ROLE)
    {
        _requireRightId(rightId);
        if (holderCommitment == bytes32(0)) {
            revert InvalidHolderCommitment();
        }
        if (validUntil <= block.timestamp) {
            revert InvalidValidUntil();
        }
        if (_rights[rightId].exists) {
            revert RightAlreadyExists(rightId);
        }

        _rights[rightId] = RightRecord({
            rightId: rightId,
            holderCommitment: holderCommitment,
            status: RightStatus.ACTIVE,
            validUntil: validUntil,
            updatedAt: _now64(),
            exists: true
        });

        emit RightRegistered(rightId, validUntil);
    }

    function updateRightStatus(bytes32 rightId, RightStatus newStatus) external onlyRole(REGISTRAR_ROLE) {
        RightRecord storage right = _requireRight(rightId);
        RightStatus oldStatus = right.status;

        right.status = newStatus;
        right.updatedAt = _now64();

        emit RightStatusUpdated(rightId, oldStatus, newStatus, right.updatedAt);
    }

    function authorizeSupport(bytes32 rightId, bytes32 supportCommitment) external onlyRole(REGISTRAR_ROLE) {
        _requireRight(rightId);
        _requireSupportCommitment(supportCommitment);

        SupportRecord storage support = _rightSupports[rightId][supportCommitment];
        if (support.status != SupportStatus.UNKNOWN) {
            revert SupportAlreadyKnown(rightId, supportCommitment);
        }

        support.status = SupportStatus.AUTHORIZED;
        support.updatedAt = _now64();

        emit SupportAuthorized(rightId, supportCommitment, support.updatedAt);
    }

    function revokeSupport(bytes32 rightId, bytes32 supportCommitment) external onlyRole(REGISTRAR_ROLE) {
        _revokeAuthorizedSupport(rightId, supportCommitment);
    }

    function replaceSupport(bytes32 rightId, bytes32 oldSupportCommitment, bytes32 newSupportCommitment)
        external
        onlyRole(REGISTRAR_ROLE)
    {
        _requireRight(rightId);
        _requireSupportCommitment(oldSupportCommitment);
        _requireSupportCommitment(newSupportCommitment);

        SupportRecord storage oldSupport = _rightSupports[rightId][oldSupportCommitment];
        if (oldSupport.status != SupportStatus.AUTHORIZED) {
            revert SupportNotAuthorized(rightId, oldSupportCommitment);
        }

        SupportRecord storage newSupport = _rightSupports[rightId][newSupportCommitment];
        if (newSupport.status != SupportStatus.UNKNOWN) {
            revert SupportAlreadyKnown(rightId, newSupportCommitment);
        }

        uint64 updatedAt = _now64();
        oldSupport.status = SupportStatus.REVOKED;
        oldSupport.updatedAt = updatedAt;

        newSupport.status = SupportStatus.AUTHORIZED;
        newSupport.updatedAt = updatedAt;

        emit SupportRevoked(rightId, oldSupportCommitment, updatedAt);
        emit SupportAuthorized(rightId, newSupportCommitment, updatedAt);
    }

    function getRight(bytes32 rightId) external view returns (RightRecord memory) {
        return _rights[rightId];
    }

    function getSupport(bytes32 rightId, bytes32 supportCommitment) external view returns (SupportRecord memory) {
        return _rightSupports[rightId][supportCommitment];
    }

    function matchesHolder(bytes32 rightId, bytes32 holderCommitment) external view returns (bool) {
        RightRecord storage right = _rights[rightId];

        return right.exists && holderCommitment != bytes32(0) && right.holderCommitment == holderCommitment;
    }

    function isValid(bytes32 rightId) public view returns (bool) {
        RightRecord storage right = _rights[rightId];

        return right.exists && right.status == RightStatus.ACTIVE && block.timestamp <= right.validUntil;
    }

    function isValidForSupport(bytes32 rightId, bytes32 supportCommitment) external view returns (bool) {
        return isValid(rightId) && _rightSupports[rightId][supportCommitment].status == SupportStatus.AUTHORIZED;
    }

    function _revokeAuthorizedSupport(bytes32 rightId, bytes32 supportCommitment) private {
        _requireRight(rightId);
        _requireSupportCommitment(supportCommitment);

        SupportRecord storage support = _rightSupports[rightId][supportCommitment];
        if (support.status != SupportStatus.AUTHORIZED) {
            revert SupportNotAuthorized(rightId, supportCommitment);
        }

        support.status = SupportStatus.REVOKED;
        support.updatedAt = _now64();

        emit SupportRevoked(rightId, supportCommitment, support.updatedAt);
    }

    function _requireRight(bytes32 rightId) private view returns (RightRecord storage right) {
        _requireRightId(rightId);

        right = _rights[rightId];
        if (!right.exists) {
            revert RightNotFound(rightId);
        }
    }

    function _requireRightId(bytes32 rightId) private pure {
        if (rightId == bytes32(0)) {
            revert InvalidRightId();
        }
    }

    function _requireSupportCommitment(bytes32 supportCommitment) private pure {
        if (supportCommitment == bytes32(0)) {
            revert InvalidSupportCommitment();
        }
    }

    function _now64() private view returns (uint64) {
        return uint64(block.timestamp);
    }
}


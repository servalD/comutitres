// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {Test} from "forge-std/Test.sol";

import {ISmartTicketRegistry} from "../src/interfaces/ISmartTicketRegistry.sol";
import {SmartTicketRegistry} from "../src/SmartTicketRegistry.sol";

contract SmartTicketRegistryTest is Test {
    event RightRegistered(bytes32 indexed rightId, uint64 validUntil);
    event RightStatusUpdated(
        bytes32 indexed rightId,
        ISmartTicketRegistry.RightStatus oldStatus,
        ISmartTicketRegistry.RightStatus newStatus,
        uint64 updatedAt
    );
    event SupportAuthorized(bytes32 indexed rightId, bytes32 indexed supportCommitment, uint64 updatedAt);
    event SupportRevoked(bytes32 indexed rightId, bytes32 indexed supportCommitment, uint64 updatedAt);

    address private constant ADMIN = address(0xA11CE);
    address private constant REGISTRAR = address(0xB0B);
    address private constant UNAUTHORIZED = address(0xBAD);

    bytes32 private constant RIGHT_ID = keccak256("right:comutitres:demo:2026");
    bytes32 private constant HOLDER_COMMITMENT = keccak256("holder:commitment:demo");
    bytes32 private constant SUPPORT_A = keccak256("support:card:demo");
    bytes32 private constant SUPPORT_B = keccak256("support:phone:demo");
    bytes32 private constant UNKNOWN_SUPPORT = keccak256("support:watch:demo");

    SmartTicketRegistry private registry;
    uint64 private validUntil;

    function setUp() public {
        registry = new SmartTicketRegistry(ADMIN, REGISTRAR);
        validUntil = uint64(block.timestamp + 30 days);
    }

    function testConstructorGrantsAdminAndRegistrarRoles() public view {
        assertTrue(registry.hasRole(registry.DEFAULT_ADMIN_ROLE(), ADMIN));
        assertTrue(registry.hasRole(registry.REGISTRAR_ROLE(), REGISTRAR));
        assertFalse(registry.hasRole(registry.REGISTRAR_ROLE(), UNAUTHORIZED));
    }

    function testConstructorRejectsZeroAddresses() public {
        vm.expectRevert(ISmartTicketRegistry.InvalidAdmin.selector);
        new SmartTicketRegistry(address(0), REGISTRAR);

        vm.expectRevert(ISmartTicketRegistry.InvalidRegistrar.selector);
        new SmartTicketRegistry(ADMIN, address(0));
    }

    function testRegisterRightStoresActiveRecord() public {
        vm.expectEmit(true, false, false, true);
        emit RightRegistered(RIGHT_ID, validUntil);

        vm.prank(REGISTRAR);
        registry.registerRight(RIGHT_ID, HOLDER_COMMITMENT, validUntil);

        ISmartTicketRegistry.RightRecord memory record = registry.getRight(RIGHT_ID);
        assertEq(record.rightId, RIGHT_ID);
        assertEq(record.holderCommitment, HOLDER_COMMITMENT);
        assertEq(uint8(record.status), uint8(ISmartTicketRegistry.RightStatus.ACTIVE));
        assertEq(record.validUntil, validUntil);
        assertEq(record.updatedAt, uint64(block.timestamp));
        assertTrue(record.exists);
        assertTrue(registry.isValid(RIGHT_ID));
    }

    function testRegisterRightRequiresRegistrarRole() public {
        bytes memory expectedRevert = abi.encodeWithSelector(
            IAccessControl.AccessControlUnauthorizedAccount.selector, UNAUTHORIZED, registry.REGISTRAR_ROLE()
        );

        vm.expectRevert(expectedRevert);
        vm.prank(UNAUTHORIZED);
        registry.registerRight(RIGHT_ID, HOLDER_COMMITMENT, validUntil);
    }

    function testRegisterRightRejectsInvalidInputs() public {
        vm.startPrank(REGISTRAR);

        vm.expectRevert(ISmartTicketRegistry.InvalidRightId.selector);
        registry.registerRight(bytes32(0), HOLDER_COMMITMENT, validUntil);

        vm.expectRevert(ISmartTicketRegistry.InvalidHolderCommitment.selector);
        registry.registerRight(RIGHT_ID, bytes32(0), validUntil);

        vm.expectRevert(ISmartTicketRegistry.InvalidValidUntil.selector);
        registry.registerRight(RIGHT_ID, HOLDER_COMMITMENT, uint64(block.timestamp));

        vm.stopPrank();
    }

    function testRegisterRightRejectsDuplicateRightId() public {
        _registerRight();

        vm.expectRevert(abi.encodeWithSelector(ISmartTicketRegistry.RightAlreadyExists.selector, RIGHT_ID));
        vm.prank(REGISTRAR);
        registry.registerRight(RIGHT_ID, HOLDER_COMMITMENT, validUntil + 1);
    }

    function testUpdateRightStatusRequiresKnownRightAndRegistrar() public {
        vm.expectRevert(abi.encodeWithSelector(ISmartTicketRegistry.RightNotFound.selector, RIGHT_ID));
        vm.prank(REGISTRAR);
        registry.updateRightStatus(RIGHT_ID, ISmartTicketRegistry.RightStatus.SUSPENDED);

        _registerRight();

        bytes memory expectedRevert = abi.encodeWithSelector(
            IAccessControl.AccessControlUnauthorizedAccount.selector, UNAUTHORIZED, registry.REGISTRAR_ROLE()
        );
        vm.expectRevert(expectedRevert);
        vm.prank(UNAUTHORIZED);
        registry.updateRightStatus(RIGHT_ID, ISmartTicketRegistry.RightStatus.SUSPENDED);
    }

    function testUpdateRightStatusStoresStatusAndEmitsEvent() public {
        _registerRight();

        vm.warp(block.timestamp + 1 hours);
        uint64 updatedAt = uint64(block.timestamp);

        vm.expectEmit(true, false, false, true);
        emit RightStatusUpdated(
            RIGHT_ID, ISmartTicketRegistry.RightStatus.ACTIVE, ISmartTicketRegistry.RightStatus.SUSPENDED, updatedAt
        );

        vm.prank(REGISTRAR);
        registry.updateRightStatus(RIGHT_ID, ISmartTicketRegistry.RightStatus.SUSPENDED);

        ISmartTicketRegistry.RightRecord memory record = registry.getRight(RIGHT_ID);
        assertEq(uint8(record.status), uint8(ISmartTicketRegistry.RightStatus.SUSPENDED));
        assertEq(record.updatedAt, updatedAt);
        assertFalse(registry.isValid(RIGHT_ID));
    }

    function testIsValidRequiresExistingActiveAndNotExpiredRight() public {
        assertFalse(registry.isValid(RIGHT_ID));

        _registerRight();
        assertTrue(registry.isValid(RIGHT_ID));

        vm.warp(validUntil + 1);
        assertFalse(registry.isValid(RIGHT_ID));
    }

    function testAuthorizeSupportRequiresRegistrarAndKnownRight() public {
        vm.expectRevert(abi.encodeWithSelector(ISmartTicketRegistry.RightNotFound.selector, RIGHT_ID));
        vm.prank(REGISTRAR);
        registry.authorizeSupport(RIGHT_ID, SUPPORT_A);

        _registerRight();

        bytes memory expectedRevert = abi.encodeWithSelector(
            IAccessControl.AccessControlUnauthorizedAccount.selector, UNAUTHORIZED, registry.REGISTRAR_ROLE()
        );
        vm.expectRevert(expectedRevert);
        vm.prank(UNAUTHORIZED);
        registry.authorizeSupport(RIGHT_ID, SUPPORT_A);
    }

    function testAuthorizeSupportStoresAuthorizedSupportAndEmitsEvent() public {
        _registerRight();

        vm.expectEmit(true, true, false, true);
        emit SupportAuthorized(RIGHT_ID, SUPPORT_A, uint64(block.timestamp));

        vm.prank(REGISTRAR);
        registry.authorizeSupport(RIGHT_ID, SUPPORT_A);

        ISmartTicketRegistry.SupportRecord memory support = registry.getSupport(RIGHT_ID, SUPPORT_A);
        assertEq(uint8(support.status), uint8(ISmartTicketRegistry.SupportStatus.AUTHORIZED));
        assertEq(support.updatedAt, uint64(block.timestamp));
        assertTrue(registry.isValidForSupport(RIGHT_ID, SUPPORT_A));
    }

    function testAuthorizeSupportRejectsZeroAndKnownSupport() public {
        _registerRight();

        vm.startPrank(REGISTRAR);

        vm.expectRevert(ISmartTicketRegistry.InvalidSupportCommitment.selector);
        registry.authorizeSupport(RIGHT_ID, bytes32(0));

        registry.authorizeSupport(RIGHT_ID, SUPPORT_A);
        vm.expectRevert(abi.encodeWithSelector(ISmartTicketRegistry.SupportAlreadyKnown.selector, RIGHT_ID, SUPPORT_A));
        registry.authorizeSupport(RIGHT_ID, SUPPORT_A);

        registry.revokeSupport(RIGHT_ID, SUPPORT_A);
        vm.expectRevert(abi.encodeWithSelector(ISmartTicketRegistry.SupportAlreadyKnown.selector, RIGHT_ID, SUPPORT_A));
        registry.authorizeSupport(RIGHT_ID, SUPPORT_A);

        vm.stopPrank();
    }

    function testRevokeSupportRequiresAuthorizedSupport() public {
        _registerRight();

        vm.startPrank(REGISTRAR);

        vm.expectRevert(ISmartTicketRegistry.InvalidSupportCommitment.selector);
        registry.revokeSupport(RIGHT_ID, bytes32(0));

        vm.expectRevert(abi.encodeWithSelector(ISmartTicketRegistry.SupportNotAuthorized.selector, RIGHT_ID, SUPPORT_A));
        registry.revokeSupport(RIGHT_ID, SUPPORT_A);

        registry.authorizeSupport(RIGHT_ID, SUPPORT_A);
        registry.revokeSupport(RIGHT_ID, SUPPORT_A);

        vm.expectRevert(abi.encodeWithSelector(ISmartTicketRegistry.SupportNotAuthorized.selector, RIGHT_ID, SUPPORT_A));
        registry.revokeSupport(RIGHT_ID, SUPPORT_A);

        vm.stopPrank();
    }

    function testRevokeSupportStoresRevokedSupportAndEmitsEvent() public {
        _registerRight();
        _authorizeSupport(SUPPORT_A);

        vm.expectEmit(true, true, false, true);
        emit SupportRevoked(RIGHT_ID, SUPPORT_A, uint64(block.timestamp));

        vm.prank(REGISTRAR);
        registry.revokeSupport(RIGHT_ID, SUPPORT_A);

        ISmartTicketRegistry.SupportRecord memory support = registry.getSupport(RIGHT_ID, SUPPORT_A);
        assertEq(uint8(support.status), uint8(ISmartTicketRegistry.SupportStatus.REVOKED));
        assertFalse(registry.isValidForSupport(RIGHT_ID, SUPPORT_A));
    }

    function testReplaceSupportRevokesOldAndAuthorizesNew() public {
        _registerRight();
        _authorizeSupport(SUPPORT_A);

        vm.expectEmit(true, true, false, true);
        emit SupportRevoked(RIGHT_ID, SUPPORT_A, uint64(block.timestamp));
        vm.expectEmit(true, true, false, true);
        emit SupportAuthorized(RIGHT_ID, SUPPORT_B, uint64(block.timestamp));

        vm.prank(REGISTRAR);
        registry.replaceSupport(RIGHT_ID, SUPPORT_A, SUPPORT_B);

        assertEq(
            uint8(registry.getSupport(RIGHT_ID, SUPPORT_A).status), uint8(ISmartTicketRegistry.SupportStatus.REVOKED)
        );
        assertEq(
            uint8(registry.getSupport(RIGHT_ID, SUPPORT_B).status), uint8(ISmartTicketRegistry.SupportStatus.AUTHORIZED)
        );
        assertFalse(registry.isValidForSupport(RIGHT_ID, SUPPORT_A));
        assertTrue(registry.isValidForSupport(RIGHT_ID, SUPPORT_B));
    }

    function testReplaceSupportRejectsInvalidOrKnownSupports() public {
        _registerRight();
        _authorizeSupport(SUPPORT_A);
        _authorizeSupport(SUPPORT_B);

        vm.startPrank(REGISTRAR);

        vm.expectRevert(ISmartTicketRegistry.InvalidSupportCommitment.selector);
        registry.replaceSupport(RIGHT_ID, bytes32(0), UNKNOWN_SUPPORT);

        vm.expectRevert(ISmartTicketRegistry.InvalidSupportCommitment.selector);
        registry.replaceSupport(RIGHT_ID, SUPPORT_A, bytes32(0));

        vm.expectRevert(abi.encodeWithSelector(ISmartTicketRegistry.SupportAlreadyKnown.selector, RIGHT_ID, SUPPORT_B));
        registry.replaceSupport(RIGHT_ID, SUPPORT_A, SUPPORT_B);

        vm.stopPrank();
    }

    function testReplaceSupportRejectsOldSupportWhenNotAuthorized() public {
        _registerRight();

        vm.expectRevert(abi.encodeWithSelector(ISmartTicketRegistry.SupportNotAuthorized.selector, RIGHT_ID, SUPPORT_A));
        vm.prank(REGISTRAR);
        registry.replaceSupport(RIGHT_ID, SUPPORT_A, SUPPORT_B);

        _authorizeSupport(SUPPORT_A);

        vm.prank(REGISTRAR);
        registry.revokeSupport(RIGHT_ID, SUPPORT_A);

        vm.expectRevert(abi.encodeWithSelector(ISmartTicketRegistry.SupportNotAuthorized.selector, RIGHT_ID, SUPPORT_A));
        vm.prank(REGISTRAR);
        registry.replaceSupport(RIGHT_ID, SUPPORT_A, SUPPORT_B);
    }

    function testIsValidForSupportRequiresActiveRightAndAuthorizedSupport() public {
        _registerRight();

        assertFalse(registry.isValidForSupport(RIGHT_ID, SUPPORT_A));

        _authorizeSupport(SUPPORT_A);
        assertTrue(registry.isValidForSupport(RIGHT_ID, SUPPORT_A));

        vm.prank(REGISTRAR);
        registry.updateRightStatus(RIGHT_ID, ISmartTicketRegistry.RightStatus.SUSPENDED);
        assertFalse(registry.isValidForSupport(RIGHT_ID, SUPPORT_A));

        vm.prank(REGISTRAR);
        registry.updateRightStatus(RIGHT_ID, ISmartTicketRegistry.RightStatus.ACTIVE);
        vm.warp(validUntil + 1);
        assertFalse(registry.isValidForSupport(RIGHT_ID, SUPPORT_A));
    }

    function testMatchesHolderOnlyForKnownRightAndExactCommitment() public {
        assertFalse(registry.matchesHolder(RIGHT_ID, HOLDER_COMMITMENT));

        _registerRight();

        assertTrue(registry.matchesHolder(RIGHT_ID, HOLDER_COMMITMENT));
        assertFalse(registry.matchesHolder(RIGHT_ID, keccak256("holder:other")));
        assertFalse(registry.matchesHolder(RIGHT_ID, bytes32(0)));
    }

    function _registerRight() private {
        vm.prank(REGISTRAR);
        registry.registerRight(RIGHT_ID, HOLDER_COMMITMENT, validUntil);
    }

    function _authorizeSupport(bytes32 supportCommitment) private {
        vm.prank(REGISTRAR);
        registry.authorizeSupport(RIGHT_ID, supportCommitment);
    }
}


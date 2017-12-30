pragma solidity ^0.4.6;

contract SmartVoting {
    struct Voter {
        bool voted;
    }
    struct Candidate {
        uint numberOfVotes;
    }
    struct Election {
        uint startTimeOfElection;
        uint lengthOfElection;
        uint deadlineOfElection;
        address[] electionVoters;
        address[] electionCandidates;
    }
    address public owner;
    uint public currNumberOfElections;
    mapping(address => Election) elections;
    mapping(address => Voter) allVoters;
    mapping(address => Candidate) allCandidates;
    mapping(address => uint[]) electionResults;
    function SmartVoting() public {
        owner = msg.sender;
        currNumberOfElections = uint(0);
    }
    function createElection(uint startTime, uint deadline,address[] voterAddresses, address[] candidateAddresses) public returns(bool success) {
        Election memory e;
        for (uint i = 0;i < voterAddresses.length;i ++) {
            allVoters[voterAddresses[i]] = Voter({ voted: false});
        }
        e.electionVoters = voterAddresses;
        for (uint j = 0;j < candidateAddresses.length;j ++) {
            allCandidates[candidateAddresses[j]] = Candidate({numberOfVotes: uint(0)});
        }
        e.electionCandidates = candidateAddresses;
        e.startTimeOfElection = startTime;
        e.lengthOfElection = deadline - startTime;
        e.deadlineOfElection = deadline;
        elections[msg.sender] = e;
        currNumberOfElections ++;
        return true;
    }
    function vote (address electionAddress, address candidateAddress) public returns(bool success) {
        if (elections[electionAddress].startTimeOfElection < block.timestamp && elections[electionAddress].deadlineOfElection > block.timestamp) {
            allCandidates[candidateAddress].numberOfVotes ++;
            return true;
        }
        return false;
    }
    function getElectionResults(address electionAddress) internal returns(uint[] cnds) {
        uint[] a;
        if (elections[electionAddress].deadlineOfElection > block.timestamp) {
            return a;
        }
        for (uint i = 0;i < elections[electionAddress].electionCandidates.length; i++) {
            electionResults[electionAddress].push(allCandidates[elections[electionAddress].electionCandidates[i]].numberOfVotes);
        }
        return electionResults[electionAddress];        
    }
}
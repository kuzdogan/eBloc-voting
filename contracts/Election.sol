pragma solidity ^0.4.18;
// We have to specify what version of compiler this code will compile with

contract SmartVoting {
  uint public numberOfElections;
  struct Voter {
      address voterAddress;
      bool voted;
      uint electionId;
  }
  
  struct Election {
      uint electionId;
      uint start;
      uint end;
      bytes32[] candidateList;
  }
  
  mapping(uint => mapping(bytes32 => uint)) votesReceived;
  mapping(address => Voter) voters;
  mapping(uint => Election) elections;
  
  function getElectionId(address va) public view returns (uint) {
    return voters[va].electionId;
  }
  
  function voteFor(bytes32 candidateName, uint electionId) public {
      require(isVoted(msg.sender) == false && isActive(electionId) == true);
      voters[msg.sender].voted = true;
      votesReceived[electionId][candidateName] += 1;
  }
  
  function isVoted(address voterAddress) view public returns(bool) {
      return voters[voterAddress].voted;
  }
  
  function isActive(uint electionId) view public returns(bool) {
      return elections[electionId].start < block.timestamp && elections[electionId].end > block.timestamp;
  }
  
  function getElectionStart(uint electionId) public view returns(uint) {
      return elections[electionId].start;
  }
  
  function getElectionEnd(uint electionId) public view returns(uint) {
      return elections[electionId].end;
  }
  
  function getElectionSecondCand(uint electionId) public view returns(bytes32) {
      return elections[electionId].candidateList[1];
  }

  function createElection(bytes32[] cands, address[] vl, uint begin, uint deadline) public returns(uint) {
      numberOfElections ++;
      elections[numberOfElections] = Election({
         electionId: numberOfElections,
         candidateList: cands,
         start: begin,
         end: deadline
      });
      for (uint i=0;i < vl.length;i ++) {
          voters[vl[i]] = Voter({
              voterAddress: vl[i],
              voted: false,
              electionId: numberOfElections
          });
      }
      return numberOfElections;
  }
  
  function getVoteNumber(uint electionId, bytes32 candidateName) public view returns(uint) {
      require(isActive(electionId) == false);
      return votesReceived[electionId][candidateName];
  }
}
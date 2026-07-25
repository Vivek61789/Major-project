// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract CrowdFundingFactory {
    address[] public deployedCFAddress;
    uint256 public cf_Count;
    struct FundingDetails {
        string cf_name;
        address cf_Owner;
        uint256 minimumContributorAmout;
    }

    FundingDetails[] public fundingDetails;

    function createCrowdFunding(
        string memory name,
        uint256 _minimumContributorAmout
    ) public {
        CrowdFunding newCrowdFunding = new CrowdFunding(
            _minimumContributorAmout,
            msg.sender
        );
        deployedCFAddress.push(address(newCrowdFunding));
        FundingDetails memory newFund = FundingDetails({
            cf_name: name,
            cf_Owner: msg.sender,
            minimumContributorAmout: _minimumContributorAmout
        });
        fundingDetails.push(newFund);
        cf_Count++;
    }

    function getCFDeployedArray() public view returns (address[] memory) {
        return deployedCFAddress;
    }
}

contract CrowdFunding {
    address public campaignManager;
    uint256 public minimumContributorAmout; // > 2 ETH
    uint256 public numRequests;
    mapping(address => bool) public approvers; // check whether he is approver ot not
    uint256 public approversCount;
    //data to display
    address[] public approversArrayData;
    struct Request {
        address payable recepient;
        string description;
        uint256 value;
        bool complete;
        uint256 approvalsCount;
        mapping(address => bool) approvals;
    }

    mapping(uint256 => Request) public requestsArray;
    // Request[] public requestsArray;

    modifier onlyOwner() {
        require(msg.sender == campaignManager, "caller is not campaignManager");
        _;
    }
    modifier onlyContributors() {
        require(approvers[msg.sender], "Not a Contributor");
        _;
    }

    constructor(uint256 _minimumContributorAmout, address creator) {
        campaignManager = creator;
        minimumContributorAmout = _minimumContributorAmout;
    }

    function getContributionAmount() public view returns (uint256) {
        return address(this).balance;
    }

    function getApproversArray() public view returns (address[] memory) {
        return approversArrayData;
    }

    function Contribute() public payable {
        require(msg.value == minimumContributorAmout, "Not Enougn Money");
        approversCount++;
        approvers[msg.sender] = true;
        approversArrayData.push(msg.sender);
    }

    function createRequest(
        string memory _description,
        address payable _recepient,
        uint256 _value
    ) public onlyOwner {
        //reference to struct
        //due to nested mapping in struct need to define a mapping storage for requests and update manually
        Request storage r = requestsArray[numRequests++];
        r.description = _description;
        r.value = _value;
        r.recepient = _recepient;
        r.complete = false;
        r.approvalsCount = 0;
    }

    function approveRequest(uint256 index) public onlyContributors {
        Request storage request = requestsArray[index];
        require(!request.approvals[msg.sender], "Already voted");
        request.approvalsCount++;
        request.approvals[msg.sender] = true;
    }

    function finalizeRequest(uint256 index) public onlyOwner {
        Request storage request = requestsArray[index];
        require(!request.complete, "Request closed");
        require(
            request.approvalsCount > approversCount / 2,
            "Approvers are Not Enough"
        );
        //transfer money
        request.recepient.transfer(request.value);
        request.complete = true;
    }
}
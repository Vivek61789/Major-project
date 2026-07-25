//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


/**
 * @title EventTicketSystem
 * @author ratio91
 * @dev this contract is based on ERC721 and is Pausable and Owned by msg.sender (at deployment)
 */
contract NFTEventTicket is ERC721URIStorage, Pausable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    string public eventName;
    string public eventSymbol;
    uint64 public eventStartDate;
    uint256 public ticketSupply;
    uint256 public availableTickets;
    uint256 public initialTicketPrice;
    address public organizer;

    /**
     * @dev constructor
     */
    constructor(
        string memory _eventName,
        string memory _eventSymbol,
        uint64 _eventStartDate,
        uint64 _ticketSupply,
        uint256 _initialTicketPrice,
        address _organizer
    ) ERC721("EventTicket", "ET") {
        eventName = _eventName;
        eventSymbol = _eventSymbol;
        eventStartDate = uint64(_eventStartDate);
        ticketSupply = uint64(_ticketSupply);
        initialTicketPrice = uint256(_initialTicketPrice);
        organizer = _organizer;
        availableTickets = uint64(_ticketSupply);
    }

    /**
     * @dev define Events
     */
    event TicketCreated(address _by, uint256 _ticketId);
    event TicketDestroyed(address _by, uint256 _ticketId);

    /* MODIFIERS */

    /**
     * @dev check if the event has already started
     */
    modifier EventNotStarted() {
        require(
            (uint64(block.timestamp) < eventStartDate),
            "event has already started"
        );
        _;
    }

    /**
     * @dev check if the supply is not exceeded
     */
    modifier isAvailable() {
        require(
            (_tokenIdCounter.current() < ticketSupply),
            "no more new tickets available"
        );
        _;
    }

    /**
     * @dev check if the function caller is the ticket owner
     */
    modifier isTicketOwner(uint256 _ticketId) {
        require((ownerOf(_ticketId) == msg.sender), "no permission");
        _;
    }
    modifier onlyOrganizer() {
        require(msg.sender == organizer, "caller is not organizer");
        _;
    }
    /* SETTERS */

    function setOrganizer(address _organizer) public EventNotStarted onlyOrganizer {
        organizer = _organizer;
    }

    /**
     * @dev set individual ticket price
     */
    function setTicketPrice(uint256 _price) public EventNotStarted {
        require(
            owner() == msg.sender || msg.sender == organizer,
            "Not accessible"
        );
        initialTicketPrice = _price;
    }

    /**
     * @dev set eventStartDate (global)
     */
    function setEventStartDate(uint64 _eventStartDate) public EventNotStarted {
        require(
            owner() == msg.sender || msg.sender == organizer,
            "Not accessible"
        );
        eventStartDate = _eventStartDate;
    }

    /**
     * @dev set TicketSupply (global)
     */
    function setTicketSupply(uint64 _ticketSupply) public EventNotStarted {
        require(
            owner() == msg.sender || msg.sender == organizer,
            "Not accessible"
        );
        ticketSupply = _ticketSupply;
    }

    /**
     * @dev set event details... (global)
     */
    function setEventDetails(string memory name, string memory symbol, uint64 eventDate,uint64 _ticketSupply, uint256 ticketPrice ) 
    public onlyOrganizer{
        eventName=name;
        eventSymbol=symbol;
        eventStartDate=eventDate;
        initialTicketPrice=ticketPrice;
        ticketSupply=_ticketSupply;
    }

   

    /**
     * @dev mint a Ticket (primary market)
     */
    function buyTicket(string memory tokenUri) external payable EventNotStarted whenNotPaused {
        require((msg.value == initialTicketPrice), "not enough money");
        _tokenIdCounter.increment();
        uint256 _ticketId = _tokenIdCounter.current();
        _mint(msg.sender, _ticketId);
        _setTokenURI(_ticketId, tokenUri);  // Corrected order of arguments
        availableTickets = ticketSupply - _ticketId;
        emit TicketCreated(msg.sender, _ticketId);
    }

    /**
     * @dev burn a Ticket (if owner)
     
    */
    function destroyTicket(uint256 _ticketId) public isTicketOwner(_ticketId) {
        _burn(_ticketId);
        emit TicketDestroyed(msg.sender, _ticketId);
    }
    function _baseURI() internal pure override returns (string memory) {
        return "https://peach-urban-bobcat-776.mypinata.cloud/ipfs/";
    }
     function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
    *  @dev get contract balance
    */
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    /**
    *  @dev withdraw contract balance
     */
    function withdrawMoney() public {
        address payable to = payable(msg.sender);
        to.transfer(getBalance());
    }


}


contract EventFactory {
    address[] public deployedCFAddress;
    uint256 public events_Count;
    struct EventDetails {
        string eventName;
        string eventSymbol;
        uint64 eventStartDate;
        uint256 ticketSupply;
        uint256 initialTicketPrice;
        address organizer;
    }

    EventDetails[] public eventDetails;
     mapping(address => EventDetails[]) eventDetailsByOrganizer;

    function createEvent(
        string memory _eventName,
        string memory _eventSymbol,
        uint64 _eventStartDate,
        uint64 _ticketSupply,
        uint256 _initialTicketPrice,
        address _organizer
    ) public {
        NFTEventTicket newNFTEventTicket = new NFTEventTicket(
            _eventName,
            _eventSymbol,
            _eventStartDate,
            _ticketSupply,
            _initialTicketPrice,
            _organizer
        );
        deployedCFAddress.push(address(newNFTEventTicket));
        EventDetails memory newEvent = EventDetails({
            eventName: _eventName,
            eventSymbol: _eventSymbol,
            eventStartDate: _eventStartDate,
            ticketSupply: _ticketSupply,
            initialTicketPrice: _initialTicketPrice,
            organizer: _organizer
        });
        eventDetails.push(newEvent);
        eventDetailsByOrganizer[msg.sender].push(newEvent);// adding to mapping
        events_Count++;
    }

    function getCFDeployedArray() public view returns (address[] memory) {
        return deployedCFAddress;
    }

    function getAllEvents() public view returns(EventDetails[] memory){
        return eventDetails;
    }

     function getEventsByOrganizer(address _organizer) public view returns (EventDetails[] memory) {
        return eventDetailsByOrganizer[_organizer];
    }
}
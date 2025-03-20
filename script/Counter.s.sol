// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CodeMarketplace {
    struct CodeListing {
        uint256 id;
        address seller;
        string title;
        string description;
        string deployedProjectUrl;
        string githubRepoLink;
        uint256 price;
        bool isActive;
    }

    // Main storage
    mapping(uint256 => CodeListing) public listings;
    mapping(uint256 => mapping(address => bool)) public buyers;
    uint256 public listingCounter;
    uint256[] public allListingIds;

    // Events
    event ListingCreated(
        uint256 indexed id, 
        address indexed seller, 
        string title, 
        string description, 
        uint256 price,
        string deployedProjectUrl
    );
    
    event CodePurchased(
        uint256 indexed id, 
        address indexed buyer, 
        address indexed seller
    );
    
    event ListingUpdated(
        uint256 indexed id, 
        bool isActive, 
        uint256 newPrice
    );

    // Create a new code listing
    function createListing(
        string memory _title,
        string memory _description,
        string memory _deployedProjectUrl,
        string memory _githubRepoLink,
        uint256 _price
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_githubRepoLink).length > 0, "GitHub repo link required");
        require(_price > 0, "Price must be greater than 0");

        listingCounter++;
        
        listings[listingCounter] = CodeListing({
            id: listingCounter,
            seller: msg.sender,
            title: _title,
            description: _description,
            deployedProjectUrl: _deployedProjectUrl,
            githubRepoLink: _githubRepoLink,
            price: _price,
            isActive: true
        });

        allListingIds.push(listingCounter);

        emit ListingCreated(
            listingCounter, 
            msg.sender, 
            _title, 
            _description, 
            _price,
            _deployedProjectUrl
        );
    }

    // Purchase access to code
    function purchaseCode(uint256 _listingId) external payable {
        CodeListing storage listing = listings[_listingId];
        
        require(listing.id != 0, "Listing does not exist");
        require(listing.isActive, "Listing is not active");
        require(msg.value == listing.price, "Incorrect payment amount");
        require(!buyers[_listingId][msg.sender], "Already purchased");
        require(msg.sender != listing.seller, "Cannot purchase your own listing");

        buyers[_listingId][msg.sender] = true;
        
        payable(listing.seller).transfer(msg.value);

        emit CodePurchased(_listingId, msg.sender, listing.seller);
    }

    // Check if user has access to a specific listing
    function hasAccess(uint256 _listingId, address _user) external view returns (bool) {
        return buyers[_listingId][_user] || listings[_listingId].seller == _user;
    }

    // Get GitHub repo link (only if user has purchased or is the seller)
    function getGithubRepoLink(uint256 _listingId) external view returns (string memory) {
        require(
            buyers[_listingId][msg.sender] || listings[_listingId].seller == msg.sender,
            "Not authorized"
        );
        return listings[_listingId].githubRepoLink;
    }

    // Update listing status or price (only by seller)
    function updateListing(uint256 _listingId, bool _isActive, uint256 _newPrice) external {
        CodeListing storage listing = listings[_listingId];
        
        require(listing.id != 0, "Listing does not exist");
        require(msg.sender == listing.seller, "Only seller can update");
        
        if (_newPrice > 0) {
            listing.price = _newPrice;
        }
        
        listing.isActive = _isActive;
        
        emit ListingUpdated(_listingId, _isActive, _newPrice);
    }

    // Get total number of listings
    function getListingCount() external view returns (uint256) {
        return listingCounter;
    }

    // Get all listing IDs
    function getAllListingIds() external view returns (uint256[] memory) {
        return allListingIds;
    }

    // Get listing details
    function getListingDetails(uint256 _listingId) external view returns (
        uint256 id,
        address seller,
        string memory title,
        string memory description,
        string memory deployedProjectUrl,
        uint256 price,
        bool isActive
    ) {
        CodeListing storage listing = listings[_listingId];
        require(listing.id != 0, "Listing does not exist");
        
        return (
            listing.id,
            listing.seller,
            listing.title,
            listing.description,
            listing.deployedProjectUrl,
            listing.price,
            listing.isActive
        );
    }
}

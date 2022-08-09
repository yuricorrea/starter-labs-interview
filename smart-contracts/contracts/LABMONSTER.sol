// SPDX-License-Identifier: MIT
pragma solidity >=0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract LABMONSTER is ERC721, Ownable, VRFConsumerBaseV2 { 

    // NFT Params

    uint public price = 15 ether;
    uint public totalSupply = 0;
    mapping(uint => Monster) public attributes;
    mapping(uint => uint) public requests;
    IERC20 public coin;

    bool private mintOpen = true;
    string internal baseTokenURI = '';

    // Chainlink Params

    VRFCoordinatorV2Interface COORDINATOR;
    LinkTokenInterface LINKTOKEN;

    address vrfCoordinator = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
    address link_token_contract = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint32 numWords =  2;
    uint32 callbackGasLimit = 100000;
    uint64 public s_subscriptionId;
    uint16 requestConfirmations = 3; 

    uint public testRequest;
    
   
    struct Monster {
        uint monster;
        uint level;
    }

    event CreateMonster(address owner, uint tokenId);
    event Mint(address owner, uint qty);
    
    constructor() ERC721("LABMONSTER", "LM")  VRFConsumerBaseV2(vrfCoordinator){
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(link_token_contract);
        // createNewSubscription();
    }

    function _baseURI() internal override view returns (string memory) {
        return baseTokenURI;
    }

    function setcoinAddress(address newAddress) public onlyOwner {
        coin = IERC20(newAddress);
    }

    function _mintTo(address to, uint qty) internal {
        for(uint i = 0; i < qty; i++){
            totalSupply++;
            uint request = requestRandomWords();
            requests[request] = totalSupply;
            _safeMint(to, totalSupply);
        }
        emit Mint(to, qty);
    }

    function mint(uint qty) external payable {
        require(mintOpen, "mint closed");
        uint total = qty * price;
        require(coin.balanceOf(_msgSender()) >= total, "insufficient funds");
        require(coin.allowance(_msgSender(), address(this)) >= total, "not allowed");
        coin.transferFrom(_msgSender(), address(this), total);
        _mintTo(_msgSender(), qty);
    }
    
    function withdraw() external onlyOwner {
       coin.transfer(_msgSender(),coin.balanceOf(address(this)));
    }

    function toggleMint() external onlyOwner {
        mintOpen = !mintOpen;
    }
    
    function setPrice(uint newPrice) external onlyOwner {
        price = newPrice;
    }
    
    function setBaseTokenURI(string calldata _uri) external onlyOwner {
        baseTokenURI = _uri;
    }

    // random

    function requestRandomWords() internal returns (uint) {
    // Will revert if subscription is not set and funded.
        return COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
  }

  function testRandomWords() external {
    testRequest = requestRandomWords();
  }

    function fulfillRandomWords(uint requestId, uint[] memory randomWords) internal override {
        uint monster = (randomWords[0] % 5) + 1;
        uint level = (randomWords[0] % 100) + 1;
        uint tokenId = requests[requestId];
        attributes[tokenId] = Monster(monster, level);
        emit CreateMonster(ownerOf(tokenId),tokenId);
    }

    // Create a new subscription when the contract is initially deployed.
  function createNewSubscription() private onlyOwner {
    s_subscriptionId = COORDINATOR.createSubscription();
    // Add this contract as a consumer of its own subscription.
    COORDINATOR.addConsumer(s_subscriptionId, address(this));
  }

  // Assumes this contract owns link.
  // 1000000000000000000 = 1 LINK
  function topUpSubscription(uint256 amount) external onlyOwner {
    LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(s_subscriptionId));
  }

  function addConsumer(address consumerAddress) external onlyOwner {
    // Add a consumer contract to the subscription.
    COORDINATOR.addConsumer(s_subscriptionId, consumerAddress);
  }

  function removeConsumer(address consumerAddress) external onlyOwner {
    // Remove a consumer contract from the subscription.
    COORDINATOR.removeConsumer(s_subscriptionId, consumerAddress);
  }

  function cancelSubscription(address receivingWallet) external onlyOwner {
    // Cancel the subscription and send the remaining LINK to a wallet address.
    COORDINATOR.cancelSubscription(s_subscriptionId, receivingWallet);
    s_subscriptionId = 0;
  }

  function setCoordinator(address coordinator) external onlyOwner {
    COORDINATOR = VRFCoordinatorV2Interface(coordinator);
  }

  function setLinkToken(address newAddress) external onlyOwner {
    LINKTOKEN = LinkTokenInterface(newAddress);
  }

  function setKeyHash(bytes32 newKey) external onlyOwner {
    keyHash = newKey;
  }

  function setGasLimit(uint32 newLimit) external onlyOwner {
    callbackGasLimit = newLimit;
  }

  function setRequestConfirmations(uint16 newConfirmations) external onlyOwner {
      requestConfirmations = newConfirmations;
  }

  // Transfer this contract's funds to an address.
  // 1000000000000000000 = 1 LINK
  function withdrawLink(uint amount, address to) external onlyOwner {
    LINKTOKEN.transfer(to, amount);
  }
    
}

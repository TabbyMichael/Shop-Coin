from blockchain.blockchain import Blockchain
from blockchain.shopkeeper import ShopkeeperRegistry

def main():
    # Initialize blockchain and registry
    blockchain = Blockchain()
    registry = ShopkeeperRegistry(blockchain)
    
    # Example usage
    print("Initializing ShopCoin blockchain...")
    
    # Register a shopkeeper
    shop_address = "shop1"
    registry.register_shopkeeper(shop_address, "John's Store", "Retail")
    
    # Simulate some transactions
    for _ in range(15):
        blockchain.add_transaction("customer1", shop_address, 10)
        registry.process_transaction(shop_address)
    
    # Mine the pending transactions
    blockchain.mine_pending_transactions("miner1")
    
    # Check balances
    print(f"Shop balance: {blockchain.get_balance(shop_address)}")
    print(f"Miner balance: {blockchain.get_balance('miner1')}")
    print(f"Total supply: {blockchain.total_supply}")

if __name__ == "__main__":
    main()
from time import time

class ShopkeeperRegistry:
    def __init__(self, blockchain):
        self.blockchain = blockchain
        self.shopkeepers = {}
        self.minimum_transactions = 10  # Minimum transactions for reward
        self.reward_cooldown = 86400    # 24 hours in seconds

    def register_shopkeeper(self, address, name, business_type):
        self.shopkeepers[address] = {
            "name": name,
            "business_type": business_type,
            "registration_date": time(),
            "last_reward": 0,
            "transaction_count": 0
        }

    def process_transaction(self, address):
        if address in self.shopkeepers:
            self.shopkeepers[address]["transaction_count"] += 1
            self._check_and_reward(address)

    def _check_and_reward(self, address):
        shopkeeper = self.shopkeepers[address]
        current_time = time()
        
        # Check if eligible for reward
        if (shopkeeper["transaction_count"] >= self.minimum_transactions and 
            current_time - shopkeeper["last_reward"] >= self.reward_cooldown):
            
            # Calculate reward based on transaction volume and longevity
            base_reward = 50
            longevity_bonus = min((current_time - shopkeeper["registration_date"]) / (86400 * 30), 2)
            volume_bonus = min(shopkeeper["transaction_count"] / 100, 1.5)
            
            total_reward = base_reward * (1 + longevity_bonus + volume_bonus)
            
            # Add reward transaction
            self.blockchain.add_transaction(
                "network",
                address,
                total_reward
            )
            
            # Reset counters
            shopkeeper["last_reward"] = current_time
            shopkeeper["transaction_count"] = 0
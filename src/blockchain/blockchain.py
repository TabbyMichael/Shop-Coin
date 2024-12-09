from .block import Block
from time import time

class Blockchain:
    def __init__(self):
        self.chain = []
        self.difficulty = 2
        self.pending_transactions = []
        self.mining_reward = 100
        self.minimum_circulation = 1000000  # Minimum coins in circulation
        self.total_supply = 0
        
        # Create genesis block
        self.chain.append(Block(time(), [], "0"))

    def get_latest_block(self):
        return self.chain[-1]

    def mine_pending_transactions(self, miner_address):
        # Check if we're below minimum circulation
        if self.total_supply < self.minimum_circulation:
            self.mining_reward = 200  # Double rewards when below minimum
        else:
            self.mining_reward = 100

        block = Block(
            time(),
            self.pending_transactions + [{
                "from": "network",
                "to": miner_address,
                "amount": self.mining_reward,
                "timestamp": time()
            }],
            self.get_latest_block().hash
        )

        block.mine_block(self.difficulty)
        self.chain.append(block)
        self.total_supply += self.mining_reward
        self.pending_transactions = []

    def add_transaction(self, sender, recipient, amount):
        if self.get_balance(sender) < amount:
            return False

        self.pending_transactions.append({
            "from": sender,
            "to": recipient,
            "amount": amount,
            "timestamp": time()
        })
        return True

    def get_balance(self, address):
        balance = 0
        for block in self.chain:
            for transaction in block.transactions:
                if transaction["from"] == address:
                    balance -= transaction["amount"]
                if transaction["to"] == address:
                    balance += transaction["amount"]
        return balance

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]

            if current_block.hash != current_block.calculate_hash():
                return False

            if current_block.previous_hash != previous_block.hash:
                return False

        return True
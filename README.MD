ethers.js
MetaMask

First check if MetaMask is installed. If MetaMask is installed:

Request the block number of the last block. Make a loop to get other blocks (subtracting from the last block). This is through the 'getLatestBlocks(no_of_blocks)' function. The parameter is the number of blocks to be fetched

Call 'printBlock(block)' to print information about the block to the table with id 'blocks_table'

In the callback of requesting a block, request information about the transactions of that block

Call 'printTransactions(transaction)' to print information about a transaction inside the accordion



All blocks and their transactions are stored in the 'blocks' area
blocks = [
    {
        block : {},
        transactions: []
    }
]
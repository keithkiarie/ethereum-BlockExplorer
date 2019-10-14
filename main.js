let provider; //link to the blockchain
    let blocks = []; //stores the latest blocks found

    //check if MetaMask is installed
    (function () {
        if (typeof web3 !== 'undefined') {
            console.log('MetaMask is installed');

            provider = new ethers.providers.Web3Provider(web3.currentProvider);
            getLatestBlocks(10);
        }
        else {
            alert('MetaMask is not installed');
        }
    }());

    //get the latest blocks
    function getLatestBlocks(no_of_blocks) {
        document.getElementById('blocks_no_input').setAttribute('disabled', true);
        document.getElementById('blocks_no_btn').style.display = 'none';
        document.getElementById('refresh_button').style.display = 'none';
        document.getElementById('still_fetching').style.display = 'inline';

        provider.getBlockNumber().then(blockNumber => {
            console.log("Current block number: " + blockNumber);
            blocks = [];

            document.getElementById('blocks_tbody').innerHTML = '';

            //get block details for the last ten blocks
            for (let i = 0; i < no_of_blocks; i++) {
                provider.getBlock(blockNumber - i).then(block => {
                    blocks.push({
                        block: block,
                        transactions: []
                    });

                    document.getElementById('fetching_blocks').style.display = 'none';
                    document.getElementById('no_of_blocks').style.display = 'block';
                    document.getElementById("blocks_table").style.display = 'block';


                    //print the block
                    printBlock(block, i);

                    if (block.transactions.length == 0) {

                        document.getElementById(`transactions_div${block.hash}`).style.display = 'none';
                        document.getElementById(`no_transactions_div${block.hash}`).style.display = 'block';

                    }

                    let printed_transactions = 0;
                    //loop through the transactions array in a block
                    block.transactions.forEach(hash => {

                        //load each transaction
                        provider.getTransaction(hash).then(transaction => {
                            for (let j = 0; j < blocks.length; j++) {
                                if (blocks[j].block.hash == transaction.blockHash) {
                                    blocks[j].transactions.push(transaction);
                                }
                            }

                            try {
                                if (printed_transactions < document.getElementById(`select${transaction.blockHash}`).value) {
                                    printTransaction(transaction);
                                    printed_transactions++;
                                }
                            } catch (error) {

                            }

                        });
                    });

                    return blocks.length;

                }).then(length => {
                    //if details about all the blocks are gathered
                    if (length == document.getElementById('blocks_no_input').value) {
                        console.log(blocks);
                        document.getElementById('blocks_no_input').removeAttribute('disabled');
                        document.getElementById('still_fetching').style.display = 'none';
                        document.getElementById('refresh_button').style.display = 'inline';
                    }
                });
            }

        });
    }


    function printBlock(block, index) {
        let tbody = document.getElementById('blocks_tbody');

        //populate the blocks table
        tbody.innerHTML += `
            <tr class="accordion" name="${index}" onclick='scrollToRow(this)'>
    	        <td>${block.hash}</td>
                <td>${block.number}</td>
                <td>${block.transactions.length}</td>
                <td>${new Date(block.timestamp * 1000)}</td>
                <td>${block.gasUsed._hex}</td>
            </tr>
            <tr class="panel" name="${index}">
  		        <td colspan="4">
                    <h3>Transactions:</h3>

                    <div id='transactions_div${block.hash}'>
                        <span>Show:</span>
                        <select class='form-control' style='width:30%;' id='select${block.hash}' name='${block.hash}' onchange='repopulate_transactions(this.name, this.value)'>
                            <option value='5'>5</option>
                            <option value='10'>10</option>
                            <option value='50'>50</option>
                            <option value='all'>All</option>
                        </select>
                    
                        <table class="table">
                            <tr>
                                <th>Hash</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Value</th>
                                <th>Gas Price</th>
                            </tr>
                            <tbody id="transactions${block.hash}"></tbody>
                        </table>
                    </div>

                    <div id='no_transactions_div${block.hash}' style='display:none;'>
                        <i>No transactions found on this block</i>
                    </div>
                </td>
	        </tr>
        `;

        //code for toggling the accordion in the table

        let acc = document.getElementsByClassName("accordion");

        for (let i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                this.classList.toggle("active");

                var panel = document.getElementsByName(this.attributes["name"].value)[1];
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            });
        }
    }

    function printTransaction(transaction) {
        let tbody = document.getElementById(`transactions${transaction.blockHash}`);
        tbody.innerHTML += `
            <tr>
                <td>${transaction.hash != null ? transaction.hash.slice(0, 10) : '<i>Not found</i>'}...</td>
                <td>${transaction.from != null ? transaction.from.slice(0, 10) : '<i>Not found</i>'}...</td>
                <td>${transaction.to != null ? transaction.to.slice(0, 10) : '<i>Not found</i>'}...</td>
                <td>${transaction.value}</td>
                <td>${transaction.gasPrice}</td>
            </tr>
        `   ;

    }

    function repopulate_transactions(name, number) {
        document.getElementById(`transactions${name}`).innerHTML = '';

        //loop through the blocks to find the one with this transctions
        for (let i = 0; i < blocks.length; i++) {

            if (blocks[i].block.hash == name) {
                //number of transactions to show
                if (!isNaN(parseInt(number))) {
                    for (let j = 0; j < number; j++) {
                        if (j == blocks[i].transactions.length) {
                            break;
                        }
                        printTransaction(blocks[i].transactions[j]);
                    }
                } else {
                    blocks[i].transactions.forEach(transaction => {
                        printTransaction(transaction);
                    });
                }
                break;
            }
        }
    }

    //function for scrolling the page when a block has been clicked
    function scrollToRow(dist) {
        window.scrollTo(0, dist.getBoundingClientRect().top);
    }

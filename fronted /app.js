
// App Configuration
const CONFIG = {
    // Replace with your deployed contract addresses
    VOTING_CONTRACT_ADDRESS: '0x...', // Your voting contract address
    TOKEN_CONTRACT_ADDRESS: '0x...', // Your token contract address
    
    // Contract ABIs - Replace with your actual ABIs
    VOTING_ABI: [
        "function createProposal(string memory title, string memory description, uint256 votingDuration) external",
        "function vote(uint256 proposalId, bool support) external",
        "function delegate(address delegatee) external",
        "function getProposalCount() external view returns (uint256)",
        "function getProposal(uint256 proposalId) external view returns (tuple(uint256 id, string title, string description, address proposer, uint256 startTime, uint256 endTime, uint256 forVotes, uint256 againstVotes, bool executed, bool active))",
        "function hasVoted(uint256 proposalId, address voter) external view returns (bool)",
        "function delegatedTo(address account) external view returns (address)",
        "function getVotingPower(address account) external view returns (uint256)"
    ],
    
    TOKEN_ABI: [
        "function balanceOf(address account) external view returns (uint256)",
        "function decimals() external view returns (uint8)",
        "function symbol() external view returns (string)"
    ]
};

// Global Variables
let provider;
let signer;
let votingContract;
let tokenContract;
let userAccount;
let currentProposalForVoting;

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletInfo = document.getElementById('walletInfo');
const walletAddress = document.getElementById('walletAddress');
const tokenBalance = document.getElementById('tokenBalance');
const proposalsList = document.getElementById('proposalsList');
const voteModal = document.getElementById('voteModal');
const statusMessage = document.getElementById('statusMessage');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
connectWalletBtn.addEventListener('click', connectWallet);

// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const targetTab = e.target.dataset.tab;
        switchTab(targetTab);
    });
});

// Forms
document.getElementById('createProposalForm').addEventListener('submit', createProposal);
document.getElementById('delegateForm').addEventListener('submit', updateDelegation);
document.getElementById('refreshProposals').addEventListener('click', loadProposals);

// Modal controls
document.querySelector('.close').addEventListener('click', closeVoteModal);
document.getElementById('voteFor').addEventListener('click', () => castVote(true));
document.getElementById('voteAgainst').addEventListener('click', () => castVote(false));

// Initialize Application
async function initializeApp() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            
            // Check if already connected
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectWallet();
            }
        } else {
            showStatus('Please install MetaMask or another Web3 wallet', 'error');
        }
    } catch (error) {
        console.error('Initialization error:', error);
        showStatus('Failed to initialize application', 'error');
    }
}

// Wallet Connection
async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            showStatus('Please install MetaMask', 'error');
            return;
        }

        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        if (accounts.length === 0) {
            showStatus('No accounts found', 'error');
            return;
        }

        userAccount = accounts[0];
        signer = provider.getSigner();
        
        // Initialize contracts
        votingContract = new ethers.Contract(
            CONFIG.VOTING_CONTRACT_ADDRESS, 
            CONFIG.VOTING_ABI, 
            signer
        );
        
        tokenContract = new ethers.Contract(
            CONFIG.TOKEN_CONTRACT_ADDRESS, 
            CONFIG.TOKEN_ABI, 
            provider
        );

        // Update UI
        updateWalletUI();
        await loadUserData();
        await loadProposals();
        
        showStatus('Wallet connected successfully!', 'success');

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());

    } catch (error) {
        console.error('Wallet connection error:', error);
        showStatus('Failed to connect wallet', 'error');
    }
}

// Handle account changes
async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else if (accounts[0] !== userAccount) {
        userAccount = accounts[0];
        await loadUserData();
        await loadProposals();
    }
}

// Disconnect wallet
function disconnectWallet() {
    userAccount = null;
    signer = null;
    votingContract = null;
    tokenContract = null;
    
    connectWalletBtn.style.display = 'block';
    walletInfo.style.display = 'none';
    proposalsList.innerHTML = '<div class="loading">Connect your wallet to view proposals</div>';
}

// Update wallet UI
function updateWalletUI() {
    connectWalletBtn.style.display = 'none';
    walletInfo.style.display = 'flex';
    walletAddress.textContent = `${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
}

// Load user data
async function loadUserData() {
    try {
        if (!tokenContract || !userAccount) return;

        // Get token balance
        const balance = await tokenContract.balanceOf(userAccount);
        const decimals = await tokenContract.decimals();
        const symbol = await tokenContract.symbol();
        
        const formattedBalance = ethers.utils.formatUnits(balance, decimals);
        tokenBalance.textContent = `${parseFloat(formattedBalance).toFixed(2)} ${symbol}`;

        // Load current delegate
        await loadCurrentDelegate();

    } catch (error) {
        console.error('Error loading user data:', error);
        showStatus('Failed to load user data', 'error');
    }
}

// Load current delegate
async function loadCurrentDelegate() {
    try {
        if (!votingContract || !userAccount) return;

        const delegate = await votingContract.delegatedTo(userAccount);
        const currentDelegateDiv = document.getElementById('currentDelegate');
        
        if (delegate === userAccount) {
            currentDelegateDiv.innerHTML = '<strong>Self (You are voting with your own tokens)</strong>';
        } else {
            currentDelegateDiv.innerHTML = `<strong>${delegate.slice(0, 6)}...${delegate.slice(-4)}</strong>`;
        }
    } catch (error) {
        console.error('Error loading delegate:', error);
        document.getElementById('currentDelegate').textContent = 'Unable to load';
    }
}

// Tab Navigation
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Load specific data for tabs
    if (tabName === 'proposals') {
        loadProposals();
    } else if (tabName === 'delegate') {
        loadCurrentDelegate();
    }
}

// Load Proposals
async function loadProposals() {
    try {
        if (!votingContract) {
            proposalsList.innerHTML = '<div class="loading">Connect your wallet to view proposals</div>';
            return;
        }

        proposalsList.innerHTML = '<div class="loading">Loading proposals...</div>';

        const proposalCount = await votingContract.getProposalCount();
        
        if (proposalCount.eq(0)) {
            proposalsList.innerHTML = '<div class="loading">No proposals found</div>';
            return;
        }

        const proposals = [];
        for (let i = 0; i < proposalCount.toNumber(); i++) {
            try {
                const proposal = await votingContract.getProposal(i);
                proposals.push({
                    id: i,
                    ...proposal
                });
            } catch (error) {
                console.error(`Error loading proposal ${i}:`, error);
            }
        }

        renderProposals(proposals);

    } catch (error) {
        console.error('Error loading proposals:', error);
        proposalsList.innerHTML = '<div class="loading">Failed to load proposals</div>';
        showStatus('Failed to load proposals', 'error');
    }
}

// Render Proposals
function renderProposals(proposals) {
    if (proposals.length === 0) {
        proposalsList.innerHTML = '<div class="loading">No proposals found</div>';
        return;
    }

    proposalsList.innerHTML = proposals.map(proposal => {
        const isActive = proposal.active;
        const totalVotes = proposal.forVotes.add(proposal.againstVotes);
        const forPercentage = totalVotes.gt(0) ? 
            proposal.forVotes.mul(100).div(totalVotes).toNumber() : 0;

        const endDate = new Date(proposal.endTime.toNumber() * 1000);
        const timeRemaining = isActive ? getTimeRemaining(endDate) : 'Ended';

        return `
            <div class="proposal-card">
                <div class="proposal-header">
                    <div>
                        <div class="proposal-title">${escapeHtml(proposal.title)}</div>
                        <small>Proposed by: ${proposal.proposer.slice(0, 6)}...${proposal.proposer.slice(-4)}</small>
                    </div>
                    <span class="proposal-status ${isActive ? 'status-active' : 'status-ended'}">
                        ${isActive ? 'Active' : 'Ended'}
                    </span>
                </div>
                
                <div class="proposal-description">
                    ${escapeHtml(proposal.description)}
                </div>

                <div class="proposal-stats">
                    <div class="stat-item">
                        <div class="stat-value">${ethers.utils.formatEther(proposal.forVotes)}</div>
                        <div class="stat-label">For Votes</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${ethers.utils.formatEther(proposal.againstVotes)}</div>
                        <div class="stat-label">Against Votes</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${timeRemaining}</div>
                        <div class="stat-label">${isActive ? 'Time Left' : 'Status'}</div>
                    </div>
                </div>

                <div class="vote-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${forPercentage}%"></div>
                    </div>
                    <div class="vote-counts">
                        <span>For: ${forPercentage.toFixed(1)}%</span>
                        <span>

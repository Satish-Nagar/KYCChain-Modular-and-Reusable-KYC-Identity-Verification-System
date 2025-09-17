/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Header Styles */
.header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;
}

.header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
}

.logo i {
    font-size: 2.5em;
    background: linear-gradient(45deg, #4facfe, #00f2fe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.logo h1 {
    font-size: 2.5em;
    font-weight: 800;
    color: white;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.tagline {
    font-size: 1.2em;
    color: rgba(255, 255, 255, 0.9);
    margin: 10px 0;
}

/* Wallet Section */
.wallet-section {
    display: flex;
    align-items: center;
    gap: 15px;
}

.wallet-info {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.1);
    padding: 10px 20px;
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
}

.wallet-info i {
    color: #4facfe;
}

/* Button Styles */
.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 50px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    background: linear-gradient(45deg, #4facfe, #00f2fe);
    color: white;
    box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
}

.btn-primary {
    background: linear-gradient(45deg, #4facfe, #00f2fe);
}

.btn-secondary {
    background: linear-gradient(45deg, #667eea, #764ba2);
}

.btn-success {
    background: linear-gradient(45deg, #11998e, #38ef7d);
}

.btn-danger {
    background: linear-gradient(45deg, #fc466b, #3f5efb);
}

.btn-outline {
    background: transparent;
    border: 2px solid white;
    color: white;
}

.btn-outline:hover {
    background: white;
    color: #333;
}

.btn-small {
    padding: 8px 16px;
    font-size: 12px;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

/* Alert Styles */
.alert {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    display: flex;
    align-items: center;
    gap: 15px;
}

.alert.success {
    background: rgba(17, 153, 142, 0.2);
    border-color: rgba(56, 239, 125, 0.3);
}

.alert.error {
    background: rgba(252, 70, 107, 0.2);
    border-color: rgba(252, 70, 107, 0.3);
}

/* Stats Section */
.stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 25px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-card i {
    font-size: 2.5em;
    background: linear-gradient(45deg, #4facfe, #00f2fe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.stat-info h3 {
    font-size: 2em;
    font-weight: 700;
    margin-bottom: 5px;
}

.stat-info p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9em;
}

/* Main Content */
.main-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

/* Section Cards */
.section-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-header {
    background: rgba(255, 255, 255, 0.1);
    padding: 25px 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h2 {
    color: white;
    font-size: 1.5em;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 15px;
}

.card-header i {
    background: linear-gradient(45deg, #4facfe, #00f2fe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.card-content {
    padding: 30px;
}

/* KYC Status */
.kyc-status {
    margin-bottom: 30px;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 15px 25px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 20px;
    transition: all 0.3s ease;
}

.status-badge.verified {
    background: linear-gradient(45deg, #11998e, #38ef7d);
    color: white;
    box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3);
}

.status-badge.pending {
    background

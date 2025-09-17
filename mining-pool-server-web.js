// mining-pool-server-web.js
const express = require('express');
const cors = require('cors');
const { Connection, Keypair, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { mintTo, getOrCreateAssociatedTokenAccount } = require('@solana/spl-token');
const fs = require('fs');
const path = require('path');

const app = express();

// Enable CORS for your website
app.use(cors({
    origin: ['https://hashnhedge.com', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Environment variables for production
const PORT = process.env.PORT || 3001;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Your existing mining pool code here...
// [Copy all the code from mining-pool-server.js but update the following:]

// Load deployment configuration
let deployment;
try {
    if (IS_PRODUCTION) {
        deployment = {
            mintAddress: process.env.MINT_ADDRESS,
            tokenAccount: process.env.TOKEN_ACCOUNT,
            mintAuthority: process.env.MINT_AUTHORITY,
            keypair: JSON.parse(process.env.KEYPAIR_SECRET || '[]')
        };
    } else {
        // Local development
        if (fs.existsSync('hnh-deployment.json')) {
            deployment = JSON.parse(fs.readFileSync('hnh-deployment.json'));
        } else {
            deployment = {
                mintAddress: "placeholder-mint-address",
                tokenAccount: "placeholder-token-account",
                mintAuthority: "placeholder-mint-authority",
                keypair: []
            };
        }
    }
} catch (error) {
    console.log('Warning: Could not load deployment config, using defaults');
    deployment = {
        mintAddress: "placeholder-mint-address",
        tokenAccount: "placeholder-token-account",
        mintAuthority: "placeholder-mint-authority",
        keypair: []
    };
}

// Add a homepage route
app.get('/', (req, res) => {
    res.json({
        message: 'HashNHedge Mining Pool API',
        version: '1.0.0',
        website: 'https://hashnhedge.com',
        documentation: 'https://hashnhedge.com/whitepaper',
        endpoints: {
            stats: '/api/stats',
            connect: 'POST /api/miner/connect',
            submit: 'POST /api/miner/submit-share'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 HashNHedge Mining Pool running on port ${PORT}`);
});
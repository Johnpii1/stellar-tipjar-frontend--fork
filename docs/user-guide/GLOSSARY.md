# Glossary

A reference guide for technical and cryptocurrency terms used in Stellar Tip Jar.

---

## Cryptocurrency and Blockchain Terms

### Blockchain

A distributed database that records transactions in blocks connected in a chain. Each block contains:
- Transaction data
- Timestamp
- Cryptographic hash (unique fingerprint)
- Hash of previous block

The chain can't be altered without everyone noticing, making it secure.

**In context:** Stellar Tip Jar runs on the Stellar blockchain, meaning all transactions are permanent and transparent.

### Cryptocurrency

Digital currency that uses encryption (cryptography) to:
- Create currency units
- Verify transactions
- Secure wallets

Money exists as digital data, not physical coins or bills.

**In context:** XLM is the cryptocurrency used on Stellar Tip Jar.

### Decentralized

Not controlled by a single server or company. Instead:
- Thousands of computers maintain the network
- No single point of failure
- No central authority like a bank
- Users have more control

**In context:** Stellar Tip Jar is decentralized - no server can go down and ruin it.

### Hash / Cryptographic Hash

A mathematical function that converts data into a fixed-size string of characters. Properties:
- Same input always produces same output
- Tiny change in input completely changes output
- Can't reverse it (one-way function)
- Used to identify blocks uniquely

**In context:** Each transaction has a hash you can use to look it up on the Stellar network.

### Immutable

Cannot be changed, modified, or deleted. 

**In context:** Once a tip is sent on the blockchain, it can't be undone or reversed.

### Ledger

A record-keeping system that lists all transactions. In blockchain:
- Every transaction is recorded
- Everyone can see and verify
- Forms the permanent history
- Cannot be altered retroactively

**In context:** The Stellar ledger contains all transactions including your tips.

### Mining / Validation

The process of verifying transactions and adding them to the blockchain:
- Miners/validators collect pending transactions
- Verify transactions are legitimate
- Add them to a new block
- Secure it with cryptography
- Other nodes verify

**In context:** When you send a tip, Stellar validators verify and record it.

### Transaction

A record of moving value (cryptocurrency) from one wallet to another:
- Sender
- Recipient
- Amount
- Timestamp
- Optional memo/message
- Network fee

**In context:** Sending a tip creates a transaction on the Stellar network.

### Private Key

A secret code that proves you own a wallet:
- Usually a very long string of characters
- Gives complete access to wallet
- Can sign transactions
- If lost, wallet is inaccessible
- If leaked, someone can steal your funds

**In context:** Your Freighter wallet has a private key that you should never share.

### Public Key / Address

Your wallet address that others use to send you money:
- Public (safe to share)
- Can't be reversed to private key
- Like a bank account number
- Usually starts with 'G' on Stellar
- Long string: `GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

**In context:** You give creators your address to send tips to you.

---

## Stellar Specific Terms

### Stellar

A blockchain platform designed for fast, low-cost payments:
- Established 2014
- Open source
- Focuses on accessibility
- Many payment channels integrated
- XLM is native currency

**Website:** stellar.org

### Stellar Network

The actual network of computers running Stellar:
- Thousands of nodes worldwide
- Validates transactions
- Maintains ledger
- Decentralized governance

**In context:** Stellar Tip Jar uses the Stellar Network for transactions.

### XLM / Stellar Lumen

The native cryptocurrency of the Stellar network:
- Full name: Stellar Lumen
- Ticker symbol: XLM
- Created by Stellar Development Foundation
- Used to pay transaction fees
- Used as payment currency

**Value:** Varies with market, roughly $0.08-0.20 USD per XLM

**In context:** Tips on Stellar Tip Jar are sent in XLM.

### Freighter

A popular wallet for the Stellar network:
- Browser extension
- User-friendly interface
- Available for Chrome, Firefox, etc.
- Controls your own private keys
- Recommended for Stellar Tip Jar

**Website:** freighter.app

### Wallet

A digital tool that:
- Stores your cryptocurrency
- Holds private and public keys  
- Allows sending and receiving
- Shows your balance and transaction history

**Types:**
- **Hot wallet:** Connected to internet, convenient
- **Cold wallet:** Offline storage, more secure for large amounts

Freighter is a hot wallet.

### Wallet Address

Your public receiving address, like:
- Account number for a bank
- Email address for emails
- Safe to share publicly
- Can't be reversed

See "Public Key" above.

### Recovery Phrase / Seed Phrase

12 or 24 English words that can recreate your wallet:
- Generates your private key
- Can import wallet on new device
- Can recover if wallet lost
- Never share with anyone
- Can't be reset if lost

**Example format:**
`moon apple tree house cat dog bird fish ocean star cloud planet`

(This is just an example, never share real recovery phrases!)

---

## Technical Terms

### API

Application Programming Interface - a way for programs to communicate:
- Stellar Tip Jar uses APIs to connect to Stellar
- Developers use APIs to build apps
- Tells programs how to interact

**In context:** The website uses APIs to fetch creator profiles.

### Gas / Transaction Fee

Small amount of cryptocurrency paid to process transaction:
- On Stellar: ~0.00001 XLM (negligible)
- Pays computers who process transaction
- Required for all transactions
- Varies by network traffic

**In context:** Sending a tip requires tiny network fee.

### Node

A computer running the blockchain software:
- Stores full ledger copy
- Validates transactions
- Helps network run
- Anyone can run a node

**In context:** Stellar network has thousands of nodes that verify your tips.

### Smart Contract

Self-executing code that lives on blockchain:
- Runs automatically when conditions met
- Trustless (no middleman needed)
- Immutable (can't change)

**In context:** Stellar Tip Jar may use smart contracts for some functions.

### JSON

Format for storing and sending data:
- Human-readable text format
- Used by APIs
- Structured like this:
  ```
  {
    "tip_amount": 5,
    "creator": "john"
  }
  ```

**In context:** Stellar Tip Jar sends and receives data in JSON.

---

## Security Terms

### 2FA / Two-Factor Authentication

Using two methods to verify you (instead of just password):
- Something you know: Password
- Something you have: Phone/app
- Something you are: Fingerprint/face

**Types:**
- Authenticator app (Google Authenticator, Authy) - more secure
- SMS text message - less secure

**In context:** Freighter doesn't use 2FA, but your email and exchange accounts should.

### HTTPS / SSL

Encrypted connection between you and website:
- HTTPS means secure
- SSL/TLS is the encryption protocol
- Indicated by lock icon in address bar
- Data is encrypted in transit

**In context:** Always verify Stellar Tip Jar uses HTTPS before signing in.

### Encryption

Scrambling data so only authorized people can read it:
- Encrypted = scrambled, unreadable
- Decrypted = unscrambled, readable
- Uses cryptographic keys
- Strong encryption: can't crack without key

**In context:** Your wallet data is encrypted locally in Freighter.

### Phishing

Fraudulent attempt to steal credentials by deception:
- Fake emails that look legitimate
- Fake websites that look real
- Ask you to enter password
- Goal: Steal your login info or recovery phrase

See [SECURITY.md](SECURITY.md) for phishing prevention.

### Malware

Malicious software that harms your device:
- Viruses: Self-replicating
- Trojans: Disguised as legitimate
- Spyware: Spies on you
- Ransomware: Locks files and demands payment

**Prevention:** Antivirus software, don't download from unknown sources.

---

## Financial Terms

### Foreign Exchange (Forex)

Trading one currency for another:
- XLM ↔ USD
- XLM ↔ EUR
- Rates fluctuate

**In context:** Converting XLM to your local currency to cash out.

### Exchange

Platform where you can trade cryptocurrencies:
- Buy and sell XLM
- Often also convert to fiat (USD, EUR, etc.)
- Some require KYC (identity verification)
- Examples: Kraken, Coinbase, Binance

**In context:** You buy XLM on an exchange, then withdraw to your Freighter wallet.

### KYC / Know Your Customer

Process where exchange verifies your identity:
- Provide government ID
- Proof of address
- May upload selfie
- Used to prevent fraud
- Required for buying/selling crypto legally

**In context:** Most exchanges require KYC before trading.

### Fiat

Traditional government-issued currency:
- USD (US Dollars)
- EUR (Euros)
- GBP (British Pounds)
- Not cryptocurrency

**In context:** Converting XLM to fiat means converting to regular money.

---

## Network Terms

### Node / Network Node

A computer in the network that:
- Stores blockchain data
- Validates transactions
- Helps run the network

### Validator

A node that specifically validates transactions:
- Checks transaction legitimacy
- Adds to blockchain
- "Stakes" reputation on correctness
- Essential for blockchain security

**In context:** Stellar validators ensure your tips are legitimate.

### Consensus

Agreement among network participants:
- All validators must agree transaction is valid
- Majority rules
- Can't fake transactions
- Why blockchain is secure

**In context:** Your tip is valid only when Stellar reaches consensus.

---

## Wallet Terms

### Hot Wallet

Wallet connected to internet:
- Convenient for frequent use
- More vulnerable to hacks
- Good for small amounts
- Examples: Freighter, Lobstr

**In context:** Freighter is a hot wallet.

### Cold Wallet

Wallet not connected to internet:
- Very secure
- Inconvenient to use
- Good for large amounts
- Examples: Hardware wallets, paper wallets

**In context:** For very large holdings, consider cold storage.

### Hardware Wallet

Physical device that holds your private keys:
- Looks like USB drive
- Costs money (~$50-100)
- Extremely secure
- Examples: Ledger, Trezor

**In context:** Advanced users store large amounts in hardware wallets.

### Custodial

A third party holds your crypto for you:
- Like storing money at a bank
- Convenient
- Less secure (they could be hacked)
- Less control

**In context:** Non-custodial wallet = you control your crypto.

### Non-Custodial

You hold and control your own cryptocurrency:
- Only you have private key
- No middleman
- Your responsibility to keep secure
- Freighter is non-custodial

**In context:** Stellar Tip Jar recommends non-custodial wallets.

---

## Platform Terms

### Creator

User who receives tips on Stellar Tip Jar:
- Has a public profile
- Accepts tips for their work
- Can be musician, artist, developer, etc.

**In context:** You're a creator if people tip you.

### Supporter

User who sends tips on Stellar Tip Jar:
- Visits creator profiles
- Sends cryptocurrency tips
- Supports creators they like

**In context:** You're a supporter if you send tips.

### Profile

Your public presence on Stellar Tip Jar:
- Shows your name and bio
- Lists your tip history
- Where supporters send you tips
- Customizable with links

**In context:** Create a profile to start receiving tips.

### Tip

A payment sent from supporter to creator:
- Voluntary
- Any amount
- Instant
- Optional message

**In context:** You send a tip when you want to support someone.

### Tip History

Record of all tips a creator has received:
- Shows amount and date
- May show sender name if included
- Public (usually)
- Shows creator's earnings

**In context:** View tip history to see if creator is active.

---

## Abbreviations and Acronyms

- **2FA** - Two-Factor Authentication
- **API** - Application Programming Interface
- **BTC** - Bitcoin
- **COLD** - Cold wallet/storage
- **ETH** - Ethereum
- **FIAT** - Traditional government currency
- **GAS** - Transaction fee
- **HOT** - Hot wallet
- **JSON** - JavaScript Object Notation
- **KYC** - Know Your Customer
- **TXN** - Transaction
- **TXID** - Transaction ID/Hash
- **USD** - US Dollar
- **XLM** - Stellar Lumen
- **XLN** - Not a real term, don't use
- **2019** onwards is the year

---

## Common Misconceptions

### "Bitcoin and XLM are the same"
**False** - Different cryptocurrencies on different blockchains with different purposes.

### "Cryptocurrency is anonymous"
**Mostly false** - Transactions are pseudonymous (address-based, not name-based) but traceable.

### "I can recover deleted transactions"
**False** - Blockchain is permanent. Once sent, it's final.

### "Stellar is a startup that could disappear"
**Uncertain** - Stellar Foundation has been around since 2014 and is well-funded, but cryptocurrency is relatively new.

---

## More Information

For more detailed information:
- Full guides in other docs (WALLET_SETUP.md, SECURITY.md, etc.)
- Stellar.org for Stellar documentation
- Official Freighter documentation at freighter.app

---

## Questions?

If you encounter a term not in this glossary:
1. Check other documentation files
2. Ask in community forums
3. Search Stellar.org documentation
4. Contact support

Happy learning! 📚

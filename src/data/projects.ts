import type { Category, Experiment, Project } from '../types/content';

export const categories: Array<'All' | Category> = [
  'All',
  'Blockchain',
  'AI',
  'Full-Stack',
  'Fintech',
];

export const projects: Project[] = [
  {
    id: 'havx',
    title: 'HAVX',
    categories: ['Blockchain', 'Full-Stack'],
    year: '2026',
    summary:
      'A blockchain-native IDE and wallet, built for writing, managing and shipping on-chain software from one surface.',
    problem:
      'On-chain development is spread across editors, wallet extensions, block explorers and deployment scripts.',
    solution:
      'HAVX brings an editor, contract tooling and HAVXWallet into one focused environment, so the whole loop stays in one place.',
    role: 'Product, interface and full-stack engineering.',
    outcome: 'In active development, with HAVXWallet shipping alongside the IDE.',
    stack: ['TypeScript', 'React', 'Node.js', 'Solidity', 'Web3.js'],
    codeUrl: 'https://github.com/ReneeMattGH/IDE-build',
    preview: 'ide',
    flagship: true,
    badge: 'Flagship · In development',
  },
  {
    id: 'bnb-greenfield',
    title: 'BNB Greenfield AI Dataset Marketplace',
    categories: ['Blockchain', 'AI'],
    year: '2025',
    summary:
      'A decentralized marketplace for managing, licensing and sharing AI datasets on BNB Greenfield.',
    problem:
      'AI datasets sit in private silos, with little clarity around ownership, access and reuse.',
    solution:
      'Datasets are stored on BNB Greenfield with access and sharing managed on-chain, through a marketplace built for discovery.',
    role: 'Blockchain and frontend development for the hackathon build.',
    outcome: 'Greenfield Winner at BNB Hackathon 2025, Bombay.',
    stack: ['BNB Greenfield', 'Solidity', 'TypeScript', 'React'],
    codeUrl: 'https://github.com/ReneeMattGH/BNB_DataVault',
    preview: 'marketplace',
    badge: 'Hackathon winner',
  },
  {
    id: 'blockvault',
    title: 'BlockVault',
    categories: ['Blockchain'],
    year: '2025',
    summary:
      'A decentralized wallet-gated vault for passwords and personal data, controlled by the holder.',
    problem: 'Password managers concentrate every credential behind a single master password.',
    solution:
      'Access is gated by a connected wallet, so the vault is controlled by its holder rather than a central operator.',
    role: 'Design and TypeScript implementation.',
    outcome: 'Published as an open-source TypeScript project.',
    stack: ['TypeScript', 'React', 'Wallet auth'],
    codeUrl: 'https://github.com/ReneeMattGH/BlockVault',
    preview: 'vault',
  },
  {
    id: 'offramp-payroll',
    title: 'Offramp Payroll',
    categories: ['Fintech', 'Full-Stack'],
    summary:
      'A full-stack USDT payroll off-ramp for companies, from batch payouts to local-currency settlement.',
    problem: 'Companies hold payroll in USDT, but teams still need to be paid in local currency.',
    solution:
      'A payroll flow that batches USDT payouts, off-ramps to fiat and keeps a record of every movement.',
    role: 'Full-stack implementation across the payout and settlement flow.',
    outcome: 'Payroll and off-ramp flow implemented end to end.',
    stack: ['Node.js', 'PostgreSQL', 'Supabase', 'React'],
    preview: 'payroll',
  },
  {
    id: 'mannapay',
    title: 'MannaPay',
    categories: ['Blockchain', 'Fintech'],
    year: '2025',
    summary:
      'A Bitcoin-powered subscription hub on Layer-2, built for recurring payments without card rails.',
    problem: 'Recurring payments depend on custodial processors and traditional card infrastructure.',
    solution:
      'MannaPay models subscriptions on Bitcoin Layer-2, with the billing flow handled on-chain.',
    role: 'Full-stack and on-chain development.',
    outcome: 'Prototype published on GitHub.',
    stack: ['Bitcoin L2', 'TypeScript', 'React'],
    codeUrl: 'https://github.com/ReneeMattGH/MannaPay',
    preview: 'subscribe',
  },
  {
    id: 'invopay',
    title: 'InvoPay',
    categories: ['Fintech', 'Blockchain'],
    year: '2026',
    summary:
      'Instant cash for small businesses by tokenizing unpaid invoices and settling them on-chain.',
    problem: 'Unpaid invoices leave small businesses without the working capital they have earned.',
    solution:
      'Unpaid invoices are tokenized, so they can be advanced and settled on-chain instead of waiting.',
    role: 'Full-stack and smart-contract development.',
    outcome: 'Working prototype published on GitHub.',
    stack: ['Solidity', 'TypeScript', 'React', 'Node.js'],
    codeUrl: 'https://github.com/ReneeMattGH/InvoPay',
    preview: 'invoice',
  },
  {
    id: 'bitlend',
    title: 'BitLend',
    categories: ['Blockchain', 'Fintech'],
    year: '2025',
    summary:
      'Decentralized crypto lending with real-time, wallet-based lending and on-chain credit control.',
    problem: 'On-chain lending needs transparent credit limits and live control of positions.',
    solution:
      'BitLend lends against connected wallets, with credit controls and loan terms enforced on-chain.',
    role: 'Smart contracts and full-stack integration.',
    outcome: 'Best Idea Implemented at BeachHack S7.',
    stack: ['Solidity', 'TypeScript', 'React', 'Wallet auth'],
    codeUrl: 'https://github.com/ReneeMattGH/BitLend-final',
    preview: 'lending',
    badge: 'Best Idea Implemented',
  },
  {
    id: 'brikx',
    title: 'Brikx',
    categories: ['Blockchain', 'Fintech'],
    year: '2025',
    summary: 'Real-estate and real-world-asset tokenization for fractional property ownership.',
    problem: 'Assets like property stay illiquid and out of reach for most investors.',
    solution:
      'Brikx tokenizes property interests, so ownership can be divided and transferred on-chain.',
    role: 'Blockchain and frontend development.',
    outcome:
      'Top 10 finalist at the IIT Blockchain Hackathon; 2nd Runner Up at Ideathon (RWA tokenization).',
    stack: ['Solidity', 'TypeScript', 'React'],
    codeUrl: 'https://github.com/ReneeMattGH/Brikx',
    preview: 'assets',
  },
  {
    id: 'solai',
    title: 'SolAI',
    categories: ['AI'],
    year: '2026',
    summary: 'An AI agent and chart predictor for market analysis.',
    problem: 'Chart reading is slow and subjective for most market participants.',
    solution:
      'An agent reads market charts and produces a directional view with its reasoning attached.',
    role: 'AI and full-stack development.',
    outcome: 'Working prototype published on GitHub.',
    stack: ['Python', 'LLMs', 'TypeScript'],
    codeUrl: 'https://github.com/ReneeMattGH/Sol-AI',
    preview: 'chart',
  },
  {
    id: 'geotrade',
    title: 'GeoTrade',
    categories: ['AI', 'Full-Stack'],
    year: '2026',
    summary: 'AI market analysis paired with global trade visuals.',
    problem: 'Market context is spread across charts, news and disconnected regional data.',
    solution:
      'GeoTrade combines AI analysis with a global trade view, so regional movement is read in context.',
    role: 'AI pipeline and frontend development.',
    outcome: 'Published on GitHub as a working prototype.',
    stack: ['Python', 'LLMs', 'React'],
    codeUrl: 'https://github.com/ReneeMattGH/geo',
    preview: 'globe',
  },
  {
    id: 'zerohour',
    title: 'Zerohour',
    categories: ['AI'],
    year: '2026',
    summary: 'An AI command-line tool that detects vulnerabilities and errors from the terminal.',
    problem: 'Security and runtime problems are usually found after code has already moved on.',
    solution:
      'A CLI runs an AI review from the terminal, surfacing vulnerabilities and errors where the work happens.',
    role: 'CLI and AI integration.',
    outcome: 'Published on GitHub as a working CLI prototype.',
    stack: ['Python', 'LLMs', 'CLI'],
    codeUrl: 'https://github.com/ReneeMattGH/bh---zerohour',
    preview: 'terminal',
  },
  {
    id: 'smart-health',
    title: 'Smart Health App',
    categories: ['Blockchain', 'Full-Stack'],
    summary: 'Decentralized patient–doctor records, with access controlled by the patient.',
    problem: 'Patient records are held in central systems that patients do not control.',
    solution:
      'Records are shared between patient and doctor with decentralized access control rather than a single custodian.',
    role: 'Blockchain and application development.',
    outcome: 'Prototype built around decentralized record access.',
    stack: ['Solidity', 'React', 'Node.js'],
    preview: 'health',
  },
  {
    id: 'trading-bot',
    title: 'Trading Bot',
    categories: ['AI', 'Fintech'],
    year: '2025',
    summary: 'An automated trading bot using an ATR strategy with EMA alerts.',
    problem: 'Manual trade monitoring misses the moments when volatility shifts.',
    solution:
      'The bot watches ATR for volatility and EMA for direction, then raises alerts when the two align.',
    role: 'Strategy implementation and alerting.',
    outcome: 'Trading strategy and alerts published on GitHub.',
    stack: ['Python', 'ATR', 'EMA'],
    codeUrl: 'https://github.com/ReneeMattGH/Win-Trade---Trading-Bot',
    preview: 'trading',
  },
];

export const experiments: Experiment[] = [
  { title: 'NFT Minter', href: 'https://github.com/ReneeMattGH/NFT_minter' },
  { title: 'Crypto-token.sol', href: 'https://github.com/ReneeMattGH/Crypto-token.sol' },
  { title: 'ZK-proof voting prototype' },
  { title: 'NFT certification engine' },
];

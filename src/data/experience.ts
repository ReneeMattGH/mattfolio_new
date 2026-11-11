import type { Role } from '../types/content';

export const roles: Role[] = [
  {
    company: 'ROYALGCC',
    title: 'Backend and Blockchain Developer',
    location: 'Remote',
    start: 'Jan 2026',
    end: 'Mar 2026',
    bullets: [
      'Built a full-stack platform where users deposit USDT, manage an internal wallet and convert crypto to INR with automated payouts.',
      'Built Node.js and PostgreSQL/Supabase APIs for authentication, transactions and wallet balances.',
      'Implemented real-time blockchain transaction tracking, external wallet withdrawals and ledger-based accounting.',
      'Added KYC verification, OTP authentication, banking integrations and an admin dashboard.',
    ],
    tags: ['Node.js', 'PostgreSQL', 'Supabase', 'Blockchain', 'KYC'],
  },
  {
    company: 'ZERO2SITE',
    title: 'Blockchain Developer',
    location: 'Chennai',
    start: 'Jan 2025',
    end: 'Present',
    current: true,
    bullets: [
      'Developed and deployed smart contracts with Solidity and Hardhat.',
      'Integrated blockchain features with React.js frontends and Node.js backends.',
      'Collaborated with cross-functional teams on fiat-to-crypto processing chains.',
    ],
    tags: ['Solidity', 'Hardhat', 'React', 'Node.js'],
  },
  {
    company: 'GOLDEN OPULENCE',
    title: 'Intern, Electoral Committee',
    location: 'Chennai',
    start: 'May 2025',
    end: 'Jul 2025',
    bullets: [
      'Supported committee operations and documentation.',
      'Handled data management and reporting.',
      'Maintained databases with a focus on data consistency.',
    ],
    tags: ['Databases', 'Reporting'],
  },
];

import type { SkillGroup } from '../types/content';

export const skillGroups: SkillGroup[] = [
  {
    label: 'Blockchain',
    icon: 'blocks',
    items: [
      'Solidity',
      'Hardhat',
      'Ethereum',
      'Solana',
      'Web3.js',
      'Ethers.js',
      'IPFS',
      'ERC-1155',
    ],
    className: 'md:col-span-6',
  },
  {
    label: 'Languages',
    icon: 'code',
    items: ['C', 'C++', 'Python', 'JavaScript', 'TypeScript', 'Java'],
    className: 'md:col-span-6',
  },
  {
    label: 'Web and Data',
    icon: 'globe',
    items: [
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'PostgreSQL / Supabase',
      'REST APIs',
    ],
    className: 'md:col-span-5',
  },
  {
    label: 'AI',
    icon: 'brain',
    items: ['LLM building', 'AI agents', 'Market-analysis models'],
    className: 'md:col-span-4',
  },
  {
    label: 'Tools',
    icon: 'wrench',
    items: ['GitHub', 'Linux'],
    className: 'md:col-span-3',
  },
];

export const softSkills = [
  'Time Management',
  'Communication and Collaboration',
  'Critical Thinking',
  'Problem Solving',
  'Project Management',
];

export const toolMarquee = [
  'Solidity',
  'Hardhat',
  'Ethereum',
  'Solana',
  'Web3.js',
  'Ethers.js',
  'IPFS',
  'React',
  'Node.js',
  'TypeScript',
  'PostgreSQL',
  'Python',
];

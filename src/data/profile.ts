import type { Profile } from '../types/content';

/**
 * Site URL used for canonical tags and structured data.
 * Update this to the production domain before deploying.
 */
export const SITE_URL = 'https://matt-portfolio.vercel.app';

export const profile: Profile = {
  name: 'George Kingsley Renee Matthew',
  firstName: 'George Kingsley',
  casualName: 'Matt',
  role: 'Blockchain and full-stack engineer building secure payment, DeFi and AI systems.',
  status: 'Available for opportunities — Chennai / Remote',
  location: 'Chennai / Remote',
  email: 'renee.matthew04@gmail.com',
  siteUrl: SITE_URL,
  resumeUrl: '/resume.pdf',
  bio: 'Third-year Computer Science student at Chennai Institute of Technology, building at the intersection of AI, blockchain and crypto. Hands-on with real-time AI, smart contracts and full-stack products, a multi-time hackathon finalist and winner who also contributes to open source.',
  proof: [
    'Top 4 — Bitcoin Global Hackathon',
    '2x Solana runner-up',
    'BNB Greenfield winner',
    '8.1 CGPA',
  ],
  stats: [
    { value: 10, suffix: '+', label: 'Hackathon podiums & finalist spots' },
    { value: 3, label: 'Industry roles' },
    { value: 66, label: 'GitHub repositories' },
    { value: 8.1, decimals: 1, label: 'Current CGPA' },
  ],
  education: [
    {
      programme: 'B.E. Computer Science Engineering',
      institution: 'Chennai Institute of Technology',
      period: '2024 — 2028',
      result: '8.1 CGPA',
    },
    {
      programme: 'Computer Science and Mathematics',
      institution: 'Adarsh Vidya Kendra, Nagercoil',
      period: '2022 — 2024',
      result: '80%',
    },
  ],
  currently: {
    title: 'HAVX',
    description: 'A blockchain-based IDE, with HAVXWallet built alongside it.',
    status: 'In development',
    href: 'https://github.com/ReneeMattGH/IDE-build',
  },
  socials: [
    { label: 'GitHub', handle: 'github.com/ReneeMattGH', href: 'https://github.com/ReneeMattGH' },
    {
      label: 'LinkedIn',
      handle: 'linkedin.com/in/renee-matthew-673141263',
      href: 'https://www.linkedin.com/in/renee-matthew-673141263',
    },
    { label: 'X', handle: '@0xmattchain', href: 'https://x.com/0xmattchain' },
    { label: 'HAVXWallet', handle: '@havxwallet', href: 'https://x.com/havxwallet' },
    { label: 'Portfolio', handle: 'matt-portfolio', href: '/' },
    { label: 'Resume', handle: 'PDF', href: '/resume.pdf' },
  ],
};

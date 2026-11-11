import type { Achievement } from '../types/content';

/**
 * Years are only filled in where the year is confirmed (BNB Hackathon 2025).
 * Everything else is left empty rather than guessed.
 */
export const achievements: Achievement[] = [
  {
    event: 'Bitcoin Global Hackathon',
    result: 'Top 4 globally',
    context: 'Finished in the global top four at the Bitcoin Global Hackathon.',
    highlight: true,
  },
  {
    event: 'Solana Colosseum Global Hackathon',
    result: '2nd Runner Up',
    context: "Second runner-up at Solana's global Colosseum hackathon.",
    highlight: true,
  },
  {
    event: 'Solana Solar Hackathon',
    result: '2nd Runner Up',
    context: 'Second runner-up at the Solana Solar hackathon.',
    highlight: true,
  },
  {
    event: 'BNB Hackathon 2025 (Bombay)',
    result: 'Greenfield Winner',
    year: '2025',
    context: 'Greenfield track winner at BNB Hackathon 2025 in Bombay.',
  },
  {
    event: 'BeachHack S7',
    result: 'Best Idea Implemented',
    context: 'Awarded Best Idea Implemented for BitLend.',
  },
  {
    event: 'Ideathon',
    result: '2nd Runner Up',
    context: 'Second runner-up for BRIKX, an RWA tokenization project.',
  },
  {
    event: 'GDG Hackathon',
    result: 'Top 8 team',
    context: 'Finished with a top-eight team.',
  },
  {
    event: 'IIT Blockchain Hackathon',
    result: 'Top 10 finalist',
    context: 'Top-ten finalist with the Brikx RWA project.',
  },
  {
    event: 'IIT Smart Hostel Hackathon',
    result: 'Top 20',
    context: 'Placed in the top twenty at the IIT Smart Hostel Hackathon.',
  },
];

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string[];
  tags: string[];
}

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Top 10 Vintage Horror Tee Trends & Graphic Styling Tips for 2027',
    slug: 'top-10-vintage-horror-tee-trends',
    category: 'Fashion & Styling',
    author: 'Alex Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    date: 'August 1, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    excerpt: 'Discover how 80s horror aesthetic and retro washed graphics are defining modern streetwear fashion.',
    content: [
      'Retro horror apparel has exploded in popularity over the past few years. From classic 80s movie poster prints to distressed washed tees, fans are embracing nostalgic dark aesthetics in daily streetwear.',
      'When styling a heavy graphic tee, balance is key. Pair oversized vintage tees with relaxed denim or layered flannel shirts for an effortless casual fit.',
      'Our Print-On-Demand process uses eco-friendly inks designed to maintain vibrant contrast even after multiple washes.',
    ],
    tags: ['Horror', 'Vintage', 'Streetwear', 'Graphic Tees'],
  },
  {
    id: 'blog-2',
    title: 'Behind The Print: How We Create Durable High-Definition Graphic Apparel',
    slug: 'behind-the-print-how-we-create-durable-tees',
    category: 'POD Inside Story',
    author: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    date: 'July 28, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    excerpt: 'Take a peek inside our fulfillment center to see how Direct-To-Garment (DTG) printing brings artwork to life.',
    content: [
      'Direct-To-Garment (DTG) printing works much like an inkjet printer, but for textiles. Ink is injected directly into 100% ring-spun cotton fibers for a soft hand-feel that won’t peel over time.',
      'Before printing, every garment undergoes a specialized pre-treatment process that binds pigment directly to the fabric.',
      'Learn how to properly wash and preserve your custom printed tees for maximum longevity.',
    ],
    tags: ['DTG Printing', 'Care Guide', 'Cotton Quality'],
  },
  {
    id: 'blog-[#3]',
    title: 'Country Music Tour Apparel: Why Graphic Tees Never Go Out Of Style',
    slug: 'country-music-tour-apparel-guide',
    category: 'Pop Culture',
    author: 'Chris Morgan',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    date: 'July 20, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
    excerpt: 'From Ella Langley to Morgan Wallen, country tour merch is taking over casual wardrobes.',
    content: [
      'Country concert merch has evolved far beyond standard venue souvenirs. Modern graphics feature vintage typography, distressed Western motifs, and washed cotton tones.',
      'Explore our top trending Ella Langley and country music graphic tees in the store now.',
    ],
    tags: ['Ella Langley', 'Morgan Wallen', 'Country Music'],
  },
];

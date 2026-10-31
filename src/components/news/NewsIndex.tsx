import React, { useState } from 'react';

export interface NewsArticleItem {
  slug: string;
  title: string;
  category: string;
  kind: string;
  published: string;
  excerpt: string;
  hero_image: string;
  author: string;
  author_avatar: string;
  read_time: string;
  featured: boolean;
}

interface NewsIndexProps {
  articles: NewsArticleItem[];
}

export const NewsIndex: React.FC<NewsIndexProps> = ({ articles }) => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = [
    { key: 'ALL', label: 'All' },
    { key: 'LAUNCH', label: 'Launches 🚀' },
    { key: 'BENCHMARK', label: 'Benchmarks 📊' },
    { key: 'DEEP DIVE', label: 'Deep Dives 📖' },
    { key: 'TOOL', label: 'Tools 🔧' },
    { key: 'OPINION', label: 'Opinion 💬' },
  ];

  const getBadgeStyle = (cat: string) => {
    switch (cat.toUpperCase()) {
      case 'LAUNCH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'BENCHMARK':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      case 'TOOL':
        return 'bg-[#00e3fd]/10 text-[#00e3fd] border-[#00e3fd]/30';
      case 'DEEP DIVE':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'OPINION':
      default:
        return 'bg-neutral-500/10 text-neutral-300 border-neutral-500/30';
    }
  };

  const featured = articles.find((a) => a.featured) || articles[0];
  const filteredArticles = articles.filter((a) => {
    if (activeCategory === 'ALL') return true;
    return a.category.toUpperCase() === activeCategory.toUpperCase();
  });

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-12 font-sans text-white">
      {/* Header */}
      <div className="space-y-4 mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
          Today in <span className="text-[#c0f500]">Automation</span>
        </h1>
        <p className="text-sm sm:text-lg text-[#9ca3af] max-w-2xl">
          Launches, deep dives, and benchmarks — updated daily by the WikiOfAutomation research team.
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-2 scrollbar-none font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl font-bold border transition-colors whitespace-nowrap cursor-pointer min-h-[40px] ${
                activeCategory === cat.key
                  ? 'bg-[#c0f500] text-[#161f00] border-[#c0f500]'
                  : 'bg-[#131317] text-[#9ca3af] hover:text-white border-white/10 hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Story (Full Width) */}
      {featured && activeCategory === 'ALL' && (
        <div className="mb-12">
          <a href={`/news/${featured.slug}`} className="no-underline block group">
            <div className="bg-[#131317] border border-white/10 group-hover:border-[#c0f500] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-[2/1] lg:aspect-auto overflow-hidden bg-[#1f1f23]">
                <img
                  src={featured.hero_image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-mono text-xs font-bold uppercase border backdrop-blur-md ${getBadgeStyle(
                      featured.category
                    )}`}
                  >
                    FEATURED STORY · {featured.category}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#c0f500] transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-[#9ca3af]">
                  <div className="flex items-center gap-2">
                    <img
                      src={featured.author_avatar}
                      alt={featured.author}
                      className="w-7 h-7 rounded-full bg-[#1f1f23]"
                    />
                    <span>By {featured.author}</span>
                    <span>·</span>
                    <span>{featured.published}</span>
                  </div>
                  <span className="text-[#c0f500] font-bold group-hover:translate-x-1 transition-transform">
                    Read Story {featured.read_time} →
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Recent Stories (3-Column Grid) */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight border-b border-white/10 pb-4">
          {activeCategory === 'ALL' ? 'Recent Articles' : `${activeCategory} Articles`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <a key={article.slug} href={`/news/${article.slug}`} className="no-underline block group">
              <div className="bg-[#131317] border border-white/10 group-hover:border-[#c0f500] rounded-2xl overflow-hidden h-full flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-1">
                <div>
                  <div className="relative aspect-[2/1] overflow-hidden bg-[#1f1f23]">
                    <img
                      src={article.hero_image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase border backdrop-blur-md ${getBadgeStyle(
                          article.category
                        )}`}
                      >
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-white group-hover:text-[#c0f500] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#9ca3af] line-clamp-3 leading-relaxed">{article.excerpt}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-white/5 text-[11px] font-mono text-[#9ca3af] mt-4">
                  <div className="flex items-center gap-2">
                    <img src={article.author_avatar} alt={article.author} className="w-5 h-5 rounded-full" />
                    <span>{article.author}</span>
                  </div>
                  <span>
                    {article.read_time} · {article.published}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

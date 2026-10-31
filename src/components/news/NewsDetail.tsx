import React, { useState, useEffect } from 'react';

export interface TocItem {
  id: string;
  title: string;
}

export interface RelatedWikiItem {
  title: string;
  href: string;
}

export interface NewsDetailProps {
  title: string;
  category: string;
  published: string;
  author: string;
  author_avatar: string;
  read_time: string;
  tags: string[];
  hero_image: string;
  toc: TocItem[];
  related_wiki: RelatedWikiItem[];
  related_news: { title: string; slug: string; read_time: string }[];
  prev_post?: { title: string; slug: string };
  next_post?: { title: string; slug: string };
  children: React.ReactNode;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({
  title,
  category,
  published,
  author,
  author_avatar,
  read_time,
  tags,
  hero_image,
  toc,
  related_wiki,
  related_news,
  prev_post,
  next_post,
  children
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [comments, setComments] = useState<string[]>([
    'Great technical breakdown! The hybrid thinking mode in Claude 3.7 really simplifies multi-step agent graphs.',
    'Exceeded expectations on SWE-bench. Very excited to implement this with our n8n workflows!'
  ]);
  const [newComment, setNewComment] = useState('');

  // Calculate scroll progress percentage
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments((prev) => [newComment.trim(), ...prev]);
      setNewComment('');
    }
  };

  return (
    <div className="font-sans text-white relative">
      {/* Fixed Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#c0f500] z-50 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(192,245,0,0.8)]"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-[#9ca3af] uppercase tracking-wider mb-8">
          <a href="/news" className="text-[#00e3fd] hover:underline no-underline">
            NEWS
          </a>
          <span>/</span>
          <span className="text-white font-bold truncate">{title}</span>
        </nav>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-12 relative">
          {/* LEFT ARTICLE (740px max width) */}
          <main className="flex-1 max-w-[740px] space-y-8">
            {/* Category & Title */}
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full font-mono text-xs font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                🚀 {category}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
                {title}
              </h1>

              {/* Byline */}
              <div className="flex items-center gap-3 text-xs sm:text-sm font-mono text-[#9ca3af] border-y border-white/10 py-3">
                <img src={author_avatar} alt={author} className="w-8 h-8 rounded-full bg-[#1f1f23]" />
                <span className="text-white font-bold">By {author}</span>
                <span>·</span>
                <span>{published}</span>
                <span>·</span>
                <span className="text-[#c0f500]">{read_time}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="font-mono text-xs text-[#9ca3af] bg-[#1f1f23] px-3 py-1 rounded-full border border-white/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero Image (2:1 aspect ratio) */}
            <div className="relative w-full aspect-[2/1] bg-[#1f1f23] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img src={hero_image} alt={title} className="w-full h-full object-cover" />
            </div>

            {/* Article Body */}
            <div className="prose prose-invert max-w-none text-[#e5e1e7] leading-[1.7] text-base sm:text-lg space-y-6">
              {children}
            </div>

            {/* Prev / Next Navigation */}
            <div className="border-t border-white/10 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prev_post ? (
                <a
                  href={`/news/${prev_post.slug}`}
                  className="bg-[#131317] border border-white/10 hover:border-[#c0f500] p-4 rounded-xl space-y-1 no-underline group transition-all"
                >
                  <span className="text-[10px] font-mono text-[#9ca3af] uppercase">← Previous Article</span>
                  <div className="text-sm font-bold text-white group-hover:text-[#c0f500] truncate">
                    {prev_post.title}
                  </div>
                </a>
              ) : <div />}

              {next_post ? (
                <a
                  href={`/news/${next_post.slug}`}
                  className="bg-[#131317] border border-white/10 hover:border-[#c0f500] p-4 rounded-xl space-y-1 no-underline group text-right transition-all"
                >
                  <span className="text-[10px] font-mono text-[#9ca3af] uppercase">Next Article →</span>
                  <div className="text-sm font-bold text-white group-hover:text-[#c0f500] truncate">
                    {next_post.title}
                  </div>
                </a>
              ) : <div />}
            </div>

            {/* Comments Section */}
            <div className="border-t border-white/10 pt-10 space-y-6">
              <h3 className="text-xl font-bold text-white">Community Discussion ({comments.length})</h3>

              <form onSubmit={handleAddComment} className="bg-[#131317] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this article..."
                  className="w-full h-24 bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl p-3.5 text-sm text-white focus:outline-none resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 h-10 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-xs shadow-[0_0_15px_rgba(192,245,0,0.3)] transition-transform cursor-pointer min-h-[40px]"
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {comments.map((cmt, idx) => (
                  <div key={idx} className="bg-[#131317] border border-white/10 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#9ca3af]">
                      <span className="text-white font-bold">Community Member</span>
                      <span>·</span>
                      <span>Just now</span>
                    </div>
                    <p className="text-sm text-[#e5e1e7]">{cmt}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* RIGHT SIDEBAR (Sticky, top-24) */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8 sticky top-24 h-fit">
            {/* Table of Contents */}
            {toc.length > 0 && (
              <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 space-y-3">
                <h3 className="text-xs font-mono font-bold text-[#c0f500] uppercase tracking-wider">
                  Table of Contents
                </h3>
                <nav className="space-y-2 font-mono text-xs">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-[#9ca3af] hover:text-white transition-colors no-underline line-clamp-1"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Newsletter Inline Block */}
            <div className="bg-[#1f1f23] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#c0f500]/20 text-[#c0f500] text-xl flex items-center justify-center font-bold">
                📬
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Get Automation News Daily</h4>
                <p className="text-xs text-[#9ca3af] mt-1">
                  Join 15,000+ engineers receiving curated AI agent benchmarks and n8n workflows every morning.
                </p>
              </div>

              {newsletterSuccess ? (
                <div className="p-3 bg-[#c0f500]/10 border border-[#c0f500]/30 rounded-xl text-xs font-mono text-[#c0f500]">
                  ✓ Subscribed! Check your inbox to confirm.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="alex@company.com"
                    required
                    className="w-full h-10 bg-[#131317] border border-white/10 focus:border-[#c0f500] rounded-xl px-3 text-xs text-white placeholder-[#9ca3af]/50 focus:outline-none min-h-[40px]"
                  />
                  <button
                    type="submit"
                    className="w-full h-10 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-xs shadow-[0_0_15px_rgba(192,245,0,0.3)] transition-transform cursor-pointer min-h-[40px]"
                  >
                    Subscribe Free →
                  </button>
                </form>
              )}
            </div>

            {/* Related Wiki Entries */}
            {related_wiki.length > 0 && (
              <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 space-y-3">
                <h3 className="text-xs font-mono font-bold text-[#00e3fd] uppercase tracking-wider">
                  Related Wiki Entries
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  {related_wiki.map((wiki, idx) => (
                    <a
                      key={idx}
                      href={wiki.href}
                      className="block text-[#9ca3af] hover:text-[#00e3fd] transition-colors no-underline"
                    >
                      📄 {wiki.title} →
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Related News */}
            {related_news.length > 0 && (
              <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  More News Stories
                </h3>
                <div className="space-y-3">
                  {related_news.map((item) => (
                    <a
                      key={item.slug}
                      href={`/news/${item.slug}`}
                      className="block text-xs font-bold text-white hover:text-[#c0f500] transition-colors no-underline group space-y-1"
                    >
                      <div className="line-clamp-2 leading-snug">{item.title}</div>
                      <div className="font-mono text-[10px] text-[#9ca3af]">{item.read_time}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

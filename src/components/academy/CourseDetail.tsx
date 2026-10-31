import React, { useState } from 'react';

export interface LessonItem {
  number: number;
  title: string;
  duration: string;
  gated: boolean;
  completed: boolean;
}

export interface CourseDetailProps {
  title: string;
  instructor: string;
  instructor_avatar: string;
  rating: number;
  enrolled_count: string;
  price_label: string;
  level: string;
  duration: string;
  lessons_count: number;
  thumbnail: string;
  what_youll_learn: string[];
  lessons: LessonItem[];
  children: React.ReactNode;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({
  title,
  instructor,
  instructor_avatar,
  rating,
  enrolled_count,
  price_label,
  level,
  duration,
  lessons_count,
  thumbnail,
  what_youll_learn,
  lessons,
  children,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'reviews' | 'discussions'>('lessons');
  const [lessonState, setLessonState] = useState<LessonItem[]>(lessons);
  const [showCertificate, setShowCertificate] = useState(false);

  const completedCount = lessonState.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / lessonState.length) * 100);

  const toggleLessonCompleted = (number: number) => {
    setLessonState((prev) =>
      prev.map((l) => (l.number === number ? { ...l, completed: !l.completed } : l))
    );
  };

  return (
    <div className="font-sans text-white max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#9ca3af] uppercase tracking-wider">
        <a href="/academy" className="text-[#00e3fd] hover:underline no-underline">
          ACADEMY
        </a>
        <span>/</span>
        <span className="text-white font-bold truncate">{title}</span>
      </nav>

      {/* Course Header & Progress Bar */}
      <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full font-mono text-xs font-bold uppercase bg-[#c0f500]/10 text-[#c0f500] border border-[#c0f500]/30">
              {level} COURSE · {duration}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono text-xs text-[#9ca3af]">
            <img src={instructor_avatar} alt={instructor} className="w-10 h-10 rounded-full bg-[#1f1f23]" />
            <div>
              <div className="text-white font-bold">{instructor}</div>
              <div>★ {rating} · {enrolled_count} enrolled</div>
            </div>
          </div>
        </div>

        {/* Progress Bar under header */}
        <div className="space-y-2 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#9ca3af]">Course Progress</span>
            <span className="text-[#c0f500] font-bold">
              {completedCount} of {lessonState.length} Lessons Completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#1f1f23] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c0f500] transition-all duration-300 shadow-[0_0_10px_rgba(192,245,0,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* LEFT MAIN CONTENT */}
        <main className="flex-1 space-y-8 min-w-0">
          {/* Hero Video Preview Container */}
          <div className="relative aspect-video bg-[#1f1f23] border border-white/10 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
            <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#c0f500] text-[#161f00] flex items-center justify-center text-3xl font-bold shadow-[0_0_30px_rgba(192,245,0,0.6)] group-hover:scale-110 transition-transform pl-1">
                ▶
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-white border border-white/10">
              Lesson 1 Preview · 12:45
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2 font-mono text-xs overflow-x-auto scrollbar-none">
            {[
              { id: 'lessons', label: `Lessons (${lessonState.length})` },
              { id: 'overview', label: 'Overview' },
              { id: 'reviews', label: 'Reviews (42)' },
              { id: 'discussions', label: 'Discussions (18)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold border transition-colors cursor-pointer whitespace-nowrap min-h-[40px] ${
                  activeTab === tab.id
                    ? 'bg-[#c0f500] text-[#161f00] border-[#c0f500]'
                    : 'bg-[#131317] text-[#9ca3af] hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'lessons' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Course Curriculum</h3>

              <div className="space-y-3">
                {lessonState.map((l) => (
                  <div
                    key={l.number}
                    className={`bg-[#131317] border ${
                      l.completed ? 'border-[#c0f500]/40 bg-[#c0f500]/5' : 'border-white/10'
                    } rounded-xl p-4 flex items-center justify-between gap-4 transition-all`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleLessonCompleted(l.number)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer ${
                          l.completed
                            ? 'bg-[#c0f500] text-[#161f00]'
                            : 'bg-[#1f1f23] text-[#9ca3af] border border-white/10'
                        }`}
                      >
                        {l.completed ? '✓' : l.number}
                      </button>

                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{l.title}</div>
                        <div className="text-[11px] font-mono text-[#9ca3af] flex items-center gap-2">
                          <span>Duration: {l.duration}</span>
                          {l.gated && <span className="text-amber-400 font-bold">🔒 Pro Gated</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {l.gated ? (
                        <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                          🔒 Lock
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleLessonCompleted(l.number)}
                          className="px-3 py-1.5 rounded-lg bg-[#1f1f23] hover:bg-[#c0f500] text-white hover:text-[#161f00] text-xs font-mono font-bold border border-white/10 transition-colors cursor-pointer min-h-[36px]"
                        >
                          {l.completed ? 'Rewatch' : 'Play →'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* "What you'll learn" checklist */}
              <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#c0f500]">✓</span> What You'll Learn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#e5e1e7]">
                  {what_youll_learn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-[#c0f500] font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-base text-[#9ca3af] leading-relaxed space-y-4">
                {children}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Student Reviews</h3>
              <div className="space-y-3">
                {[
                  { name: 'Alex Rivera', rating: '5.0', comment: 'Clear, concise, and straight to the point. Built my first n8n agent workflow in 2 hours!' },
                  { name: 'David Chen', rating: '5.0', comment: 'The MCP server section alone was worth enrolling. Excellent instructor!' },
                ].map((r, i) => (
                  <div key={i} className="bg-[#131317] border border-white/10 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white font-bold">{r.name}</span>
                      <span className="text-amber-400 font-bold">★ {r.rating}</span>
                    </div>
                    <p className="text-sm text-[#e5e1e7]">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'discussions' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Classroom Discussions</h3>
              <div className="bg-[#131317] border border-white/10 rounded-xl p-4 space-y-2">
                <div className="text-xs font-mono text-[#9ca3af]">Ask a question or share your workflow build...</div>
                <textarea
                  placeholder="Type your question..."
                  className="w-full h-20 bg-[#1f1f23] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none resize-none"
                />
                <div className="flex justify-end">
                  <button className="px-4 h-9 bg-[#c0f500] text-[#161f00] font-bold text-xs rounded-lg cursor-pointer">
                    Post Question
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR (Sticky, top-24) */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6 sticky top-24 h-fit">
          {/* Price Card */}
          <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#9ca3af] uppercase">COURSE ACCESS</span>
              <div className="text-3xl font-bold text-white">
                {price_label === 'FREE' ? (
                  <span className="text-[#00e3fd]">FREE</span>
                ) : (
                  <span>$99 <span className="text-xs font-normal text-[#9ca3af]">/ lifetime</span></span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="/signin"
                className="w-full h-11 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-xs sm:text-sm shadow-[0_0_15px_rgba(192,245,0,0.3)] transition-transform flex items-center justify-center no-underline cursor-pointer min-h-[44px]"
              >
                Start Learning Free →
              </a>
              <button
                onClick={() => setShowCertificate(!showCertificate)}
                className="w-full h-11 bg-[#1f1f23] hover:bg-[#2a292e] text-white font-bold rounded-xl text-xs border border-white/10 transition-colors cursor-pointer min-h-[44px]"
              >
                {showCertificate ? 'Hide Certificate Preview' : 'Preview Certificate Widget'}
              </button>
            </div>

            {/* Includes Checklist */}
            <div className="border-t border-white/10 pt-4 space-y-3 text-xs font-mono text-[#9ca3af]">
              <div className="text-white font-bold uppercase">This course includes:</div>
              <div className="flex items-center gap-2"><span>📹</span> <span>{duration} on-demand video</span></div>
              <div className="flex items-center gap-2"><span>📄</span> <span>{lessonState.length} interactive lessons</span></div>
              <div className="flex items-center gap-2"><span>📂</span> <span>Downloadable JSON workflow assets</span></div>
              <div className="flex items-center gap-2"><span>🏆</span> <span>Verified Certificate of Completion</span></div>
              <div className="flex items-center gap-2"><span>♾️</span> <span>Full lifetime access</span></div>
            </div>

            {/* Certificate Preview Widget */}
            {showCertificate && (
              <div className="border-t border-white/10 pt-4 space-y-3 animate-in fade-in">
                <div className="bg-[#1f1f23] border border-[#c0f500]/40 rounded-xl p-4 space-y-2 text-center">
                  <div className="text-[10px] font-mono text-[#c0f500] uppercase font-bold">VERIFIED ACADEMY CERTIFICATE</div>
                  <div className="text-xs font-bold text-white">Automation Engineering Specialist</div>
                  <div className="text-[10px] font-mono text-[#9ca3af]">Awarded upon 100% completion</div>
                  <div className="pt-2">
                    <span className="px-3 py-1 bg-[#c0f500] text-[#161f00] text-[10px] font-mono font-bold rounded-md">
                      WOA-CERT-{Math.floor(100000 + Math.random() * 900000)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

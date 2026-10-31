import React, { useState } from 'react';

export interface CourseItem {
  slug: string;
  title: string;
  instructor: string;
  instructor_avatar: string;
  rating: number;
  enrolled_count: string;
  price_label: string;
  level: string;
  duration: string;
  lessons_count: number;
  tool_tag: string;
  tags: string[];
  thumbnail: string;
}

interface AcademyHubProps {
  courses: CourseItem[];
}

export const AcademyHub: React.FC<AcademyHubProps> = ({ courses }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const tracks = [
    {
      id: 'beginner',
      badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      dotColor: 'bg-violet-500',
      title: 'Beginner Automation Foundations',
      description: 'Master core API concepts, webhooks, JSON schemas, and basic triggers.',
      coursesCount: '4 courses',
      hoursTotal: '8h total',
    },
    {
      id: 'n8n-master',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      dotColor: 'bg-[#00e3fd]',
      title: 'n8n Master Track',
      description: 'Build production self-hosted n8n instances, sub-workflows, and AI reasoning nodes.',
      coursesCount: '7 courses',
      hoursTotal: '14h total',
    },
    {
      id: 'claude-skills',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dotColor: 'bg-amber-500',
      title: 'Claude Skills Builder',
      description: 'Design SKILL.md specs, custom Model Context Protocol (MCP) servers, and agent plugins.',
      coursesCount: '5 courses',
      hoursTotal: '10h total',
    },
  ];

  const filteredCourses = courses.filter((c) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'FREE') return c.price_label === 'FREE';
    if (activeFilter === 'PRO') return c.price_label === 'PRO';
    return c.tool_tag.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-16 font-sans text-white space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase bg-[#c0f500]/10 text-[#c0f500] border border-[#c0f500]/30">
            🎓 WikiOfAutomation Academy
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
            Automation <span className="text-[#c0f500]">Academy</span>
          </h1>
          <p className="text-base sm:text-xl text-[#9ca3af]">
            Learn automation. Ship workflows. Earn verified developer certificates.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="#all-courses"
            className="px-6 h-12 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-xs sm:text-sm shadow-[0_0_15px_rgba(192,245,0,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px] no-underline w-full sm:w-auto"
          >
            Browse Courses ↓
          </a>
          <a
            href="/signin"
            className="px-6 h-12 bg-[#131317] hover:bg-[#1f1f23] text-white border border-white/10 hover:border-white/20 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px] no-underline w-full sm:w-auto"
          >
            View My Progress
          </a>
        </div>
      </div>

      {/* Learning Tracks Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Structured Learning Tracks</h2>
          <p className="text-sm text-[#9ca3af]">Guided pathways designed to take you from foundational concepts to production deployment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-[#131317] border border-white/10 hover:border-[#c0f500] rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase border ${track.badgeColor}`}>
                    TRACK
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#9ca3af]">
                    <span>{track.coursesCount}</span>
                    <span>·</span>
                    <span>{track.hoursTotal}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#c0f500] transition-colors">
                  {track.title}
                </h3>
                <p className="text-xs text-[#9ca3af] leading-relaxed">{track.description}</p>
              </div>

              <a
                href="#all-courses"
                className="text-xs font-mono font-bold text-[#c0f500] group-hover:translate-x-1 transition-transform no-underline flex items-center gap-1"
              >
                Explore Track Curriculum →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* All Courses Section */}
      <div id="all-courses" className="space-y-8 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">All Courses ({filteredCourses.length})</h2>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto font-mono text-xs scrollbar-none">
            {['ALL', 'FREE', 'PRO', 'n8n', 'Claude', 'Docker', 'LangGraph'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl font-bold border transition-colors cursor-pointer whitespace-nowrap min-h-[36px] ${
                  activeFilter === f
                    ? 'bg-[#c0f500] text-[#161f00] border-[#c0f500]'
                    : 'bg-[#131317] text-[#9ca3af] hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards List (Horizontal Card Layout) */}
        <div className="space-y-6">
          {filteredCourses.map((course) => (
            <a
              key={course.slug}
              href={`/academy/courses/${course.slug}`}
              className="no-underline block group"
            >
              <div className="bg-[#131317] border border-white/10 group-hover:border-[#c0f500] rounded-2xl overflow-hidden transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6 shadow-xl group-hover:-translate-y-1">
                {/* Thumbnail (Left) */}
                <div className="md:col-span-4 aspect-video bg-[#1f1f23] rounded-xl overflow-hidden relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase border backdrop-blur-md ${
                        course.price_label === 'FREE'
                          ? 'bg-teal-500/20 text-[#00e3fd] border-teal-500/40'
                          : 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                      }`}
                    >
                      {course.price_label}
                    </span>
                  </div>
                </div>

                {/* Content (Right) */}
                <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#9ca3af]">
                      <span className="text-white font-bold">{course.level}</span>
                      <span>·</span>
                      <span>{course.lessons_count} lessons</span>
                      <span>·</span>
                      <span>{course.duration}</span>
                      <span>·</span>
                      <span className="text-amber-400 font-bold">★ {course.rating}</span>
                      <span>({course.enrolled_count} students)</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#c0f500] transition-colors leading-snug">
                      {course.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                      <img src={course.instructor_avatar} alt={course.instructor} className="w-6 h-6 rounded-full" />
                      <span className="text-xs font-mono text-[#9ca3af]">{course.instructor}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {course.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md font-mono text-[10px] text-[#9ca3af] bg-[#1f1f23] border border-white/10"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      <span className="text-xs font-mono font-bold text-[#c0f500] group-hover:translate-x-1 transition-transform">
                        Start Course →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

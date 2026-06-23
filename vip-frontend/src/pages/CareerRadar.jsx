import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import PageHeader from '../components/ui/PageHeader';

export default function CareerRadar() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      {/* Side Navigation */}
      <SideNavBar />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background">
        <TopNavBar breadcrumbs={[{ label: 'Home', link: '/dashboard' }, { label: 'Career Radar' }]} />

        <div className="p-margin-mobile md:p-margin-desktop max-w-[1280px] mx-auto w-full flex flex-col gap-gutter mt-4 mb-8">
          {/* Page Header */}
          <PageHeader
            title="Career Radar & Market Trends"
            subtitle="Parsing active UTM listings and industry demands."
          />

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter auto-rows-min">
            {/* 1. Trending Skills Widget (Spans 2 cols) */}
            <div className="col-span-1 lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary-container"></div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="font-h3 text-h3 text-on-surface mb-1 font-bold font-h3 serif">Trending Skills</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Most requested skills in current active tier-1 listings.</p>
                </div>
                <span className="material-symbols-outlined text-outline-variant text-[32px]">trending_up</span>
              </div>
              <div className="flex flex-col gap-5 mt-auto">
                {/* Skill Items */}
                {[
                  { name: 'Python', percentage: 88 },
                  { name: 'React', percentage: 75 },
                  { name: 'SQL', percentage: 62 },
                  { name: 'Data Analysis', percentage: 54 },
                  { name: 'UI/UX', percentage: 40 }
                ].map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="font-label-md text-label-md text-on-surface">{skill.name}</span>
                      <span className="font-label-md text-label-md text-primary">{skill.percentage}%</span>
                    </div>
                    <div className="w-full bg-surface-variant rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Industry Distribution Widget */}
            <div className="col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
              <h2 className="font-h3 text-h3 text-on-surface mb-1 font-bold font-h3 serif">Industry Sectors</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Volume of current opportunities.</p>
              <div className="flex-1 flex flex-col gap-6 justify-center">
                {[
                  { name: 'Technology', value: 45, icon: 'computer', barColor: 'bg-tertiary-container' },
                  { name: 'Engineering', value: 30, icon: 'precision_manufacturing', barColor: 'bg-secondary-container' },
                  { name: 'Finance', value: 25, icon: 'account_balance', barColor: 'bg-surface-tint' }
                ].map((sector, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">{sector.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-label-md text-label-md text-on-surface">{sector.name}</span>
                        <span className="font-body-md text-body-md font-semibold text-on-surface">{sector.value}%</span>
                      </div>
                      <div className="w-full bg-surface-variant rounded-full h-1.5">
                        <div className={`${sector.barColor} h-1.5 rounded-full`} style={{ width: `${sector.value}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. CGPA Benchmarks Card */}
            <div className="col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm min-h-[220px]">
              <span className="material-symbols-outlined text-secondary text-[40px] mb-4">school</span>
              <h2 className="font-h1 text-h1 text-primary mb-2 font-bold font-h1 serif">3.50</h2>
              <p className="font-body-md text-body-md text-on-surface font-medium mb-4">Average Required CGPA<br />for Tier-1 Placements</p>
              <div className="bg-surface-container px-4 py-2 rounded-lg border border-outline-variant inline-block">
                <p className="font-label-sm text-label-sm text-on-surface-variant">MINIMUM THRESHOLD: <span className="text-primary font-bold">3.00</span></p>
              </div>
            </div>

            {/* 4. Profile Advisory Tip Box */}
            <div className="col-span-1 lg:col-span-2 bg-[#fffaf0] border border-[#fdb742] rounded-xl p-6 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#fdb742] bg-opacity-20 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-[#805600] fill-icon">lightbulb</span>
              </div>
              <div className="flex-1">
                <h3 className="font-h3 text-h3 text-[#805600] mb-2 font-bold font-h3 serif">Profile Advisory</h3>
                <p className="font-body-md text-body-md text-[#6e4900] leading-relaxed">
                  Your current profile matches <strong>42%</strong> of active listings in your faculty. Adding a certified proficiency in <strong>Python</strong> or <strong>React</strong> could boost your visibility to recruiters by an estimated <strong>35%</strong>. Consider updating your portfolio.
                </p>
                <button 
                  onClick={() => navigate('/profile-setup')}
                  className="mt-4 text-[#805600] font-label-md text-label-md hover:underline decoration-2 underline-offset-4 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                >
                  Update Profile <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

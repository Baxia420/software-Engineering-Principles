import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

export default function CreateListingForm() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('remote');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [stipend, setStipend] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    async function getSupervisorId() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) {
          setProfile(data);
          setCompany(data.company_name || 'My Company');
        }
      }
    }
    getSupervisorId();
  }, []);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !skills.includes(val)) {
        setSkills([...skills, val]);
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (profile && !profile.is_approved) {
      alert('Your organization account is not approved by UTM Admin yet. You cannot publish internships.');
      return;
    }

    const { error } = await supabase
      .from('internships')
      .insert({
        supervisor_id: userId,
        title: jobTitle,
        company: company || 'UTM Faculty Office',
        location: location || 'Johor Bahru (On-site)',
        type: type,
        description: description,
        requirements: skills.join(', '),
        stipend: stipend,
        duration: duration,
      });

    if (error) {
      alert(error.message);
    } else {
      alert('Listing Published Successfully!');
      navigate('/company/postings');
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background">
        <TopNavBar 
          breadcrumbs={[
            { label: 'Home', link: '/company/dashboard' },
            { label: 'My Postings', link: '/company/postings' },
            { label: 'Post New Internship' }
          ]} 
        />

        <div className="p-margin-mobile md:p-margin-desktop max-w-[1280px] mx-auto w-full flex flex-col gap-gutter mt-4 mb-8">
          <div className="mb-2">
            <h1 className="font-h1 text-h1 text-on-surface mb-2 font-bold font-h1 serif">Post New Internship</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Create a detailed listing to attract top student talent from UTM.</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-gutter shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Job Title */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="job-title">Job Title</label>
                  <input 
                    className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-on-surface placeholder:text-on-surface-variant/50" 
                    id="job-title" 
                    placeholder="e.g., Software Engineering Intern" 
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Company and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="company">Company / Organization Name</label>
                    <input 
                      className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-on-surface" 
                      id="company" 
                      placeholder="e.g. UTM Digital" 
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="location">Location</label>
                    <input 
                      className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-on-surface" 
                      id="location" 
                      placeholder="e.g. Johor Bahru (On-site)" 
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Type & Duration Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="type">Workplace Type</label>
                    <div className="relative">
                      <select 
                        className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-on-surface appearance-none pr-10" 
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                      >
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="on-site">On-site</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="duration">Duration</label>
                    <input 
                      className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-on-surface" 
                      id="duration" 
                      placeholder="e.g. 24 Weeks" 
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Role Description */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="description">Role Description</label>
                  <textarea 
                    className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md bg-surface-container-lowest focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 resize-y focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
                    id="description" 
                    placeholder="Describe the responsibilities and learning opportunities..." 
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Required Skills */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="skills-input">Required Skills</label>
                  <div className="border border-outline-variant rounded p-2 bg-surface-container-lowest flex flex-wrap gap-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                    {skills.map((skill, index) => (
                      <span key={index} className="bg-surface-container-high border border-outline-variant text-on-surface font-label-sm text-label-sm px-2 py-1 rounded flex items-center gap-1">
                        {skill}
                        <button 
                          className="hover:text-error cursor-pointer border-none bg-transparent p-0 flex items-center" 
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                    ))}
                    <input 
                      className="flex-1 min-w-[200px] border-none bg-transparent focus:ring-0 focus:outline-none p-1 font-body-sm text-body-sm placeholder:text-on-surface-variant/50 text-on-surface" 
                      id="skills-input" 
                      placeholder="Type a skill and press Enter..." 
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                    />
                  </div>
                </div>

                {/* Stipend */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="stipend">Monthly Stipend (optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md text-body-md">RM</span>
                    <input 
                      className="w-full border border-outline-variant rounded pl-10 pr-3 py-2 font-body-md text-body-md bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-on-surface placeholder:text-on-surface-variant/50" 
                      id="stipend" 
                      placeholder="e.g., 1200" 
                      type="text"
                      value={stipend}
                      onChange={(e) => setStipend(e.target.value)}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-outline-variant flex justify-end gap-4 mt-8">
                  <button 
                    onClick={() => navigate('/company/postings')}
                    className="px-6 py-2.5 border border-primary-container text-primary-container font-label-md text-label-md rounded hover:bg-primary-container/10 transition-colors cursor-pointer bg-transparent" 
                    type="button"
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-primary/90 transition-colors cursor-pointer border border-transparent disabled:opacity-50" 
                    type="submit"
                    disabled={profile && !profile.is_approved}
                  >
                    Publish Listing
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://eradgzlaigmwiumioyaq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyYWRnemxhaWdtd2l1bWlveWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0ODMxNDUsImV4cCI6MjA5MzA1OTE0NX0.ZccCK1kQs4cWs4nfwIp9jDuNJyWBWB6rlzm6kCNHRuU';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Prevents node from caching the session globally
  }
});

// Helper delay to avoid rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('--- STARTING VIP DATABASE POPULATION ---');

  // 1. Parse Student CSV
  const csvPath = path.resolve('../courseid_1722_participants.csv');
  console.log('Reading CSV from:', csvPath);
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n');
  const students = [];
  
  // Parse header: First name,Last name,Groups
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing
    let parts = [];
    if (line.startsWith('"')) {
      // Handle quoted first name
      const closingQuoteIdx = line.indexOf('"', 1);
      const name = line.substring(1, closingQuoteIdx);
      const rest = line.substring(closingQuoteIdx + 2);
      parts = [name, ...rest.split(',')];
    } else {
      parts = line.split(',');
    }
    
    const fullName = parts[0]?.trim();
    const matricNumber = parts[1]?.trim();
    
    if (fullName && matricNumber && matricNumber.startsWith('A') || matricNumber?.startsWith('T')) {
      // Split full name into first and last name
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'Student';
      
      students.push({
        firstName,
        lastName,
        matricNumber,
        fullName
      });
    }
  }
  
  console.log(`Parsed ${students.length} students from CSV.`);
  
  // Pick 12 students to register
  const selectedStudents = students.slice(0, 12);
  console.log(`Selected ${selectedStudents.length} students for registration.`);

  // 2. Define Mock Companies
  const mockCompanies = [
    {
      name: 'Petronas Berhad',
      email: 'recruitment@petronas.com.my',
      password: 'CompanyPassword123!',
      firstName: 'Ahmad',
      lastName: 'Zaki',
      bio: 'Petroliam Nasional Berhad (PETRONAS) is a global energy and solutions partner, ranked amongst the largest corporations on Fortune Global 500.',
      internships: [
        {
          title: 'Cloud Infrastructure Intern',
          location: 'Kuala Lumpur',
          type: 'on-site',
          duration: '6 Months',
          stipend: 'RM 1,500',
          description: `At PETRONAS, we are accelerating our digital transformation by leveraging state-of-the-art cloud technologies. As a Cloud Infrastructure Intern with the Group Technology division, you will assist our senior cloud engineering team in design, deployment, and optimization of cloud infrastructure.

Responsibilities:
- Assist in migrating legacy on-premise workloads to public cloud platforms (primarily AWS and Microsoft Azure).
- Work with infrastructure-as-code (IaC) tools, primarily Terraform, to draft, validate, and maintain automated infrastructure deployments.
- Maintain and improve CI/CD pipelines for cloud deployments, ensuring high reliability and automated testing.
- Set up and configure virtual networks (VPCs/VNets), security groups, subnets, and routing tables under the guidance of senior mentors.
- Assist in monitoring resource utilization, identifying bottlenecks, and implementing cost-optimization strategies.

What We Offer:
- Hands-on experience with production cloud environments.
- Direct mentorship from certified Cloud Architects and DevOps Engineers.
- Opportunity to work on high-impact projects that affect global energy operations.`,
          requirements: `- Currently pursuing a Bachelor’s degree in Computer Science, Software Engineering, Information Technology, or a related technical field.
- Familiarity with core cloud concepts (compute, storage, databases, networking) on AWS, Azure, or GCP.
- Basic command of Linux operating systems and shell scripting (Bash, Python, or PowerShell).
- Understanding of Version Control Systems, specifically Git.
- Strong problem-solving skills, analytical thinking, and eagerness to learn new technologies.
- Excellent verbal and written communication skills in English.`
        },
        {
          title: 'Data Science & Analytics Intern',
          location: 'Kuala Lumpur',
          type: 'hybrid',
          duration: '6 Months',
          stipend: 'RM 1,500',
          description: `Join the PETRONAS Upstream Analytics team to transform raw exploration and production data into actionable strategic insights. You will work alongside experienced data scientists, geophysicists, and reservoir engineers to build machine learning models that predict reservoir performance and optimize asset extraction.

Responsibilities:
- Clean, preprocess, and perform exploratory data analysis (EDA) on vast geological and operational datasets.
- Collaborate with domain experts to build, train, and validate machine learning models (regression, classification, time-series forecasting).
- Build interactive data dashboards and visualization tools using Streamlit, PowerBI, or Dash to communicate findings.
- Participate in researching and benchmarking new machine learning frameworks and algorithms.
- Document data pipelines, models, and experiments to ensure reproducibility and alignment with software engineering best practices.

What We Offer:
- Exposure to real-world industrial data science challenges in the energy sector.
- Mentorship under senior data scientists and technical experts.
- High-performance computing resources for model training.`,
          requirements: `- Final year or penultimate year student in Computer Science, Data Science, Statistics, Mathematics, or related field.
- Proficiency in Python and familiarity with data science libraries (Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn).
- Solid understanding of SQL and relational databases.
- Eager to understand business contexts and translate engineering problems into quantitative ML models.
- Familiarity with deep learning frameworks (TensorFlow, PyTorch) or big data tools (Apache Spark) is a plus.`
        }
      ]
    },
    {
      name: 'Grab Malaysia',
      email: 'careers@grab.com.my',
      password: 'CompanyPassword123!',
      firstName: 'Sarah',
      lastName: 'Lim',
      bio: 'Grab is Southeast Asia\'s leading superapp, providing everyday services such as ride-hailing, food delivery, and digital payments.',
      internships: [
        {
          title: 'Backend Software Engineer Intern (Go/Node.js)',
          location: 'Petaling Jaya, Selangor',
          type: 'hybrid',
          duration: '6 Months',
          stipend: 'RM 1,800',
          description: `Grab is Southeast Asia's leading superapp, providing millions of users with ride-hailing, food delivery, and digital payment services daily. As a Backend Software Engineer Intern, you will join our core engineering team in building resilient, high-throughput backend services that handle millions of requests per minute.

Responsibilities:
- Develop, test, and deploy clean, maintainable backend code in Go or Node.js.
- Design and optimize APIs and database schemas to ensure low latency and high availability.
- Write unit, integration, and performance tests to guarantee system stability and prevent regressions.
- Troubleshoot, debug, and optimize live microservices under the guidance of senior developers.
- Participate actively in engineering discussions, agile sprints, standups, and peer code reviews.

What We Offer:
- Real-world experience building scalable microservices inside a high-growth tech organization.
- Mentorship from top-tier engineers who are leaders in Southeast Asia's tech industry.
- Opportunity to see your code deployed to millions of active users.`,
          requirements: `- Enrolled in a Bachelor’s degree in Computer Science, Software Engineering, or equivalent.
- Strong foundation in computer science fundamentals: data structures, algorithms, object-oriented programming, and design patterns.
- Hands-on experience with backend programming languages (Go, Node.js, Python, or Java) through coursework or personal projects.
- Familiarity with SQL/NoSQL databases and building RESTful or gRPC APIs.
- Understanding of Git and basic DevOps practices (Docker, CI/CD).
- Strong debugging and analytical skills.`
        },
        {
          title: 'Mobile Engineer Intern (React Native / iOS)',
          location: 'Petaling Jaya, Selangor',
          type: 'on-site',
          duration: '3 Months',
          stipend: 'RM 1,800',
          description: `At Grab, the mobile application is our main bridge to our users. As a Mobile Engineer Intern, you will work within the passenger app engineering team to craft delightful, fluid user interfaces. You will assist in implementing new features, optimizing performance, and resolving native issues on iOS or React Native codebases.

Responsibilities:
- Write clean, modular, and responsive UI components using React Native and/or Swift.
- Collaborate closely with UI/UX designers and product managers to translate design mockups into functional mobile screens.
- Optimize mobile applications for speed, memory usage, and battery efficiency.
- Investigate and resolve bugs reported by users or automated monitoring systems.
- Learn and adopt industry-standard mobile development architectures and practices.

What We Offer:
- Immersion in a world-class mobile development ecosystem.
- Mentorship from senior iOS and React Native specialists.
- Active participation in mobile release cycles.`,
          requirements: `- Pursuing a degree in Computer Science, Software Engineering, Mobile Computing, or equivalent.
- Solid knowledge of JavaScript/TypeScript and React, or Native iOS (Swift, UIKit/SwiftUI).
- Understanding of mobile app lifecycle, state management (Redux, Context, etc.), and networking.
- A keen eye for visual detail, typography, alignment, and smooth micro-animations.
- Previous experience building personal mobile apps or publishing apps to stores is highly valued.`
        }
      ]
    },
    {
      name: 'Maybank Berhad',
      email: 'hr_talent@maybank.com',
      password: 'CompanyPassword123!',
      firstName: 'Mohd',
      lastName: 'Faizal',
      bio: 'Maybank is Malaysia\'s largest financial services group and has a strong regional presence in Southeast Asia.',
      internships: [
        {
          title: 'Cybersecurity Operations Intern',
          location: 'Kuala Lumpur',
          type: 'on-site',
          duration: '6 Months',
          stipend: 'RM 1,200',
          description: `Maybank is Malaysia’s largest financial services group and a pioneer in digital banking. Protecting our customers’ assets and data is our top priority. As a Cybersecurity Operations Intern, you will join our Security Operations Center (SOC) team to monitor and protect Maybank's digital infrastructure from security threats.

Responsibilities:
- Monitor real-time threat alerts from SIEM (Security Information and Event Management) platforms and report anomalies.
- Conduct preliminary analysis and triage of security alerts (e.g., phishing attempts, malware outbreaks, unauthorized access).
- Assist the incident response team in gathering evidence, analyzing logs, and preparing threat mitigation reports.
- Run vulnerability scans on test networks and document outstanding system patches or misconfigurations.
- Support the cybersecurity education team in creating simulated phishing campaigns and security awareness training materials.

What We Offer:
- Firsthand exposure to enterprise security tools and security methodologies in a regulated banking environment.
- Mentorship from experienced security analyst professionals.
- Comprehensive training on threat analysis, security monitoring, and network forensics.`,
          requirements: `- Final-year student in Cybersecurity, Computer Networks, Information Security, Computer Science, or related fields.
- Good understanding of networking protocols (TCP/IP, DNS, HTTP, SSH).
- Knowledge of common security concepts, network vulnerabilities (OWASP Top 10), and basic security tools (Wireshark, Nmap, Metasploit).
- Familiarity with operating systems (Linux and Windows Server).
- Eagerness to research and stay up-to-date with the latest cybersecurity threat landscapes.`
        }
      ]
    },
    {
      name: 'Intel Malaysia',
      email: 'intel.jobs@intel.com',
      password: 'CompanyPassword123!',
      firstName: 'William',
      lastName: 'Tan',
      bio: 'Intel is a global leader in semiconductor design and manufacturing, with major assembly and test operations in Penang and Kulim.',
      internships: [
        {
          title: 'Embedded Systems Developer Intern',
          location: 'Bayan Lepas, Penang',
          type: 'on-site',
          duration: '6 Months',
          stipend: 'RM 1,600',
          description: `Intel is a global leader in semiconductor design and manufacturing. Our Malaysia assembly and test operations in Penang and Kulim are key hubs of global hardware production. As an Embedded Systems Developer Intern, you will work with our IoT and Hardware Test systems engineering team to develop firmware for custom validation boards.

Responsibilities:
- Develop, optimize, and debug low-level firmware for IoT and test controllers in C and C++.
- Write device drivers for hardware interfaces, including I2C, SPI, UART, and GPIO.
- Perform hardware-software integration testing using oscilloscopes, logic analyzers, and digital multimeters.
- Create and execute automated unit tests to validate firmware correctness and reliability.
- Collaborate with hardware design engineers to troubleshoot board bring-up issues and document firmware designs.

What We Offer:
- Experience working in a state-of-the-art silicon engineering and hardware manufacturing lab.
- Mentorship from veteran hardware and embedded software engineers.
- Exposure to industrial-grade debugging and validation processes.`,
          requirements: `- Pursuing a degree in Computer Engineering, Electrical/Electronic Engineering, Embedded Systems, or related field.
- Proficiency in C/C++ programming for embedded microcontrollers (such as ARM, ESP32, STM32, or Arduino).
- Solid understanding of microcontroller architectures, memory layout, and real-time operating systems (RTOS) concepts.
- Basic ability to read schematics and use laboratory testing equipment (multimeter, oscilloscope).
- Strong logical thinking and debugging skills.`
        }
      ]
    },
    {
      name: 'Maxis Berhad',
      email: 'careers@maxis.com.my',
      password: 'CompanyPassword123!',
      firstName: 'Emily',
      lastName: 'Wong',
      bio: 'Maxis is a leading converged solutions provider in Malaysia, providing mobile, fiber, and business ICT services.',
      internships: [
        {
          title: 'IoT Solutions & Network Intern',
          location: 'Kuala Lumpur',
          type: 'remote',
          duration: '6 Months',
          stipend: 'RM 1,400',
          description: `Maxis is Malaysia’s leading converged solutions provider. We are building the next generation of Smart City and industrial IoT applications powered by Maxis 5G. As an IoT Solutions & Network Intern, you will join the Enterprise Solutions team to prototype, configure, and test Smart City and industrial solutions.

Responsibilities:
- Configure, program, and deploy IoT sensor nodes and gateways (Raspberry Pi, ESP32, Arduino) to connect to Maxis platforms.
- Write integration scripts (primarily in Python) to parse and transmit sensor data over MQTT and HTTP protocols.
- Run testing suites to measure 5G network performance, latency, and throughput under various physical settings.
- Build web interfaces and dashboards to present real-time telemetry data to commercial clients.
- Assist in technical product testing and write comprehensive documentation for client handovers.

What We Offer:
- Hands-on experience with cutting-edge 5G networks and enterprise IoT systems.
- Creative freedom to prototype smart hardware solutions under senior guidance.
- Industry exposure to commercial B2B telecom solutions.`,
          requirements: `- Pursuing a degree in Telecommunications, Computer Networks, Electronic Engineering, Computer Science, or related field.
- Proficiency in Python and basic scripting languages.
- Familiarity with IoT communication protocols (MQTT, HTTP, CoAP) and basic networking (IPv4, routing, Wi-Fi, cellular).
- Experience with single-board computers (Raspberry Pi) and basic microcontroller boards.
- Enthusiastic about hardware hacking, physical prototyping, and system testing.`
        }
      ]
    }
  ];

  // 3. Register Mock Companies
  console.log('\n--- REGISTERING MOCK COMPANIES ---');
  const registeredCompanies = [];
  for (const company of mockCompanies) {
    console.log(`Registering company: ${company.name}...`);
    const { data, error } = await supabase.auth.signUp({
      email: company.email,
      password: company.password,
      options: {
        data: {
          first_name: company.firstName,
          last_name: company.lastName,
          role: 'company',
          company_name: company.name
        }
      }
    });

    if (error) {
      console.warn(`Error registering ${company.name}: ${error.message}. Attempting login to retrieve existing user ID...`);
      const { data: logData, error: logErr } = await supabase.auth.signInWithPassword({
        email: company.email,
        password: company.password
      });
      if (logErr) {
        console.error(`Failed to retrieve existing company user:`, logErr.message);
      } else {
        console.log(`Success! Retrieved existing company user ID: ${logData.user.id}`);
        registeredCompanies.push({
          ...company,
          id: logData.user.id
        });
        await supabase.auth.signOut();
      }
    } else {
      console.log(`Success! Registered company user: ${data.user.id}`);
      registeredCompanies.push({
        ...company,
        id: data.user.id
      });
    }
    await delay(1000); // 1s delay to avoid rate limit
  }

  // 4. Create and Authenticate a Temporary Supervisor
  console.log('\n--- CREATING TEMPORARY SUPERVISOR TO APPROVE COMPANIES ---');
  const supervisorEmail = `temp_admin_${Date.now()}@mock.utm.my`;
  const supervisorPassword = 'AdminPassword123!';
  const { data: adminAuth, error: adminErr } = await supabase.auth.signUp({
    email: supervisorEmail,
    password: supervisorPassword,
    options: {
      data: {
        first_name: 'UTM Portal',
        last_name: 'Administrator',
        role: 'supervisor',
        department: 'UTM Career Center'
      }
    }
  });

  if (adminErr) {
    console.error('Failed to create supervisor account:', adminErr.message);
    return;
  }
  const supervisorId = adminAuth.user.id;
  console.log(`Supervisor account created: ${supervisorEmail} (ID: ${supervisorId})`);
  await delay(1000);

  // Sign in as supervisor to get active supervisor session
  console.log('Signing in as supervisor...');
  const { data: adminSession, error: loginErr } = await supabase.auth.signInWithPassword({
    email: supervisorEmail,
    password: supervisorPassword
  });

  if (loginErr) {
    console.error('Failed to log in as supervisor:', loginErr.message);
    return;
  }
  console.log('Logged in as supervisor successfully!');

  // Approve the companies
  const companyIds = registeredCompanies.map(c => c.id);
  console.log(`Approving ${companyIds.length} companies...`);
  for (const cid of companyIds) {
    const { error: appErr } = await supabase
      .from('profiles')
      .update({
        is_approved: true
      })
      .eq('id', cid);
    
    if (appErr) {
      console.error(`Failed to approve company ID ${cid}:`, appErr.message);
    } else {
      console.log(`Approved company ID ${cid}`);
    }
  }

  // Also approve existing companies if any are pending (except Shell which is already approved)
  
  // Sign out supervisor
  await supabase.auth.signOut();
  console.log('Logged out supervisor.');
  await delay(1000);

  // 5. Post Internships
  console.log('\n--- POSTING INTERNSHIP LISTINGS ---');
  const postedInternships = [];
  for (const company of registeredCompanies) {
    console.log(`Logging in as ${company.name} (${company.email})...`);
    const { data: compSession, error: cLoginErr } = await supabase.auth.signInWithPassword({
      email: company.email,
      password: company.password
    });

    if (cLoginErr) {
      console.error(`Failed to login as ${company.name}:`, cLoginErr.message);
      continue;
    }

    // Save bio
    const { error: bioErr } = await supabase
      .from('profiles')
      .update({
        bio: company.bio
      })
      .eq('id', company.id);
    if (bioErr) console.error(`Failed to save bio for ${company.name}:`, bioErr.message);

    for (const job of company.internships) {
      console.log(`Posting internship: ${job.title}...`);
      const { data: internshipData, error: postErr } = await supabase
        .from('internships')
        .insert({
          supervisor_id: company.id,
          title: job.title,
          company: company.name,
          location: job.location,
          type: job.type,
          duration: job.duration,
          description: job.description,
          requirements: job.requirements,
          stipend: job.stipend
        })
        .select();

      if (postErr) {
        console.error(`Error posting ${job.title}:`, postErr.message);
      } else {
        console.log(`Internship posted successfully: ${internshipData[0].id}`);
        postedInternships.push(internshipData[0]);
      }
    }
    await supabase.auth.signOut();
    await delay(1000);
  }

  // 6. Register Mock Students
  console.log('\n--- REGISTERING MOCK STUDENTS ---');
  const registeredStudents = [];
  const skillsList = [
    'Python,JavaScript,React,Node.js,SQL',
    'Java,Spring Boot,MySQL,Git',
    'HTML,CSS,JavaScript,Vite,React',
    'C++,Embedded Systems,Linux,Rust',
    'Python,Pandas,NumPy,TensorFlow,SQL',
    'Cybersecurity,Wireshark,Linux,Python',
    'AWS,Docker,Terraform,Node.js'
  ];

  for (let idx = 0; idx < selectedStudents.length; idx++) {
    const student = selectedStudents[idx];
    const studentEmail = `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}_${idx}@mock.utm.my`.replace(/\s+/g, '');
    const studentPassword = 'StudentPassword123!';
    
    console.log(`Registering student: ${student.fullName} (${studentEmail})...`);
    const { data: sAuth, error: sAuthErr } = await supabase.auth.signUp({
      email: studentEmail,
      password: studentPassword,
      options: {
        data: {
          first_name: student.firstName,
          last_name: student.lastName,
          role: 'student',
          matric_number: student.matricNumber
        }
      }
    });

    if (sAuthErr) {
      console.warn(`Failed to register student ${student.fullName}: ${sAuthErr.message}. Attempting login to retrieve existing user ID...`);
      const { data: logData, error: logErr } = await supabase.auth.signInWithPassword({
        email: studentEmail,
        password: studentPassword
      });
      if (logErr) {
        console.error(`Failed to retrieve existing student:`, logErr.message);
      } else {
        console.log(`Success! Retrieved existing student user ID: ${logData.user.id}`);
        registeredStudents.push({
          ...student,
          id: logData.user.id,
          email: studentEmail,
          password: studentPassword
        });
        await supabase.auth.signOut();
      }
    } else {
      console.log(`Success! Registered student user: ${sAuth.user.id}`);
      registeredStudents.push({
        ...student,
        id: sAuth.user.id,
        email: studentEmail,
        password: studentPassword
      });
    }
    await delay(1000);
  }

  // 7. Update Student Bios & Apply to Internships
  console.log('\n--- CREATING APPLICATIONS ---');
  const createdApplications = [];
  
  for (let idx = 0; idx < registeredStudents.length; idx++) {
    const student = registeredStudents[idx];
    console.log(`Logging in as student: ${student.fullName}...`);
    const { data: sSession, error: sLoginErr } = await supabase.auth.signInWithPassword({
      email: student.email,
      password: student.password
    });

    if (sLoginErr) {
      console.error(`Failed to login as student ${student.fullName}:`, sLoginErr.message);
      continue;
    }

    // Update bio & skills
    const skills = skillsList[idx % skillsList.length];
    const bio = `Year 3 Computer Science student at UTM specializing in Software Engineering. Highly interested in internship opportunities to apply my skills in ${skills.split(',')[0]} and ${skills.split(',')[1]}.`;
    const resumeUrl = `https://eradgzlaigmwiumioyaq.supabase.co/storage/v1/object/public/resumes/${student.id}-resume.pdf`;
    
    const { error: sProfileErr } = await supabase
      .from('profiles')
      .update({
        bio,
        skills,
        resume_url: resumeUrl,
        resume_name: 'UTM_Standard_CV.pdf'
      })
      .eq('id', student.id);
    if (sProfileErr) console.error(`Failed to update profile for ${student.fullName}:`, sProfileErr.message);

    // Apply to 1-2 random internships
    const numApps = 1 + (idx % 2); // 1 or 2
    const shuffledJobs = [...postedInternships].sort(() => 0.5 - Math.random());
    const jobsToApply = shuffledJobs.slice(0, numApps);

    for (const job of jobsToApply) {
      console.log(`Applying to ${job.title} at ${job.company}...`);
      const { data: appData, error: appErr } = await supabase
        .from('applications')
        .insert({
          internship_id: job.id,
          student_id: student.id,
          cover_letter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${job.title} internship at ${job.company}. As a student at UTM, I have been building project experience in ${skills} and believe I would be a great fit for your team.\n\nThank you for your consideration.\n\nBest regards,\n${student.fullName}`,
          resume_url: resumeUrl
        })
        .select();

      if (appErr) {
        console.error(`Failed to apply to ${job.title}:`, appErr.message);
      } else {
        console.log(`Application submitted: ${appData[0].id}`);
        createdApplications.push(appData[0]);
      }
    }
    
    await supabase.auth.signOut();
    await delay(1000);
  }

  // 8. Update Application Statuses
  console.log('\n--- UPDATING APPLICATION STATUSES ---');
  // Log in as companies to approve/reject some applications
  for (const app of createdApplications) {
    // Find who owns the internship
    const internship = postedInternships.find(j => j.id === app.internship_id);
    if (!internship) continue;
    const company = registeredCompanies.find(c => c.name === internship.company);
    if (!company) continue;

    // Random status
    const rand = Math.random();
    let newStatus = 'pending';
    if (rand > 0.6) newStatus = 'approved';
    else if (rand > 0.8) newStatus = 'rejected';

    if (newStatus !== 'pending') {
      console.log(`Logging in as ${company.name} to update application ${app.id} to ${newStatus}...`);
      const { data: compSession, error: cLoginErr } = await supabase.auth.signInWithPassword({
        email: company.email,
        password: company.password
      });

      if (cLoginErr) {
        console.error(`Failed login for ${company.name}:`, cLoginErr.message);
        continue;
      }

      const { error: statusErr } = await supabase
        .from('applications')
        .update({
          status: newStatus
        })
        .eq('id', app.id);

      if (statusErr) {
        console.error(`Failed to update application status:`, statusErr.message);
      } else {
        console.log(`Updated status of application ${app.id} to ${newStatus}`);
      }

      await supabase.auth.signOut();
      await delay(1000);
    }
  }

  // 9. Create Forum Threads & Posts
  console.log('\n--- POPULATING PEER FORUM ---');
  const forumTopics = [
    {
      title: 'Tips for passing Technical Coding Interviews?',
      content: 'Hello everyone! I have a software engineering internship interview coming up. What topics in data structures and algorithms should I focus on? Should I do LeetCode or are there specific Malaysian company interview practices?',
      category: 'General'
    },
    {
      title: 'Petronas Internship stipend and work culture?',
      content: 'Hi! Has anyone interned at Petronas as a cloud infrastructure intern before? Can you share your experience regarding their stipend, work environment, and support for interns?',
      category: 'Reviews'
    },
    {
      title: 'Vercel Deployment error on Vite build',
      content: 'I am getting an out-of-memory error when deploying my React frontend to Vercel. Has anyone experienced this? Is there a Vite configuration or build option that can reduce chunk sizes?',
      category: 'Q&A'
    }
  ];

  for (let idx = 0; idx < forumTopics.length; idx++) {
    const topic = forumTopics[idx];
    const student = registeredStudents[idx % registeredStudents.length];
    
    console.log(`Logging in as ${student.fullName} to post forum thread...`);
    const { data: sSession, error: sLoginErr } = await supabase.auth.signInWithPassword({
      email: student.email,
      password: student.password
    });

    if (sLoginErr) continue;

    console.log(`Creating thread: "${topic.title}"...`);
    const { data: threadData, error: threadErr } = await supabase
      .from('forum_threads')
      .insert({
        author_id: student.id,
        title: topic.title,
        content: topic.content,
        category: topic.category
      })
      .select();

    if (threadErr) {
      console.error(`Failed to create thread:`, threadErr.message);
    } else {
      const threadId = threadData[0].id;
      console.log(`Thread created: ${threadId}`);

      // Add a reply from another student or company
      const replier = registeredStudents[(idx + 1) % registeredStudents.length];
      await supabase.auth.signOut();
      await delay(500);

      console.log(`Logging in as replier ${replier.fullName}...`);
      const { error: rLoginErr } = await supabase.auth.signInWithPassword({
        email: replier.email,
        password: replier.password
      });

      if (!rLoginErr) {
        console.log(`Replying to thread...`);
        const { error: postErr } = await supabase
          .from('forum_posts')
          .insert({
            thread_id: threadId,
            author_id: replier.id,
            content: `Hey ${student.firstName}! I had a similar issue last semester. My advice is to focus on sorting algorithms and basic tree traversals. Most local interviewers here check basic problem-solving skills rather than extreme competitive programming questions. Good luck!`
          });

        if (postErr) console.error(`Failed to reply:`, postErr.message);
        else console.log(`Reply posted successfully.`);
      }
    }
    
    await supabase.auth.signOut();
    await delay(1000);
  }

  // 10. Write Summary Log File
  console.log('\n--- DATABASE POPULATION COMPLETED ---');
  const summaryContent = {
    tempSupervisor: {
      email: supervisorEmail,
      password: supervisorPassword
    },
    companies: registeredCompanies.map(c => ({
      name: c.name,
      email: c.email,
      password: c.password
    })),
    students: registeredStudents.map(s => ({
      name: s.fullName,
      matric: s.matricNumber,
      email: s.email,
      password: s.password
    }))
  };

  const summaryPath = path.resolve('../populator_accounts.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summaryContent, null, 2));
  console.log('Credentials and account logs written to:', summaryPath);
}

run().catch(err => {
  console.error('Populator Script Failed:', err);
});

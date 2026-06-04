import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ENGINEERING_SKILLS = [
  // Software / Computing
  "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Java", "Go", "Rust", "Ruby", "Swift", "Kotlin", "PHP", "HTML5", "CSS3",
  "React", "Angular", "Vue.js", "Svelte", "Node.js", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET Core",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra", "SQLite", "GraphQL", "REST APIs", "gRPC", "Docker", "Kubernetes",
  "Terraform", "Ansible", "Jenkins", "GitLab CI/CD", "GitHub Actions", "AWS", "Azure", "Google Cloud Platform (GCP)",
  "Linux", "Bash Scripting", "Git", "GitHub", "Machine Learning", "Deep Learning", "Natural Language Processing (NLP)",
  "Computer Vision", "Data Analysis", "Data Science", "Pandas", "NumPy", "TensorFlow", "PyTorch", "Scikit-Learn", "MATLAB",
  "R Language", "Power BI", "Tableau", "Apache Spark", "Hadoop", "Apache Kafka", "Cybersecurity", "Penetration Testing",
  "Wireshark", "Metasploit", "Reverse Engineering", "Embedded Systems", "Robotics", "ROS (Robot Operating System)", "FPGA",
  "VHDL", "Verilog", "Embedded C", "Embedded C++", "RTOS (Real-Time OS)", "Microcontrollers", "Arduino", "Raspberry Pi",
  "ESP32", "STM32", "ARM Architecture", "Schematic Capture", "PCB Layout", "Altium Designer", "KiCad", "SPICE Simulation",
  "LTspice", "LabVIEW", "PLC Programming", "SCADA", "Control Systems", "Control Theory", "Mechatronics", "Automotive Design",
  "AutoCAD", "SolidWorks", "Autodesk Inventor", "CATIA", "PTC Creo", "Siemens NX", "Autodesk Fusion 360", "Finite Element Analysis (FEA)",
  "ANSYS", "Abaqus", "Computational Fluid Dynamics (CFD)", "Thermodynamics", "Heat Transfer", "Fluid Mechanics", "Aerodynamics",
  "HVAC Design", "Refrigeration Systems", "Pneumatics", "Hydraulics", "Gas Turbines", "CNC Machining", "3D Printing",
  "Additive Manufacturing", "Injection Molding", "Sheet Metal Design", "GD&T", "Mechanical Vibrations", "Stress Analysis",
  "Structural Analysis", "Concrete Design", "Steel Design", "Foundation Engineering", "Geotechnical Engineering", "ArcGIS",
  "QGIS", "Revit", "BIM (Building Information Modeling)", "SAP2000", "ETABS", "STAAD.Pro", "Bridge Engineering", "Highway Engineering",
  "Wastewater Treatment", "Hydrology", "Seismic Design", "Chemical Process Design", "Aspen Plus", "Aspen HYSYS", "Reactor Design",
  "Mass Transfer", "Process Flow Diagrams (PFD)", "Piping & Instrumentation Diagram (P&ID)", "HAZOP Study", "Process Safety Management",
  "Polymer Science", "Corrosion Engineering", "Cathodic Protection", "Biomaterials", "Medical Imaging", "Instrumentation",
  "Metrology", "Six Sigma", "Lean Manufacturing", "Quality Assurance", "Agile Methodologies", "Scrum Master", "Project Scheduling",
  "Primavera P6", "MS Project", "Construction Cost Estimation", "Quantity Surveying", "Land Surveying", "Automotive Infotainment",
  "CAN Bus", "LIN Bus", "Modbus", "OPC UA", "Smart Grids", "Battery Management Systems (BMS)", "Electric Vehicle (EV) Systems",
  "Keras", "OpenCV", "NLP tokenization", "Scrapy", "Selenium", "Jupyter Notebook", "D3.js", "Hadoop HDFS", "Apache Hive",
  "Apache Pig", "HBase", "Elasticsearch", "Logstash", "Kibana", "GraphQL Apollo", "Prisma ORM", "Sequelize", "Mongoose",
  "Tailwind CSS", "Bootstrap", "Webpack", "Vite", "Babel", "npm", "yarn", "Docker Compose", "Helm Charts", "Prometheus",
  "Grafana", "AWS EC2", "AWS S3", "AWS Lambda", "AWS RDS", "AWS DynamoDB", "Azure DevOps", "Heroku", "Netlify", "Vercel",
  "Cryptography", "OAuth 2.0", "JWT (JSON Web Tokens)", "SAML", "Active Directory", "Firewall Configuration", "Intrusion Detection Systems (IDS)",
  "Network Security", "Information Security", "Ethical Hacking", "OWASP Top 10", "SQL Injection Prevention", "Cross-Site Scripting (XSS)",
  "Solidity", "Smart Contract Auditing", "Ethereum", "Hyperledger Fabric", "Web3.js", "Ethers.js", "Android SDK", "iOS SDK",
  "SwiftUI", "CocoaPods", "Gradle", "Maven", "Unity 3D", "Unreal Engine 5", "Game Physics", "3D Modeling", "Blender", "Figma Design",
  "Wireframing", "Prototyping", "User Research", "A/B Testing", "Google Analytics", "SQL Server Integration Services (SSIS)",
  "SSAS", "SSRS", "PL/SQL", "T-SQL", "MapReduce", "TensorBoard", "PyTorch Lightning", "Hugging Face", "BERT", "GPT Architecture",
  "Reinforcement Learning", "Supervised Learning", "Unsupervised Learning", "Dimensionality Reduction", "Principal Component Analysis (PCA)",
  "Data Cleaning", "Data Wrangling", "ETL Pipelines",
  // Electrical / Electronics / Signals
  "Signal Processing", "Fourier Transform", "Wavelet Transform", "Analog-to-Digital Converters (ADC)", "Digital-to-Analog Converters (DAC)",
  "Operational Amplifiers (Op-Amps)", "Filter Design", "Power Supply Design", "Switch-Mode Power Supplies (SMPS)", "LDO Regulators",
  "Voltage References", "RF Transceivers", "Impedance Matching", "Antenna Arrays", "Microwave Engineering", "Electromagnetic Fields",
  "Maxwell's Equations", "PCB Routing", "High-Speed PCB Design", "Signal Integrity", "Power Integrity", "Altium CircuitStudio",
  "Eagle CadSoft", "KiCad EDA", "OrCAD", "PSpice", "Multisim", "Proteus", "Verilog-A", "SystemVerilog", "Universal Verification Methodology (UVM)",
  "Logic Synthesis", "Static Timing Analysis", "ASIC Design", "VLSI Layout", "CMOS Design", "FPGA Design Flow", "Xilinx Vivado",
  "Intel Quartus Prime", "ModelSim", "I2C Communication", "SPI Communication", "UART", "USB Protocols", "Ethernet Protocols",
  "Controller Area Network (CAN)", "Modbus RTU", "Zigbee Protocols", "BLE Stack", "Wi-Fi 6", "NFC Technology", "RFID Systems",
  "Embedded Linux", "Yocto Project", "Buildroot", "FreeRTOS", "Zephyr RTOS", "VxWorks", "MicroPython", "ARM Cortex-M", "ARM Cortex-A",
  "PIC Microcontrollers", "AVR Microcontrollers", "MSP430", "STM8", "Intel 8051", "Assembly Language", "Hardware Debugging",
  "JTAG Debugging", "Logic Analyzer", "Digital Multimeter", "Soldering", "BGA Rework", "PCB Assembly", "Oscilloscope Measurement",
  "Spectrum Analysis", "RF Calibration", "Power Grid Synchronization", "High Voltage DC (HVDC)", "Substation Automation",
  "Transformer Design", "Electric Machinery", "Synchronous Motors", "Induction Motors", "Brushless DC (BLDC) Motors",
  "Stepper Motor Control", "Inverter Control", "Variable Frequency Drives (VFD)", "PID Tuning", "State-Space Representation",
  "Transfer Functions", "Bode Plots", "Nyquist Stability Criterion", "Linear Quadratic Regulator (LQR)", "Kalman Filtering",
  "Extended Kalman Filter (EKF)", "SLAM (Simultaneous Localization and Mapping)", "LIDAR Integration", "Sonar Systems",
  "IMU Integration", "GPS/GNSS Tracking", "Actuator Calibration", "Solenoid Valves", "Servo Motors",
  // Mechanical / Aerodynamics / Thermal
  "Computational Fluid Dynamics", "Turbulence Modeling", "Multiphase Flow Simulation", "ANSYS Fluent", "ANSYS CFX",
  "OpenFOAM", "Star-CCM+", "Finite Element Analysis", "ANSYS Mechanical", "Abaqus/CAE", "COMSOL Multiphysics",
  "MSC Nastran", "LS-DYNA", "HyperMesh", "Autodesk Nastran", "SolidWorks Simulation", "Structural FEA", "Thermal FEA",
  "Dynamic FEA", "Nonlinear FEA", "Modal Analysis", "Fatigue Life Prediction", "Fracture Mechanics", "Creep Analysis",
  "Stress Intensity Factors", "SolidWorks CAD", "AutoCAD Drafting", "Autodesk Inventor", "PTC Creo Parametric",
  "CATIA V5", "Siemens NX CAD", "Autodesk Fusion 360", "GD&T Application", "Tolerance Stack-up Analysis", "Assembly Modeling",
  "Surfacing in CAD", "Sheet Metal Fabrication Design", "Weldments Design", "Mold Design", "CNC Programming", "G-Code",
  "CAM (Computer Aided Manufacturing)", "Mastercam", "SolidCAM", "Laser Cutting Design", "Waterjet Cutting Design",
  "Injection Molding Simulation", "3D Printing FDM", "3D Printing SLA", "3D Printing SLS", "Metal 3D Printing (DMLS)",
  "Mechatronics System Design", "Robotic Kinematics & Dynamics", "End Effector Design", "Pneumatic Circuit Design",
  "Hydraulic Circuit Design", "Compressible Flow", "Incompressible Flow", "Boundary Layer Theory", "Gas Turbine Design",
  "Internal Combustion Engine Cycles", "Automotive Drivetrain", "Automotive Suspension Design", "Steering Geometry",
  "Braking System Design", "Vehicle Aerodynamics", "Wind Tunnel Testing", "Orbital Mechanics", "Satellite Propulsion",
  "Rocket Engine Design", "Aerospace Materials Selection", "Aircraft Design", "Flight Control Laws", "Avionics Systems",
  "Thermodynamic Cycles", "Rankine Cycle", "Brayton Cycle", "HVAC Load Calculation", "Duct Design", "Chiller Plant Design",
  "Heat Exchanger Optimization", "Heat Pipe Technology", "Boiler Maintenance", "Piping Stress Analysis", "Caesar II",
  "Vibration Dampening", "Acoustic Insulation", "Noise, Vibration, and Harshness (NVH) Testing",
  // Civil / Structural / Construction
  "Concrete Structural Design", "Steel Structural Design", "Timber Structural Design", "Composite Structural Design",
  "Reinforced Concrete (RC) Design", "Prestressed Concrete", "Structural Steel Detailing", "Foundation Settlement Analysis",
  "Retaining Wall Design", "Deep Foundations (Piles)", "Shallow Foundations", "Slope Stability Analysis", "Soil Mechanics",
  "Rock Engineering", "Geotechnical Site Investigation", "ArcGIS Desktop", "QGIS Desktop", "Spatial Data Analysis",
  "GIS Database Management", "AutoCAD Civil 3D", "Autodesk Revit Structure", "Building Information Modeling (BIM)",
  "Revit Families Creation", "Navisworks Coordination", "Tekla Structures", "SAP2000 Structural Analysis",
  "ETABS Building Design", "STAAD.Pro Analysis", "Robot Structural Analysis", "Finite Element Bridge Modeling",
  "Pavement Performance Modeling", "Asphalt Technology", "Flexible Pavements", "Rigid Pavements", "Traffic Flow Theory",
  "Traffic Signal Timing", "Synchro Software", "VISSIM Simulation", "Geometric Highway Design", "Urban Planning GIS",
  "Water Distribution Networks", "EPANET", "Hydrologic Modeling", "HEC-HMS", "HEC-RAS River Analysis",
  "Stormwater Management", "Sustainable Drainage Systems (SuDS)", "Flood Inundation Mapping", "Water Resource Planning",
  "Wastewater Process Design", "Activated Sludge Systems", "Anaerobic Digesters", "Membrane Bioreactors (MBR)",
  "Reverse Osmosis Desalination", "Coagulation-Flocculation", "Environmental Impact Assessment (EIA)",
  "Air Dispersion Modeling", "AERMOD", "Industrial Waste Treatment", "Hazardous Waste Management", "Landfill Design",
  "Soil Remediation Techniques", "Coastal Protection Structures", "Wave Run-up Analysis", "Seismic Load Calculation",
  "Response Spectrum Analysis", "Time History Analysis", "Structural Dynamics", "Base Isolation Systems",
  "Tuned Mass Dampers", "Construction Planning", "Primavera P6 Scheduling", "Microsoft Project Scheduling",
  "Construction Cost Estimating", "Quantity Surveying", "BIM 4D/5D Simulation", "Building Services (MEP)",
  "Acoustic Room Design", "Fire Protection Sprinkler Systems", "LEED Green Building Standards", "Green Star Certification",
  "Passive House Design", "Structural Glass Design",
  // Chemical / Process / Petroleum
  "Chemical Process Simulation", "Aspen Plus Simulation", "Aspen HYSYS Process Design", "CHEMCAD", "Reactor Design & Optimization",
  "Chemical Kinetics Modeling", "Catalytic Reactor Design", "Bioreactor Scaling", "Fermentation Engineering",
  "Industrial Distillation", "Absorption Column Design", "Liquid-Liquid Extraction", "Crystallization Processes",
  "Fluidization Engineering", "Pneumatic Conveying Design", "Process Control Diagrams", "Piping and Instrumentation Diagrams (P&ID)",
  "Process Flow Diagrams (PFD)", "HAZOP Leadership", "Layer of Protection Analysis (LOPA)", "Process Safety Management (PSM)",
  "Refining Technology", "Petrochemical Processes", "Polymer Polymerization", "Bioplastics Development",
  "Nanoparticle Synthesis", "Nanomaterial Characterization", "Catalyst Characterization", "Corrosion Control",
  "Cathodic Protection Design", "Anodic Protection", "Water Desalination Plants", "Desalination Evaporators",
  "Membrane Distillation", "Industrial Crystallizer Design", "Gas Chromatography (GC) Analysis", "Mass Spectrometry (MS) Analysis",
  "High-Performance Liquid Chromatography (HPLC)", "Fourier Transform Infrared (FTIR) Spectroscopy", "Distributed Control Systems (DCS)",
  "Safety Instrumented Systems (SIS)", "Industrial Safety Management", "Hazardous Material Handling",
  "Electrostatic Precipitators", "Scrubber Systems", "Air Pollution Control", "Cleanroom Ventilation",
  "Flow Assurance", "Drilling Fluid Engineering", "Reservoir Engineering Simulation", "Eclipse Simulator",
  "Enhanced Oil Recovery (EOR)", "Hydraulic Fracturing Simulation", "Natural Gas Dehydration", "Pipeline Hydraulics Simulation",
  "CO2 Capture and Storage (CCS)", "Hydrogen Production Technology", "Steam Methane Reforming", "Water-Gas Shift Reaction",
  "Biomedical Instrumentation", "BioMEMS", "Cardiovascular Fluid Mechanics", "Prosthetic Design", "Biomaterial Testing",
  "Polymer Extrusion", "Metal Casting", "Forging Processes", "Metallurgical Failure Analysis", "Scanning Electron Microscopy (SEM)",
  "X-ray Diffraction (XRD)", "Tensile Testing", "Hardness Testing", "Charpy Impact Testing", "Non-Destructive Testing (NDT)",
  "Ultrasonic Testing", "Radiographic Testing", "Magnetic Particle Testing", "Dye Penetrant Testing", "Statistical Process Control (SPC)"
];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) {
          setRole(data.role || 'student');
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setBio(data.bio || '');
          setMatricNumber(data.matric_number || '');
          setDepartment(data.department || '');
          setCompanyName(data.company_name || '');
          setAvatarUrl(data.avatar_url || '');
          setResumeUrl(data.resume_url || '');
          setResumeName(data.resume_name || '');
          setSkills(data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : []);
        } else {
          // Fallback to Auth SignUp metadata so fields are populated
          const meta = user.user_metadata || {};
          setRole(meta.role || 'student');
          setFirstName(meta.first_name || '');
          setLastName(meta.last_name || '');
          setMatricNumber(meta.matric_number || '');
          setCompanyName(meta.company_name || '');
          setDepartment(meta.department || '');
        }
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Check if the profile already exists in DB
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    let query;
    if (existing) {
      // Safe update: does not modify or reset the "is_approved" column
      query = supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          bio: bio,
          matric_number: role === 'student' ? matricNumber : '',
          department: role === 'supervisor' ? department : '',
          company_name: role === 'company' ? companyName : '',
          avatar_url: avatarUrl,
          resume_url: role === 'student' ? resumeUrl : '',
          resume_name: role === 'student' ? resumeName : '',
          skills: skills.join(','),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    } else {
      // Safe insert: establishes company approval state correctly
      query = supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          bio: bio,
          role: role,
          matric_number: role === 'student' ? matricNumber : '',
          department: role === 'supervisor' ? department : '',
          company_name: role === 'company' ? companyName : '',
          avatar_url: avatarUrl,
          resume_url: role === 'student' ? resumeUrl : '',
          resume_name: role === 'student' ? resumeName : '',
          skills: skills.join(','),
          is_approved: role === 'company' ? false : true,
          updated_at: new Date().toISOString()
        });
    }

    const { error } = await query;

    if (error) {
      alert(error.message);
    } else {
      alert('Profile updated successfully!');
      if (role === 'company') {
        navigate('/company/dashboard');
      } else if (role === 'supervisor') {
        navigate('/supervisor/dashboard');
      } else {
        navigate('/profile');
      }
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      alert('Profile picture uploaded successfully!');
    } catch (err) {
      alert(err.message || 'Error uploading profile picture. Make sure the avatars bucket exists and is set to public.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingResume(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      setResumeUrl(publicUrl);
      setResumeName(file.name);
      alert('Resume uploaded successfully!');
    } catch (err) {
      alert(err.message || 'Error uploading file.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (skillInput.trim() && !skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter">
        <header className="mb-gutter md:mb-12">
          <h1 className="font-h1 text-h1 text-primary mb-2">Profile Setup</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Complete your profile to unlock all portal features.</p>
        </header>
        {!bio && (
          <div className="bg-primary/5 border border-primary/20 text-primary p-4 rounded-lg flex items-start gap-3 mb-6 font-medium">
            <span className="material-symbols-outlined text-[20px] text-primary">info</span>
            <span>Welcome to VIP Portal! Please complete your profile details (avatar/logo, bio, skills) to activate your account and access dashboard features.</span>
          </div>
        )}
        <form className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start" onSubmit={handleSave}>
          {/* Left Column: Primary Details */}
          <div className="lg:col-span-8 flex flex-col gap-gutter">
            {/* Personal Information Card */}
            <section className="bg-surface-container-lowest border border-outline-variant p-gutter border-l-[4px] border-l-secondary-container">
              <h2 className="font-h3 text-h3 text-on-surface mb-base flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                {role === 'company' ? 'Company Partner Information' : 'Personal Information'}
              </h2>
              
              {/* Profile Avatar Upload */}
              <div className="flex items-center gap-4 my-6 p-4 border border-outline-variant rounded bg-surface">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-outline bg-primary-container text-on-primary flex items-center justify-center font-bold text-xl shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : initials}
                </div>
                <div>
                  <label className="bg-primary text-on-primary px-4 py-2 rounded text-label-md font-semibold cursor-pointer hover:opacity-90 transition-opacity">
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                    {uploadingAvatar ? 'Uploading...' : role === 'company' ? 'Upload Company Logo' : 'Upload Profile Picture'}
                  </label>
                  <p className="text-xs text-on-surface-variant mt-1.5">JPG, PNG up to 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-base mt-4">
                {role === 'company' ? (
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="company_name">Company / Organization Name</label>
                    <input className="font-body-md text-body-md border border-outline-variant bg-surface rounded-DEFAULT px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none" id="company_name" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="first_name">First Name</label>
                      <input className="font-body-md text-body-md border border-outline-variant bg-surface rounded-DEFAULT px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none" id="first_name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="last_name">Last Name</label>
                      <input className="font-body-md text-body-md border border-outline-variant bg-surface rounded-DEFAULT px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none" id="last_name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </>
                )}

                {role === 'student' && (
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="matric_number">Matriculation Number</label>
                    <input className="font-body-md text-body-md border border-outline-variant bg-surface rounded-DEFAULT px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none" id="matric_number" type="text" value={matricNumber} onChange={(e) => setMatricNumber(e.target.value)} required />
                  </div>
                )}
                {role === 'supervisor' && (
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="department">Department / Faculty</label>
                    <input className="font-body-md text-body-md border border-outline-variant bg-surface rounded-DEFAULT px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none" id="department" type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                  </div>
                )}
                <div className="flex flex-col gap-1 md:col-span-2 mt-2">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="bio">Professional Bio / Company Description</label>
                  <textarea className="font-body-md text-body-md border border-outline-variant bg-surface rounded-DEFAULT px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none" id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Introduce yourself or your organization..." />
                </div>
              </div>
            </section>

            {/* Skills Card (For students only) */}
            {role === 'student' && (
              <section className="bg-surface-container-lowest border border-outline-variant p-gutter border-l-[4px] border-l-secondary-container">
                <h2 className="font-h3 text-h3 text-on-surface mb-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">code</span>
                  Technical Skills
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Add skills relevant to your field of study to help match you with suitable internships.</p>
                <div className="flex flex-col gap-2">
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        list="engineering-skills"
                        className="w-full font-body-md text-body-md border border-outline-variant bg-surface rounded-DEFAULT pl-10 pr-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
                        id="skill_search" 
                        placeholder="Type and press Enter to add skills..." 
                        type="text" 
                        value={skillInput} 
                        onChange={(e) => setSkillInput(e.target.value)} 
                        onKeyDown={handleAddSkill} 
                      />
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline">search</span>
                      <datalist id="engineering-skills">
                        {ENGINEERING_SKILLS.map((skill, index) => (
                          <option key={index} value={skill} />
                        ))}
                      </datalist>
                    </div>
                    <button type="button" onClick={handleAddSkill} className="bg-primary text-on-primary px-4 py-2 rounded font-label-md text-label-md hover:opacity-90">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill, index) => (
                      <div key={index} className="inline-flex items-center gap-1 bg-surface-container-high border border-outline-variant rounded-full px-3 py-1">
                        <span className="font-label-md text-label-md text-on-surface">{skill}</span>
                        <button className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center" type="button" onClick={() => handleRemoveSkill(skill)}>
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Actions & CV (Students only) */}
          <div className="lg:col-span-4 flex flex-col gap-gutter lg:sticky lg:top-gutter">
            {role === 'student' && (
              <section className="bg-surface-container-lowest border border-outline-variant p-gutter border-l-[4px] border-l-secondary-container">
                <h2 className="font-h3 text-h3 text-on-surface mb-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">upload_file</span>
                  Resume / CV
                </h2>
                <label className="mt-4 border-2 border-dashed border-outline-variant bg-surface-container-low p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-high hover:border-primary transition-colors group rounded-lg">
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} disabled={uploadingResume} />
                  <span className="material-symbols-outlined text-4xl text-outline mb-2 group-hover:text-primary transition-colors">cloud_upload</span>
                  <p className="font-label-md text-label-md text-on-surface mb-1">
                    {uploadingResume ? 'Uploading...' : 'Click to browse files'}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">PDF files only (Max 5MB)</p>
                </label>
                {resumeUrl && (
                  <div className="mt-4 flex items-center justify-between p-3 border border-outline-variant bg-surface">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="material-symbols-outlined text-error" data-weight="fill">picture_as_pdf</span>
                      <div className="flex flex-col truncate">
                        <span className="font-label-sm text-label-sm text-on-surface truncate">{resumeName || 'Uploaded Resume.pdf'}</span>
                      </div>
                    </div>
                    <button className="text-on-surface-variant hover:text-error transition-colors p-1" title="Remove file" type="button" onClick={() => { setResumeUrl(''); setResumeName(''); }}>
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-4">
              <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 px-4 hover:opacity-95 transition-opacity flex justify-center items-center gap-2 rounded-lg cursor-pointer" type="submit">
                Save Profile
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <button 
                onClick={() => navigate(role === 'company' ? '/company/dashboard' : role === 'supervisor' ? '/supervisor/dashboard' : '/dashboard')}
                className="w-full bg-transparent border border-outline-variant text-on-surface font-label-md text-label-md py-3 px-4 hover:bg-surface-container-low transition-colors rounded-lg cursor-pointer" 
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

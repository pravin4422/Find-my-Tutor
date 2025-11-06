import React, { useState, useEffect } from 'react';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.about-section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: '🔍',
      title: 'Smart Tutor Discovery',
      description: 'Find the perfect tutor based on subject, experience, ratings, and location preferences'
    },
    {
      icon: '⭐',
      title: 'Rating & Review System',
      description: 'Transparent feedback system ensuring quality and credibility'
    },
    {
      icon: '🌐',
      title: 'Online & Offline Modes',
      description: 'Choose between virtual sessions or in-person teaching based on your needs'
    },
    {
      icon: '☁️',
      title: 'Cloud-Powered',
      description: 'Built on AWS infrastructure for scalability, speed, and reliability'
    }
  ];

  const stats = [
    { number: '1+', label: 'Verified Tutors' },
    { number: '2+', label: 'Active Students' },
    { number: '6+', label: 'Subjects Covered' },
    { number: '24/7', label: 'Platform Access' }
  ];

  const timeline = [
    {
      year: '2025',
      title: 'Project Inception',
      description: 'Vision to revolutionize tutor-student connections'
    },
    {
      year: '2025',
      title: 'Cloud Architecture',
      description: 'Built scalable platform using AWS services'
    }
  ];

  const teamMembers = [
    { name: 'Pravin R', role: 'Full Stack Developer', initials: 'PR' },
    { name: 'Siva Shunmugam B', role: 'Backend Developer', initials: 'SS' },
    { name: 'Karthikeyan S', role: 'Cloud Architect', initials: 'KS' }
  ];

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      {/* Hero Section */}
<div className="min-h-[45vh] bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center relative overflow-hidden text-white text-center">
  {/* Subtle dotted background */}
  <div className="absolute inset-0 opacity-5">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
      }}
    ></div>
  </div>

  {/* Main content */}
  <div className="relative z-10 max-w-2xl px-5">
    <h1 className="text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
      About Find My Tutor
    </h1>
    <div className="text-base italic opacity-80">
      <span>"Empowering Education Through Technology"</span>
    </div>
  </div>

  {/* Floating Elements */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-1/4 left-1/4 text-5xl opacity-70 animate-bounce"></div>
    <div className="absolute top-1/3 right-1/4 text-5xl opacity-70 animate-pulse"></div>
    <div className="absolute bottom-1/3 left-1/3 text-5xl opacity-70 animate-bounce delay-100"></div>
    <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-70 animate-pulse delay-200"></div>
  </div>
</div>


      {/* Navigation */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md z-50 border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-5 flex justify-center gap-4 flex-wrap">
          <a href="#overview" className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg font-medium">
            Overview
          </a>
          <a href="#features" className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg font-medium">
            Features
          </a>
          <a href="#team" className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg font-medium">
            Team
          </a>
          <a href="#mission" className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg font-medium">
            Mission
          </a>
          <a href="#technology" className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg font-medium">
            Technology
          </a>
          <a href="#contact" className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg font-medium">
            Contact
          </a>
        </div>
      </nav>

      {/* Overview Section */}
      <section 
        id="overview" 
        className={`about-section py-20 transition-all duration-700 ${isVisible.overview ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
            Platform Overview
          </h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-lg">
              <p className="text-xl font-semibold text-gray-700 mb-6 leading-relaxed">
                Find My Tutor is a revolutionary cloud-based platform that bridges 
                the gap between students seeking knowledge and experienced tutors ready to share 
                their expertise.
              </p>
              <p className="text-gray-600 leading-relaxed">
                In an era where quality education should be accessible to everyone, we've created 
                a comprehensive ecosystem that leverages cutting-edge technology to make learning 
                personalized, efficient, and transparent. Our platform uses AI-driven recommendations, 
                secure authentication, and real-time updates to ensure the best learning experience.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl text-center shadow-xl hover:-translate-y-2 transition-transform duration-300">
                  <div className="text-4xl font-extrabold text-purple-600 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        className={`about-section py-20 bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-700 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-10 rounded-3xl text-center shadow-xl hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="text-5xl mb-4 filter drop-shadow-lg">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section 
        id="team" 
        className={`about-section py-20 transition-all duration-700 ${isVisible.team ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
            Meet the Team
          </h2>
          <p className="text-center text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A passionate team of developers and innovatorss committed to transforming 
            the education landscape through technology.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl text-center shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg">
                  {member.initials}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  <span className="bg-gradient-to-r from-purple-600 to-purple-900 text-white px-4 py-1 rounded-full text-xs font-semibold">Developer</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section 
        id="mission" 
        className={`about-section py-20 bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-700 ${isVisible.mission ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="relative bg-white p-12 rounded-3xl shadow-xl">
              <div className="absolute -top-4 left-8 text-9xl text-purple-600 opacity-20 font-serif">"</div>
              <blockquote className="relative z-10 text-2xl leading-relaxed italic text-gray-700">
                To democratize access to quality education by creating a transparent, 
                efficient, and technology-driven platform that connects learners with 
                the right mentors, anywhere in the world.
              </blockquote>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex gap-6">
                <div className="text-5xl flex-shrink-0"></div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Quality Education for All</h4>
                  <p className="text-gray-600 leading-relaxed">Making expert tutoring accessible regardless of location or background</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-5xl flex-shrink-0"></div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Building Trust</h4>
                  <p className="text-gray-600 leading-relaxed">Transparent ratings and verified profiles ensure credibility and quality</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-5xl flex-shrink-0"></div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Innovation in Learning</h4>
                  <p className="text-gray-600 leading-relaxed">Leveraging AI and cloud technology for personalized education experiences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section 
        id="technology" 
        className={`about-section py-20 transition-all duration-700 ${isVisible.technology ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
            Technology Stack
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
<div className="text-lg">
  <p className="text-xl font-semibold text-gray-700 mb-8 leading-relaxed">
    <strong>Built on AWS Cloud Infrastructure</strong>
  </p>
  <div className="space-y-6">
    <div className="flex gap-4 items-start">
      <span className="text-3xl flex-shrink-0">☁️</span>
      <div className="text-gray-700">
        <strong>AWS EC2:</strong> Powers our backend APIs and authentication services
      </div>
    </div>

    <div className="flex gap-4 items-start">
      <span className="text-3xl flex-shrink-0">📦</span>
      <div className="text-gray-700">
        <strong>Amazon S3:</strong> Secure file storage for profiles and documents
      </div>
    </div>

    {/* Newly added AWS services */}
    <div className="flex gap-4 items-start">
      <span className="text-3xl flex-shrink-0">📧</span>
      <div className="text-gray-700">
        <strong>Amazon SES:</strong> Full Access for secure and scalable email delivery
      </div>
    </div>

    <div className="flex gap-4 items-start">
      <span className="text-3xl flex-shrink-0">⚙️</span>
      <div className="text-gray-700">
        <strong>AWS Lambda:</strong> Full Access for serverless function execution
      </div>
    </div>

    <div className="flex gap-4 items-start">
      <span className="text-3xl flex-shrink-0">🚀</span>
      <div className="text-gray-700">
        <strong>Amazon API Gateway:</strong> Full Access for secure and scalable API management
      </div>
    </div>

    <div className="flex gap-4 items-start">
      <span className="text-3xl flex-shrink-0"></span>
      <div className="text-gray-700">
        <strong>Amazon CloudWatch:</strong> Logs and monitoring for application performance
      </div>
    </div>
  </div>
</div>

            <div className="bg-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Project Timeline</h3>
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6 mb-8 last:mb-0">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-900 text-white px-4 py-2 rounded-full font-bold text-sm flex-shrink-0 text-center min-w-20 h-fit">
                    {item.year}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        className={`about-section py-20 bg-gradient-to-br from-purple-600 to-purple-900 text-white transition-all duration-700 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 text-white">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-bold mb-4">Connect with Us</h3>
              <p className="mb-8 opacity-90 leading-relaxed text-lg">
                Have questions about the platform? Want to join our team? 
                We'd love to hear from you!
              </p>
              <div className="space-y-4">
                <a href="mailto:rpravin4422@gmail.com" className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 hover:translate-x-2 backdrop-blur-md">
                  <div className="text-3xl"></div>
                  <div>
                    <span className="block text-sm opacity-80">Email</span>
                    <span className="font-semibold">findmytutor@gmail.com</span>
                  </div>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4">Join the Platform</h3>
              <p className="mb-8 opacity-90 leading-relaxed text-lg">
                Whether you're a student seeking knowledge or a tutor ready to share 
                your expertise, Kurukulam welcomes you to our growing community.
              </p>
              <div className="flex flex-col gap-4">
                <button className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-lg">
                  Find a Tutor
                </button>
                <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 hover:-translate-y-1 text-lg">
                  Become a Tutor
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <p className="mb-2">© 2025 Found My Tutor. Made with  for learners everywhere.</p>
          <p className="opacity-70 italic">
            "Empowering minds, one connection at a time"
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;

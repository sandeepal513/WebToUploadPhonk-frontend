import React, { useState } from 'react';
import { BsQuestionCircle, BsCheckCircleFill, BsEnvelopeFill, BsHeadset, BsShieldCheck } from 'react-icons/bs';
import { FaFire } from 'react-icons/fa';

const FAQS = [
  {
    q: 'How do I upload my Phonk beats to PHONK HUB?',
    a: 'Simply click the "Upload Beat" button on the navbar or home page. You can upload MP3 or WAV files up to 50MB, select custom artwork, choose subgenres (Drift, Memphis, Brazilian, etc.), and specify your track BPM.',
  },
  {
    q: 'Can I use sample vocal chops and distorted cowbells in my tracks?',
    a: 'Yes! Phonk music is rooted in Memphis underground sampling culture. Ensure you hold necessary rights or licensing for commercial monetization if distrubuting through major platforms.',
  },
  {
    q: 'How does track ranking work on the Trending page?',
    a: 'Our algorithm considers play count velocity, total likes, recent listener retention, and community engagement over the last 7 days.',
  },
  {
    q: 'Is PHONK HUB ready to host on Vercel or Netlify?',
    a: 'Yes! The site is pre-configured with client-side SPA routing (`vercel.json` and `netlify.toml`), optimized static asset loading, and zero external backend dependencies required for demo mode.',
  },
];

const Support = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#090a10] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff0055]/10 border border-[#ff0055]/30 text-[#ff0055] text-xs font-extrabold uppercase tracking-widest">
          <BsHeadset />
          <span>PRODUCER SUPPORT CENTER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-['Orbitron'] text-white uppercase tracking-tight">
          HOW CAN WE HELP YOU?
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Find answers regarding track uploads, copyright guidelines, audio formats, and platform hosting setup.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black font-['Orbitron'] text-white tracking-wide border-b border-slate-800 pb-3">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-[#ff0055] font-mono text-xl">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center text-xl">
            <BsEnvelopeFill />
          </div>
          <div>
            <h3 className="text-xl font-black font-['Orbitron'] text-white">CONTACT SUPPORT TEAM</h3>
            <p className="text-xs text-slate-400">Have specific questions or need feature requests? Drop us a line.</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center bg-slate-950 rounded-2xl border border-[#00f0ff]/40 text-[#00f0ff] animate-scaleUp">
            <BsCheckCircleFill className="text-4xl mx-auto mb-2" />
            <h4 className="font-extrabold text-lg">MESSAGE SENT SUCCESSFULLY!</h4>
            <p className="text-xs text-slate-400">Our support team will respond within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Producer Alias"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#ff0055] focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="producer@phonkhub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#ff0055] focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your question or feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-[#ff0055] focus:outline-none rounded-xl p-4 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#ff0055] to-[#a855f7] hover:opacity-90 text-white font-extrabold font-['Orbitron'] text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
            >
              SEND SUPPORT MESSAGE
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Support;
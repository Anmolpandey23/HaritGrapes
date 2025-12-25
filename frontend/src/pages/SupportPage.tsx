import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaQuestionCircle, FaRegEnvelope, FaCheckCircle, FaLeaf } from 'react-icons/fa';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const faqs = [
  {
    q: "How does disease detection work?",
    a: "Upload or capture a fresh grape leaf photo. Our AI model analyzes visible symptoms to detect common diseases and offers advice."
  },
  {
    q: "Are my images and data private?",
    a: "Yes. All your images and scan results are only visible to you, protected by strict authentication."
  },
  {
    q: "Which languages are supported?",
    a: "Currently English, Hindi, and Marathi. More coming soon!"
  },
  {
    q: "How accurate are the predictions?",
    a: "Predictions are made by advanced models trained on vineyard data, but always consult an agronomist for important decisions."
  }
];

const gradientBg = "bg-gradient-to-br from-green-50 via-green-100 to-blue-50";

const SupportPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', query: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const onInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);
    setError(null);
    setLoading(true);

    try {
      await addDoc(collection(db, "support_contacts"), {
        ...form,
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      setForm({ name: '', email: '', query: '' }); // Reset the form
    } catch (err: any) {
      setError('There was a problem submitting your query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${gradientBg}`}>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="rounded-3xl bg-white/75 shadow-2xl px-7 py-10 mb-12 backdrop-blur-xl"
        >
          <h1 className="text-3xl font-extrabold text-green-800 mb-7 flex items-center gap-2">
            <FaQuestionCircle size={32} className="text-green-700 drop-shadow" />
            Support & FAQs
          </h1>
          <div className="mb-11">
            <h2 className="text-xl font-bold text-green-900 mb-5">Frequently Asked Questions</h2>
            <ul className="flex flex-col gap-4">
              {faqs.map((faq, idx) => (
                <motion.li
                  key={idx}
                  initial={{ y: 32, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18 + idx * 0.08, duration: 0.4 }}
                  className={`rounded-xl bg-green-50/80 hover:bg-green-100 border border-green-100 px-4 py-4 transition-shadow cursor-pointer shadow-sm group`}
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-green-900 text-md flex-1">{faq.q}</span>
                    <FaChevronDown
                      className={`ml-3 text-green-700 transition-transform duration-200 ${openFaq === idx ? "rotate-180" : ""}`}
                    />
                  </div>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 text-gray-700 pb-1">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
          </div>
          {/* Contact Us Section */}
          <div>
            <h2 className="text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
              <FaRegEnvelope className="inline text-green-800" />
              Contact Us
            </h2>
            {!submitted ? (
              <form
                className="flex flex-col gap-4 bg-white/90 rounded-xl p-7 shadow border border-green-100"
                onSubmit={onSubmit}
                autoComplete="off"
              >
                <input
                  className="px-4 py-2 border border-green-100 rounded-lg focus:ring-green-200 focus:ring-2 outline-none"
                  placeholder="Your Name"
                  name="name"
                  value={form.name}
                  onChange={onInput}
                  required
                />
                <input
                  className="px-4 py-2 border border-green-100 rounded-lg focus:ring-green-200 focus:ring-2 outline-none"
                  placeholder="Your Email"
                  name="email"
                  value={form.email}
                  onChange={onInput}
                  required
                  type="email"
                />
                <textarea
                  className="px-4 py-2 border border-green-100 rounded-lg focus:ring-green-200 focus:ring-2 outline-none resize-none"
                  rows={4}
                  placeholder="How can we help?"
                  name="query"
                  value={form.query}
                  onChange={onInput}
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-br from-green-600 via-green-500 to-green-700 text-white font-bold rounded-xl shadow hover:from-green-700 hover:to-green-800 px-8 py-2 mt-2 transition disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                {error && (
                  <div className="text-red-600 text-sm mt-1">{error}</div>
                )}
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="p-7 bg-green-50 text-green-900 rounded-2xl shadow-lg flex flex-col items-center gap-3 font-bold"
              >
                <FaCheckCircle size={36} className="text-green-600" />
                Thank you for reaching out! We'll respond to your query soon.
              </motion.div>
            )}
          </div>
        </motion.div>
        {/* App tagline/illustration */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-10 text-center font-logo text-green-900 font-bold text-lg opacity-95"
        >
          <div className="flex justify-center mb-2">
            <span className="inline-flex items-center bg-green-100 p-2 rounded-full shadow">
              <FaLeaf size={28} className="text-green-700" />
            </span>
          </div>
          HaritGrapes brings smart AI to vineyard management for Indian farmers.
          <br />Developed with <span className="text-pink-500">❤️</span> for agriculture.
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage;

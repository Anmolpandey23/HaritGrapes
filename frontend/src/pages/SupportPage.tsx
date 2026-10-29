import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaQuestionCircle, FaRegEnvelope, FaCheckCircle } from 'react-icons/fa';
import { GiGrapes, GiVineLeaf } from 'react-icons/gi';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const faqs = [
  {
    q: "How does the grape cluster counting model operate?",
    a: "Our system runs an optimized YOLOv5 computer vision model that isolates individual grape bunches and clusters directly from your camera or uploaded photo, outputting an accurate bunch tally."
  },
  {
    q: "How does the harvest yield prediction calculate output in kg?",
    a: "Yield predictions utilize a 366-tree XGBoost ensemble model specifically calibrated on historical agronomic harvest data from Niphad and Nashik micro-regions. It models temperature, humidity, rainfall, wind speed, solar exposure, and vine count to estimate total crop tonnage."
  },
  {
    q: "How does disease detection analyze grape leaves?",
    a: "Upload or capture a grape leaf photo in daylight. Our deep neural network inspects cellular discoloration and spore patterns to identify Downey Mildew, Powdery Mildew, and Bacterial Rot, then forwards the diagnosis to the fertilizer recommender."
  },
  {
    q: "Are my vineyard images and crop data confidential?",
    a: "Yes. All images and telemetry scans are encrypted and scoped strictly to your authenticated farmer account."
  },
  {
    q: "Which regional languages are supported?",
    a: "HaritGrapes supports English, हिन्दी (Hindi), and मराठी (Marathi) to empower farmers across Maharashtra and India."
  }
];

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
      setForm({ name: '', email: '', query: '' });
    } catch (err: any) {
      setError('There was a problem submitting your query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-100">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-xl p-6 sm:p-10 mb-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1">
                <GiVineLeaf className="text-emerald-700" />
                Agronomy Assistance
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Support & Knowledge Base
              </h1>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl shadow-inner">
              <GiGrapes />
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-stone-50/70 border border-gray-200/80 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-gray-900 hover:text-primary transition-colors text-sm sm:text-base"
                  >
                    <span>{faq.q}</span>
                    <FaChevronDown
                      className={`text-emerald-700 text-xs shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-200/50 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FaRegEnvelope className="text-primary text-sm" />
              Contact Our Agronomists & Developers
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Have specific vineyard questions or need assistance calibrating models for your region? Send us a message.
            </p>

            {!submitted ? (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Your Name</label>
                    <input
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
                      placeholder="e.g. Ramesh Patel"
                      name="name"
                      value={form.name}
                      onChange={onInput}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Your Email</label>
                    <input
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition"
                      placeholder="e.g. grower@vineyard.in"
                      name="email"
                      value={form.email}
                      onChange={onInput}
                      required
                      type="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">How can we help your vineyard?</label>
                  <textarea
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm resize-none transition"
                    rows={4}
                    placeholder="Describe your question or observation..."
                    name="query"
                    value={form.query}
                    onChange={onInput}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-700 to-[#1B4332] text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? 'Submitting Question...' : 'Transmit Query to Field Support'}
                </button>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {error}
                  </div>
                )}
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex flex-col items-center gap-2 text-center"
              >
                <FaCheckCircle className="text-emerald-600 text-3xl" />
                <h4 className="font-bold text-sm">Message Transmitted Successfully</h4>
                <p className="text-xs text-emerald-800">
                  Thank you! An agronomy technician will review your query and respond shortly.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage;

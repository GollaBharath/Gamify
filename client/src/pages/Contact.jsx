import { useState, useRef } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaDiscord,
  FaPaperPlane,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const formRef = useRef();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await emailjs.sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formRef.current,
        "YOUR_PUBLIC_KEY"
      );
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setErrors({ submit: "Something went wrong. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen pt-24 pb-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* 3D Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate />
          <Stars radius={100} depth={50} count={5000} factor={4} fade />
        </Canvas>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Let’s Connect
          </h1>
          <p className="text-lg text-gray-300 mt-4 max-w-xl mx-auto">
            Have a question or just want to say hi? We’d love to hear from you.
          </p>
        </div>

        {/* Form and Info */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-gray-800 bg-opacity-80 p-8 rounded-2xl shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>

            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-green-800 border border-green-500 rounded flex items-center space-x-3"
                >
                  <FaCheckCircle className="text-green-400" />
                  <span>Your message was sent successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block mb-1">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500"
                  placeholder="Type your message..."
                />
                {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
              </div>

              {errors.submit && <p className="text-red-400 text-sm">{errors.submit}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition duration-300"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" /> Send
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-800 bg-opacity-80 p-8 rounded-2xl shadow-2xl border border-gray-700 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Info</h2>

            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-xl text-purple-400" />
              <div>
                <h3 className="font-medium">Email</h3>
                <a href="mailto:contact@gamify.example" className="text-purple-300 hover:underline">
                  contact@gamify.example
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-xl text-pink-400" />
              <div>
                <h3 className="font-medium">Location</h3>
                <p>Remote Team – Worldwide</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaDiscord className="text-xl text-blue-400" />
              <div>
                <h3 className="font-medium">Community</h3>
                <a
                  href="https://discord.gg/yourcommunity"
                  className="text-blue-300 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join our Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

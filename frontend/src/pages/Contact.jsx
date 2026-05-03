import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { FaPaperPlane } from "react-icons/fa";
import {
  User,
  Mail,
  Phone,
  ClipboardEdit,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  const handleContactForm = (e) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      name,
      email,
      phone,
      subject,
      message,
    };

    emailjs
      .send(
        "service_9ey13ee",
        "template_q1dq1ih",
        templateParams,
        "1-yFCNLoyI5ythYIQ"
      )
      .then(() => {
        toast.success("Thank You! Your message has been sent successfully.", {
          icon: <CheckCircle2 className="text-green-500" />,
        });
        setLoading(false);
        navigateTo("/");
      })
      .catch((err) => {
        toast.error("Failed to send message.", {
          icon: <XCircle className="text-red-500" />,
        });
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-slate-900 dark:to-slate-800 lg:pl-[320px] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl relative">
        {/* Decorative Background Shapes */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-white/10 dark:bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-200/10 dark:bg-purple-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 bg-white/80 dark:bg-slate-800/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Contact Information Section */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 p-10 text-white flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <MessageCircle className="mr-3 text-2xl" />
                Get in Touch
              </h2>
              <p className="text-indigo-100 dark:text-indigo-50 mb-6">
                Got a question or interested in collaborating? Fill out the
                form, and we’ll get back to you shortly.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="mr-3 text-xl" />
                  <span>(732)-713-0546</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-3 text-xl" />
                  <span>primebid@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="p-10">
              <form onSubmit={handleContactForm} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <User className="mr-2 text-indigo-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 
                        rounded-xl bg-slate-50 dark:bg-slate-700 
                        text-slate-900 dark:text-slate-100 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 
                        transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <Mail className="mr-2 text-indigo-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 
                        rounded-xl bg-slate-50 dark:bg-slate-700 
                        text-slate-900 dark:text-slate-100 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 
                        transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Phone and Subject Inputs */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <Phone className="mr-2 text-indigo-500" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 
                        rounded-xl bg-slate-50 dark:bg-slate-700 
                        text-slate-900 dark:text-slate-100 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 
                        transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <ClipboardEdit className="mr-2 text-indigo-500" />
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 
                        rounded-xl bg-slate-50 dark:bg-slate-700 
                        text-slate-900 dark:text-slate-100 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 
                        transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <MessageCircle className="mr-2 text-indigo-500" />
                    Your Message
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 
                      rounded-xl bg-slate-50 dark:bg-slate-700 
                      text-slate-900 dark:text-slate-100 
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 
                      transition-all duration-200 resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                    hover:from-indigo-700 hover:to-purple-700 
                    dark:from-indigo-700 dark:to-purple-700 
                    dark:hover:from-indigo-800 dark:hover:to-purple-800 
                    text-white font-semibold rounded-xl 
                    transition-all duration-300 
                    transform hover:-translate-y-1 
                    shadow-lg hover:shadow-xl 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-indigo-500 
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FaPaperPlane className="mr-2" />
                      Send Message
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

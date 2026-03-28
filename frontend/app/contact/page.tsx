'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setLoading(false)
    setSuccess(true)
    setFormData({ name: '', email: '', subject: '', message: '' })

    setTimeout(() => setSuccess(false), 5000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'support@noviious.com',
      link: 'mailto:support@noviious.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Address',
      content: '123 Fashion Street, New York, NY 10001',
      link: 'https://maps.google.com',
    },
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-br from-brand to-brand/80">
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">Get In Touch</h1>
          <p className="text-xl">We'd love to hear from you</p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-20">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.title}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">{info.title}</h3>
                <p className="text-text-secondary">{info.content}</p>
              </motion.a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-display font-bold mb-6">Send Us a Message</h2>
              <p className="text-lg text-text-secondary mb-8">
                Have a question or feedback? Fill out the form and we'll get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Business Hours</h3>
                  <p className="text-text-secondary">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-text-secondary">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-text-secondary">Sunday: Closed</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">Follow Us</h3>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                      <span className="sr-only">Facebook</span>
                      F
                    </a>
                    <a href="#" className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                      <span className="sr-only">Instagram</span>
                      I
                    </a>
                    <a href="#" className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                      <span className="sr-only">Twitter</span>
                      T
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card"
            >
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-6"
                >
                  Thank you! We'll get back to you soon.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-200 dark:bg-gray-800">
        <div className="w-full h-full flex items-center justify-center text-text-secondary">
          <MapPin className="w-12 h-12 mr-4" />
          <span className="text-xl">Map Integration Here</span>
        </div>
      </section>
    </div>
  )
}

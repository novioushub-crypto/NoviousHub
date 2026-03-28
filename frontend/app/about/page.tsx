'use client'

import { motion } from 'framer-motion'
import { Award, Users, Globe, Heart } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Quality First',
      description: 'We source only the finest materials and work with skilled artisans to create products that last.',
    },
    {
      icon: Users,
      title: 'Customer Focused',
      description: 'Your satisfaction is our priority. We listen, adapt, and deliver exceptional service.',
    },
    {
      icon: Globe,
      title: 'Sustainable',
      description: 'We are committed to ethical practices and reducing our environmental impact.',
    },
    {
      icon: Heart,
      title: 'Passion Driven',
      description: 'Every product is crafted with love and attention to detail.',
    },
  ]

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '500+', label: 'Products' },
    { number: '15+', label: 'Years Experience' },
    { number: '98%', label: 'Satisfaction Rate' },
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-br from-brand to-brand/80">
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">About Noviious</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Crafting premium leather jackets and sportswear since 2010
          </p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Our Story</h2>
              <p className="text-lg text-text-secondary mb-4">
                Founded in 2010, Noviious began with a simple mission: to create the perfect leather jacket. 
                What started as a small workshop has grown into a global brand known for quality and style.
              </p>
              <p className="text-lg text-text-secondary mb-4">
                Today, we offer a curated collection of premium leather jackets and high-performance sportswear, 
                each piece designed to elevate your wardrobe and stand the test of time.
              </p>
              <p className="text-lg text-text-secondary">
                Our commitment to craftsmanship, sustainability, and customer satisfaction drives everything we do.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-gold"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-surface dark:bg-surface-dark">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold mb-4">Our Values</h2>
            <p className="text-xl text-text-secondary">What drives us every day</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-text-secondary">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-display font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-surface dark:bg-surface-dark">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-text-secondary">
              Passionate individuals dedicated to bringing you the best
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((member, index) => (
              <motion.div
                key={member}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-accent to-gold rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-1">Team Member {member}</h3>
                <p className="text-text-secondary mb-2">Position</p>
                <p className="text-sm text-text-secondary">
                  Passionate about creating exceptional products and experiences.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-display font-bold mb-6">Join Our Journey</h2>
          <p className="text-xl text-text-secondary mb-8">
            Experience the Noviious difference. Explore our collection today.
          </p>
          <a href="/products" className="btn-primary inline-block">
            Shop Now
          </a>
        </motion.div>
      </section>
    </div>
  )
}

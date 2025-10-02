"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import '@n8n/chat/style.css';
import ChatWidget from "@/components/ChatWidget";
import {
  Mail,
  Github,
  Linkedin,
  MapPin,
  FileDown,
  Rocket,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import DarkVeil from "@/components/DarkVeil"; // <-- adjust path if needed

const skills: string[] = [
  "Python",
  "Java",
  "Go",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "React",
  "TailwindCSS",
  "SQL",
  "Docker",
  "Git",
  "Machine Learning",
  "Reinforcement Learning",
];

const nowBadges = [
  { label: "Thesis: Multi-Agent RL (MAPPO/MADDPG)", icon: GraduationCap },
  { label: "BenchMARL • PettingZoo • VMAS", icon: Sparkles },
  { label: "Open to roles in Veneto", icon: MapPin },
];

const projects = [
  {
    title: "OffWeb Platform",
    description: "Modern web platform built with Next.js and TailwindCSS",
    stack: ["Next.js", "TailwindCSS", "TypeScript"],
    demo: "https://offweb.eu",
    repo: "https://github.com/DixieIT/offweb",
  },
  {
    title: "Trading Data Manager",
    description:
      "Python application with Notion API and Google Calendar integration",
    stack: ["Python", "Notion API", "Google Calendar"],
    repo: "https://github.com/DixieIT/trading-manager",
  },
  {
    title: "Word Automata Builder",
    description: "JavaFX application for finite-state machine visualization",
    stack: ["Java", "JavaFX", "Graph Theory"],
    repo: "https://github.com/DixieIT/word-automata",
  },
  {
    title: "BenchMARL Analysis",
    description:
      "Analysis and visualization of multi-agent RL algorithms using BenchMARL",
    stack: ["Python", "BenchMARL", "WandB"],
    repo: "https://github.com/DixieIT/Final_AI_Stage_GABRIELE_MASIERO_VR474762.git",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <ChatWidget />
      {/* --- Hero --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <DarkVeil hueShift={392} />
          </div>
        </div>

        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto px-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center gap-6 mb-6">
            <div className="relative h-28 w-28 rounded-2xl overflow-hidden ring-2 ring-cyan-500/30">
              {/* Replace /me.PNG with your actual avatar */}
              <Image
                src="/icon.jpeg"
                alt="Gabriele Masiero headshot"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Veneto, Italy
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Gabriele{" "}
            </span>
            Masiero
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Final-year Computer Science Student
          </p>
          <p className="text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-semibold mb-8">
            Software & AI Engineer • Multi-Agent RL
          </p>

          {/* Quick "Now" badges for personality */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {nowBadges.map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300"
              >
                <Icon className="h-4 w-4" /> {label}
              </span>
            ))}
          </div>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            I build pragmatic software and love turning research into impact.
            Currently finishing my thesis in
            <span className="text-cyan-400">
              {" "}
              Multi-Agent Reinforcement Learning
            </span>{" "}
            and actively looking for roles in Veneto.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resume.pdf"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition inline-flex items-center gap-2"
              prefetch={false}
              download
            >
              <FileDown className="h-5 w-5" /> Download Resume
            </Link>
            <Link
              href="#projects"
              className="border border-cyan-500 text-cyan-500 px-8 py-3 rounded-xl font-semibold hover:bg-cyan-500 hover:text-black transition"
            >
              View Projects
            </Link>
            <Link
              href="mailto:gabriele.masiero2002@gmail.com"
              className="border border-gray-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 transition inline-flex items-center gap-2"
            >
              <Mail className="h-5 w-5" /> Contact Me
            </Link>
          </div>

          {/* Secondary links */}
          <div className="mt-6 flex items-center justify-center gap-5 text-gray-400">
            <Link
              href="https://dixieoff.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition inline-flex items-center gap-2"
            >
              <Rocket className="h-4 w-4" /> Portfolio • dixieoff.me
            </Link>
            <span className="text-gray-700">•</span>
            <Link
              href="https://github.com/DixieIT"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition inline-flex items-center gap-2"
            >
              <Github className="h-4 w-4" /> GitHub
            </Link>
            <span className="text-gray-700">•</span>
            <Link
              href="https://www.linkedin.com/in/gabriele-masiero-24a7822a3"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition inline-flex items-center gap-2"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- About / Personal pitch --- */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            About Me
          </h2>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 text-lg text-gray-300 leading-relaxed">
              <p className="mb-4">
                I’m a builder at heart. From web platforms to research tooling,
                I value clean code, fast feedback loops, and delivering things
                people actually use. Recently I’ve worked with{" "}
                <span className="text-cyan-300">BenchMARL</span>,
                <span className="text-cyan-300"> PettingZoo</span>, and{" "}
                <span className="text-cyan-300">VMAS</span> while exploring
                algorithms like MAPPO, MADDPG, and MASAC.
              </p>
              <p>
                My next step: contribute to a product team where I can own
                features end-to-end, keep learning, and bring applied AI to real
                users.
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-cyan-300">
                What I’m looking for
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Backend / Full-Stack (TS/Go/Python)</li>
                <li>• AI/ML Engineer (applied)</li>
                <li>• Teams in Veneto (Padova/Verona/etc.)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- Skills --- */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {skills.map((skill) => (
              <motion.div
                key={skill}
                variants={item}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-center hover:border-cyan-500 transition"
              >
                <span className="text-gray-300 font-medium">{skill}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Projects --- */}
      <section id="projects" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-500/50 transition"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-6">{project.description}</p>
                <div className="flex gap-4">
                  {project.demo && (
                    <Link
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-center py-2 rounded-lg font-medium hover:opacity-90 transition"
                    >
                      Live Demo
                    </Link>
                  )}
                  <Link
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-gray-600 text-center py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    View Code
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Contact --- */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Let’s Work Together
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            I’m open to internships and junior roles in Veneto. If you’re
            building something cool, let’s chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="mailto:gabriele.masiero2002@gmail.com"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition inline-flex items-center gap-2"
            >
              <Mail className="h-5 w-5" /> Send Email
            </Link>
            <div className="flex gap-4 text-gray-400">
              <Link
                href="https://github.com/DixieIT"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-500 transition inline-flex items-center gap-2"
              >
                <Github className="h-5 w-5" /> GitHub
              </Link>
              <Link
                href="https://www.linkedin.com/in/gabriele-masiero-24a7822a3"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-500 transition inline-flex items-center gap-2"
              >
                <Linkedin className="h-5 w-5" /> LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-8 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Gabriele Masiero. All rights reserved.</p>
        </div>
      </footer>

      {/* --- SEO: Person schema --- */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Gabriele Masiero",
            url: "https://dixieoff.me",
            sameAs: [
              "https://github.com/DixieIT",
              "https://www.linkedin.com/in/gabriele-masiero-24a7822a3",
            ],
            jobTitle: "Software & AI Engineer",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Veneto",
              addressCountry: "Italy",
            },
          }),
        }}
      />
    </main>
  );
}

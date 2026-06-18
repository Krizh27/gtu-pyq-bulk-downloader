import { Link } from "wouter";
import { motion } from "framer-motion";
import { Download, Zap, Shield, Archive, ArrowRight, FileText, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
{
  icon: Zap,
  title: "One-Click Bulk Download",
  description: "Select your subject, year range, and session type. Get a ZIP with every available paper in seconds."
},
{
  icon: Shield,
  title: "Bypasses GTU Blocks",
  description: "Smart browser-like request headers to fetch papers even when direct access is blocked."
},
{
  icon: Archive,
  title: "Organized ZIP Output",
  description: "Papers are named clearly — subject code, course, session, and year — so you always know what you have."
},
{
  icon: Clock,
  title: "Any Year, Any Session",
  description: "Download Summer, Winter, or both from any year range. Great for comprehensive exam prep."
}];


const steps = [
{ step: "01", label: "Enter subject code", desc: "Your GTU subject code, e.g. 3150703" },
{ step: "02", label: "Choose course & years", desc: "BE, BCA, MCA, Diploma and the year range you need" },
{ step: "03", label: "Pick session type", desc: "Summer, Winter, or both sessions" },
{ step: "04", label: "Download ZIP", desc: "One click — all found papers land in your Downloads folder" }];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <motion.div
          className="relative z-10 container mx-auto max-w-3xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-muted-foreground mb-6">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>GTU Previous Year Question Papers</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            
            Download GTU PYQs{" "}
            <span className="bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
              in One Click
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            
            Stop downloading papers one by one. Enter your subject code, pick your years, and get every available previous year question paper as a single ZIP — ready for exam prep.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/download" className="contents">
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-[0_0_24px_rgba(139,92,246,0.4)] hover:shadow-[0_0_32px_rgba(139,92,246,0.6)] transition-all duration-300 px-8"
                data-testid="button-get-started">
                
                <Download className="w-4 h-4" />
                Start Downloading
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about" className="contents">
              <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
                How it works
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {features.map((f) =>
            <motion.div
              key={f.title}
              variants={itemVariants}
              className="glass-panel rounded-xl p-5 hover:border-primary/20 transition-colors duration-300 group"
              data-testid={`card-feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}>
              
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 border-t border-white/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12">
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Four steps. Zero friction.</h2>
            <p className="text-muted-foreground">From zero to a folder full of question papers in under a minute.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {steps.map((s, i) =>
            <motion.div key={s.step} variants={itemVariants} className="relative">
                {i < steps.length - 1 &&
              <div className="hidden lg:block absolute top-6 left-[calc(100%-8px)] w-[calc(100%-32px)] h-px bg-gradient-to-r from-white/10 to-transparent z-10" />
              }
                <div className="glass-panel rounded-xl p-5 h-full">
                  <div className="text-xs font-mono text-primary mb-3">{s.step}</div>
                  <h3 className="font-semibold text-sm mb-1.5">{s.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-10">
            
            <Link href="/download" className="contents">
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 text-white"
                data-testid="button-hero-download">
                
                <CheckCircle className="w-4 h-4" />
                Try it now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>);

}
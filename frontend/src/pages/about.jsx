import { motion } from "framer-motion";
import { Link } from "wouter";
import { Download, Globe, FileText, Archive, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

export default function About() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8">
        
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold mb-2">About GTU PYQ Bulk Downloader</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A tool built to save GTU students the tedious work of downloading past papers one exam at a time.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            How it works
          </h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-mono text-xs text-primary shrink-0 mt-0.5">01</span>
              <div>
                <strong className="text-foreground block mb-0.5">URL generation</strong>
                GTU hosts papers at a predictable URL pattern:
                <code className="block mt-1.5 text-xs bg-white/5 border border-white/10 rounded px-2 py-1 font-mono">
                  gtu.ac.in/uploads/S2025/BE/3150703.pdf
                </code>
                We generate all combinations of session (S/W), year, course, and subject code.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-xs text-primary shrink-0 mt-0.5">02</span>
              <div>
                <strong className="text-foreground block mb-0.5">Availability check</strong>
                Each URL is probed with browser-like request headers (User-Agent, Referer, etc.) to determine whether a valid PDF exists — without downloading the full file.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-xs text-primary shrink-0 mt-0.5">03</span>
              <div>
                <strong className="text-foreground block mb-0.5">Bulk download &amp; ZIP</strong>
                Valid PDFs are downloaded in parallel, packed into a ZIP named after your subject code and year range, and streamed directly to your browser.
              </div>
            </li>
          </ol>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            URL pattern
          </h2>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 font-mono text-xs space-y-1">
              <div><span className="text-primary">S</span>2025/<span className="text-blue-400">BE</span>/<span className="text-green-400">3150703</span>.pdf  — Summer 2025</div>
              <div><span className="text-primary">W</span>2024/<span className="text-blue-400">BE</span>/<span className="text-green-400">3150703</span>.pdf  — Winter 2024</div>
              <div><span className="text-primary">S</span>2023/<span className="text-blue-400">MCA</span>/<span className="text-green-400">630004</span>.pdf   — Summer 2023</div>
            </div>
            <p>
              <span className="text-primary font-medium">S</span> = Summer,{" "}
              <span className="text-primary font-medium">W</span> = Winter.
              Not every subject has papers for every session or year — we skip the ones that return 404.
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5 space-y-3 border border-yellow-500/10">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-yellow-400/80">
            <AlertTriangle className="w-4 h-4" />
            Known limitations
          </h2>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>GTU occasionally blocks automated requests. If no papers are found for a subject you know exists, try again in a few minutes.</li>
            <li>Only subjects with a standard GTU code on the pattern above are supported. Some departments use alternate paths.</li>
            <li>Very large year ranges (10+ years, both sessions) can take 30–60 seconds.</li>
          </ul>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Archive className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Ready to download?</p>
              <p className="text-xs text-muted-foreground">Head to the downloader and get your papers.</p>
            </div>
          </div>
          <Link href="/download" className="contents">
            <Button className="gap-1.5 bg-primary hover:bg-primary/90 text-white" data-testid="button-go-download">
              <Download className="w-4 h-4" />
              Download
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>);

}
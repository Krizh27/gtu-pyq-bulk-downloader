import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Search,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Archive,
  BookOpen,
  ExternalLink,
  XCircle } from
"lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import { useCheckPyq } from "../api";
import { useToast } from "@/hooks/use-toast";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - i);

const COURSES = ["BE", "ME", "BCA", "MCA", "Diploma", "B.Pharm", "MBA"];
const SESSION_OPTIONS = [
{ value: "S", label: "Summer" },
{ value: "W", label: "Winter" },
{ value: "SW", label: "Both" }];


const formSchema = z.object({
  subjectCode: z.string().min(4, "Enter a valid subject code").max(15),
  course: z.string().min(1, "Select a course"),
  startYear: z.number().int().min(2015).max(currentYear),
  endYear: z.number().int().min(2015).max(currentYear),
  sessionMode: z.enum(["S", "W", "SW"])
});












function makeLabel(url) {
  const match = url.match(/\/(S|W)(\d{4})\//);
  if (match) {
    return `${match[1] === "S" ? "Summer" : "Winter"} ${match[2]}`;
  }
  return url;
}

function makeFilename(url, course, subjectCode) {
  const match = url.match(/\/(S|W)(\d{4})\//);
  if (match) {
    return `${subjectCode}_${course}_${match[1] === "S" ? "Summer" : "Winter"}${match[2]}.pdf`;
  }
  return url.split("/").pop() ?? "paper.pdf";
}

export default function Download() {
  const { toast } = useToast();
  const [papers, setPapers] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [corsBlocked, setCorsBlocked] = useState(false);
  const [lastFormData, setLastFormData] = useState(null);

  const checkMutation = useCheckPyq();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectCode: "",
      course: "BE",
      startYear: currentYear - 2,
      endYear: currentYear,
      sessionMode: "SW"
    }
  });

  const onCheck = (values) => {
    setPapers(null);
    setDownloadDone(false);
    setCorsBlocked(false);
    const sessions = values.sessionMode === "SW" ? ["S", "W"] : [values.sessionMode];

    checkMutation.mutate(
      {
        data: {
          subjectCode: values.subjectCode.trim(),
          course: values.course,
          startYear: values.startYear,
          endYear: values.endYear,
          sessions
        }
      },
      {
        onSuccess: (result) => {
          setLastFormData(values);
          const entries = result.availableUrls.map((url) => ({
            url,
            label: makeLabel(url),
            filename: makeFilename(url, values.course, values.subjectCode.trim()),
            status: "pending"
          }));
          setPapers(entries);
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : "Failed to generate links.";
          toast({ title: "Error", description: message, variant: "destructive" });
        }
      }
    );
  };

  const updatePaperStatus = (url, status) => {
    setPapers((prev) =>
    prev ? prev.map((p) => p.url === url ? { ...p, status } : p) : prev
    );
  };

  const handleDownload = async () => {
    if (!papers || !lastFormData) return;
    setIsDownloading(true);
    setDownloadDone(false);
    setCorsBlocked(false);

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    let successCount = 0;
    let corsError = false;

    for (const paper of papers) {
      updatePaperStatus(paper.url, "downloading");
      try {
        const response = await fetch(paper.url);
        if (response.ok) {
          const blob = await response.blob();
          zip.file(paper.filename, blob);
          successCount++;
          updatePaperStatus(paper.url, "done");
        } else {
          updatePaperStatus(paper.url, "failed");
        }
      } catch (err) {
        const isCors =
        err instanceof TypeError && err.message.toLowerCase().includes("cors");
        if (isCors) corsError = true;
        updatePaperStatus(paper.url, "failed");
      }
    }

    if (successCount > 0) {
      const content = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = `${lastFormData.subjectCode}_${lastFormData.course}_${lastFormData.startYear}_${lastFormData.endYear}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      toast({
        title: "Download ready",
        description: `${successCount} paper${successCount !== 1 ? "s" : ""} saved as ZIP.`
      });
      setDownloadDone(true);
    } else {
      if (corsError) setCorsBlocked(true);
      toast({
        title: corsError ? "Browser blocked the download" : "No papers downloaded",
        description: corsError ?
        "GTU doesn't allow cross-origin downloads. Use the direct links below instead." :
        "None of the papers could be downloaded. Try adjusting the year range.",
        variant: "destructive"
      });
    }

    setIsDownloading(false);
  };

  const { handleSubmit, register, setValue, watch, formState: { errors } } = form;
  const startYear = watch("startYear");
  const endYear = watch("endYear");

  const successCount = papers?.filter((p) => p.status === "done").length ?? 0;
  const failedCount = papers?.filter((p) => p.status === "failed").length ?? 0;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            PYQ Downloader
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your subject details — your browser downloads papers directly from GTU.
          </p>
        </div>

        <form onSubmit={handleSubmit(onCheck)} className="space-y-5">
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="subject-code" className="text-sm font-medium">
                Subject Code
              </Label>
              <Input
                id="subject-code"
                placeholder="e.g. 3150703"
                className="glass-input font-mono"
                data-testid="input-subject-code"
                {...register("subjectCode")} />
              
              {errors.subjectCode &&
              <p className="text-xs text-destructive">{errors.subjectCode.message}</p>
              }
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Course</Label>
              <Select
                defaultValue="BE"
                onValueChange={(v) => setValue("course", v)}>
                
                <SelectTrigger className="glass-input" data-testid="select-course">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((c) =>
                  <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Start Year</Label>
                <Select
                  defaultValue={String(currentYear - 2)}
                  onValueChange={(v) => setValue("startYear", parseInt(v))}>
                  
                  <SelectTrigger className="glass-input" data-testid="select-start-year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) =>
                    <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">End Year</Label>
                <Select
                  defaultValue={String(currentYear)}
                  onValueChange={(v) => setValue("endYear", parseInt(v))}>
                  
                  <SelectTrigger className="glass-input" data-testid="select-end-year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) =>
                    <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {startYear > endYear &&
            <p className="text-xs text-destructive">Start year must be before end year</p>
            }

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Session</Label>
              <div className="flex gap-2" data-testid="group-session">
                {SESSION_OPTIONS.map((opt) => {
                  const current = watch("sessionMode");
                  const active = current === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue("sessionMode", opt.value)}
                      data-testid={`button-session-${opt.value}`}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      active ?
                      "bg-primary/20 border-primary/50 text-primary" :
                      "bg-background/40 border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"}`
                      }>
                      
                      {opt.label}
                    </button>);

                })}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={checkMutation.isPending}
            data-testid="button-check-papers">
            
            {checkMutation.isPending ?
            <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating links...
              </> :

            <>
                <Search className="w-4 h-4" />
                Get Paper Links
              </>
            }
          </Button>
        </form>

        <AnimatePresence mode="wait">
          {checkMutation.isPending &&
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-5 glass-panel rounded-xl p-5 text-center">
            
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm font-medium">Generating paper links...</p>
              <p className="text-xs text-muted-foreground mt-1">
                Building GTU URLs for your selection
              </p>
            </motion.div>
          }

          {papers && !checkMutation.isPending &&
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 space-y-3">
            
              {/* Stats + action bar */}
              <div className="glass-panel rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {downloadDone ?
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" /> :
                corsBlocked ?
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" /> :

                <FileText className="w-5 h-5 text-primary shrink-0" />
                }
                  <div>
                    <p className="text-sm font-semibold">
                      {downloadDone ?
                    `${successCount} paper${successCount !== 1 ? "s" : ""} downloaded` :
                    corsBlocked ?
                    "Use direct links below" :
                    `${papers.length} paper${papers.length !== 1 ? "s" : ""} found`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {downloadDone ?
                    `${failedCount > 0 ? `${failedCount} not found on GTU` : "All papers saved to ZIP"}` :
                    corsBlocked ?
                    "GTU blocks cross-origin downloads" :
                    "Your browser will fetch papers directly from GTU"}
                    </p>
                  </div>
                </div>

                {!corsBlocked &&
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-[0_0_16px_rgba(139,92,246,0.4)] shrink-0"
                data-testid="button-download-zip">
                
                    {isDownloading ?
                <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Downloading...
                      </> :
                downloadDone ?
                <>
                        <Archive className="w-4 h-4" />
                        Download Again
                      </> :

                <>
                        <Archive className="w-4 h-4" />
                        Download ZIP
                      </>
                }
                  </Button>
              }
              </div>

              {/* CORS fallback notice */}
              {corsBlocked &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel rounded-xl p-4 border border-amber-400/20 bg-amber-400/5">
              
                  <p className="text-xs text-amber-300 leading-relaxed">
                    <strong>GTU restricts cross-origin downloads.</strong> Click each paper link
                    below to open and save it directly from GTU. Right-click → Save As to save
                    as a PDF.
                  </p>
                </motion.div>
            }

              {/* Paper list */}
              <div className="glass-panel rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/5 text-xs font-medium text-muted-foreground">
                  {corsBlocked ? "Direct links — click to open" : "Papers"}
                </div>
                <motion.ul
                variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                initial="hidden"
                animate="visible"
                className="divide-y divide-white/5">
                
                  {papers.map((paper, i) =>
                <motion.li
                  key={paper.url}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } }
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
                  data-testid={`item-paper-${i}`}>
                  
                      {paper.status === "downloading" &&
                  <Loader2 className="w-4 h-4 text-primary shrink-0 animate-spin" />
                  }
                      {paper.status === "done" &&
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  }
                      {paper.status === "failed" &&
                  <XCircle className="w-4 h-4 text-destructive shrink-0" />
                  }
                      {paper.status === "pending" &&
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  }

                      <span className="text-sm font-medium">{paper.label}</span>

                      <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs text-muted-foreground hover:text-primary flex items-center gap-1 shrink-0 transition-colors"
                    title="Open on GTU">
                    
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </a>
                    </motion.li>
                )}
                </motion.ul>
              </div>

              {/* Legend */}
              {(successCount > 0 || failedCount > 0) &&
            <div className="flex gap-4 px-1 text-xs text-muted-foreground">
                  {successCount > 0 &&
              <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      {successCount} downloaded
                    </span>
              }
                  {failedCount > 0 &&
              <span className="flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-destructive" />
                      {failedCount} not on GTU
                    </span>
              }
                </div>
            }
            </motion.div>
          }
        </AnimatePresence>
      </motion.div>
    </div>);

}
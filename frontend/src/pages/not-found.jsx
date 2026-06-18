import { Link } from "wouter";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center">
        
        <p className="text-7xl font-bold text-primary/20 mb-4">404</p>
        <h1 className="text-xl font-semibold mb-2">Page not found</h1>
        <p className="text-muted-foreground text-sm mb-6">This page doesn't exist.</p>
        <Link href="/" className="contents">
          <Button className="gap-2" data-testid="button-go-home">
            <Home className="w-4 h-4" />
            Back to home
          </Button>
        </Link>
      </motion.div>
    </div>);

}
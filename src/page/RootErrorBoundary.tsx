import { Button } from "@/components";
import { motion } from "framer-motion";
import { AlertOctagon, Home, RefreshCw } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface Props extends React.ComponentProps<"div"> {}

export const RootErrorBoundary = ({ ...rest }: Props) => {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#141414] text-white"
      {...rest}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#E50914]/20"
        >
          <AlertOctagon className="h-12 w-12 text-[#E50914]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-2 text-3xl font-bold"
        >
          Something went wrong
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8 text-gray-400"
        >
          An unexpected error occurred. Please try refreshing the page or go back to home.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            className="flex w-full items-center justify-center gap-2 bg-gray-800 px-6 py-3 font-medium hover:bg-gray-700 sm:w-auto"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>

          <Link to="/" className="w-full sm:w-auto">
            <Button className="flex w-full items-center justify-center gap-2 bg-[#E50914] px-6 py-3 font-medium hover:bg-[#B81D24]">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

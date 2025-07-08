import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-[#8c8c8c] opacity-30 rounded-full blur-[150px] z-0" />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="./Vlogo.png" alt="logo" className="h-10 w-10" />
              <h1 className="text-2xl font-bold">Vforms</h1>
            </div>
            <Button
              onClick={() => navigate("/form-builder")}
              className="bg-black hover:bg-[#333] text-white font-semibold"
            >
              Launch Builder
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto px-4 py-24"
        >
          <Badge className="bg-[#8c8c8c] text-white mb-6 px-4 py-1 text-sm tracking-wide">
            ⚡ Build Smarter. Share Faster.
          </Badge>

          <motion.h2
            className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-[#8c8c8c]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Create Beautiful Forms <br />
            <span className="text-[#525252]">Without Writing a Single Line</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-[#525252] mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Drag and drop fields, preview on any device, and share instantly — it's that simple.
          </motion.p>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/form-builder")}
              className="bg-black text-white hover:bg-[#333] text-lg px-8 py-4"
            >
              <Plus className="h-5 w-5 mr-2" />
              Start a New Form
            </Button>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
};

export default HomePage;

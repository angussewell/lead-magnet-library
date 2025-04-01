import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors from Sheet (simplified for dark mode focus)
        brand: {
          red: '#EF4444',       // Primary 500
          blue: '#0EA5E9',      // Secondary 500
          red_dark: '#DC2626',  // Primary 600 (for hover)
          blue_dark: '#0284C7', // Secondary 600 (for hover)
        },
        // Cool Gradient Colors from Sheet
        gradient: {
          cool_deep_blue: '#092843',
          cool_mid_blue: '#1b4f75',
          cool_light_blue: '#53b5d9',
        },
        // Warm Gradient Colors (for potential text/accents)
        gradient_warm: {
           deep_red: '#ab213e',
           bright_red: '#e93d3d',
           gold: '#edad52'
        },
        // Dark mode palette refinement
        background: {
          DEFAULT: '#030712', // Near black
          alt: '#111827',   // Dark gray-blue
          card: '#1f2937'     // Slightly lighter gray-blue for cards
        },
        border_color: {
            DEFAULT: '#374151' // Gray-ish border
        },
        text_color: {
            DEFAULT: '#F9FAFB', // Off-white primary
            muted: '#9CA3AF'   // Gray for secondary text
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
         // Add custom gradient utilities if needed, e.g.:
         'gradient-cool-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))', 
         'gradient-cool-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))'
      },
      // Add subtle animations/keyframes if desired later
    },
  },
  plugins: [],
};
export default config;

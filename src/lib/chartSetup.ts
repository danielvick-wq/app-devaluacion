import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Global defaults for fintech dark theme
ChartJS.defaults.color = '#94A3B8';
ChartJS.defaults.borderColor = '#1E293B';
ChartJS.defaults.font.family = "'Inter', system-ui, sans-serif";
ChartJS.defaults.font.size = 12;

// Snappy performance-tuned animation for continuous dashboard interactions (Plan 001)
ChartJS.defaults.animation = {
  duration: 180,
  easing: 'easeOutQuart'
};

// Disable animations when prefers-reduced-motion is active (Plan 003 - WCAG 2.2)
if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  ChartJS.defaults.animation = false;
}

export default ChartJS;

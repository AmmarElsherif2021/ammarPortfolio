// Section.tsx
import { useRouter } from 'next/navigation';
import type { Segment } from '@/interfaces/types';

interface SectionProps {
  data: Segment;
  isActive: boolean;
  index: number;
}

const Section = ({ data, isActive, index }: SectionProps) => {
  const router = useRouter();

  // Determine if we have a button and its text
  const hasButton = data.buttonText || data.buttonText_ar;
  const buttonText = data.buttonText || data.buttonText_ar || 'Learn More';

  const handleClick = () => {
    if (data.buttonLink) {
      // If link starts with http, open in new tab; else navigate internally
      if (data.buttonLink.startsWith('http')) {
        window.open(data.buttonLink, '_blank');
      } else {
        router.push(data.buttonLink);
      }
    }
  };

  // You can use the `animation` and `textAlign` props for additional styling
  const textAlignClass = data.textAlign === 'right' ? 'text-right' : data.textAlign === 'center' ? 'text-center' : 'text-left';

  return (
    <div
      className={`flex items-center justify-center h-full px-4 md:px-8 transition-opacity duration-700 ${
        isActive ? 'opacity-100' : 'opacity-40'
      }`}
    >
      <div className={`max-w-4xl w-full ${textAlignClass}`}>
        <h2 className="text-port-h2 font-bold text-port-dark dark:text-port-white">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-port-h4 text-port-muted dark:text-port-muted/80 mt-2">
            {data.subtitle}
          </p>
        )}
        <p className="text-port-body1 text-port-dark/80 dark:text-port-white/80 mt-4 max-w-2xl mx-auto">
          {data.description}
        </p>
        {hasButton && (
          <button
            onClick={handleClick}
            className="mt-6 bg-port-btn text-port-white font-bold px-6 py-3 rounded-btn shadow-card transition-transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            {buttonText}
          </button>
        )}
        {/* Optional: render linked sections as tags */}
        {data.linkedSections && data.linkedSections.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {data.linkedSections.map((label) => (
              <span key={label} className="text-xs bg-port-white/20 dark:bg-port-dark/20 px-3 py-1 rounded-full text-port-dark dark:text-port-white">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Section;
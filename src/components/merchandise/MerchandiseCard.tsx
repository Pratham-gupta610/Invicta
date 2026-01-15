import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MerchandiseCardProps {
  image?: string;
  frontImage?: string;
  backImage?: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  price?: string;
  ctaText: string;
  ctaLink: string;
}

export default function MerchandiseCard({
  image,
  frontImage,
  backImage,
  title,
  subtitle,
  description,
  features,
  price,
  ctaText,
  ctaLink,
}: MerchandiseCardProps) {
  const hasFrontBack = frontImage && backImage;

  return (
    <div className="group relative bg-white/8 backdrop-blur-md border border-white/12 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      {/* Product Image(s) */}
      {hasFrontBack ? (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={frontImage}
              alt={`${title} - Front`}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium">
              Front
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={backImage}
              alt={`${title} - Back`}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium">
              Back
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl mb-6">
          <img
            src={image}
            alt={title}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* Product Information */}
      <div className="space-y-4">
        {/* Title and Subtitle */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{title}</h3>
          <p className="text-base text-primary font-medium">{subtitle}</p>
        </div>

        {/* Description */}
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Features */}
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start text-sm text-muted-foreground/90"
            >
              <span className="text-primary mr-2 mt-0.5">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Price (if provided) */}
        {price && (
          <div className="pt-2">
            <span className="text-2xl font-bold text-foreground">{price}</span>
          </div>
        )}

        {/* CTA Button */}
        <Button
          asChild
          className="w-full bg-gradient-to-r from-[#FFB84D] to-[#FFA500] hover:from-[#FFC55D] hover:to-[#FFB520] text-primary-foreground font-semibold text-base py-6 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            {ctaText}
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}

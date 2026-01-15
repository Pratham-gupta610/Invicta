import { ShoppingBag } from 'lucide-react';
import MerchandiseCard from './MerchandiseCard';

export default function MerchandiseSection() {
  const jerseyImage = 'https://miaoda-conversation-file.s3cdn.medo.dev/user-8uulh0d0bh8g/conv-8uulibpxqebk/20260115/file-8y9m5dybvxts.jpg';
  const maroonHoodieFront = 'https://miaoda-conversation-file.s3cdn.medo.dev/user-8uulh0d0bh8g/conv-8uulibpxqebk/20260115/file-8yaqe2f92lts.png';
  const maroonHoodieBack = 'https://miaoda-conversation-file.s3cdn.medo.dev/user-8uulh0d0bh8g/conv-8uulibpxqebk/20260115/file-8yaqdmn05zpc.png';
  const navyHoodieFront = 'https://miaoda-conversation-file.s3cdn.medo.dev/user-8uulh0d0bh8g/conv-8uulibpxqebk/20260115/file-8yayb2fyrr40.png';
  const navyHoodieBack = 'https://miaoda-conversation-file.s3cdn.medo.dev/user-8uulh0d0bh8g/conv-8uulibpxqebk/20260115/file-8yayb2fyrksg.png';

  return (
    <section className="w-full bg-gradient-to-b from-primary/10 to-background py-16 xl:py-24">
      <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 xl:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="h-10 w-10 xl:h-12 xl:w-12 text-primary" />
            <h2 className="text-3xl xl:text-[42px] font-bold text-foreground">
              Official Merchandise
            </h2>
          </div>
          <p className="text-base xl:text-lg text-muted-foreground font-normal">
            Grab your IIITG Sports Carnival gear!
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-10">
          {/* Jersey Card */}
          <MerchandiseCard
            image={jerseyImage}
            title="Official Sports Jersey"
            subtitle="IIIT Guwahati Carnival Edition"
            description="Show your team spirit with our premium quality sports jersey featuring the official IIITG Sports Board logo. Comfortable, durable, and perfect for the carnival!"
            features={[
              'Premium polyester fabric',
              'Customizable player number',
              'Official IIITG branding',
              'Front & back design',
              'Available in all sizes',
            ]}
            ctaText="Buy Jersey Now"
            ctaLink="https://forms.gle/Zz64gJjWMjPC4ZvHA"
          />

          {/* Maroon Hoodie Card */}
          <MerchandiseCard
            frontImage={maroonHoodieFront}
            backImage={maroonHoodieBack}
            title="IIIT Guwahati Zipper"
            subtitle="Maroon Edition"
            description="Stay warm and stylish with our premium maroon zipper hoodie featuring the IIIT Guwahati Sports Board logo on the front and bold IIIT GUWAHATI text on the back."
            features={[
              'Premium cotton blend fabric',
              'Full-zip front closure',
              'Front kangaroo pocket',
              'Sports Board logo on chest',
              'IIIT GUWAHATI back print',
            ]}
            ctaText="Buy Maroon Hoodie"
            ctaLink="https://forms.gle/CNCC67eLv1y5dYc7A"
          />

          {/* Navy Blue Hoodie Card */}
          <MerchandiseCard
            frontImage={navyHoodieFront}
            backImage={navyHoodieBack}
            title="IIIT Guwahati Zipper"
            subtitle="Navy Blue Edition"
            description="Premium navy blue zipper hoodie with the iconic IIIT Guwahati branding. Perfect for training sessions, casual wear, or showing your team spirit year-round."
            features={[
              'Premium cotton blend fabric',
              'Durable YKK zipper',
              'Soft fleece interior',
              'Sports Board emblem',
              'IIIT GUWAHATI back text',
            ]}
            ctaText="Buy Navy Hoodie"
            ctaLink="https://forms.gle/CNCC67eLv1y5dYc7A"
          />
        </div>
      </div>
    </section>
  );
}

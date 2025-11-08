// NOVO ARQUIVO: src/components/TeamMember.tsx
import { ReactNode } from "react";
// Assumindo que você tem o arquivo utilitário padrão do shadcn/ui
import { cn } from "@/lib/utils";

interface TeamMemberProps {
  name: string;
  role: string;
  description: ReactNode;
  image: string;
  reverse?: boolean;
}

const TeamMember = ({ name, role, description, image, reverse = false }: TeamMemberProps) => {
  return (
    <section className={cn(
      "container mx-auto px-6 py-16",
      "grid md:grid-cols-2 gap-12 items-center"
    )}>
      <div className={cn(
        "space-y-6",
        reverse && "md:order-2"
      )}>
        <div className="space-y-2">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            {name}
          </h2>
          <p className="text-xl text-muted-foreground font-medium">
            {role}
          </p>
        </div>
        <div className="text-lg text-foreground/80 space-y-4 leading-relaxed">
          {description}
        </div>
      </div>
      
      <div className={cn(
        "relative",
        reverse && "md:order-1"
      )}>
        <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-medium)] 
                        transform transition-transform duration-300 hover:scale-[1.02]">
          <img 
            src={image} 
            alt={`${name} - ${role}`}
            className="w-full aspect-[4/3] object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default TeamMember;
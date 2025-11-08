// NOVO ARQUIVO: src/components/TeamHero.tsx
const TeamHero = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/10 to-secondary/10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 
                         bg-[var(--gradient-primary)] bg-clip-text text-transparent">
            Nossa Equipe
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed">
            Conheça os profissionais dedicados que tornam nossa clínica um lugar especial 
            para cuidar do seu pet com excelência e carinho.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeamHero;
import Header from "@/components/Header"; // 1. IMPORTAÇÃO DO HEADER
import TeamHero from "@/components/TeamHero";
import TeamMember from "@/components/TeamMember";
// Mantém-se as importações das suas fotos, que serão usadas como ilustrações
import teamMember1 from "@/assets/foto 1.jpg"; 
import teamMember2 from "@/assets/foto 2.jpg"; 
import teamMember3 from "@/assets/foto 3.jpg"; 

const NossaEquipe = () => {
  return (
    // 2. USO DE FRAGMENT PARA ENVOLVER O HEADER E O CONTEÚDO
    <> 
      <Header /> {/* O HEADER É ADICIONADO AQUI, FORA DO BLOCO DE CONTEÚDO */}

      {/* O conteúdo original é mantido dentro do seu wrapper principal */}
      <div className="min-h-screen bg-background">
        <TeamHero />
        
        {/* 1º BLOCO: MEMBRO DA EQUIPE */}
        <TeamMember
          name="Dra. Ana Carolina Silva" 
          role="Médica Veterinária - Diretora Clínica"
          description={
            <>
              <p>
                Formada pela Universidade Federal com especialização em clínica de pequenos animais, 
                a Dra. Ana tem mais de 15 anos de experiência dedicados ao bem-estar animal.
              </p>
              <p>
                Sua paixão pela medicina veterinária começou ainda na infância, quando decidiu que 
                dedicaria sua vida a cuidar dos animais que tanto amava. Hoje, ela lidera nossa clínica 
                com excelência técnica e um coração imenso.
              </p>
            </>
          }
          image={teamMember1} 
        />

        {/* 2º BLOCO: INFORMAÇÃO INSTITUCIONAL (NOSSOS VALORES) */}
        <TeamMember
          name="Nossos Valores"
          role="Ética e Transparência"
          description={
            <>
              <p>
                Acreditamos que o cuidado com seu pet deve ser guiado pela honestidade e clareza em todos os processos. Nossos valores fundamentais são a base de todas as nossas interações e tratamentos.
              </p>
              <p>
                Desde o diagnóstico até o acompanhamento pós-tratamento, garantimos que você sempre estará informado e confortável com as decisões tomadas para o bem-estar do seu companheiro.
              </p>
            </>
          }
          image={teamMember2} 
          reverse 
        />

        {/* 3º BLOCO: INFORMAÇÃO INSTITUCIONAL (TECNOLOGIA) */}
        <TeamMember
          name="Tecnologia e Inovação" 
          role="Modernidade a Serviço da Saúde Animal"
          description={
            <>
              <p>
                Investimos continuamente em equipamentos de última geração e em capacitação profissional para oferecer o que há de mais moderno na medicina veterinária.
              </p>
              <p>
                Isso nos permite realizar exames e procedimentos complexos com maior precisão, agilidade e, principalmente, segurança para o seu pet.
              </p>
            </>
          }
          image={teamMember3} 
        />

        {/* SEÇÃO FINAL */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
              Seu pet em boas mãos
            </h2>
            <p className="text-xl text-foreground/70 leading-relaxed">
              Nossa dedicação é total, proporcionando o melhor cuidado possível para seu companheiro. 
              A expertise e o carinho do nosso time garantem uma atenção completa e personalizada.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default NossaEquipe;
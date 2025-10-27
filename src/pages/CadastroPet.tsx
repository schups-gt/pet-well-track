import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/Header";
import { PawPrint } from "lucide-react";
import InputMask from "react-input-mask";

const petFormSchema = z.object({
  petName: z.string().trim().min(2, "Nome do pet deve ter pelo menos 2 caracteres").max(50),
  species: z.string().min(1, "Selecione a espécie"),
  breed: z.string().trim().min(2, "Raça deve ter pelo menos 2 caracteres").max(50),
  age: z.string().min(1, "Idade é obrigatória"),
  weight: z.string().min(1, "Peso é obrigatório"),
  ownerName: z.string().trim().min(2, "Nome do dono deve ter pelo menos 2 caracteres").max(100),
  ownerPhone: z.string().trim().min(10, "Telefone inválido").max(15),
});

const racas: Record<string, string[]> = {
  cachorro: ["Labrador", "Poodle", "Bulldog", "Beagle", "Golden Retriever", "Shih Tzu", "Yorkshire Terrier", "Schnauzer", "Boxer", "Dachshund", "Rottweiler", "Pastor Alemão", "Pug", "Maltês", "Buldogue Francês", "Husky Siberiano", "Cocker Spaniel", "Pinscher", "Border Collie", "Outro"],
  gato: ["Siamês", "Persa", "Maine Coon", "Ragdoll", "Sphynx", "Bengal", "Britânico de Pelo Curto", "Angorá", "Abissínio", "Norueguês da Floresta", "Exótico", "Scottish Fold", "Siberiano", "Oriental", "Devon Rex", "Birmanês", "Himalaio", "Tonquinês", "Cornish Rex", "Outro"],
};



type PetFormData = z.infer<typeof petFormSchema>;

const CadastrarPet = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PetFormData>({
    resolver: zodResolver(petFormSchema),
  });

  const species = watch("species");

  const onSubmit = async (data: PetFormData) => {
    
  setIsSubmitting(true);
  try {
    const response = await fetch("http://localhost:3000/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: data.petName,
        especie: data.species,
        raca: data.breed,
        idade: data.age,
        peso: data.weight,
        tutor: data.ownerName,
        telefone: data.ownerPhone,
        status: "Saudável",
        imagem: data.species === "cachorro"
          ? "https://i.imgur.com/6a0PzVY.png"
          : "https://i.imgur.com/svGvZ1U.png",
      }),
    });

    if (!response.ok) throw new Error("Erro ao cadastrar pet");
    const newPet = await response.json();

    toast.success("Pet cadastrado com sucesso!", {
      description: `${newPet.nome} foi adicionado ao sistema.`,
    });

    // limpa o formulário
    Object.keys(data).forEach((key) => setValue(key as any, ""));
  } catch (error) {
    toast.error("Erro ao cadastrar pet", { description: "Tente novamente mais tarde." });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
              <PawPrint className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-4xl font-bold">Cadastrar Novo Pet</h1>
            <p className="text-muted-foreground">
              Preencha as informações do seu pet para começar o monitoramento de saúde
            </p>
          </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Informações do Pet</CardTitle>
              <CardDescription>
                Precisamos de alguns dados para criar o perfil completo do seu companheiro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input type="hidden" {...register("species")} />
                <input type="hidden" {...register("breed")} />
                {/* Pet Information Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="petName">Nome do Pet *</Label>
                    <Input
                      id="petName"
                      placeholder="Ex: Rex, Mia, Thor..."
                      {...register("petName")}
                      className={errors.petName ? "border-destructive" : ""}
                    />
                    {errors.petName && (
                      <p className="text-sm text-destructive">{errors.petName.message}</p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="species">Espécie *</Label>
                      <Select onValueChange={(value) => setValue("species", value)}>
                        <SelectTrigger id="species" className={errors.species ? "border-destructive" : ""}>
                          <SelectValue placeholder="Selecione a espécie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cachorro">Cachorro</SelectItem>
                          <SelectItem value="gato">Gato</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.species && <p className="text-sm text-destructive">{errors.species.message}</p>}
                    </div>

                    {/* Breed Field (logo abaixo da espécie) */}
                    <div className="space-y-2">
                      <Label htmlFor="breed">Raça *</Label>
                      <Select onValueChange={(value) => setValue("breed", value)}>
                        <SelectTrigger id="breed" className={errors.breed ? "border-destructive" : ""}>
                          <SelectValue placeholder="Selecione a raça" />
                        </SelectTrigger>
                        <SelectContent>
                          {species && racas[species]?.map((raca) => (
                            <SelectItem key={raca} value={raca}>{raca}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.breed && <p className="text-sm text-destructive">{errors.breed.message}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="age">Idade *</Label>
                      <Input
                        id="age"
                        placeholder="Ex: 2 anos"
                        {...register("age")}
                        className={errors.age ? "border-destructive" : ""}
                      />
                      {errors.age && (
                        <p className="text-sm text-destructive">{errors.age.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso *</Label>
                      <Input
                        id="weight"
                        placeholder="Ex: 15kg"
                        {...register("weight")}
                        className={errors.weight ? "border-destructive" : ""}
                      />
                      {errors.weight && (
                        <p className="text-sm text-destructive">{errors.weight.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Owner Information Section */}
                <div className="border-t border-border pt-6">
                  <h3 className="mb-4 text-lg font-semibold">Informações do Tutor</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Nome do Tutor *</Label>
                      <Input
                        id="ownerName"
                        placeholder="Seu nome completo"
                        {...register("ownerName")}
                        className={errors.ownerName ? "border-destructive" : ""}
                      />
                      {errors.ownerName && (
                        <p className="text-sm text-destructive">{errors.ownerName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerPhone">Telefone de Contato *</Label>
                      <InputMask mask="99-999999999" {...register("ownerPhone")}>
                        {(inputProps) => (
                          <Input
                            {...inputProps}
                            id="ownerPhone"
                            type="tel"
                            placeholder="00-00000000"
                            className={errors.ownerPhone ? "border-destructive" : ""}
                          />
                        )}
                      </InputMask>
                      {errors.ownerPhone && (
                        <p className="text-sm text-destructive">{errors.ownerPhone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Cadastrando..." : "Cadastrar Pet"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CadastrarPet;

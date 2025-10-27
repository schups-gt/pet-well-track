let pets = []; // por enquanto só em memória

export const savePet = async (petData) => {
  const newPet = { id: Date.now(), ...petData };
  pets.push(newPet);
  return newPet;
};

export const listPets = async () => {
  return pets;
};
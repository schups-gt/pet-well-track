import { savePet, listPets } from "../services/pets.service.js";

export const createPet = async (req, res) => {
  try {
    const newPet = await savePet(req.body);
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar pet", error });
  }
};

export const getPets = async (req, res) => {
  try {
    const pets = await listPets();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pets", error });
  }
};
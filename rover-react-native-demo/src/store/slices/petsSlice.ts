import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  photoURL?: string;
  description?: string;
  ownerId: string;
  vaccinations: {
    rabies: boolean;
    distemper: boolean;
    parvo: boolean;
  };
  specialNeeds?: string;
  medications?: string[];
}

interface PetsState {
  pets: Pet[];
  selectedPet: Pet | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PetsState = {
  pets: [],
  selectedPet: null,
  isLoading: false,
  error: null,
};

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    fetchPetsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPetsSuccess: (state, action: PayloadAction<Pet[]>) => {
      state.isLoading = false;
      state.pets = action.payload;
      state.error = null;
    },
    fetchPetsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addPet: (state, action: PayloadAction<Pet>) => {
      state.pets.push(action.payload);
    },
    updatePet: (state, action: PayloadAction<Pet>) => {
      const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
      if (index !== -1) {
        state.pets[index] = action.payload;
      }
    },
    deletePet: (state, action: PayloadAction<string>) => {
      state.pets = state.pets.filter((pet) => pet.id !== action.payload);
    },
    selectPet: (state, action: PayloadAction<string>) => {
      state.selectedPet = state.pets.find((pet) => pet.id === action.payload) || null;
    },
    clearSelectedPet: (state) => {
      state.selectedPet = null;
    },
  },
});

export const {
  fetchPetsStart,
  fetchPetsSuccess,
  fetchPetsFailure,
  addPet,
  updatePet,
  deletePet,
  selectPet,
  clearSelectedPet,
} = petsSlice.actions;

export default petsSlice.reducer;
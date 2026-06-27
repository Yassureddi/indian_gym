export interface TrainerSocial {
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  image: string;
  bio: string;
  certificates: string[];
  social: TrainerSocial;
  age?: number;
  dob?: string;
  purpose?: string;
  isActive?: boolean;
  sortOrder?: number;
}

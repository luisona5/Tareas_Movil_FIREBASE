import { AuthRepository } from "@/src/domain/repositories/AuthRepository";
import { User } from "@/src/domain/entities/User";

export class UpdateProfile {
  constructor(private authRepository: AuthRepository) {}

  async execute(displayName: string): Promise<User> {
    if (!displayName || displayName.trim().length < 2) {
      throw new Error("El nombre debe tener al menos 2 caracteres");
    }
    return this.authRepository.updateProfile(displayName.trim());
  }
}
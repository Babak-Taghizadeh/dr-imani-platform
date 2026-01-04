import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "@/types/types";

export const getUserById = async (userId: string): Promise<User | null> => {
  const userData = await db
    .select({
      id: users.id,
      name: users.name,
      idNumber: users.idNumber,
      phoneNumber: users.phoneNumber,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (userData.length === 0) {
    return null;
  }

  return {
    ...userData[0],
    createdAt: userData[0].createdAt.toISOString(),
    updatedAt: userData[0].updatedAt.toISOString(),
  };
};

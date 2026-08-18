import { ProgramModulesResponse } from "@/src/services/http/users";
import { buildApiUrl } from "@/src/utils/buildApiUrl";

export async function getProgram(name: string) {
  const apiUrl = buildApiUrl(`/users/programs/`);

  if (!apiUrl) {
    return null;
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ProgramModulesResponse;

    return data.results.find((program) => program.program_type === name) ?? null;
  } catch {
    return null;
  }
}

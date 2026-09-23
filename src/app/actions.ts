"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function requireString(value: FormDataEntryValue | null, field: string): string {
  const str = typeof value === "string" ? value.trim() : "";
  if (!str) {
    throw new Error(`Le champ "${field}" est obligatoire.`);
  }
  return str;
}

function optionalString(value: FormDataEntryValue | null): string | null {
  const str = typeof value === "string" ? value.trim() : "";
  return str.length > 0 ? str : null;
}

export async function createPatient(formData: FormData) {
  const nom = requireString(formData.get("nom"), "Nom");
  const prenom = requireString(formData.get("prenom"), "Prénom");
  const numeroDossier = requireString(
    formData.get("numeroDossier"),
    "Numéro de dossier",
  );
  const dateNaissanceRaw = requireString(
    formData.get("dateNaissance"),
    "Date de naissance",
  );
  const sexe = requireString(formData.get("sexe"), "Sexe");

  if (sexe !== "HOMME" && sexe !== "FEMME") {
    throw new Error("Le sexe doit être HOMME ou FEMME.");
  }

  const patient = await prisma.patient.create({
    data: {
      nom,
      prenom,
      numeroDossier,
      dateNaissance: new Date(dateNaissanceRaw),
      sexe,
      telephone: optionalString(formData.get("telephone")),
      adresse: optionalString(formData.get("adresse")),
      groupeSanguin: optionalString(formData.get("groupeSanguin")),
    },
  });

  revalidatePath("/");
  redirect(`/patients/${patient.id}`);
}

export async function addConsultation(formData: FormData) {
  const patientId = requireString(formData.get("patientId"), "Patient");
  const motif = requireString(formData.get("motif"), "Motif");
  const medecin = requireString(formData.get("medecin"), "Médecin");

  await prisma.consultation.create({
    data: {
      patientId,
      motif,
      medecin,
      diagnostic: optionalString(formData.get("diagnostic")),
      traitement: optionalString(formData.get("traitement")),
    },
  });

  revalidatePath(`/patients/${patientId}`);
}

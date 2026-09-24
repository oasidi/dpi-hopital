import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const patients = [
    {
      numeroDossier: "DPI-2024-0001",
      nom: "Diallo",
      prenom: "Aminata",
      dateNaissance: new Date("1988-03-12"),
      sexe: "FEMME",
      telephone: "+222 45 12 34 56",
      adresse: "Tevragh Zeina, Nouakchott",
      groupeSanguin: "O+",
      consultations: [
        {
          motif: "Céphalées persistantes",
          diagnostic: "Migraine sans aura",
          traitement: "Paracétamol 1g, repos, suivi à 2 semaines",
          medecin: "Dr. Ba",
          date: new Date("2024-11-04T09:30:00"),
        },
        {
          motif: "Contrôle tension artérielle",
          diagnostic: "Tension normale (120/80)",
          traitement: "Poursuite de l'hygiène de vie",
          medecin: "Dr. Sy",
          date: new Date("2025-01-20T11:00:00"),
        },
      ],
    },
    {
      numeroDossier: "DPI-2024-0002",
      nom: "Ould Ahmed",
      prenom: "Mohamed",
      dateNaissance: new Date("1975-07-29"),
      sexe: "HOMME",
      telephone: "+222 22 98 76 54",
      adresse: "Ksar, Nouakchott",
      groupeSanguin: "A+",
      consultations: [
        {
          motif: "Douleurs abdominales",
          diagnostic: "Gastrite",
          traitement: "Oméprazole 20mg, régime alimentaire",
          medecin: "Dr. Ba",
          date: new Date("2024-12-15T14:15:00"),
        },
      ],
    },
    {
      numeroDossier: "DPI-2025-0003",
      nom: "Sow",
      prenom: "Fatimata",
      dateNaissance: new Date("1996-11-02"),
      sexe: "FEMME",
      telephone: "+222 36 55 44 33",
      adresse: "Sebkha, Nouakchott",
      groupeSanguin: "B-",
      consultations: [],
    },
  ];

  for (const { consultations, ...patient } of patients) {
    await prisma.patient.upsert({
      where: { numeroDossier: patient.numeroDossier },
      update: {},
      create: {
        ...patient,
        consultations: {
          create: consultations,
        },
      },
    });
  }

  const count = await prisma.patient.count();
  console.log(`Seed terminé. ${count} patients dans la base.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

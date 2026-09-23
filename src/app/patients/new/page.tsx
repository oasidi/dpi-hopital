import Link from "next/link";
import { createPatient } from "@/app/actions";

export default function NewPatientPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Retour aux patients
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Nouveau dossier patient
        </h1>
        <p className="text-sm text-slate-500">
          Renseignez les informations administratives du patient.
        </p>
      </div>

      <form
        action={createPatient}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Prénom" name="prenom" required />
          <Field label="Nom" name="nom" required />
          <Field
            label="Numéro de dossier"
            name="numeroDossier"
            placeholder="DPI-2025-0004"
            required
          />
          <Field
            label="Date de naissance"
            name="dateNaissance"
            type="date"
            required
          />
          <div className="space-y-1">
            <label
              htmlFor="sexe"
              className="block text-sm font-medium text-slate-700"
            >
              Sexe <span className="text-red-500">*</span>
            </label>
            <select
              id="sexe"
              name="sexe"
              required
              defaultValue="FEMME"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="FEMME">Femme</option>
              <option value="HOMME">Homme</option>
            </select>
          </div>
          <Field
            label="Groupe sanguin"
            name="groupeSanguin"
            placeholder="O+, A-, …"
          />
          <Field label="Téléphone" name="telephone" placeholder="+222 …" />
          <Field label="Adresse" name="adresse" />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Link
            href="/"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Enregistrer le dossier
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}

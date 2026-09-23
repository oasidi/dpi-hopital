const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

export function formatDateTime(date: Date): string {
  return dateTimeFormatter.format(date);
}

export function computeAge(dateNaissance: Date): number {
  const now = new Date();
  let age = now.getFullYear() - dateNaissance.getFullYear();
  const m = now.getMonth() - dateNaissance.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dateNaissance.getDate())) {
    age--;
  }
  return age;
}

export function initials(prenom: string, nom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

/**
 * Format date to beautiful Portuguese format for events
 * Example: "Sábado, 15 de Junho de 2026 • 15:00"
 */
export function formatEventDate(date: Date | string, includeTime = true): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const dayNames = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const dayName = dayNames[d.getDay()];
  const day = d.getDate();
  const monthName = monthNames[d.getMonth()];
  const year = d.getFullYear();

  let result = `${dayName}, ${day} de ${monthName} de ${year}`;

  if (includeTime) {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    result += ` • ${hours}:${minutes}`;
  }

  return result;
}

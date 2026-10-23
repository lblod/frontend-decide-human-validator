export const NO_MATCH_CONCEPT_ID = 'b8fb6be7-c063-4e87-a3af-4cca5685cdbd';

const MIN_TITLE_FILTER_LENGTH = 4;

// store concepts hold a language string set, the No Match concept a plain string
function labelOf(concept) {
  return `${concept.prefLabel ?? ''}`;
}

function sortGroup(concept) {
  if (concept.id === NO_MATCH_CONCEPT_ID) {
    return 2;
  }
  return concept.notation ? 0 : 1;
}

export function compareConcepts(a, b) {
  const groupDifference = sortGroup(a) - sortGroup(b);
  if (groupDifference !== 0) {
    return groupDifference;
  }
  const keyA = a.notation || labelOf(a);
  const keyB = b.notation || labelOf(b);
  return keyA.localeCompare(keyB, undefined, { numeric: true });
}

export function percentage(part, total) {
  return total > 0 ? Math.round((part / total) * 100) : null;
}

export function buildChartRows(concepts, summaryRows, conceptCounts) {
  return [...concepts].sort(compareConcepts).map((concept) => {
    const counts = conceptCounts.find((row) => row.conceptId === concept.id);
    const countFor = (result) =>
      summaryRows.find(
        (row) => row.conceptId === concept.id && row.result === result,
      )?.count ?? 0;
    return {
      id: concept.id,
      label: concept.notation
        ? `${concept.notation}: ${labelOf(concept)}`
        : labelOf(concept),
      approve: countFor('approve'),
      reject: countFor('reject'),
      labeledDecisions: counts?.labeledDecisions ?? 0,
      reviewedDecisions: counts?.reviewedDecisions ?? 0,
    };
  });
}

export function filterSummaryParts(
  {
    municipalityLabel,
    schemeLabel,
    year,
    title,
    selectedCount,
    conceptCount,
    allConcepts,
  },
  t,
) {
  const parts = [municipalityLabel, schemeLabel, year];
  if (title && title.length >= MIN_TITLE_FILTER_LENGTH) {
    parts.push(t('validation-results-title-contains', { title }));
  }
  parts.push(
    allConcepts
      ? t('validation-results-all-concepts')
      : t('validation-results-n-of-m-concepts', {
          selected: selectedCount,
          total: conceptCount,
        }),
  );
  return parts.filter((part) => !!part);
}

function csvField(value) {
  return `"${`${value ?? ''}`.replaceAll('"', '""')}"`;
}

export function buildCsv(rows, headers) {
  const lines = [
    headers,
    ...rows.map((row) => {
      const votes = row.approve + row.reject;
      return [
        row.label,
        row.labeledDecisions,
        row.reviewedDecisions,
        row.approve,
        row.reject,
        votes,
        percentage(row.approve, votes),
      ];
    }),
  ];
  return (
    '\uFEFF' + lines.map((line) => line.map(csvField).join(';')).join('\r\n')
  );
}

export function csvFileName(filterSummary) {
  const date = new Date();
  const day = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
  const slug = ['validation-results', ...filterSummary, day]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug}.csv`;
}

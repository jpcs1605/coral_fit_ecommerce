/**
 * Netlify Function — proxy para o Google Sheets.
 * O browser só vê /api/sheets; a URL real da planilha fica no servidor.
 * Configure a variável de ambiente SHEETS_ID no painel do Netlify.
 */

export async function handler(event) {
  const sheet   = event.queryStringParameters?.sheet ?? '';
  const sheetsId = process.env.SHEETS_ID;

  if (!sheetsId) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'SHEETS_ID não configurado no servidor' }),
    };
  }

  const url = sheet
    ? `https://docs.google.com/spreadsheets/d/${sheetsId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`
    : `https://docs.google.com/spreadsheets/d/${sheetsId}/gviz/tq?tqx=out:csv`;

  try {
    const upstream = await fetch(url);

    if (!upstream.ok) {
      return {
        statusCode: upstream.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Google Sheets retornou ${upstream.status}` }),
      };
    }

    const csv = await upstream.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
      body: csv,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Falha ao contatar Google Sheets', detail: err.message }),
    };
  }
}

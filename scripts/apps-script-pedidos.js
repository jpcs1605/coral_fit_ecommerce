// ─────────────────────────────────────────────────────────────────────────────
// CORAL FIT — Registro automático de pedidos na planilha
//
// Como usar:
//   1. Abra a planilha > Extensões > Apps Script
//   2. Apague qualquer código existente e cole este arquivo inteiro
//   3. Implantar > Nova implantação
//      - Tipo: App da Web
//      - Executar como: Eu mesmo
//      - Quem tem acesso: Qualquer pessoa (anônimo)
//   4. Clique em Implantar e autorize as permissões
//   5. Copie a URL gerada e cole em src/services/orderService.ts (APPS_SCRIPT_URL)
//
// Estrutura da aba "Pedidos" (linha 1 = cabeçalho):
//   A: Numero de pedido (fórmula automática — NÃO é escrita pelo script)
//   B: Cliente
//   C: Data do pedido
//   D: Pedido
//   E: Entrega
//   F: Pagamento
//   G: Valor
//   H: Status
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var raw = e.parameter && e.parameter.data
      ? e.parameter.data
      : (e.postData ? e.postData.contents : '{}');
    var data = JSON.parse(raw);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Pedidos');

    if (!sheet) {
      return jsonResponse({ success: false, error: 'Aba "Pedidos" não encontrada' });
    }

    // Próxima linha disponível (após o cabeçalho e linhas existentes)
    var nextRow = sheet.getLastRow() + 1;

    // Data/hora no fuso de São Paulo
    var now = new Date();
    var dateStr = Utilities.formatDate(now, 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm');

    // Escreve nas colunas B a H (índices 2 a 8) — coluna A tem fórmula, não tocamos nela
    sheet.getRange(nextRow, 2, 1, 7).setValues([[
      data.cliente   || '',
      dateStr,
      data.pedido    || '',
      data.entrega   || '',
      data.pagamento || '',
      data.valor     || '',
      'Novo',
    ]]);

    return jsonResponse({ success: true, row: nextRow });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// Permite testar a URL no navegador
function doGet(e) {
  return jsonResponse({ status: 'Coral Fit — Apps Script ativo' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

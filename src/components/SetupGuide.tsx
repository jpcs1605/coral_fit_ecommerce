import { useState } from 'react';
import { X, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

export function SetupGuide() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-cyan-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-cyan-700 transition-colors text-sm"
      >
        📊 Configurar Planilha
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2>Guia de Configuração da Planilha</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-blue-900 mb-2">Importante: Tornar a Planilha Pública</h3>
                <p className="text-blue-800 text-sm">
                  Para que o site consiga acessar os dados, você precisa tornar a planilha pública:
                </p>
                <ol className="text-blue-800 text-sm mt-2 space-y-1 list-decimal list-inside">
                  <li>Abra sua planilha no Google Sheets</li>
                  <li>Clique em "Compartilhar" (canto superior direito)</li>
                  <li>Em "Acesso geral", selecione "Qualquer pessoa com o link"</li>
                  <li>Certifique-se de que está como "Leitor"</li>
                  <li>Clique em "Concluído"</li>
                </ol>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 mb-3">Estrutura da Planilha</h3>
            <p className="text-gray-600 text-sm mb-3">
              A planilha deve estar na aba <strong>DATABASE_SITE</strong> e conter as seguintes colunas:
            </p>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-gray-800 text-sm">Colunas Obrigatórias:</h4>
                  <ul className="text-gray-600 text-sm space-y-1 mt-1">
                    <li><strong>ID</strong> - Identificador único (ex: prod-001)</li>
                    <li><strong>NOME</strong> - Nome do produto</li>
                    <li><strong>PREÇO</strong> - Preço (ex: "R$ 89,90" ou "89.90")</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-gray-800 text-sm">Colunas Opcionais:</h4>
                  <ul className="text-gray-600 text-sm space-y-1 mt-1">
                    <li><strong>CATEGORIA</strong> - "fitness" ou "praia"</li>
                    <li><strong>CORES</strong> - Separadas por vírgula (ex: "preto, turquesa, rosa")</li>
                    <li><strong>TAMANHOS</strong> - Separados por vírgula (ex: "P, M, G, GG")</li>
                    <li><strong>DESCRIÇÃO</strong> - Descrição do produto</li>
                    <li><strong>IMAGEM</strong> - URL da imagem (se não informar, usa imagem padrão)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 mb-3">Cores Reconhecidas</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {[
                'preto', 'branco', 'turquesa', 'azul', 'azul royal', 'azul marinho',
                'coral', 'rosa', 'pink', 'vermelho', 'verde', 'verde menta',
                'amarelo', 'laranja', 'roxo', 'lilás', 'cinza', 'bege', 'nude'
              ].map(color => (
                <div key={color} className="bg-gray-100 px-3 py-2 rounded-lg text-gray-700">
                  {color}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 mb-3">Exemplo de Planilha</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-cyan-50">
                  <tr>
                    <th className="border px-2 py-2 text-left">ID</th>
                    <th className="border px-2 py-2 text-left">NOME</th>
                    <th className="border px-2 py-2 text-left">PREÇO</th>
                    <th className="border px-2 py-2 text-left">CATEGORIA</th>
                    <th className="border px-2 py-2 text-left">CORES</th>
                    <th className="border px-2 py-2 text-left">TAMANHOS</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="border px-2 py-2">prod-001</td>
                    <td className="border px-2 py-2">Top Fitness</td>
                    <td className="border px-2 py-2">R$ 89,90</td>
                    <td className="border px-2 py-2">fitness</td>
                    <td className="border px-2 py-2">preto, turquesa</td>
                    <td className="border px-2 py-2">P, M, G, GG</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-2">prod-002</td>
                    <td className="border px-2 py-2">Biquíni Verão</td>
                    <td className="border px-2 py-2">129.90</td>
                    <td className="border px-2 py-2">praia</td>
                    <td className="border px-2 py-2">coral, branco</td>
                    <td className="border px-2 py-2">P, M, G</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="text-green-900 mb-1">Link da Planilha Atual</h4>
                <a
                  href="https://docs.google.com/spreadsheets/d/14IMBUoWENDMxAmuIEf-yu_ACEkCMjnq_T9OHYnrv3L8/edit?gid=217413119#gid=217413119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 text-sm flex items-center gap-2 hover:underline"
                >
                  Abrir planilha no Google Sheets
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
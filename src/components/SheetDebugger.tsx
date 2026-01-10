import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export function SheetDebugger() {
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testFetch = async () => {
    setLoading(true);
    try {
      const SPREADSHEET_ID = '14IMBUoWENDMxAmuIEf-yu_ACEkCMjnq_T9OHYnrv3L8';
      const SHEET_NAME = 'ESTOQUE';
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
      
      const response = await fetch(url);
      const text = await response.text();
      setData(text);
    } catch (error) {
      setData(`Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={testFetch}
        disabled={loading}
        className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title="Debug: Testar conexão com planilha"
      >
        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
      </button>
      
      {data && (
        <div className="absolute bottom-16 right-0 bg-white p-4 rounded-lg shadow-xl max-w-md max-h-96 overflow-auto border">
          <h4 className="mb-2">Dados da Planilha:</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {data.substring(0, 500)}...
          </pre>
        </div>
      )}
    </div>
  );
}

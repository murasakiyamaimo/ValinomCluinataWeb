interface CompilerResponse {
    success: boolean;
    compiledCode?: string;
    log?: string;
    executionResult?: string;
    error?: string;
}

// コンパイルと実行のロジックを関数としてエクスポート
const compile = async (sourceCode: string): Promise<CompilerResponse> => {
    try {
        const response = await fetch('http://api.murasakiyamaimo.net/compile', { // JavaバックエンドのURL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: sourceCode }),
        });

        const data: CompilerResponse = await response.json();

        if (!response.ok) {
            // エラーの場合でも、バックエンドからのレスポンスボディを返す
            return {
                success: false,
                error: `HTTP error! status: ${response.status} - ${data.log || data.error || '不明なエラー'}`,
                log: data.log,
                executionResult: data.executionResult
            };
        }

        return data;
    } catch (err) {
        console.error('Failed to connect or compile:', err);
        return {
            success: false,
            error: `Failed to connect or compile: ${err instanceof Error ? err.message : String(err)}`
        };
    }
};

export default compile;
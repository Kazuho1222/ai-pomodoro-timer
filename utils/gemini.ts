// APIルートを呼び出してリフレッシュ提案を作成
export async function generateRefreshSuggestion(): Promise<string> {
	try {
		// APIを呼び出す
		const response = await fetch("/api/refresh-suggestion");
		if (!response.ok) {
			throw new Error("Failed to fetch refresh suggestion");
		}
		const data = await response.json();
		return data.suggestion;
	} catch (error) {
		console.error(error);
		return "エラーが発生しました";
	}
}

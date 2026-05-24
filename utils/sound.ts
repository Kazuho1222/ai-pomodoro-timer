export async function playNotificationSound() {
	try {
		// Audioオブジェクトを作成
		const audio = new Audio("/notification.mp3");

		// 音量を設定
		audio.volume = 0.3;

		// 音声を再生
		await audio.play();

		// 音声の再生が完了するまで待機
		return new Promise<void>((resolve) => {
			audio.onended = () => {
				resolve();
			};
		});
	} catch (error) {
		console.error("通知音の再生に失敗しました:", error);
	}
}

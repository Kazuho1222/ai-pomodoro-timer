import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function GET() {
	const prompt = `
	# 命令
	作業の合間にできる簡単なリフレッシュ方法を1つ提案してください。
	
	# 制約事項
	- 1〜2分程度でできること
	- 室内でできること
	- 体を動かすこと
	- 絵文字を1つ含めること
	- 簡潔に1文の中に収めること
	- 「〜しよう」のように提案する形で終わること
	
	# 出力例
	- 大きく背伸びしよう🙆
	- 室内で少し歩こう🚶
	`;

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash-lite",
			contents: prompt,
		});
		return NextResponse.json({ suggestion: response.text }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ suggestion: "エラーが発生しました" },
			{ status: 500 },
		);
	}
}

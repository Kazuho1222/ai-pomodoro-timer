import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface RefreshSuggestionProps {
	suggestion: string | null;
	onClose: () => void;
}

export default function RefreshSuggestion({
	suggestion,
	onClose,
}: RefreshSuggestionProps) {
	// 5秒後に自動で閉じる
	useEffect(() => {
		if (suggestion) {
			const timer = setTimeout(() => {
				onClose();
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [suggestion, onClose]);

	return (
		<AnimatePresence>
			{suggestion && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white- p-4 rounded-lg border border-gray-200 "
				>
					<button
						onClick={onClose}
						className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 cursor-pointer"
					>
						<X size={16} />
					</button>
					<p className="text-lg font-medium text-gray-700 pr-6">{suggestion}</p>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

'use client';

/**
 * SuggestedQuestions Component
 * Quick reply chips for common questions
 * Per spec FR-005, FR-005a: 3 suggested questions in green-outline variant
 * 
 * @param {Object} props
 * @param {Array<{id: string, text: string, category: string}>} props.questions - Array of question objects
 * @param {(question: {id: string, text: string, category: string}) => void} props.onSelect - Selection handler
 * @param {string} [props.className] - Optional additional CSS classes
 */
export default function SuggestedQuestions({ questions, onSelect, className = '' }) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 px-4 pb-3 ${className}`}>
      {questions.map((question) => (
        <button
          key={question.id}
          onClick={() => onSelect(question)}
          className="rounded-full border border-emerald-300 px-3 py-1.5 text-sm text-emerald-700 transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          type="button"
          aria-label={`Ask: ${question.text}`}
        >
          {question.text}
        </button>
      ))}
    </div>
  );
}

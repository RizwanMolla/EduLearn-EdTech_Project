import { useState } from 'react';
import { Check, X, RotateCcw, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { getQuiz } from '../../data/quizzes';
import { ProgressRing } from '../ui/Progress';
import Button from '../ui/Button';

const PASS_RATIO = 0.75;

const Quiz = ({ course, onPass, best }) => {
  const questions = getQuiz(course.category);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const revealed = selected !== null;
  const score = answers.filter((a, i) => a === questions[i].answer).length;

  const choose = (i) => {
    if (revealed) return;
    setSelected(i);
    setAnswers((list) => [...list, i]);
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
      return;
    }
    setFinished(true);
    const finalScore = answers.filter((a, i) => a === questions[i].answer).length;
    if (finalScore / questions.length >= PASS_RATIO) onPass?.(finalScore, questions.length);
  };

  const retry = () => {
    setIndex(0);
    setAnswers([]);
    setSelected(null);
    setFinished(false);
  };

  if (finished) {
    const passed = score / questions.length >= PASS_RATIO;
    return (
      <div className="rounded-3xl border border-line bg-card p-8 text-center sm:p-12">
        <ProgressRing value={(score / questions.length) * 100} size={140} stroke={10} barClass={passed ? 'text-success' : 'text-clay'}>
          <span>
            <span className="block font-display text-4xl">
              {score}/{questions.length}
            </span>
            <span className="eyebrow text-ink-3">Score</span>
          </span>
        </ProgressRing>
        <h3 className="mt-6 font-display text-3xl">{passed ? 'Knowledge check passed' : 'Not quite there yet'}</h3>
        <p className="mx-auto mt-2 max-w-md text-ink-2">
          {passed
            ? 'Nicely done. This lesson is now marked complete.'
            : `You need ${Math.ceil(questions.length * PASS_RATIO)} correct answers to pass. Review the explanations and try again.`}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button variant="outline" iconLeft={RotateCcw} onClick={retry}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-card p-6 sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow text-ink-3">
          Question {index + 1} of {questions.length}
        </p>
        {best && <p className="eyebrow text-ink-3">Best score {best.score}/{best.total}</p>}
      </div>
      <div className="mt-4 flex gap-1.5">
        {questions.map((_, i) => (
          <span
            key={i}
            className={clsx(
              'h-1 flex-1 rounded-full transition-colors duration-500',
              i < answers.length ? (answers[i] === questions[i].answer ? 'bg-success' : 'bg-clay') : i === index ? 'bg-ink' : 'bg-ink/10'
            )}
          />
        ))}
      </div>

      <h3 className="mt-8 font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-tight tracking-[-0.02em]">{question.q}</h3>

      <div className="mt-8 grid gap-3" role="radiogroup" aria-label="Answers">
        {question.options.map((option, i) => {
          const isCorrect = i === question.answer;
          const isChosen = i === selected;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isChosen}
              disabled={revealed}
              onClick={() => choose(i)}
              className={clsx(
                'flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 disabled:cursor-default',
                !revealed && 'border-line hover:-translate-y-0.5 hover:border-ink',
                revealed && isCorrect && 'border-success bg-success/10',
                revealed && isChosen && !isCorrect && 'border-clay bg-clay/10',
                revealed && !isCorrect && !isChosen && 'border-line opacity-55'
              )}
            >
              <span
                className={clsx(
                  'grid size-8 shrink-0 place-items-center rounded-full border font-mono text-xs',
                  revealed && isCorrect ? 'border-success bg-success text-paper' : revealed && isChosen ? 'border-clay bg-clay text-coal' : 'border-line-strong'
                )}
              >
                {revealed && isCorrect ? <Check size={14} strokeWidth={3} /> : revealed && isChosen ? <X size={14} strokeWidth={3} /> : String.fromCharCode(65 + i)}
              </span>
              <span className="text-[0.975rem]">{option}</span>
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-6 flex animate-[pop-in_0.5s_cubic-bezier(0.16,1,0.3,1)] flex-col gap-4 rounded-2xl bg-ink/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-ink-2">
            <span className="font-medium text-ink">{selected === question.answer ? 'Correct. ' : 'Not quite. '}</span>
            {question.why}
          </p>
          <Button size="sm" onClick={next} icon={ArrowRight} className="shrink-0">
            {index + 1 < questions.length ? 'Next question' : 'See results'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Quiz;

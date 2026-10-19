"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * "How many hours could AI save you?" — four questions, a rough weekly estimate.
 * Deliberately conservative: it multiplies the time spent on repetitive work by
 * a typical automation rate for that kind of work (capped at 60%).
 */

type Option = { label: string; value: number };
type Question = { id: string; q: string; options: Option[] };

const questions: Question[] = [
  {
    id: "people",
    q: "How many people on your team do repetitive, routine tasks?",
    options: [
      { label: "1–5", value: 3 },
      { label: "6–20", value: 12 },
      { label: "21–50", value: 35 },
      { label: "50+", value: 75 },
    ],
  },
  {
    id: "hours",
    q: "Roughly how many hours a week does each of them spend on that work?",
    options: [
      { label: "Under 5", value: 3 },
      { label: "5–10", value: 7.5 },
      { label: "10–20", value: 15 },
      { label: "20+", value: 25 },
    ],
  },
  {
    id: "kind",
    q: "What is most of that work?",
    options: [
      { label: "Data entry & admin", value: 0.6 },
      { label: "Reports & analysis", value: 0.5 },
      { label: "Customer support", value: 0.45 },
      { label: "Sales & lead follow-up", value: 0.35 },
    ],
  },
  {
    id: "tools",
    q: "How connected are your tools today?",
    options: [
      { label: "Mostly manual & spreadsheets", value: 1 },
      { label: "Some integrations", value: 0.85 },
      { label: "Well integrated already", value: 0.7 },
    ],
  },
];

const fmt = (n: number) => (n >= 100 ? Math.round(n / 10) * 10 : Math.round(n)).toLocaleString("en-US");

export function SavingsQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const step = questions.findIndex((q) => answers[q.id] === undefined);
  const done = step === -1;

  const weekly = done ? answers.people * answers.hours * Math.min(0.6, answers.kind) * answers.tools : 0;
  const low = weekly * 0.8;
  const high = weekly * 1.2;

  return (
    <div className="rounded-3xl border border-line bg-card p-6 md:p-10">
      {!done ? (
        <div key={step}>
          <div className="flex items-center justify-between font-mono text-xs tracking-widest text-muted uppercase">
            <span>
              Question {step + 1} of {questions.length}
            </span>
            {step > 0 && (
              <button
                type="button"
                className="normal-case tracking-normal hover:text-fg"
                onClick={() => {
                  const prev = questions[step - 1].id;
                  setAnswers(({ [prev]: _drop, ...rest }) => {
                    void _drop;
                    return rest;
                  });
                }}
              >
                ← Back
              </button>
            )}
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
            <div className="h-full bg-mold transition-all duration-500" style={{ width: `${(step / questions.length) * 100}%` }} />
          </div>
          <h3 className="mt-8 text-2xl font-semibold tracking-tight md:text-3xl">{questions[step].q}</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {questions[step].options.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => setAnswers((a) => ({ ...a, [questions[step].id]: o.value }))}
                className="rounded-2xl border border-line bg-bg px-5 py-4 text-left transition hover:border-mold"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div aria-live="polite">
          <p className="font-mono text-xs tracking-widest text-muted uppercase">Your estimate</p>
          <p className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
            <span className="word-gradient">
              {fmt(low)}–{fmt(high)}
            </span>{" "}
            <span className="text-2xl text-muted md:text-3xl">hours / week</span>
          </p>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            That’s roughly {fmt(weekly * 4.3)} hours a month — about {Math.max(0.1, weekly / 40).toFixed(1)} full-time people’s worth of
            work your team could spend elsewhere.
          </p>
          <p className="mt-3 text-sm text-muted">
            A rough estimate based on typical automation rates for this kind of work. A free audit gives you a real number.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact?service=ai-automation-agents" className="rounded-full bg-fg px-6 py-3 font-medium text-bg transition hover:opacity-85">
              Book a free automation audit
            </Link>
            <button
              type="button"
              onClick={() => setAnswers({})}
              className="rounded-full border border-line px-6 py-3 font-medium transition hover:border-fg"
            >
              Start again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

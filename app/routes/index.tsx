import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";
import { ChangeEvent, useState, useMemo } from 'react';

import { ANSWERS, QUESTIONS } from '../constants';
import { shuffleArray } from '../utils';

type IndexData = {
  answers: Array<{
    id: string;
    text: string;
  }>;
  questions: Array<{
    answerId: string;
    id: string;
    text: string;
  }>;
};

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = () => {
  let data: IndexData = {
    answers: shuffleArray(ANSWERS),
    questions: QUESTIONS,
  };

  // https://remix.run/api/remix#json
  return json(data);
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!"
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let data = useLoaderData<IndexData>();
  const { answers } = data;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  //JTM issues:
  // - when you have the correct answer, it disappears from the select
  // - need a success state
  // - need to save to local storage
  const options = useMemo(() => {
    const selectedAnswerIds = Object.values(selectedAnswers);
    const remainingAnswers = answers.filter(answer => !selectedAnswerIds.includes(answer.id));
    return remainingAnswers.map(answer => ({ label: answer.text, value: answer.id }));
  }, [answers, selectedAnswers]);

  return (
    <div className="remix__page">
      <main>
        <h2>This is your playlist!</h2>
        <p>It'll update automatically every time you load this page. The game will not - you might not have questions for new songs...sorry!</p>
        <p>Match the song to the reason I put it on the playlist. The reasons range from very deep to just thinking you might like the song.</p>
        <p>I tried to limit the playlist to one song per artist. I also tried to avoid artists/songs you sent me, except when they're extremely relevant. And for the first time this was published I looked through every single one of my liked songs (you're welcome :) ).</p>
        <iframe src="https://open.spotify.com/embed/playlist/7cDko7hlQAiItWT1jUE2eV" width="300" height="380" frameBorder="0" allowTransparency={true} allow="encrypted-media"></iframe>
      </main>
      <section>
        <h2>But why did I pick these songs?</h2>
        <p>There's a reason (some better than others) for why each of these songs was picked! Match the song to the reason. When you select a reason, that reason will disappear from the options.</p>    
        <p>Your answers will be saved, but only in the browser you're currently viewing this site. If you change browsers or devices, or clear your browser's data, you will lose your progress.</p>
        <hr/>
        {data.questions.map(question => (
          <Question key={question.answerId} answer={question.answerId} onChange={e => setSelectedAnswers({ ...selectedAnswers, [question.id]: e.target.value })} options={options} question={question.text} value={selectedAnswers[question.id]} />
        ))}
      </section>
    </div>
  );
}

type Option = {
  label: string;
  value: string;
}

export const Question = ({ answer, onChange, options, question, value }: { answer: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; options: Option[]; question: string; value: string }) => {
  const isInvalid = value && value !== answer;
  const isCorrect = value && value === answer;
  return (
    <div>
      <p>{question}</p>
      {isCorrect ? <div>Correct!</div> : (<select onChange={onChange} placeholder="Select reason">
        <option value="">Select an option</option>
        {options.map((option) => <option value={option.value}>{option.label}</option>)}
      </select>)}
      {isInvalid && <span style={{ color: 'red'}}>WRONG</span> }
    </div>
  )
}

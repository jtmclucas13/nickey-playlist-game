import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";
import { ChangeEvent, useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

import { ANSWERS, QUESTIONS } from "../constants";
import { shuffleArray } from "../utils";

// note: this is not secure whatsoever, it's here just to add hoops to discourage someone trying to pry
const PASSWORD = "kirby";
const LOCAL_STORAGE_KEY = "nickey-playlist-game-answers";

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
    description: "Welcome to remix!",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let data = useLoaderData<IndexData>();
  const { answers } = data;
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [password, setPassword] = useState("");
  const selectedAnswerIds = Object.values(selectedAnswers);

  useEffect(() => {
    const storedAnswers = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedAnswers) {
      return;
    }

    const storedAnswersJson = JSON.parse(storedAnswers);
    setSelectedAnswers(storedAnswersJson);
    setPassword(PASSWORD);
  }, []);

  useEffect(() => {
    if (password !== PASSWORD) {
      return;
    }

    const newLocalStorageAnswers = JSON.stringify(selectedAnswers);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, newLocalStorageAnswers);
  }, [selectedAnswers]);

  return (
    <div className="remix__page">
      <main>
        <h2>This is your playlist!</h2>
        <p>
          It'll update automatically every time you load this page. The game
          will not - you might not have questions for new songs...sorry!
        </p>
        <p>
          Match the song to the reason I put it on the playlist. The reasons
          range from very deep to just thinking you might like the song.
        </p>
        <p style={{ marginBottom: 24 }}>
          I tried to limit the playlist to one song per artist. I also tried to
          avoid artists/songs you sent me, except when they're extremely
          relevant. And for the first time this was published I looked through
          every single one of my liked songs (you're welcome :) ).
        </p>
        <iframe
          src="https://open.spotify.com/embed/playlist/7cDko7hlQAiItWT1jUE2eV"
          width="300"
          height="380"
          frameBorder="0"
          allowTransparency={true}
          allow="encrypted-media"
        ></iframe>
      </main>
      <section>
        <h2>But why did I pick these songs?</h2>
        <p>
          There's a reason (some better than others) for why each of these songs
          was picked! Match the song to the reason. When you select a reason,
          that reason will disappear from the options.
        </p>
        <p>
          Your answers will be saved, but only in the browser you're currently
          viewing this site. If you change browsers or devices, or clear your
          browser's data, you will lose your progress.
        </p>
        <hr />
        {password === PASSWORD ? (
          data.questions.map((question) => {
            const remainingAnswers = answers.filter(
              (answer) =>
                !selectedAnswerIds.includes(answer.id) ||
                answer.id === selectedAnswers[question.id]
            );
            const options = remainingAnswers.map((answer) => ({
              label: answer.text,
              value: answer.id,
            }));

            return (
              <Question
                key={question.answerId}
                correctAnswer={
                  answers.find((answer) => answer.id === question.answerId)!
                }
                onChange={(e) =>
                  setSelectedAnswers({
                    ...selectedAnswers,
                    [question.id]: e.target.value,
                  })
                }
                options={options}
                question={question.text}
                value={selectedAnswers[question.id]}
              />
            );
          })
        ) : (
          <div>
            Enter password to play:
            <div style={{ marginTop: 16 }}>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: 200,
                }}
              >
                Password
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ marginTop: 4 }}
                  type="password"
                  value={password}
                />
              </label>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

type Option = {
  label: string;
  value: string;
};

export const Question = ({
  correctAnswer,
  onChange,
  options,
  question,
  value,
}: {
  correctAnswer: { id: string; text: string };
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  question: string;
  value: string;
}) => {
  const isInvalid = value && value !== correctAnswer.id;
  const isCorrect = value && value === correctAnswer.id;

  return (
    <div
      style={{
        borderBottom: "1px solid white",
        display: "flex",
        flexDirection: "column",
        paddingBottom: 16,
      }}
    >
      <p
        style={{
          alignItems: "center",
          color: isCorrect
            ? "palegreen"
            : isInvalid
            ? "rgb(255, 204, 203)"
            : "unset",
          display: "flex",
          fontWeight: "bold",
        }}
      >
        {isInvalid && <FaTimes style={{ marginRight: 8 }} />}
        {isCorrect && <FaCheck style={{ marginRight: 8 }} />}
        {question}
      </p>
      {isCorrect ? (
        <div>
          <div>{correctAnswer.text}</div>
        </div>
      ) : (
        <select
          onChange={onChange}
          placeholder="Select reason"
          style={{
            backgroundColor: isInvalid ? "rgb(255, 204, 203)" : "white",
            marginBottom: 8,
            padding: 8,
          }}
          value={value}
        >
          <option style={{ backgroundColor: "white" }} value="">
            Select an option
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              style={{ backgroundColor: "white" }}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      )}
      {isInvalid && (
        <span style={{ color: "rgb(255, 204, 203)" }}>Try again!</span>
      )}
    </div>
  );
};

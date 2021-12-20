import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";
import { ChangeEvent, useState, useMemo } from 'react';

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
    answers: [
      { id: 'song-first-met', text: "I'm pretty sure this band's biggest song was on the radio when I first met you." },
      { id: 'when-screaming', text: '"When will they start screaming?"' },
      { id: 'starry-night', text: 'It reminds me of the first night you stayed with me after seeing my show and we looked at the night sky.' },
      { id: 'nickey-good-fit', text: 'You showed me this song, and it fit perfectly.' },
      { id: 'derek-pregnancy', text: 'Absolutely not how Derek felt during the pregnancy, but an idealized version of that.' },
      { id: 'sub-radio', text: 'I knew immediately that you\'d like this band, and when I showed them to you, I was right!' },
      { id: 'mt-joy-reminder', text: 'This singer reminded me of Mt. Joy a little.' },
      { id: 'lil-nas-x', text: 'You told me you didn\'t know who this artist was, and I was floored.' },
      { id: 'cover-like', text: 'This is my kind of cover of an artist you really love, and I think you\'ll like it too.' },
      { id: 'songs-align-1', text: 'You can sing a different song over top of this one and it lines up perfectly, like what we did with Fall For You.' },
      { id: 'songs-align-2', text: 'I think we\'ve both heard this song about 500 times, thanks to exactly one weekend.' },
      { id: 'cover-dislike', text: 'This is my kind of cover of an artist you really love, and I don\'t think you\'ll like it.'  },
      { id: 'greys-makeshift', text: 'This sounds like a Grey\'s Anatomy song, but I don\'t think that it is.' },
      { id: 'somewhat-like-us', text: "This one isn't fully accurate to our story, but it reminds me a little of our tumultuous early days a bit." },
      { id: 'you-freak', text: "Well...this one's cause you're a freak." },
      { id: 'blend-our-tastes', text: "This one's the blend of our music tastes." },
      { id: 'want-you-to-like-1', text: "I just desperately want you to like this artist and I don't think you've ever told me if you listened before." },
      { id: 'piano-learn', text: "I think you may have told me to learn this song on piano?" },
      { id: 'me-to-you', text: "The title is what I am to you ;)" },
      { id: 'like-your-music', text: "This sounds like your type of music, but we haven't ever talked about them before." },
      { id: 'describes-you', text: "Obviously, this one describes you. Heheh." },
      { id: 'want-you-to-like-2', text: "I just think you'd like this song." },
      { id: 'favorites', text: 'This is my favorite song from one of your favorite bands.' },
      { id: 'you-are-she', text: 'I think you\'re the "she" in this song.' },
      { id: 'greys-for-real', text: "This is a Grey's song that just fuckin' kills me." },
      { id: 'my-favorite-of-yours', text: 'I know you have a very special relationship with this band, but this is my favorite song of theirs these days.' },
      { id: 'instagram-1', text: 'I think you took an Instagram video of us singing this on the way to the train station.' },
      { id: 'saw-it-first', text: "One of our few mutually liked artists that I've seen and you haven't." },
      { id: 'camino-mistake-1', text: 'This is a band I get mixed up with CAMINO on occasion, but they sound nothing alike.' },
      { id: 'dennys-late', text: 'Remember when we went to Denny\'s real late that one time?' },
      { id: 'favorites-we-missed', text: 'One of your favorite bands, pity we couldn\'t see them together in PA.' },
      { id: 'dating-motto', text: 'Could be your motto now that you\'re dating again' },
      { id: 'complete-the-title-1', text: '[title goes here]...because I do!' },
      { id: 'memorized', text: 'You memorized this one!' },
      { id: 'mutual-discovery-1', text: 'We discovered this song, years apart, and only found out recently' },
      { id: 'want-you-to-like-3', text: 'It\'s just so groovy, you gotta like it!' },
      { id: 'astrology-1', text: 'You always use this as an excuse for everything, and I roll my eyes at it.' },
      { id: 'arrest', text: 'This is a reference to how being with you is the closest I\'ve been to being arrested.' },
      { id: 'cover-maybe', text: 'This is my kind of cover of an artist you really love, and you might like it? Unsure.' },
      { id: 'cover-hate', text: 'This is my kind of cover of an artist you really love - I\'ve played it for you before and you do NOT like it.'  },
      { id: 'want-you-to-like-4', text: 'Maybe it\'s like you and your exes, but I really want you to like this band.' },
      { id: 'camino-mistake-2', text: 'I thought this band was CAMINO for so long...' },
      { id: 'your-name', text: 'I mean...this one is the most obvious of them all.' },
      { id: 'our-friendship', text: 'I can imagine scream-singing the chorus with you as an affirmation of our friendship.' },
      { id: 'move-to-portland', text: 'To me, the chorus is your decision to move to Portland.' }
    ],
    questions: [
      { answerId: 'song-first-met', id: 'script-1', text: 'For the First Time - The Script' },
      { answerId: 'when-screaming', id: 'volumes-1', text: 'Bend - Volumes' },
      { answerId: 'starry-night', id: 'capstan-1', text: 'Sway - Capstan (feat. Charlene Joan)' },
      { answerId: 'nickey-good-fit',id: 'colony-1',  text: 'Lights On - Colony House' },
      { answerId: 'derek-pregnancy', id: 'microwave-1', text: 'Something Right - Microwave' },
      { answerId: 'sub-radio',id: 'sub-radio-1',  text: 'What Are We - Sub-Radio' },
      { answerId: 'mt-joy-reminder', id: 'sleep-token-1', text: 'Missing Limbs - Sleep Token' },
      { answerId: 'lil-nas-x', id: 'nas-x-1', text: 'THATS WHAT I WANT - Lil Nas X' },
      { answerId: 'cover-like', id: 'jxdn-1', text: 'drivers license - jxdn' },
      { answerId: 'songs-align-1', id: 'mgk-1', text: 'love race - Machine Gun Kelly (feat. Kellin Quinn)' },
      { answerId: 'songs-align-2', id: 'secondhand-1', text: 'Fall For You - Secondhand Serenade' },
      { answerId: 'cover-dislike', id: 'prevail-1', text: 'Blank Space - I Prevail' },
      { answerId: 'greys-makeshift', id: 'gonzales-1', text: 'Heartbeats (Live) - José Gonzáles, The String Theory' },
      { answerId: 'somewhat-like-us',id: 'sawayama-1',  text: 'Bad Friend - Rina Sawayama' },
      { answerId: 'you-freak', id: 'sordid-1',text: 'Freak - Sordid Pink' },
      { answerId: 'blend-our-tastes',id: 'all-time-low-1', text: 'Monsters - All Time Low (feat. Demi Lovato & blackbear)' },
      { answerId: 'want-you-to-like', id: 'bridgers-1', text: 'Chinese Satellite (Copycat Killer version) - Phoebe Bridgers, Rob Moose' },
      { answerId: 'piano-learn', id: 'ceres-1', text: 'A Thousand Miles (Live) - Ceres' },
      { answerId: 'me-to-you',id: 'in-crowd-1', text: 'The Best Thing (That Never Happened) - We Are The In Crowd' },
      { answerId: 'like-your-music', id: 'maine-1' ,text: 'Bad Behavior - The Maine' },
      { answerId: 'describes-you', id: 'ava-max-1',text: 'Sweet But Psycho - Ava Max' },
      { answerId: 'want-you-to-like-2', id: 'big-wild-1',text: "6's to 9's - Big Wild (feat. Rationale)" },
      { answerId: 'favorites',id: 'camino-1', text: 'Daphne Blue - The Band CAMINO' },
      { answerId: 'you-are-she', id: 'lovely-1',text: 'broken - lovelytheband' },
      { answerId: 'greys-for-real', id: 'rice-1',text: '9 Crimes - Damien Rice' },
      { answerId: 'my-favorite-of-yours',id: 'goo-1', text: 'Broadway - The Goo Goo Dolls' },
      { answerId: 'instagram-1', id: 'metro-1',text: 'Shake It - Metro Station' },
      { answerId: 'dennys-late', id: 'atlantic-1',text: 'Coffee at Midnight - Stand Atlantic' },
      { answerId: 'dating-motto', id: 'clarkson-1',text: 'I Do Not Hook Up - Kelly Clarkson' },
      { answerId: 'complete-the-title-1', id: 'october-1',text: 'I Hope You\'re Happy - Blue October' },
      { answerId: 'mutual-discovery-1', id: 'walk-the-moon-1',text: 'Anna Sun - WALK THE MOON' },
      { answerId: 'want-you-to-like-3', id: 'heavy-eyes-1',text: 'Bad - Heavy Eyes' },
      { answerId: 'astrology-1', id: 'young-guns-1', text: 'Mercury In Retrograde - Young Guns' },
      { answerId: 'arrest', id: 'lost-year-1',text: 'Cop Car - Another Lost Year' },
      { answerId: 'cover-hate', id: 'dccm-1',text: 'Bad Blood - DCCM' },
      { answerId: 'saw-it-first', id: 'bleachers-1',text: 'I Wanna Get Better - Bleachers' },
      { answerId: 'camino-mistake-1', id: 'cab-1',text: 'One of THOSE Nights - The Cab' },
      { answerId: 'memorized', id: 'jay-sean-1',text: 'Down - Jay Sean, Lil Wayne' },
      { answerId: 'want-you-to-like-4', id: '1975-1',text: 'Somebody Else - The 1975' },
      { answerId: 'camino-mistake-2', id: 'bad-suns-1',text: 'How Am I Not Myself - Bad Suns' },
      { answerId: 'your-name', id: 'sickest-1',text: 'Nikki - Forever the Sickest Kids' },
      { answerId: 'our-friendship', id: 'future-islands-1',text: 'For Sure - Future Islands' },
      { answerId: 'cover-maybe', id: 'fltl-1',text: 'Closer - From Lambs To Lions' },
      { answerId: 'move-to-portland', id: 'senses-fail-1',text: 'Headed West - Senses Fail' },
      { answerId: 'favorites-we-missed', id: 'fray-1',text: 'You Found Me - The Fray'}
    ]
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
  return (
    <div>
      <p>{question}</p>
      <select  onChange={onChange} placeholder="Select reason">
        <option value="">Select an option</option>
        {options.map((option) => <option value={option.value}>{option.label}</option>)}
      </select>
      {isInvalid && <span style={{ color: 'red'}}>WRONG</span> }
    </div>
  )
}

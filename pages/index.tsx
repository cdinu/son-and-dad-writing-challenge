import React from 'react';
import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';
import Head from 'next/head';

import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';

type Author = 'Tudor' | 'Cristian';

interface PostsOfThe {
  [day: number]: {
    [author in Author]: string;
  };
}

interface Challenges {
  [day: number]: string;
}

interface ScoresOfThe {
  [day: number]: number;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const postsDirectory = path.join(process.cwd(), '_posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map(filename => {
    if (!filename.endsWith('.md')) return null;

    const filePath = path.join(postsDirectory, filename)
    const { data, content } = matter.read(filePath);
    if (!data || !data.day) return null;

    return {
      data,
      content,
    }
  }).filter(isNotNull => isNotNull);

  const postsOfThe = {};
  const scoresOfThe = {};
  const challenges = {};

  posts.forEach(({ data, content}) => {
    const { day, author, challenge, points } = data;
    if (!day || !author) return;

    postsOfThe[day] = postsOfThe[day] || {};
    postsOfThe[day][author] = content

    scoresOfThe[day] = scoresOfThe[day] || {};
    scoresOfThe[day][author] = parseInt(points)
    
    challenges[day] = challenges[day] || challenge;
  })

  return {
    props: {
      postsOfThe,
      challenges,
      scoresOfThe,
    },
  };
}

interface IndexProps {
  postsOfThe: PostsOfThe;
  challenges: Challenges;
  scoresOfThe: ScoresOfThe;
}

const Index: React.FC<IndexProps> = (props) => {
  const { postsOfThe, scoresOfThe, challenges } = props;
  let currentTudor = 0;
  let currentCristian = 0;

  return (
    <div className="section">
      <Head>
        <title>💪 Writing Challenge</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1 className="title is-1">Writing Challenge!</h1> 
      <div>
        {Object.keys(postsOfThe)
          .sort()
          .map(day => (
            <div key={day} style={{ marginBottom: '2em'}}>
              <h2 className="subtitle">
                Day {day} (
                  {
                    scoresOfThe[day].Tudor ? 1 + (currentTudor++) : currentTudor
                  }
                  -
                  {
                    scoresOfThe[day].Cristian ? 1 + (currentCristian++) : currentCristian
                  }
                )
              </h2>
              <div className="title is-5">Challenge: {challenges[day]}</div>
              <div className="columns">
                <div className={scoresOfThe[day].Tudor ? 'column has-background-black-bis': 'column has-background-black-ter'}>
                  <div className="level">
                    <div className="is-size-4	 level-item level-left">Tudor</div>
                    <div className="level-item">{scoresOfThe[day].Tudor ? '+1 ⭐️': null}</div>
                  </div>
                  <ReactMarkdown source={postsOfThe[day].Tudor} />
                </div>
                <div className={scoresOfThe[day].Cristian ? 'column has-background-black-bis': 'column has-background-black-ter'}>
                  <div className="level">
                    <div className="is-size-4	 level-item level-left">Cristian</div>
                    <div className="level-item">{scoresOfThe[day].Cristian ? '+1 ⭐️': null}</div>
                  </div>
                  <ReactMarkdown source={postsOfThe[day].Cristian} /> 
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Index;
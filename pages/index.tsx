import React from 'react';
import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';

import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';

type Author = 'Tudor' | 'Cristian';

interface PostsOfTheDays {
  [day: number]: {
    [author in Author]: string;
  };
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

  const postsOfTheDays = {};
  posts.forEach(({ data, content}) => {
    const { day, author } = data;
    if (!day || !author) return;

    postsOfTheDays[day] = postsOfTheDays[day] || {};
    postsOfTheDays[day][author] = content
    postsOfTheDays[day].challenge = content
  })

  return {
    props: {
      postsOfTheDays
    },
  };
}

const Index: React.FC<{postsOfTheDays: PostsOfTheDays}> = (props) => {
  const { postsOfTheDays } = props;

  return (
    <>
      <h1 className="title is-1">Writing Challenge!</h1> 
      <div>
        {Object.keys(postsOfTheDays)
          .sort()
          .map(day => (
            <div key={day} style={{ marginBottom: '2em'}}>
              <h2 className="subtitle">Day: {day}</h2>
              <div className="columns">
                <div className="column has-background-white-ter">
                  <span className="title is-6">Tudor:</span>
                  <ReactMarkdown source={postsOfTheDays[day].Tudor} />
                </div>
                <div className="column has-background-white-ter">
                <span className="title is-6">Cristian:</span>
                  <ReactMarkdown source={postsOfTheDays[day].Cristian} /> 
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
}

export default Index;
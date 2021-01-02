import React, { useState, useEffect } from 'react';
import { GET_CLASSES, HIGHLIGHT_CLASSES } from '../constants';

const App = () => {
  const [classes, setClasses] = useState([]);

  const getMostUsedClasses = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: GET_CLASSES }, classNames => {
        const counts = {};

        classNames.forEach(className => {
          counts[className] = counts[className] ? counts[className] + 1 : 1;
        });

        setClasses(
          Object.keys(counts)
            .map(key => ({
              name: key,
              count: counts[key],
              active: false,
            }))
            .sort((a, b) => (a.count < b.count ? 1 : -1))
        );
      });
    });
  };

  const setActive = name => {
    setClasses(classes =>
      classes.map(classe => ({
        ...classe,
        active: classe.name === name ? !classe.active : classe.active,
      }))
    );
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: HIGHLIGHT_CLASSES, classes });
    });
  }, [classes]);

  return (
    <>
      <ul>
        {classes.map(({ name, count, active }, index) => (
          <li
            key={index}
            onClick={() => setActive(name)}
            className={`${active ? 'active' : ''}`}
          >
            <strong>{name}</strong>
            <span>{count}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => getMostUsedClasses()}>Get most used classes</button>
    </>
  );
};

export default App;

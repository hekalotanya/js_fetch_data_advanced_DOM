'use strict';

// write code here
const url = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';

const getPhones = () => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(phones => {
        resolve(phones);
      });

    setTimeout(() => {
      reject();
    }, 5000);
  });
};

const getFirstReceivedDetails = (list) => {
  return Promise.race(list.map(id =>
    fetch(`https://mate-academy.github.io/phone-catalogue-static/api/phones/${id}.json`)
      .then(result => result.json())
  ));
};

const getThreeFastestDetails = (list) => {
  return Promise.race(list.map(id =>
    fetch(`https://mate-academy.github.io/phone-catalogue-static/api/phones/${id}.json`)
      .then(result => result.json())
  ));
};

const getAllSuccessfulDetails = (list) => {
  return Promise.allSettled(list.map(id =>
    fetch(`https://mate-academy.github.io/phone-catalogue-static/api/phones/${id}.json`)
      .then(result => result.json())
  ));
};

getPhones()
  .then(data => {
    getFirstReceivedDetails(data.map(element => element.id))
      .then(result => {
        makeMessage('first-received', 'First Received', result.name);
      });

    getAllSuccessfulDetails(data.map(element => element.id))
      .then(result => {
        makeMessage('all-successful', 'All Successful', result.map(element => element.name));
      });

    const resultArray = [];

    getThreeFastestDetails(data.map(element => element.id))
      .then(result1 => {
        resultArray.push(result1);
      });

    getThreeFastestDetails(data.map(element => element.id))
      .then(result2 => {
        resultArray.push(result2);
      });

    getThreeFastestDetails(data.map(element => element.id))
      .then(result3 => {
        resultArray.push(result3);
        makeMessage('three-received', 'First 3 responses', resultArray.map(element => element.name));
      });
  });

const makeMessage = (classMessage, messageResult, result) => {
  const message = document.createElement('div');
  const head = document.createElement('h3');
  const list = document.createElement('ul');

  message.classList.add(`${classMessage}`);
  head.textContent = `${messageResult}`;
  message.append(head, list);
  document.querySelector('body').append(message);

  if (result instanceof Array) {
    result.forEach(element => {
      const listItem = document.createElement('li');

      listItem.textContent = element;
      list.append(listItem);
    });
  } else {
    const listItem = document.createElement('li');

    listItem.textContent = result;
    list.append(listItem);
  }
};

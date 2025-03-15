const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const requestIp = require('request-ip');
const useragent = require('express-useragent');

app.set('json spaces', 2);
app.use(bodyParser.json());
app.use(requestIp.mw());
app.use(useragent.express());

let teachPhrases = {};
let replyPhrases = {};

const teachJsonFilePath = path.join(__dirname, 'rana/Teach.json');
const replyJsonFilePath = path.join(__dirname, 'rana/Reply.json');

function loadTeachPhrases() {
  try {
    const data = fs.readFileSync(teachJsonFilePath, 'utf8');
    teachPhrases = JSON.parse(data);
    console.log('\x1b[34m', 'Loaded teach phrases from Teach.json');
  } catch (error) {
    console.log('\x1b[31m', 'Error loading teach phrases:', error.message);
  }
}

function loadReplyPhrases() {
  try {
    const data = fs.readFileSync(replyJsonFilePath, 'utf8');
    replyPhrases = JSON.parse(data);
    console.log('\x1b[34m', 'Loaded reply phrases from Reply.json');
  } catch (error) {
    console.log('\x1b[31m', 'Error loading reply phrases:', error.message);
  }
}

function saveTeachPhrases() {
  fs.writeFile(teachJsonFilePath, JSON.stringify(teachPhrases, null, 2), 'utf8', (err) => {
    if (err) {
      console.log('\x1b[31m', 'Error saving teach phrases to Teach.json');
    } else {
      console.log('\x1b[34m', 'Saved teach phrases to Teach.json');
    }
  });
}

function saveReplyPhrases() {
  fs.writeFile(replyJsonFilePath, JSON.stringify(replyPhrases, null, 2), 'utf8', (err) => {
    if (err) {
      console.log('\x1b[31m', 'Error saving reply phrases to Reply.json');
    } else {
      console.log('\x1b[32m', 'Saved reply phrases to Reply.json');
    }
  });
}

app.get('/sim', (req, res) => {
  const teachQuery = req.query.teach;
  const replyQuery = req.query.reply;
  const ansQuery = req.query.ans;
  const userLang = req.query.lang;

  const clientIp = req.clientIp;
  const userAgentInfo = req.useragent.source;

  loadTeachPhrases();
  loadReplyPhrases();

  if (teachQuery) {
    teachPhrases[teachQuery] = ansQuery || 'Default response for ' + teachQuery;
    saveTeachPhrases();
    const teachingResponse = {
      author: 'Mohammad Rana',
      message: 'Successful Teaching server',
    };

    console.log('\x1b[33m', '┌──────────────── •✧ • ────────────────┐');
    console.log('\x1b[34m', '\n  ____      _    _   _    _    ____  ');
    console.log('\x1b[35m', ' |  _ \\    / \\  | | | |  / \\  |  _ \\ ');
    console.log('\x1b[36m', ' | |_) |  / _ \\ | |_| | / _ \\ | | | |');
    console.log('\x1b[37m', ' |  _ <  / ___ \\|  _  |/ ___ \\| |_| |');
    console.log('\x1b[38m', ' |_| \\_\\/_/   \\_\\_| |_/_/   \\_\\____/');
    console.log('\x1b[34m', '\n   Author: Mohammad Rana');
    console.log('\x1b[37m', `   Message: ${teachingResponse.message}`);
    console.log('\x1b[34m', `   IP Address: ${clientIp}`);
    console.log('\x1b[33m', `   User Agent: ${userAgentInfo}`);
    console.log('\x1b[33m', '└──────────────── •✧ • ────────────────┘');

    res.json(teachingResponse);
  } else if (replyQuery) {
    let response = replyPhrases[replyQuery];
    if (!response) {
      response = teachPhrases[replyQuery];
    }

    if (response) {
      const responseObj = {
        author: 'Mohammad Rana',
        message: response,
      };

      console.log('\x1b[36m', '┌──────────────── •✧ • ────────────────┐');
      console.log('\x1b[32m', '\n  ____      _    _   _    _    ____  ');
      console.log('\x1b[33m', ' |  _ \\    / \\  | | | |  / \\  |  _ \\ ');
      console.log('\x1b[34m', ' | |_) |  / _ \\ | |_| | / _ \\ | | | |');
      console.log('\x1b[35m', ' |  _ <  / ___ \\|  _  |/ ___ \\| |_| |');
      console.log('\x1b[36m', ' |_| \\_\\/_/   \\_\\_| |_/_/   \\_\\____/');
      console.log('\x1b[34m', '\n   Author: Mohammad Rana');
      console.log('\x1b[38m', `   Message: ${responseObj.message}`);
      console.log('\x1b[36m', `   IP Address: ${clientIp}`);
      console.log('\x1b[34m', `   User Agent: ${userAgentInfo}`);
      console.log('\x1b[36m', '\n└──────────────── •✧ • ────────────────┘');
      res.json(responseObj);
    } else {
      const notFoundResponse = {
        author: 'Mohammad Rana',
        message: '_তুমি উলটা পালটা কথা বললে আমি জবাব দিবো কি জানু-!!😤',
      };
      res.json(notFoundResponse);

      console.log('\x1b[36m', '┌──────────────── •✧ • ────────────────┐');
      console.log('\x1b[33m', '\n  ____      _    _   _    _    ____  ');
      console.log('\x1b[34m', ' |  _ \\    / \\  | | | |  / \\  |  _ \\ ');
      console.log('\x1b[35m', ' | |_) |  / _ \\ | |_| | / _ \\ | | | |');
      console.log('\x1b[36m', ' |  _ <  / ___ \\|  _  |/ ___ \\| |_| |');
      console.log('\x1b[32m', ' |_| \\_\\/_/   \\_\\_| |_/_/   \\_\\____/');
      console.log('\x1b[31m', '\n   Author: Mohammad Rana'); console.log('\x1b[31m', `   Message: ${notFoundResponse.message}`);
            console.log('\x1b[34m', `   IP Address: ${clientIp}`);
            console.log('\x1b[36m', `   User Agent: ${userAgentInfo}`);
            console.log('\x1b[38m', '└──────────────── •✧ • ────────────────┘');
          }
        } else {
          if (userLang) {
            // Handle userLang if needed
          }
          const invalidParamsResponse = {
            error: 'Invalid query parameters. You can use "teach" to teach and "reply" to get a response.',
          };

          console.log('\x1b[35m', '┌──────────────── •✧ • ────────────────┐');
          console.log('\x1b[36m', '\n  ____      _    _   _    _    ____  ');
          console.log('\x1b[37m', ' |  _ \\    / \\  | | | |  / \\  |  _ \\ ');
          console.log('\x1b[38m', ' | |_) |  / _ \\ | |_| | / _ \\ | | | |');
          console.log('\x1b[33m', ' |  _ <  / ___ \\|  _  |/ ___ \\| |_| |');
          console.log('\x1b[33m', ' |_| \\_\\/_/   \\_\\_| |_/_/   \\_\\____/');
          console.log('\x1b[34m', '\n     Author: Mohammad Rana');
          console.log('\x1b[37m', `   Message: ${invalidParamsResponse.error}`);
          console.log('\x1b[34m', `   IP Address: ${clientIp}`);
          console.log('\x1b[36m', `   User Agent: ${userAgentInfo}`);
          console.log('\x1b[35m', '└──────────────── •✧ • ────────────────┘');

          res.status(400).json(invalidParamsResponse);
        }
      });

      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log('\x1b[32m', ' \x1b[31mRana \x1b[32m \x1b[33mServer \x1b[32m \x1b[36mStart\x1b[32m \x1b[34mSuccessful\n',
          '┌──────────────── •✧ • ────────────────┐');
        console.log('\x1b[35m', '\n  ____      _    _   _    _    ____  ');
        console.log('\x1b[36m', ' |  _ \\    / \\  | | | |  / \\  |  _ \\ ');
        console.log('\x1b[34m', ' | |_) |  / _ \\ | |_| | / _ \\ | | | |');
        console.log('\x1b[37m', ' |  _ <  / ___ \\|  _  |/ ___ \\| |_| |');
        console.log('\x1b[31m', ' |_| \\_\\/_/   \\_\\_| |_/_/   \\_\\____/');
        console.log('\x1b[32m', '\n└──────────────── •✧ • ────────────────┘\n');
        console.log('\x1b[35m', `   Server is running on port ${port}`);
      });

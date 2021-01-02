const groupMessages = (messages) => {
  if (!messages) return null;
  let results = [];
  let currentGroup = {
    messages: [],
    username: ''
  };
  let last = messages[0];
  for (let i = 0; i <= messages.length - 1; i++) {
    let current = messages[i];
    if (messages[i].type === 'message') {
      if (messages[i].username === last.username) {
        currentGroup.messages.push(messages[i]);
      } else {
        currentGroup.username = last.username;
        currentGroup.type = 'message';
        results.push(currentGroup);
        currentGroup = {
          messages: [messages[i]],
          username: messages[i].username
        }
      }
      last = messages[i];
      if (i === messages.length - 1 && currentGroup.messages.length > 0) {
        currentGroup.type = 'message';
        currentGroup.username = last.username;
        results.push(currentGroup);
      }

    } else {
      if (current.meta) {
        current.type = 'flight'
      }
      // current.isFlight = true;
      results.push(current);
    }
  }
  return results;
}
export default groupMessages;
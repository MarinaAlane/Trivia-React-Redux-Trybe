export const apiTrivia = async () => {
  const response = await fetch('https://opentdb.com/api_token.php?command=request');
  const json = await response.json();
  const { token } = json;
  return token;
};

export const getQuestions = async () => {
  const token = await apiTrivia();
  const response = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
  const json = await response.json();
  return json.results;
};

export default apiTrivia;

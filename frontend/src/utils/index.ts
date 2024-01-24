export const setParam = (paramList: string[][]) => {
  let params = "";
  for (let i = 0; i < paramList.length; i++) {
    if (paramList[i][1] === "") continue;
    params += `${i === 0 ? "?" : "&"}${paramList[i][0]}=${paramList[i][1]}`;
  }
  return params;
};

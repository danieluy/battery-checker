const fs = window.require('fs');
const path = window.require('path');
const os = window.require('os');
import storage from './storage';

const LOCAL_PATH = path.resolve(os.homedir(), '.battery-checker/stats/');
const FILE_PATH = `${LOCAL_PATH}/${Date.now()}.json`;

// Init folder structure
const localConfig = storage.getLocal('LOCAL_CONFIG') || {};
if (!localConfig.initFolderStructure)
  try {
    fs.mkdirSync(path.resolve(os.homedir(), '.battery-checker'));
    fs.mkdirSync(path.resolve(os.homedir(), '.battery-checker/stats'));
    storage.updateLocal('LOCAL_CONFIG', { initFolderStructure: true, localPath: LOCAL_PATH });
  }
  catch (error) {
    console.error(error);
  }

export const initSessionFile = () => {
  fs.writeFileSync(FILE_PATH, '[]');
};

export const saveToFile = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data));
};


const parseFile = ({ path, file }) => new Promise((resolve, reject) => {
  fs.readFile(path, 'UTF-8', (err, data) => {
    if (err)
      return reject(err);
    resolve({
      data: safeParse(data),
      date: new Date(parseInt(file.slice(0, -5)))
    });
  });
});

export const getStats = () => new Promise((resolve, reject) => {
  const { localPath } = storage.getLocal('LOCAL_CONFIG');
  fs.readdir(localPath, (err, files) => {
    if (err)
      return reject(err);
    Promise.all(files.map(file => parseFile({ file, path: path.resolve(localPath, file) })))
      .then(allFiles => resolve(allFiles.filter(file => !!file.data)))
      .catch(parseErr => reject(parseErr));
  });
});

export default {
  initSessionFile,
  saveToFile,
  getStats
};

function safeParse(data) {
  try {
    return JSON.parse(data);
  }
  catch (error) {
    return null;
  }
}

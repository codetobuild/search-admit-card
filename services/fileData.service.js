const fileDataList = require("../data/fileDriveData.json");
// const fileDataList = JSON.parse(fileDataListJson);

function getFileIdByRollno(rollNo) {
  if (!Array.isArray(fileDataList)) {
    return null;
  }
  return fileDataList.find(
    (fileData) => fileData.fileNumber === String(rollNo)
  );
}

module.exports = { getFileIdByRollno };

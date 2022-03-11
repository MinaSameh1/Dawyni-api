// See https://stackoverflow.com/questions/6059246/how-to-include-route-handlers-in-multiple-files-in-express
import fs from 'fs'

// Get files that have `router` in their name
export const getFilesWithKeyword = (
  keyword: string,
  folderName: string,
  files_?: Array<string>
) => {
  files_ = typeof files_ === 'undefined' ? [] : files_
  const files = fs.readdirSync(folderName)
  for (const i in files) {
    const name = folderName + '/' + files[i]
    if (fs.statSync(name).isDirectory()) {
      getFilesWithKeyword(keyword, name, files_)
    } else {
      name.includes(keyword) && files_.push(name)
    }
  }
  return files_
}

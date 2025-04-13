import { rimraf } from 'rimraf';
import fs from 'fs';


const foldersToDelete = [
  '.next',
];

for (const folder of foldersToDelete) {
  try {
    if (fs.existsSync(folder)) {
      await rimraf(folder);
      console.log(`✅ Folder "${folder}" deleted.`);
    }
    else {
      console.log(`❌ Folder "${folder}" is missing, nothing to delete.`);
    }
  }
  catch (err) {
    console.error(`💥 Unexpected error deleting the "${folder}" folder :`, err);
  }
}

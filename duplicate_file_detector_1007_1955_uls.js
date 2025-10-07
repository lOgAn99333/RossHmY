// 代码生成时间: 2025-10-07 19:55:35
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DuplicateFileDetector = Backbone.Model.extend({

  // Constructor
  constructor: function() {
    Backbone.Model.apply(this, arguments);
    this.hashMap = {};
    this.duplicateFiles = [];
  },

  // Method to scan a directory for duplicate files
  scanDirectory: function(directoryPath) {
    try {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          throw new Error('Error reading directory: ' + err.message);
        }

        files.forEach((file) => {
          this.processFile(path.join(directoryPath, file));
        });
      });
    } catch (error) {
      console.error('Error scanning directory:', error.message);
      this.trigger('error', error.message);
    }
  },

  // Method to process each file
  processFile: function(filePath) {   
    const file = fs.createReadStream(filePath);
    const hash = crypto.createHash('sha256');

    file.on('data', (chunk) => {
      hash.update(chunk);
    });

    file.on('end', () => {
      const fileHash = hash.digest('hex');
      this.checkDuplicate(fileHash, filePath);
    });
  },

  // Method to check if the file is duplicate
  checkDuplicate: function(fileHash, filePath) {
    if (this.hashMap[fileHash]) {
      this.duplicateFiles.push({
        'hash': fileHash,
        'files': [...new Set([...this.hashMap[fileHash], filePath])]
      });
    } else {
      this.hashMap[fileHash] = [filePath];
    }
  },

  // Method to get duplicates
  getDuplicates: function() {
    return this.duplicateFiles;
  }

});


// Usage example
const detector = new DuplicateFileDetector();

detector.on('error', (message) => {
  console.error(message);
});

detector.scanDirectory('./path/to/directory');

// Get duplicates once scanning is complete
setTimeout(() => {
  const duplicates = detector.getDuplicates();
  console.log('Duplicates found:', duplicates);
}, 5000);
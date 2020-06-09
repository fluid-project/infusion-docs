module.exports = {
  permalink: (data) => {
    return data.page.filePathStem + '.html';
  },
  // Helper function to build a URL for "Edit on GitHub" for the current document
  githubLocation: (data) => {
    // The documentation root on GitHub:
    // Used to build URLs for "Edit on GitHub" links
    var githubDocRoot = "https://github.com/fluid-project/infusion-docs/blob/master/src/documents";
    // in case we're on Windows, replace "\" in the path with "/"
    var relativePath = data.page.filePathStem.replace(/\\/g, "/");
    return githubDocRoot + relativePath + '.md';
  }
};

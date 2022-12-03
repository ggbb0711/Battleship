module.exports = {  
    mode: 'development',  
    entry: ['./jsfiles/DOMstuff.js','./jsfiles/mainDOM.js','./jsfiles/co-opmode.js','./jsfiles/AI.js'],  
    output: {  
      filename: 'main.js',  
      publicPath: 'dist'  
    }  
  };
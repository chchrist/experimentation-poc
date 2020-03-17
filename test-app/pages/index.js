import Head from 'next/head'

const Home = () => (
  <div className="container">
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.ico" />
      <script dangerouslySetInnerHTML={{__html:`
      
      function include(url) {
        var s = document.createElement("script");
        s.setAttribute("type", "text/javascript");
        s.setAttribute("src", url);
        console.log(document.body)
        document.body.appendChild(s);
      }

      window.onload = function() {include("/test.js")};
      
      `}}>

      

      </script>
    </Head>

    <main>
      <h1 className="title">
        Experimentation POC
      </h1>

      <p className="description">
        Change this colour
      </p>

      </main>

      

    <style jsx>{`
      .description: {
        color: red;
      }
    `}</style>

    <style jsx global>{`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }

      * {
        box-sizing: border-box;
      }
    `}</style>
  </div>
)

export default Home

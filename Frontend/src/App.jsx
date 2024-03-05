import { useEffect, useState } from "react";
import openSocket from "socket.io-client";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [inputData, setInputData] = useState("");

  useEffect(() => {
    const connectServer = async () => {
      try {
        const socket = openSocket("http://localhost:4000");
        socket.on("connect", () => {
          console.log("Socket connected successfully!");
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected!");
        });

        socket.on('data',(socketdata)=>{
          if(socketdata.action==='create'){
            console.log("data",data)
            console.log('socket data.data', socketdata);
            // setData([socketdata.data, ...data]);
            setData(prevData => [socketdata.data, ...prevData]);
            // setData(prevData => {
            //   if (Array.isArray(prevData)) {
            //     return [socketdata.data, ...prevData];
            //   } else {
            //     return [socketdata.data];
            //   }
            // });
        

          }
        })
      } catch (error) {
        console.info(error);
      }
    };
    connectServer();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch("http://localhost:4000/getPosts");
        const result = await resp.json();
        // console.log("result.data", result);
        setData(result);
      } catch (error) {
        console.info(error);
      }
    };
    fetchData();
  }, []);

  const inputHandler = (e) => {
    setInputData(e.target.value);
  };

  const postData = async () => {
    console.log("inputData", inputData);
    try {
      await fetch("http://localhost:4000/addPost", {
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        method: "POST",
        body: JSON.stringify({ data: inputData }),
      })
        .then((result) => {
          return result.json();
        })
        .then((Apidata) => {
          console.info(Apidata);
          setInputData("");
          // setData([...data,inputData]);
        });
    } catch (error) {
      console.info(error);
    }
  };

  return (
    <div>
      <input type="text" value={inputData} onChange={inputHandler}></input>{" "}
      <button onClick={postData}>Post Data</button>
      <div>
        <ul>
          {data.length > 0 &&
            data.map((item, index) => {
              return <li key={index}>{item}</li>;
            })}
        </ul>
      </div>
    </div>
  );
}

export default App;

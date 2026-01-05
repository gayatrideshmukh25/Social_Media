import { postList } from "../store/Post_List-store";
import { useContext, useState, useEffect } from "react";
function Welcomemsg() {
  const contextObj = useContext(postList);
  const addInitialPosts = contextObj.addInitialPosts;

  // const [fetched, setFetched] = useState(false);
  // useEffect(() => {
  //   setFetched(true);
  //   fetch("https://dummyjson.com/posts")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       console.log("fetched again");
  //       addInitialPosts(data.posts);
  //       setFetched(false);
  //       console.log("returned");
  //     });
  // }, []);
  // if (!fetched) {
  //   fetch("https://dummyjson.com/posts")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       console.log("fetched again");
  //       addInitialPosts(data.posts);
  //     });
  //   setFetched(true);
  // }

  const getPostsHandler = () => {
    // fetch("https://dummyjson.com/posts")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //     addInitialPosts(data.posts);
    //   });
    // console.log("posts are fetching");
  };
  return (
    <center>
      <h1>There are no posts.</h1>
      <button
        type="button"
        onClick={getPostsHandler}
        className="btn btn-primary"
      >
        Get posts From server
      </button>
    </center>
  );
}

export default Welcomemsg;

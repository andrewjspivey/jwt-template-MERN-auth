import React, { useContext, useEffect, useState, useCallback } from "react";
import { useHistory, Link } from "react-router-dom";
import UserContext from "../Context/UserContext";
import HomeLayout from "../Fragments/Home/HomeLayout";
import Aside from "../Components/Home/Aside";
import FeedContainer from "../Fragments/Home/FeedContainer";
import TweetModal from "../Components/Home/TweetModal";
import Axios from "axios";
import TweetContainer from "../Fragments/Home/TweetContainer";
import { CgProfile } from "react-icons/cg";

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [postModalShow, setPostModalShow] = useState(false);
  const { userData } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (!userData.user) history.push("/login");
  }, [userData.user, history]);

  const getPosts = async () => {
    const posts = await Axios.get("/posts/all", {
      headers: { "x-auth-token": userData.token },
    });
    setTweets(posts.data);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const autoUpdateList = useCallback(() => {
    getPosts();
  }, [tweets, getPosts]);

  const openPostModal = () => {
    setPostModalShow(true);
  };

  const deleteTweet = async (postId) => {
    try {
      await Axios.delete(`/posts/${postId}`, {
        headers: { "x-auth-token": userData.token },
      }).then((res) => {
        if (res.status === 200) {
          alert("deleted successfully");
          autoUpdateList();
        }
        // will need else condition if cant delete
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <HomeLayout>
      <Aside show={postModalShow} openPostModal={openPostModal}></Aside>

      <FeedContainer>
        <div>
          <h3 style={{ margin: "10px 0px" }}>Home</h3>
        </div>
        <TweetModal
          show={postModalShow}
          setShow={setPostModalShow}
          autoUpdateList={autoUpdateList}
        ></TweetModal>

        {tweets.map((tweet, i) => (
          <TweetContainer
            key={i}
            onClick={() => history.push(`/post/${tweet._id}`)}
          >
            <div style={{ display: "flex" }}>
              <div style={{ height: "90%" }}>
                <CgProfile size="50px" />
              </div>
              <p style={{ padding: "10px", margin: "0" }}>{tweet.text}</p>
            </div>
          </TweetContainer>
        ))}
      </FeedContainer>
      <div style={{ margin: "15px" }}>Whats happening/Messages</div>
    </HomeLayout>
  );
};

export default Home;

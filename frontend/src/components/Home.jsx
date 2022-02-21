import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Row, Spinner } from "react-bootstrap";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [broads, setBroads] = useState("");
  const [myNickname, setMyNickname] = useState("");
  const [myId, setMyId] = useState("");

  useEffect(() => {
    if (localStorage.jwt) {
      axios({
        method: "get",
        // url: "/auth/falsify/",
        url: "/user/mypage/",
        headers: { Authorization: localStorage.getItem("jwt") },
      })
        .then((res) => {
          console.log(res);
          setMyNickname(res.data.nickname);
          setMyId(res.data.userid);
        })
        .catch((err) => {
          console.log(err);
          // 토큰 만료되면 로그아웃
          localStorage.removeItem("jwt");
          navigate("/");
        });
    }
    axios({
      method: "get",
      url: "/room/all",
    })
      .then((res) => {
        console.log("room List: ", res);
        setBroads(res.data);
        res.data.map((room) => {
          console.log("userid: ", room.userid);
          axios({
            method: "get",
            url: "/user/thumbnail/" + room.userid,
          })
            .then((response) => {
              console.log(response);
              if(response.data===""){
                response.data = null;
                console.log("빈데이터 변경",response.data);
              }
              
            })
            .catch((err) => {
              console.log("error: ", err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onProfile = (e) => {
    navigate("/profile/" + e);
    // console.log(e)
  };

  const onBroad = (e) => {
    console.log(e);
    if (localStorage.getItem("jwt")) {
      navigate(`/watch/${e.userid}/${myId}/${myNickname}`);
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  if (broads === "") {
    return (
      <div>
        <img
          src="../img/home2.png"
          alt=""
          style={{ width: "100%" }}
          className="d-flex mx-auto d-none d-lg-block"
        />
        <img
          src="../img/home3.png"
          alt=""
          style={{ width: "100%" }}
          className="d-flex mx-auto d-none d-sm-block d-lg-none"
        />
        <img
          src="../img/home4.png"
          alt=""
          style={{ width: "100%" }}
          className="d-flex mx-auto d-sm-none"
        />
        <br /> <br /> <br /> <br />
        <Spinner animation="border" className="d-flex mx-auto" />
      </div>
    );
  }

  const addDefaultImg=e=>{
    e.target.src = "../img/user.png";
  }

  return (
    <div>
      <img
        src="../img/home2.png"
        alt=""
        style={{ width: "100%" }}
        className="d-flex mx-auto d-none d-lg-block"
      />
      <img
        src="../img/home3.png"
        alt=""
        style={{ width: "100%" }}
        className="d-flex mx-auto d-none d-sm-block d-lg-none"
      />
      <img
        src="../img/home4.png"
        alt=""
        style={{ width: "100%" }}
        className="d-flex mx-auto d-sm-none"
      />
      <br /> <br />
      <div style={{ width: "90%", maxWidth: "1200px" }} className="mx-auto">
        <Row xs={1} sm={2} md={3} lg={4} className="">
          {broads.map((broad) => (
            <div key={broad.userid}>
              <div className="mb-4">
                <div className="">
                  {broad.thumbnail.includes(".") ? (
                    <img
                      src={broad.thumbnail}
                      alt=""
                      style={{
                        height: "100%",
                        width: "100%",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        onBroad(broad);
                      }}
                    />
                  ) : (
                    // <div  style={{ width: "100%"}}>
                    <img
                      src="../img/thumbnail.png"
                      // src='../img/home2.png'
                      alt=""
                      // style={{ height: "100%", width: "100%" }}
                      // width="320"
                      // height="180"
                      style={{ width: "100%", cursor: "pointer" }}
                      onClick={() => {
                        onBroad(broad);
                      }}
                    />
                    // </div>
                  )}
                </div>
                <div className="d-flex mt-2">
                  <img
                    src={"/user/thumbnail/" + broad.userid}
                    //src="../img/user.png"
                    alt=""
                    onError={addDefaultImg}
                    style={{
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                      borderRadius: "70%",
                    }}
                    onClick={() => {
                      onProfile(broad.nickname);
                    }}
                  />
                  <div className="ms-1">
                    <div>
                      <span
                        className="fw-bold"
                        onClick={() => {
                          onBroad(broad.nickname);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {broad.title}
                      </span>
                    </div>
                    <div>
                      <span
                        onClick={() => {
                          onProfile(broad.nickname);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {broad.nickname}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;

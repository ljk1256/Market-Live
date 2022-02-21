import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import $ from 'jquery'
// import { kurentoUtils } from './kurento-utils.js'
import { WebRtcPeer } from 'kurento-utils';
import { useBeforeunload } from "react-beforeunload";


function Broad() {
  const { broadid, viewerid, mynickname } = useParams();
  const navigate = useNavigate();
  const [broadNickname, setBroadNickname] = useState('')
  const [broadTitle, setBroadTitle] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [ws_, setWs_] = useState('')
  const [chat, setChat] = useState('')
  // console.log(ws_,'-------------------------')


  

  //채팅 메시지 보내기
  const [chatting, setChatting] = useState("");
  const [messages, setMessages] = useState([]);
  const chattingBox = useRef();

  const onChange = (e) => {
    setChatting(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter" && chatting !== "") {
      sendMessage_(chatting);
      e.target.value = "";
      setChatting("");
    }
  };

  const sendMessage_ = (message) => {
    console.log(message)
    setMessages(messages.concat(message));
    console.log(messages)
    console.log(message)
  };

  useEffect(() => {
    chattingBox.current.scrollTop = chattingBox.current.scrollHeight;
    console.log("update");
  }, [messages]);

  const messageList = messages.map((msg) => <div>{msg}</div>);


  //
 


  // const info = async () => {
  //   await axios({
  //     method: "get",
  //     url: "/user/mypage/",
  //     headers: { Authorization: localStorage.getItem("jwt") },
  //   })
  //     .then((res) => {
  //       console.log(res);
  //       setMyNickname(res.data.nickname);
  //       // var nickname_ = res.data.nickname
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       // 토큰 만료되면 로그아웃
  //       localStorage.removeItem("jwt");
  //       navigate("/login");
  //     });
    // await console.log(this.nickname_)
  // }
  // info()

  useEffect(() => {
    axios({
      method: "get",
      url: "/user/mypage/",
      headers: { Authorization: localStorage.getItem("jwt") },
    })
      .then((res) => {
        // console.log(res);
        // 임의로 방,닉네임 만들어서 들어가면 홈으로 이동
        if (String(res.data.userid) !== String(viewerid) || res.data.nickname !== mynickname){
          navigate("/")
          console.log(res.data.userid,viewerid,res.data.nickname,mynickname)
        }
      })
      .catch((err) => {
        console.log(err);
        // 토큰 만료되면 로그아웃
        localStorage.removeItem("jwt");
        navigate("/login");
      });

    // 방정보 없으면 홈으로 이동
    axios({
      method: 'get',
      url: '/room/one/'+broadid
    })
    .then(res => {
      console.log(res)
      setBroadNickname(res.data.nickname)
      setBroadTitle(res.data.title)
      setThumbnail(res.data.thumbnail)
    })
    .catch(err => {
      console.log(err)
      navigate("/")
    })
  }, []);

  // 방송
  // const mediaStreamConstraints = {
  //   video: {
  //     width: 1280,
  //     height: 720,
  //   },
  //   audio: true,
  // };

  // const localVideo = useRef();

  // let localStream;

  // const startVideo = async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia(
  //     mediaStreamConstraints
  //   );
  //   if (localVideo && localVideo.current && !localVideo.current.srcObject) {
  //     localVideo.current.srcObject = stream;
  //     localVideo.current.onloadedmetadata = (e) => {
  //       localVideo.current.play();
  //     };
  //   }
  // };

  // console.log(navigator.mediaDevices.enumerateDevices());

  //   function gotLocalMediaStream(mediaStream) {
  //     localStream = mediaStream;
  //     localVideo.current.srcObject = mediaStream;
  //     localVideo.current.onloadedmetadata = (e) => {
  //       localVideo.current.play();
  //     };
  //   }

  //   function handleLocalMediaStreamError(error) {
  //     console.log("navigator.getUserMedia error: ", error);
  //   }

  //   navigator.mediaDevices
  //     .getUserMedia(mediaStreamConstraints)
  //     .then(gotLocalMediaStream)
  //     .catch(handleLocalMediaStreamError);

  const onProfile = () => {
    window.open("/profile/" + broadNickname, "_blank");
  };


  // webRTC


  useEffect(() => {
    // info()
    // console.log(broadid, viewerid, mynickname, '--------')

    // setTimeout(function () {
    var myurl = 'i6c110.p.ssafy.io:8113'
    var ws = new WebSocket('wss://' + myurl + '/i6c110');
    setWs_(ws)
    // var ws = new WebSocket('https://i6c110.p.ssafy.io:8443/i6c110')
    var video = document.getElementById('video');
    var webRtcPeer;
    // var broad_id;	// 테스트용 broadcaster id
    // var viewer_id;
    var broad_id = broadid
    var viewer_id = viewerid
    var nickname = mynickname
    // console.log(myNickname)
    var chatInput = document.getElementById('chatInput');

    // console.log('-----')
    if (broadid === viewerid){
      ws.onopen = () => presenter()
    } else {
      ws.onopen = () => viewer()
    }
    
    
    
    // video = video_

    // window.onload = function () {
        // console = new Console();
        // video = document.getElementById('video');
        // video = video_
        // disableStopButton();
        // enableButton('#sendBroadId', 'broadId()');
        // enableButton('#sendViewerId', 'viewerId()');
    // }

    // function broadId() {
    //     broad_id = document.getElementById('broadId').value;
    //     console.log(broad_id);
    // }
    // const broadId = () => {
    //   broad_id = document.getElementById('broadId').value;
    //   console.log(broad_id);
    // }

    // function viewerId() {
    //     viewer_id = document.getElementById('viewerId').value;
    //     console.log(viewer_id);
    // }


    function sendMessage(message) {
      var jsonMessage = JSON.stringify(message);
      console.log('Sending message: ' + jsonMessage);
      ws.send(jsonMessage);
    }

    ws.onmessage = function (message) {
        var parsedMessage = JSON.parse(message.data);
        console.info('Received message: ' + message.data);

        switch (parsedMessage.id) {
            case 'presenterResponse':
                presenterResponse(parsedMessage);
                break;
            case 'viewerResponse':
                viewerResponse(parsedMessage);
                break;
            case 'iceCandidate':
                webRtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
                    if (error)
                        return console.error('Error adding candidate: ' + error);
                });
                break;
            case 'stopCommunication':
                dispose();
                navigate('/')
                break;
            case 'message':
                printMessage(parsedMessage);
                break;
            default:
                console.error('Unrecognized message', parsedMessage);
        }
    }

    window.onbeforeunload = function () {
      console.log('----------접속 종료--------------')
        ws.close();
    }


    function presenterResponse(message) {
        if (message.response !== 'accepted') {
            var errorMsg = message.message ? message.message : 'Unknow error';
            console.info('Call not accepted for the following reason: ' + errorMsg);
            dispose();
        } else {
            webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
                if (error)
                    return console.error(error);
            });
        }
    }

    function viewerResponse(message) {
        if (message.response !== 'accepted') {
            var errorMsg = message.message ? message.message : 'Unknow error';
            console.info('Call not accepted for the following reason: ' + errorMsg);
            dispose();
        } else {
            webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
                if (error)
                    return console.error(error);
            });
        }
    }

    function presenter() {
        // console.log(video)
        if (!webRtcPeer) {
            // showSpinner(video);

            var options = {
                localVideo: video,
                onicecandidate: onIceCandidate
            }
            webRtcPeer = new WebRtcPeer.WebRtcPeerSendonly(options,
                function (error) {
                    if (error) {
                        return console.error(error);
                    }
                    webRtcPeer.generateOffer(onOfferPresenter);
                });

            // enableStopButton();
        }
    }

    function onOfferPresenter(error, offerSdp) {
        if (error)
            return console.error('Error generating the offer');
        // console.info('Invoking SDP offer callback function ' + location.host);
        var message = {
            id: 'makeRoom',
            roomid: broad_id,
            userid: viewer_id,
            nickname: nickname,
            sdpOffer: offerSdp
        }
        sendMessage(message);
    }

    function viewer() {
        if (!webRtcPeer) {
            // showSpinner(video);

            var options = {
                remoteVideo: video,
                onicecandidate: onIceCandidate
            }
            webRtcPeer = new WebRtcPeer.WebRtcPeerRecvonly(options,
                function (error) {
                    if (error) {
                        return console.error(error);
                    }
                    this.generateOffer(onOfferViewer);
                });

            // enableStopButton();
        }
    }

    function onOfferViewer(error, offerSdp) {
        if (error)
            return console.error('Error generating the offer');
        // console.info('Invoking SDP offer callback function ' + location.host);
        var message = {
            id: 'enterRoom',
            roomid: broad_id,
            userid: viewer_id,
            nickname: nickname,
            sdpOffer: offerSdp
        }
        sendMessage(message);
    }

    function onIceCandidate(candidate) {
        console.log("Local candidate" + JSON.stringify(candidate));

        var message = {
            id: 'onIceCandidate',
            roomid: broad_id,
            userid: viewer_id,
            candidate: candidate
        };
        sendMessage(message);
    }

    function stop() {
        var message = {
            id: 'stop'
        }
        sendMessage(message);
        console.log('stop 메세지 보내기')
        dispose();
    }

    function dispose() {
        if (webRtcPeer) {
            webRtcPeer.dispose();
            webRtcPeer = null;
            console.log('피어 없애기')
        }
        // hideSpinner(video);

        // disableStopButton();
    }

    // function disableStopButton() {
    //     enableButton('#presenter', 'presenter()');
    //     enableButton('#viewer', 'viewer()');
    //     disableButton('#stop');
    // }

    // function enableStopButton() {
    //     disableButton('#presenter');
    //     disableButton('#viewer');
    //     enableButton('#stop', 'stop()');
    // }

    // function disableButton(id) {
    //     $(id).attr('disabled', true);
    //     $(id).removeAttr('onclick');
    // }

    // function enableButton(id, functionName) {
    //     $(id).attr('disabled', false);
    //     $(id).attr('onclick', functionName);
    // }



    // function showSpinner() {
    //     for (var i = 0; i < arguments.length; i++) {
    //         // arguments[i].poster = './img/transparent-1px.png';
    //         arguments[i].poster = '../../img/webrtc.png';
    //         arguments[i].style.background = 'center transparent url("../../img/spinner.gif") no-repeat';
    //     }
    // }

    // function hideSpinner() {
    //     for (var i = 0; i < arguments.length; i++) {
    //         arguments[i].src = '';
    //         arguments[i].poster = '../../img/webrtc.png';
    //         arguments[i].style.background = '';
    //     }
    // }

    /**
     * Lightbox utility (to display media pipeline image in a modal dialog)
     */
    // $(document).delegate('*[data-toggle="lightbox"]', 'click', function (event) {
    //     event.preventDefault();
    //     $(this).ekkoLightbox();
    // });
  // }, 1000)


  
    // 채팅

    

    // function sendchat(chat){
    //   var message = chat
    //   if(message !== ""){
    //       var jsonMessage = {
    //           id: 'message',
    //           roomid: broadid,
    //           message: message
    //       };
    //       sendMessage(jsonMessage);
    //   }
    // }

    // const enterkey = () => {
    //     if (window.event.keyCode === 13) {
    //         sendchat(chatting);
    //     }
    //   }

    // const onChange_ = (e) => {
    //   setChatting(e.target.value);
    // };




    
    // function printMessage(fullmessage){
    //   var message = fullmessage.message;
    //   $("#messageWindow").html($("#messageWindow").html()
    //       + "<p class='chat_content'><b class='impress'>" + message + "</b></p>");
    // }

    // function send(){
    //   var message = inputMessage.value;
    //   if(message != ""){
    //       var jsonMessage = {
    //           id: 'message',
    //           roomid: broad_id,
    //           message: message
    //       };
    //       sendMessage(jsonMessage);
    //   }
    //   inputMessage.value = "";
      
    // }

    // //     엔터키를 통해 send함
    // const enterkey = (e) => {
    //   if (window.event.keyCode === 13) {
    //       send();
    //       e.target.value = "";
    //       setChatting("");
    //   }
    // }
    return () => {
      console.log('언마운트')
      stop()
      // window.open("/", "_blank");
    }

  },[])


  // 채팅


  function printMessage(fullmessage){
    var message = fullmessage.message;
    console.log(message)
    // sendMessage_(String(message))
    sendMessage_(String('123'))
    // setMessages(messages.concat(message));
    $("#messageWindow").html($("#messageWindow").html()
        + "<p class='chat_content'><b class='impress'>" + message + "</b></p>");
  }

  function sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    console.log('Sending message: ' + jsonMessage);
    ws_.send(jsonMessage);
  }


  //     엔터키를 통해 send함
  const enterkey = (e) => {
      if (e.key === "Enter" && chat !== "") {
          var message = chat
          var jsonMessage = {
              id: 'message',
              roomid: broadid,
              message: message
          };
          setChat('')
          e.target.value = "";
          sendMessage(jsonMessage);
        }
      }
  
  const onChat = (e) => {
    setChat(e.target.value);
  };


  


  const onHome = () => {
    navigate("/")
  }
  const addDefaultImg=e=>{
    e.target.src = "https://i6c110.p.ssafy.io/img/user.png";
  }


  return (
    <div>
      <div
        style={{ width: "100%", maxWidth: "1400px" }}
        className="mx-auto d-md-flex"
      >
        <div className="w-100 p-0">
          {/* 비디오 */}
          <div id="videoBig">
				  	<video id="video" autoPlay 
              // width="640px" height="480px"
              // poster=""
              className="w-100"
            ></video>
				  </div>
          {/* <video
            id="video"
            // poster="../img/thumbnail.png"
            className="w-100"
            // ref={localVideo}
            autoPlay
            // playsInline
          ></video> */}

          {/* 비디오 밑 */}
          <div className="d-flex mb-2">
            {/* 이미지, 방송제목, 닉네임 */}
            <img
              src={"/user/thumbnail/" + broadid}
              onError={addDefaultImg}
              alt=""
              style={{ width: "50px", height: "50px", cursor: "pointer", borderRadius: "70%",}}
              className="ms-1"
              onClick={onProfile}
            />
            <div className="ms-1">
              <div className="fw-bold">{broadTitle}</div>
              <div>
                <span onClick={onProfile} style={{ cursor: "pointer" }}>
                  {broadNickname}
                </span>
              </div>
            </div>

            {/* 판매자일 경우 보이는 버튼 */}
            {broadid === viewerid ? (
              <div className="ms-auto me-1">
                <Button
                  // onClick={startVideo}
                  className="ms-2"
                  variant="secondary"
                  size="sm"
                >
                  화면 송출
                </Button>
                <Button className="ms-2" variant="secondary" size="sm">
                  음소거
                </Button>
                <Button className="ms-2" variant="secondary" size="sm">
                  설정
                </Button>
                <Button 
                  className="ms-2" 
                  variant="secondary" 
                  size="sm" 
                  onClick={onHome}  
                >
                  방송 종료
                </Button>
              </div>
            ) : (
            <div className="ms-auto me-1">
              <Button 
                  className="ms-2" 
                  variant="secondary" 
                  size="sm" 
                  onClick={onHome}  
                >
                  방송 나가기
                </Button>
            </div>
            )}
          </div>
        </div>

        {/* 채팅 */}
        <div
          ref={chattingBox}
          className="p-0 border"
          // style={{ minHeight: "200px", width:"400px"}}
          style={{
            position: "relative",
            minHeight: "400px",
            width: "400px",
            height: "400px",
            // height: "100%",
            overflow: "auto",
          }}

        >
          <div style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
            채팅창
          </div>
          {/* <div>{messageList}</div> */}
          <div id="_chatbox">
            <fieldset>
              <div id="messageWindow"></div>
            </fieldset>
				  </div>
          <input
            placeholder="채팅을 입력해주세요"
            // onChange={onChange}
            // onKeyPress={onKeyPress}
            onChange={onChat} 
            onKeyPress={enterkey}
            style={{
              position: "sticky",
              width: "100%",
              clear: "left",
              float: "left",
              // top: "400px",
              top:"100%",
              left: 0,
              bottom: 0,
            }}
          ></input>
          </div>
        </div>

        {/* 채팅 테스트 */}
        {/* <div id="_chatbox">
					<fieldset>
						<div id="messageWindow"></div>
						<br/> <input id="inputMessage" onChange={onChat} type="text" onKeyPress={enterkey}/>
						<input type="submit" value="send" onclick="send()"/>
					</fieldset>
				</div> */}



        {/* <div
          ref={chattingBox}
          className="p-0 border d-md-none"
          // style={{ minHeight: "200px", width:"400px"}}
          style={{
            position: "relative",
            minHeight: "400px",
            width: "100%",
            height: "400px",
            overflow: "auto",
          }}

        >
          <div style={{ position: "sticky", top: 0, backgroundColor: "white" }}>
            채팅창
          </div>
          <div>{messageList}</div>
          <input
            placeholder="채팅을 입력해주세요"
            onChange={onChange}
            onKeyPress={onKeyPress}
            style={{
              position: "sticky",
              width: "100%",
              clear: "left",
              float: "left",
              top: "400px",
              left: 0,
              bottom: 0,
            }}
          ></input>
        </div> */}
        {/* <div
          className="p-0 border d-md-none"
          style={{ minHeight: "200px", width:"100%", height:"40vh"}}
        >
          채팅창
        </div> */}
      

    </div>
  );
}

export default Broad;

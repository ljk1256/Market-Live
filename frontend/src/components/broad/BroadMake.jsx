import { FormControl, Button, Modal, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';


function BroadMake() {
  const navigate = useNavigate();
  const imageUpload = useRef()

  const [userid, setUserid] = useState('')
  const [nickname, setNickname] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [thumbnail, setThumbnail] = useState('../img/thumbnail_basic.png')
  const [checkedImage, setCheckedImage] = useState('basic')
  const [thumbnailSpinner, setThumbnailSpinner] = useState(false)

  // 모달창
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  // 기본 이미지 버튼 눌렀을 때
  const handleShow = () => {
    if (thumbnail === '../img/thumbnail_clothing.png'){
      setCheckedImage('clothing')
    }
    else if (thumbnail === '../img/thumbnail_digital.png'){
      setCheckedImage('digital')
    }
    else if (thumbnail === '../img/thumbnail_food.png'){
      setCheckedImage('food')
    }
    else{
      setCheckedImage('basic')
    }
    setShow(true);
  }

  // 모달창에서 선택 버튼 눌렀을 때
  const clickButton = () => {
    if (checkedImage === 'basic'){
      setThumbnail('../img/thumbnail_basic.png')
    }
    else if (checkedImage === 'clothing'){
      setThumbnail('../img/thumbnail_clothing.png')
    }
    else if (checkedImage === 'digital'){
      setThumbnail('../img/thumbnail_digital.png')
    }
    else if (checkedImage === 'food'){
      setThumbnail('../img/thumbnail_food.png')
    }
    setShow(false)
  }

  // 라디오 버튼 클릭시
  const choiceImage = (e) => {
    setCheckedImage(e.target.id)
  }
  // 이미지 클릭시
  const clickImage = (e) => {
    setCheckedImage(e.target.id)
  }

  // 업로드 버튼 클릭시
  const clickImageUpload = () => {
    imageUpload.current.click()
    // setThumbnailSpinner(!thumbnailSpinner)
  }
  // 파일 선택시
  const onImageChange = (e) => {
    console.log(e.target.files[0])
  }

  // 방송 정보 저장
  const onChange = (e) => {
    const { value, name } = e.target;
    if (name === "title"){
      setTitle(value)
    }
    else if (name === "category"){
      setCategory(value)
    }
  }

  // 닉네임 받아오기
  useEffect(() => {
    axios({
        method: 'get',
        url: '/user/mypage/',
        headers: {Authorization: localStorage.getItem('jwt')}
    })
    .then(res => { 
        // console.log(res)
        setNickname(res.data.nickname)
        setUserid(res.data.userid)
    })
    .catch(err => {
        console.log(err)
        // 토큰 만료되면 로그아웃
        localStorage.removeItem("jwt");
        navigate("/login");
    })
  }, [])


  // 방송 만들기 버튼 클릭시
  const onBroad = () => {
    // console.log(title, category, thumbnail)
    if (title.trim() === ''){
      alert('제목을 입력해주세요.')
    }else{
      // console.log(title,category,thumbnail,nickname,userid)
      axios({
        method:'post',
        url: '/broad/create-room',
        data: {
          'title': title,
          'category': category,
          'thumbnail': thumbnail,
          'nickname': nickname,
          'userid': userid,
        }
      })
      .then(res => {
        console.log(res)
        navigate(`/watch/${userid}/${userid}/${nickname}`)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
  
  return (
    <div>
      <div className='mx-auto mt-4' style={{width:"90%", maxWidth:"600px"}}>
          <div className='border-bottom border-3 border-dark'>
              <h2 className='fw-bold ms-1'>방송 만들기</h2>
          </div>
          <div className='ms-1 mt-2'>
            <h6>썸네일</h6>
              <div className='d-sm-flex'>
                {thumbnailSpinner ? (
                  <div style={{ width:"320px", height:"180px"}}>
                    <Spinner animation="border" className="d-flex mx-auto" style={{marginTop:"74px"}}/>
                  </div>
                ) : (
                  <img
                  src={thumbnail}
                  alt=""
                  style={{ width: "320px", height:"180px" }}
                />
                )}
                
                <div className='mt-1 mt-sm-auto ms-sm-1'>
                  <Button 
                    // variant="secondary" 
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleShow}
                  >기본 이미지</Button>
                  {/* 업로드 버튼 */}
                  <Button 
                    // variant="secondary" 
                    variant="outline-secondary"
                    size="sm"
                    className='ms-1'
                    onClick={clickImageUpload}
                  >업로드</Button>
                  <input 
                    type="file" 
                    accept='image/*'
                    ref={imageUpload}
                    onChange={onImageChange}
                    style={{display:"none"}}
                  />
                </div>
              </div>
          </div>
          <hr />
          <div className='ms-1'>
            <h6>방송 제목</h6>
                <FormControl
                    name="title"
                    value={title}
                    onChange={onChange}
                    maxLength={20}
                />
          </div>
          <hr />
          <div className='ms-1'>
              <h6>카테고리</h6>
              <FormControl
                  name="category"
                  value={category}
                  onChange={onChange}
                  maxLength={15}
              />
          </div>
          <hr />
          <Button
            // variant="secondary"
            variant="outline-secondary"
            onClick={onBroad}
            className="d-flex ms-auto"
          >
            만들기
          </Button>
      </div>

      {/* 모달창 */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className='fw-bold'>썸네일 선택</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className='d-flex'>
              <Form.Check 
                type="radio"
                id="basic"
                label=""
                name="group1"
                onChange={choiceImage}
                checked={checkedImage === 'basic'}
              />
              <img 
                src="../img/thumbnail_basic.png" 
                alt="" 
                style={{width:"200px"}} 
                id="basic"
                onClick={clickImage}
              />
            </div>
            <div className='d-flex mt-2'>
              <Form.Check 
                type="radio"
                id="clothing"
                label=""
                name="group1"
                onChange={choiceImage}
                checked={checkedImage === 'clothing'}
              />
              <img 
                src="../img/thumbnail_clothing.png" 
                alt="" 
                style={{width:"200px"}}
                id="clothing"
                onClick={clickImage}
              />
            </div>
            <div className='d-flex mt-2'>
              <Form.Check 
                type="radio"
                id="digital"
                label=""
                name="group1"
                onChange={choiceImage}
                checked={checkedImage === 'digital'}
              />
              <img 
                src="../img/thumbnail_digital.png" 
                alt="" 
                style={{width:"200px"}} 
                id="digital"
                onClick={clickImage}
              />
            </div>
            <div className='d-flex mt-2'>
              <Form.Check 
                type="radio"
                id="food"
                label=""
                name="group1"
                onChange={choiceImage}
                checked={checkedImage === 'food'}
              />
              <img 
                src="../img/thumbnail_food.png" 
                alt="" 
                style={{width:"200px"}} 
                id="food"
                onClick={clickImage}
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            // variant="secondary" 
            variant="outline-secondary"
            onClick={clickButton}
          >
            선택
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BroadMake;

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { Spinner, FormControl, Button } from 'react-bootstrap'


function MyPageEdit() {

    const navigate = useNavigate();
    const imageUpload = useRef()

    const [num, setNum] = useState(0)
    const [originNickname, setOriginNickname] = useState('')
    const [nicknameMsg, setNicknameMsg] = useState('')
    const [nicknameMsgColor, setNicknameMsgColor] = useState({ color: "black" })
    const [checkNickname, setCheckNickname] = useState(false)
    const [chosenImage, setChosenImage] = useState('')
    const [thumbnailSpinner, setThumbnailSpinner] = useState(false)


    // input으로 수정값 받아오기
    const [inputs, setInputs] = useState({
        email: '',
        manner: '',
        name: '',
        nickname: '',
        oneline: '',
        phone: '',
        thumnailroot: '',
        userid: '',
    });
    const onChange = (e) => {
        const { value, name } = e.target;
        setInputs({
            ...inputs, 
            [name]: value 
        });
    };


    // 회원정보 받아오기
    useEffect(() => {
        axios({
            method: 'get',
            url: '/user/mypage/',
            headers: {Authorization: localStorage.getItem('jwt')}
        })
        .then(res => { 
            console.log(res)
            setOriginNickname(res.data.nickname)    // 기존 닉네임 저장
            if (res.data.thumnailroot === null){
                setChosenImage('../img/user.png')
            } else {
                setChosenImage(res.data.thumnailroot)
            }
            setInputs(res.data)
        })
        .catch(err => {
            console.log(err)
            // 토큰 만료되면 로그아웃
            localStorage.removeItem("jwt");
            navigate("/login");
        })
    }, [])


    // 닉네임 유효성검사
    useEffect(() => {
        setNum(num+1)
        setCheckNickname(false)
        setNicknameMsg('')
        const debounce = setTimeout(() => {
            if (inputs.nickname.length >= 1){
                if (inputs.nickname === originNickname){
                    if (num > 1){
                        setNicknameMsg('기존 닉네임입니다.')
                    }
                    setNicknameMsgColor({ color: "black" })
                    setCheckNickname(true)
                }
                else if (inputs.nickname.substr(0,1) === ' ' || inputs.nickname.substr(-1,1) === ' '){
                    setNicknameMsg('처음과 끝에 공백을 넣을 수 없습니다.')
                    setNicknameMsgColor({ color: "red" })
                }
                else if (inputs.nickname.includes('  ')){
                    setNicknameMsg('공백을 두번 연속 포함할 수 없습니다.')
                    setNicknameMsgColor({ color: "red" })
                }
                else{   // 닉네임 중복체크
                    axios({
                        method: 'get',
                        url: '/user/checknickname?nickname='+inputs.nickname
                    })
                    .then(res => {
                        setCheckNickname(true)
                        setNicknameMsg('사용하셔도 좋습니다.')
                        setNicknameMsgColor({ color: "blue" })
                    })
                    .catch(err => {
                        setNicknameMsg('중복된 닉네임입니다.')
                        setNicknameMsgColor({ color: "red" })
                    })   
                }
            }
        }, 700)
            return() => clearTimeout(debounce)
        }, [inputs.nickname])


    // 회원정보 수정
    const onEdit = () => {
        if (checkNickname){
            axios({
                method: 'post',
                url: '/user/update/',
                headers: {Authorization: localStorage.getItem('jwt')},
                data: {
                    "nickname": inputs.nickname,
                    "oneline": inputs.oneline,
                    "phone": inputs.phone,
                },
            })
                .then(res => {
                    console.log(res)
                    navigate("/mypage");
                })
                .catch(err => {
                    console.log(err)
                    // 토큰 만료되면 로그아웃
                    localStorage.removeItem("jwt");
                    navigate("/login");
                })
        }
        else{
            alert('다시 입력해주세요.')
        }
    }

    const onExit = () => {
        navigate('/mypage')
    }

    // 업로드 버튼 클릭시
    const clickImageUpload = () => {
        imageUpload.current.click()
    }
    // 파일 선택시
    const onImageChange = (e) => {
        // setThumbnailSpinner(true)
        const formData = new FormData()
        formData.append('multipartFile', e.target.files[0])
        // const response = 
        axios({
            Headers: {
                'content-type': 'multipart/form-data',
            },
            method:"post",
            url: `/user/upload?userid=${inputs.userid}`,
            // url: 'https://i6c110.p.ssafy.io:8110/user/upload?userid=12',
            data: formData,
        })
        .then(res => {
            console.log(res)
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            return new Promise((resolve)=>{
              reader.onload = () =>{
                setChosenImage(reader.result);
                resolve();
              }
            })
        })
        .catch(err => {
            console.log(err)
        })
        // setThumbnailSpinner(false)
        // console.log(e.target.files[0])
        console.log(formData)

        // console.log(e)
    }
    // 지우기 클릭시
    const imageCancel = () => {
        setChosenImage('../img/user.png')
        setInputs({...inputs,thumnailroot:""})
    }

    const addDefaultImg=e=>{
        e.target.src = "https://i6c110.p.ssafy.io/img/user.png";
      }


    if (inputs.email === ''){
        return(
            <div className="d-flex">
            <Spinner animation="border" className="mx-auto" style={{marginTop:"30vh"}}/>
            </div>
        )
    }

    return(
        <div>
            {/* <h1>MyPageEdit</h1>
            <div>
                이메일: {inputs.email}
            </div>
            <div>
                매너온도: {inputs.manner}
            </div>
            <div>
                이름: {inputs.name}
            </div>
            <div>
                닉네임: 
                <input
                name="nickname"
                value={inputs.nickname}
                onChange={onChange}
                maxLength={15}
                />
                <span style={nicknameMsgColor}>
                    {nicknameMsg}
                </span>
            </div>
            <div>
                소개: 
                <input
                name="oneline"
                value={inputs.oneline}
                onChange={onChange}
                maxLength={50}
                />
            </div>
            <div>
                전화번호: 
                <input
                name="phone"
                value={inputs.phone}
                onChange={onChange}
                maxLength={15}
                />
            </div>
            <button onClick={onEdit}>수정</button>
            <Link to="/mypage">
                <button>취소</button>
            </Link> */}


            <div className='mx-auto mt-4' style={{width:"90%", maxWidth:"600px"}}>
                <div className='border-bottom border-3 border-dark'>
                    <h2 className='fw-bold ms-1'>프로필 수정</h2>
                </div>
                <div className='mt-4 d-flex ms-1'>
                    {/* {thumbnailSpinner ? (
                        <div style={{ width:"80px", height:"80px"}}>
                            <Spinner animation="border" className="d-flex mx-auto" style={{marginTop:"24px"}}/>
                        </div>
                    ) : ( */}
                        <img 
                            src={"/user/thumbnail/" + inputs.userid}
                            onError={addDefaultImg}
                            alt="" 
                            style={{width:"80px", height:"80px", borderRadius: "70%"}}
                        />
                    {/* )} */}
                    
                    {/* <Button 
                        variant="secondary" 
                        size="sm"
                        className='py-0 px-1'
                        style={{position: "absolute", marginLeft:"63px"}}>x</Button> */}
                    {/* 버튼 */}
                    <div className='mt-auto'>
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
                        {/* {(chosenImage !== '../img/user.png') ? (
                            <Button 
                                // variant="secondary" 
                                variant="outline-secondary"
                                size="sm"
                                className='ms-1'
                                onClick={imageCancel}
                            >지우기</Button>
                         ) : null} */}
                        
                    </div>
                    {/* <h2 className='mt-auto ms-2'> 
                        <span className='fw-bold'>{originNickname}</span> 님
                    </h2>
                    <h5 className='mt-auto ms-auto me-1'>
                        매너온도 {inputs.manner}도
                    </h5> */}
                </div>
                <hr />
                <div className='ms-1'>
                    <h6>이메일</h6>
                    <h5>{inputs.email}</h5>
                </div>
                <hr />
                <div className='ms-1'>
                    <h6>이름</h6>
                    <h5>{inputs.name}</h5>
                </div>
                <hr />
                <div className='ms-1'>
                    <h6>닉네임</h6>
                    <FormControl
                       name="nickname"
                       value={inputs.nickname}
                       onChange={onChange}
                       maxLength={15}
                    />
                    <div className='ms-1'>
                        <span style={nicknameMsgColor}>
                            {nicknameMsg}
                        </span>
                    </div>
                </div>
                <hr />
                <div className='ms-1'>
                    <h6>전화번호</h6>
                    <FormControl
                        name="phone"
                        value={inputs.phone}
                        onChange={onChange}
                        maxLength={15}
                    />
                </div>
                <hr />
                <div className='ms-1'>
                    <h6>소개글</h6>
                    <FormControl
                        name="oneline"
                        value={inputs.oneline}
                        onChange={onChange}
                        maxLength={50}
                    />
                </div>
                <hr />
                <div className='d-flex' >
                    <Button 
                        className='ms-auto' 
                        // variant="secondary"
                        variant="outline-secondary"
                        onClick={onEdit}
                    >
                        수정
                    </Button>
                    <Button
                        className='ms-2' 
                        // variant="secondary"
                        variant="outline-secondary"
                        onClick={onExit}
                    >
                        취소
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MyPageEdit;